<?php

namespace App\Http\Controllers\chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\message;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();
        
        // Get all users except current user
        $users = User::where('id', '!=', $currentUser->id)
            ->select('id', 'name', 'photo', 'is_online', 'email', 'role', 'contact_number', 'street', 'lot', 'block')
            ->orderBy('name')
            ->get();
        
        // Get unread message counts for each user
        $unreadCounts = message::where('to_id', $currentUser->id)
            ->where('status', 'unread')
            ->select('from_id', DB::raw('COUNT(*) as unread_count'))
            ->groupBy('from_id')
            ->pluck('unread_count', 'from_id');
        
        // Add unread counts to users
        $users = $users->map(function($user) use ($unreadCounts) {
            $user->unread_count = $unreadCounts->get($user->id, 0);
            return $user;
        });
        
        // Get users with recent conversations
        $recentChats = DB::table('messages')
            ->select('users.id', 'users.name', 'users.photo', 'users.is_online', 
                     DB::raw('MAX(messages.created_at) as last_message_time'))
            ->join('users', function($join) use ($currentUser) {
                $join->on(function($query) use ($currentUser) {
                    $query->where('messages.from_id', '=', 'users.id')
                          ->where('messages.to_id', '=', $currentUser->id);
                })->orOn(function($query) use ($currentUser) {
                    $query->where('messages.to_id', '=', 'users.id')
                          ->where('messages.from_id', '=', $currentUser->id);
                });
            })
            ->where('users.id', '!=', $currentUser->id)
            ->whereNull('messages.deleted_at')
            ->groupBy('users.id', 'users.name', 'users.photo', 'users.is_online')
            ->orderBy('last_message_time', 'desc')
            ->limit(10)
            ->get();
        
        // Add unread counts to recent chats
        $recentChats = $recentChats->map(function($chat) use ($unreadCounts) {
            $chat->unread_count = $unreadCounts->get($chat->id, 0);
            return $chat;
        });
        
        return view('chat.chat', compact('users', 'recentChats', 'currentUser'));
    }
    
    public function getMessages($userId)
    {
        $currentUser = auth()->user();
        
        $messages = message::where(function($query) use ($currentUser, $userId) {
            $query->where('from_id', $currentUser->id)
                  ->where('to_id', $userId);
        })->orWhere(function($query) use ($currentUser, $userId) {
            $query->where('from_id', $userId)
                  ->where('to_id', $currentUser->id);
        })
        ->with(['user:id,name,photo', 'toUser:id,name,photo'])
        ->orderBy('created_at', 'asc')
        ->get();
        
        // Mark messages as read
        message::where('from_id', $userId)
            ->where('to_id', $currentUser->id)
            ->where('status', 'unread')
            ->update(['status' => 'read']);
        
        // Get the chat user's online status
        $chatUser = User::select('id', 'name', 'is_online')->find($userId);
        
        return response()->json([
            'success' => true,
            'messages' => $messages,
            'currentUserId' => $currentUser->id,
            'chatUser' => $chatUser
        ]);
    }
    
    public function sendMessage(Request $request)
    {
        $request->validate([
            'to_id' => 'required|exists:users,id',
            'message' => 'required|string|max:5000'
        ]);
        
        $currentUser = auth()->user();
        
        $message = message::create([
            'from_id' => $currentUser->id,
            'to_id' => $request->to_id,
            'message' => $request->message,
            'status' => 'unread'
        ]);
        
        // Create notification for the recipient
        Notification::create([
            'users_id' => $request->to_id,
            'type' => 'message',
            'title' => 'New Message',
            'message' => "You have a new message from {$currentUser->name}",
            'read_at' => null
        ]);
        
        $message->load(['user:id,name,photo', 'toUser:id,name,photo']);
        
        return response()->json([
            'success' => true,
            'message' => $message,
            'currentUserId' => $currentUser->id
        ]);
    }
    
    public function getUnreadCount()
    {
        $count = message::where('to_id', auth()->id())
            ->where('status', 'unread')
            ->count();
            
        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
    
    public function getNotifications()
    {
        $notifications = Notification::where('users_id', auth()->id())
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    }
    
    public function markNotificationAsRead($notificationId)
    {
        $notification = Notification::where('id', $notificationId)
            ->where('users_id', auth()->id())
            ->first();
            
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => 'Notification not found']);
    }
    
    public function markAllNotificationsAsRead()
    {
        Notification::where('users_id', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
            
        return response()->json(['success' => true]);
    }
    
    public function getLatestMessageSender()
    {
        $currentUser = auth()->user();
        
        // Get the latest unread message
        $latestMessage = message::where('to_id', $currentUser->id)
            ->where('status', 'unread')
            ->with(['user:id,name,photo'])
            ->orderBy('created_at', 'desc')
            ->first();
            
        if ($latestMessage) {
            return response()->json([
                'success' => true,
                'sender' => [
                    'id' => $latestMessage->user->id,
                    'name' => $latestMessage->user->name,
                    'photo' => $latestMessage->user->photo ? asset('storage/profiles/' . $latestMessage->user->photo) : asset('img/user.jpg')
                ]
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'No unread messages found'
        ]);
    }
}
