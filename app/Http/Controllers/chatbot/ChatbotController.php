<?php

namespace App\Http\Controllers\chatbot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\module;
use App\Models\notification_settings;
use App\Models\Notification;

class ChatbotController extends Controller
{
    public function index()
    {
        // Get all unique guest conversations
        $guestConversations = \App\Models\chatbot_messages::whereNotNull('from_guest_id')
            ->selectRaw('from_guest_id, 
                         MAX(created_at) as last_message_at, 
                         COUNT(*) as message_count,
                         MAX(id) as last_message_id')
            ->groupBy('from_guest_id')
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function($conversation) {
                $lastMessage = \App\Models\chatbot_messages::find($conversation->last_message_id);
                $pendingCount = \App\Models\chatbot_messages::where('from_guest_id', $conversation->from_guest_id)
                    ->where('status', 'pending')
                    ->count();
                
                $firstMessage = \App\Models\chatbot_messages::where('from_guest_id', $conversation->from_guest_id)
                    ->orderBy('created_at', 'asc')
                    ->first();
                
                return [
                    'guest_id' => $conversation->from_guest_id,
                    'message_count' => $conversation->message_count,
                    'pending_messages' => $pendingCount,
                    'last_message' => $lastMessage ? \Str::limit($lastMessage->message, 50) : null,
                    'last_message_at' => $conversation->last_message_at,
                    'last_message_human' => \Carbon\Carbon::parse($conversation->last_message_at)->diffForHumans(),
                    'first_message_at' => $firstMessage ? $firstMessage->created_at : null,
                ];
            });

        return view('chatbot.chatbot', compact('guestConversations'));
    }

    public function message(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:1000',
                'guest_id' => 'nullable|string|max:255',
            ]);

            $userMessage = $validated['message'];
            $guestId = $validated['guest_id'] ?? null;
            
            // Save guest message to database
            $guestMessage = null;
            if ($guestId) {
                $guestMessage = \App\Models\chatbot_messages::create([
                    'from_guest_id' => $guestId,
                    'from_users_id' => null,
                    'message' => $userMessage,
                    'parent_id' => null,
                    'status' => 'pending'
                ]);
                
                \Log::info('Guest message saved', [
                    'guest_id' => $guestId,
                    'message' => $userMessage,
                    'message_id' => $guestMessage->id
                ]);
                
                // Send notification to users with chatbot notification settings
                $this->sendChatbotNotifications($guestMessage, $guestId);
            }
            
            // Generate bot response
            $response = $this->generateResponse($userMessage);
            
            // Save bot response to database
            if ($guestId) {
                \App\Models\chatbot_messages::create([
                    'from_guest_id' => $guestId,
                    'from_users_id' => null, // Bot response (system)
                    'message' => $response,
                    'parent_id' => null,
                    'status' => 'bot_response'
                ]);
            }

            return response()->json([
                'success' => true,
                'response' => $response
            ]);
        } catch (\Exception $e) {
            \Log::error('Chatbot error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'error' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    /**
     * Admin reply to guest message
     */
    public function replyToGuest(Request $request)
    {
        try {
            $validated = $request->validate([
                'guest_id' => 'required|string|max:255',
                'parent_message_id' => 'required|integer|exists:chatbot_messages,id',
                'message' => 'required|string|max:1000',
            ]);

            // Get authenticated admin user
            $adminUser = auth()->user();
            if (!$adminUser) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized. Admin must be logged in.'
                ], 401);
            }

            // Get the parent message to verify guest_id
            $parentMessage = \App\Models\chatbot_messages::findOrFail($validated['parent_message_id']);
            
            if ($parentMessage->from_guest_id !== $validated['guest_id']) {
                return response()->json([
                    'success' => false,
                    'error' => 'Guest ID mismatch.'
                ], 400);
            }

            // Create admin reply
            $reply = \App\Models\chatbot_messages::create([
                'from_guest_id' => $validated['guest_id'],
                'from_users_id' => $adminUser->id,
                'message' => $validated['message'],
                'parent_id' => $validated['parent_message_id'],
                'status' => 'admin_reply'
            ]);
            
            // Mark parent message as 'replied' instead of 'pending'
            $parentMessage->update(['status' => 'replied']);
            
            // Mark all other pending messages from this guest as 'read' 
            // (since admin is now handling this conversation)
            \App\Models\chatbot_messages::where('from_guest_id', $validated['guest_id'])
                ->where('status', 'pending')
                ->where('id', '!=', $validated['parent_message_id']) // Don't update the parent again
                ->update(['status' => 'read']);

            \Log::info('Admin reply sent to guest', [
                'admin_id' => $adminUser->id,
                'guest_id' => $validated['guest_id'],
                'parent_id' => $validated['parent_message_id'],
                'message' => $validated['message'],
                'pending_messages_marked_as_read' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reply sent successfully',
                'data' => [
                    'id' => $reply->id,
                    'guest_id' => $reply->from_guest_id,
                    'admin_id' => $reply->from_users_id,
                    'admin_name' => $adminUser->name ?? 'Admin',
                    'message' => $reply->message,
                    'parent_id' => $reply->parent_id,
                    'created_at' => $reply->created_at->format('Y-m-d H:i:s')
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin reply error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to send reply. ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get guest conversation history
     */
    public function getGuestConversation(Request $request)
    {
        try {
            $validated = $request->validate([
                'guest_id' => 'required|string|max:255',
            ]);

            // Get all messages for this guest
            $messages = \App\Models\chatbot_messages::where('from_guest_id', $validated['guest_id'])
                ->with('user:id,name,email')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function($message) {
                    return [
                        'id' => $message->id,
                        'message' => $message->message,
                        'from_guest' => $message->from_users_id === null && $message->status !== 'bot_response',
                        'from_admin' => $message->from_users_id !== null,
                        'from_bot' => $message->status === 'bot_response',
                        'admin_name' => $message->user ? $message->user->name : null,
                        'parent_id' => $message->parent_id,
                        'status' => $message->status,
                        'created_at' => $message->created_at->format('Y-m-d H:i:s')
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);
        } catch (\Exception $e) {
            \Log::error('Get conversation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve conversation.'
            ], 500);
        }
    }

    /**
     * Get all guest conversations (for admin)
     */
    public function getAllGuestConversations(Request $request)
    {
        try {
            // Get distinct guest IDs with their latest message
            $guestConversations = \App\Models\chatbot_messages::whereNotNull('from_guest_id')
                ->selectRaw('from_guest_id, MAX(created_at) as last_message_at, 
                             COUNT(*) as message_count, 
                             MAX(id) as last_message_id')
                ->groupBy('from_guest_id')
                ->orderBy('last_message_at', 'desc')
                ->get()
                ->map(function($conversation) {
                    $lastMessage = \App\Models\chatbot_messages::find($conversation->last_message_id);
                    $pendingCount = \App\Models\chatbot_messages::where('from_guest_id', $conversation->from_guest_id)
                        ->where('status', 'pending')
                        ->count();
                    
                    return [
                        'guest_id' => $conversation->from_guest_id,
                        'message_count' => $conversation->message_count,
                        'pending_messages' => $pendingCount,
                        'last_message' => $lastMessage ? $lastMessage->message : null,
                        'last_message_at' => $conversation->last_message_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $guestConversations
            ]);
        } catch (\Exception $e) {
            \Log::error('Get all conversations error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve conversations.'
            ], 500);
        }
    }

    private function generateResponse($message)
    {
        $originalMessage = $message;
        $message = strtolower(trim($message));
        
        // Log the message for debugging
        \Log::info('Chatbot received message: "' . $originalMessage . '" (lowercase: "' . $message . '")');
        
        // Vehicle sticker application process - CHECK THIS FIRST
        if (str_contains($message, 'how to apply for vehicle sticker') || str_contains($message, 'vehicle sticker') || str_contains($message, 'sticker application') || str_contains($message, 'apply sticker')) {
            \Log::info('Matched vehicle sticker pattern');
            return "🚗 **Vehicle Sticker Application Process:**\n\n1️⃣ **Fill Out Application**\n   • Go to Vehicle Management\n   • Click 'Add Vehicle'\n   • Complete all required fields:\n     - Vehicle type (Car, Motorcycle, etc.)\n     - Plate number\n     - Vehicle model\n     - OR number\n     - CR number\n     - Color\n     - Supporting documents\n\n2️⃣ **Upload Documents**\n   • Upload multiple supporting documents\n   • Accepted formats: PDF, DOC, JPG, PNG\n   • Maximum 10MB per file\n\n3️⃣ **Submit & Wait**\n   • Click 'Add Vehicle' to submit\n   • Status will be 'Pending'\n   • Wait for admin review\n\n4️⃣ **Admin Review**\n   • Admin will review your application\n   • May approve or decline with reason\n\n5️⃣ **Get Sticker**\n   • If approved: Control number generated\n   • Sticker validity date set\n   • Status changes to 'Approved'\n\nNeed help with any specific step?";
        }
        
        // Business registration process - CHECK THIS SECOND
        if (str_contains($message, 'how to register my business') || str_contains($message, 'business registration') || str_contains($message, 'register business') || str_contains($message, 'business clearance')) {
            \Log::info('Matched business registration pattern');
            return "🏢 **Business Registration Process:**\n\n1️⃣ **Prepare Documents**\n   • Business clearance document\n   • Valid business permit\n   • Other required certificates\n\n2️⃣ **Fill Out Application**\n   • Go to Business Management\n   • Click 'Add New Business'\n   • Complete all required fields:\n     - Business name\n     - Type of business\n     - Address (optional)\n     - Upload business clearance\n\n3️⃣ **Upload Clearance**\n   • Upload business clearance document\n   • Accepted formats: PDF, JPG, PNG\n   • Maximum 2MB file size\n\n4️⃣ **Submit & Wait**\n   • Click 'Save' to submit\n   • Status will be 'Pending'\n   • Wait for admin review\n\n5️⃣ **Admin Review**\n   • Admin will review your application\n   • May approve or decline with reason\n\n6️⃣ **Get Approval**\n   • If approved: Status changes to 'Approved'\n   • If declined: Reason provided\n   • You can view status anytime\n\nNeed help with any specific step?";
        }
        
        // Greeting responses - MOVED AFTER SPECIFIC MATCHES
        if (str_contains($message, 'hello') || str_contains($message, 'hi') || str_contains($message, 'hey')) {
            return "Hello! How can I assist you today?";
        }
        
        // Help responses
        if (str_contains($message, 'help') || str_contains($message, 'support')) {
            return "I'm here to help! You can ask me about:\n• Vehicle sticker application\n• Business registration\n• Service requests\n• Incident reports\n• User management\n\nWhat would you like to know more about?";
        }
        
        
        // Vehicle types and requirements
        if (str_contains($message, 'vehicle type') || str_contains($message, 'what vehicle') || str_contains($message, 'vehicle types')) {
            return "🚗 **Available Vehicle Types:**\n\n• **Car** - Standard passenger vehicles\n• **Motorcycle** - Two-wheeled vehicles\n• **Tricycle** - Three-wheeled vehicles\n• **Truck** - Commercial vehicles\n• **Others** - Specify custom type\n\nAll types require the same documents:\n• Plate number\n• Vehicle model\n• OR number\n• CR number\n• Color\n• Supporting documents\n\nWhich vehicle type do you want to register?";
        }
        
        // Document requirements
        if (str_contains($message, 'documents') || str_contains($message, 'required') || str_contains($message, 'what documents')) {
            return "📄 **Required Documents:**\n\n**For Vehicle Registration:**\n• Official Receipt (OR)\n• Certificate of Registration (CR)\n• Supporting documents (multiple files allowed)\n• Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG\n• Maximum 10MB per file\n\n**For Business Registration:**\n• Business clearance document\n• Valid business permit\n• Accepted formats: PDF, JPG, PNG\n• Maximum 2MB file size\n\nMake sure all documents are clear and readable!";
        }
        
        // Status tracking
        if (str_contains($message, 'status') || str_contains($message, 'check') || str_contains($message, 'track')) {
            return "📊 **Application Status Tracking:**\n\n**Vehicle Applications:**\n• **Pending** - Under review by admin\n• **Approved** - Sticker control number generated\n• **Declined** - Reason provided\n\n**Business Applications:**\n• **Pending** - Under review by admin\n• **Approved** - Business registered\n• **Declined** - Reason provided\n\nTo check your status:\n1. Go to Vehicle Management or Business Management\n2. Look at the Status column\n3. Use filters to find specific applications\n\nNeed help finding your application?";
        }
        
        // Vehicle related responses
        if (str_contains($message, 'vehicle') || str_contains($message, 'car') || str_contains($message, 'motorcycle')) {
            return "🚗 **Vehicle Management Help:**\n\n**What you can do:**\n• Register new vehicles\n• View vehicle details\n• Track application status\n• Manage supporting documents\n\n**Common Questions:**\n• Ask about 'vehicle sticker application' for step-by-step process\n• Ask about 'vehicle types' for available options\n• Ask about 'documents' for required files\n• Ask about 'status' for tracking applications\n\nWhat would you like to know?";
        }
        
        // Business related responses
        if (str_contains($message, 'business') || str_contains($message, 'register') || str_contains($message, 'clearance')) {
            return "🏢 **Business Registration Help:**\n\n**What you can do:**\n• Submit business clearance documents\n• Track application status\n• View approved businesses\n• Manage business information\n\n**Common Questions:**\n• Ask about 'business registration' for step-by-step process\n• Ask about 'documents' for required files\n• Ask about 'status' for tracking applications\n\nNeed help with a specific business matter?";
        }
        
        // Service related responses
        if (str_contains($message, 'service') || str_contains($message, 'request') || str_contains($message, 'complaint')) {
            return "For service requests:\n• Submit new service requests\n• Track request status\n• View service history\n• File complaints\n\nWhat type of service do you need?";
        }
        
        // Incident related responses
        if (str_contains($message, 'incident') || str_contains($message, 'report') || str_contains($message, 'emergency')) {
            return "For incident reports:\n• Report incidents\n• View incident history\n• Assign guards to incidents\n• Track incident status\n\nDo you need to report an incident?";
        }
        
        // User related responses
        if (str_contains($message, 'user') || str_contains($message, 'profile') || str_contains($message, 'account')) {
            return "For user management:\n• Update your profile\n• Change password\n• View account settings\n• Manage notifications\n\nWhat would you like to update?";
        }
        
        // Thank you responses
        if (str_contains($message, 'thank') || str_contains($message, 'thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Default response
        return "I understand you're asking about: \"{$message}\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?";
    }

    /**
     * Get users with active chatbot notification settings
     */
    private function getChatbotNotificationUsers()
    {
        // First, let's check all available modules to see what's in the database
        $allModules = module::all();
        \Log::info('All modules in database for chatbot', [
            'modules' => $allModules->map(function($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->module_name,
                    'status' => $module->status
                ];
            })
        ]);

        // Try different variations of the chatbot module name
        $possibleModuleNames = [
            'guest chatbot',
            'Guest Chatbot',
            'Guest ChatBot',
            'chatbot',
            'Chatbot',
            'ChatBot',
            'chat bot',
            'Chat Bot',
            'chatbot management',
            'Chatbot Management'
        ];

        $chatbotModule = null;
        foreach ($possibleModuleNames as $moduleName) {
            $chatbotModule = module::where('module_name', $moduleName)
                ->where('status', 'active')
                ->first();
            
            if ($chatbotModule) {
                \Log::info('Found chatbot module with name', [
                    'module_name' => $moduleName,
                    'module_id' => $chatbotModule->id
                ]);
                break;
            }
        }

        \Log::info('Chatbot module lookup result', [
            'module_found' => $chatbotModule ? true : false,
            'module_id' => $chatbotModule->id ?? 'N/A',
            'module_name' => $chatbotModule->module_name ?? 'N/A',
            'module_status' => $chatbotModule->status ?? 'N/A'
        ]);

        if (!$chatbotModule) {
            \Log::warning('Chatbot module not found or inactive. Available modules:', [
                'available_modules' => $allModules->pluck('module_name')->toArray()
            ]);
            return collect();
        }

        // Get users with active notification settings for chatbot
        $notificationSettings = notification_settings::with('user')
            ->where('module_id', $chatbotModule->id)
            ->where('status', 'active')
            ->get();

        \Log::info('Chatbot notification settings found', [
            'settings_count' => $notificationSettings->count(),
            'settings' => $notificationSettings->map(function($setting) {
                return [
                    'id' => $setting->id,
                    'user_id' => $setting->users_id,
                    'user_name' => $setting->user->name ?? 'N/A',
                    'status' => $setting->status
                ];
            })
        ]);

        return $notificationSettings->pluck('user')->filter(); // Remove null users
    }

    /**
     * Send notification to users with chatbot notification settings
     */
    private function sendChatbotNotifications($guestMessage, $guestId)
    {
        try {
            \Log::info('Starting chatbot notifications', [
                'message_id' => $guestMessage->id,
                'guest_id' => $guestId,
                'message' => \Str::limit($guestMessage->message, 50)
            ]);

            $users = $this->getChatbotNotificationUsers();
            
            \Log::info('Users to notify for chatbot', [
                'total_users_found' => $users->count(),
                'user_ids' => $users->pluck('id')->toArray(),
                'user_names' => $users->pluck('name')->toArray()
            ]);

            if ($users->isEmpty()) {
                \Log::warning('No users found with active chatbot notification settings');
                return;
            }

            // Create notification for each user
            foreach ($users as $user) {
                try {
                    // Get or find the chatbot module for notification_settings_id
                    // Try different variations of the chatbot module name
                    $possibleModuleNames = [
                        'guest chatbot',
                        'Guest Chatbot',
                        'Guest ChatBot',
                        'chatbot',
                        'Chatbot',
                        'ChatBot',
                        'chat bot',
                        'Chat Bot'
                    ];
                    
                    $chatbotModule = null;
                    foreach ($possibleModuleNames as $moduleName) {
                        $chatbotModule = module::where('module_name', $moduleName)
                            ->where('status', 'active')
                            ->first();
                        
                        if ($chatbotModule) {
                            break;
                        }
                    }

                    $notificationSettingId = null;
                    if ($chatbotModule) {
                        $notificationSetting = notification_settings::where('users_id', $user->id)
                            ->where('module_id', $chatbotModule->id)
                            ->where('status', 'active')
                            ->first();
                        
                        if ($notificationSetting) {
                            $notificationSettingId = $notificationSetting->id;
                        }
                    }

                    $notification = Notification::create([
                        'users_id' => $user->id,
                        'type' => 'info',
                        'title' => 'New Chatbot Message',
                        'message' => "Guest {$guestId} sent a message: " . \Str::limit($guestMessage->message, 100),
                        'notification_settings_id' => $notificationSettingId,
                        'read_at' => null
                    ]);

                    \Log::info('Chatbot notification created', [
                        'notification_id' => $notification->id,
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'notification_settings_id' => $notificationSettingId
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to create notification for user', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            \Log::info('Chatbot notifications sent successfully', [
                'total_notifications_sent' => $users->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error sending chatbot notifications: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
        }
    }
}
