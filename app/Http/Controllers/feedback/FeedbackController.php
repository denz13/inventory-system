<?php

namespace App\Http\Controllers\feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_feedback;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        // Get per_page from request, default to 10
        $perPage = $request->get('per_page', 10);
        
        // Ensure per_page is a valid value
        $perPage = in_array($perPage, [10, 25, 35, 50]) ? $perPage : 10;
        
        // Get current user's feedback only
        $feedbacks = tbl_feedback::with(['user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Get current user info
        $currentUser = auth()->user();

        return view('feedback.feedback', compact('feedbacks', 'currentUser'));
    }

    public function store(Request $request)
    {
        try {
            // Check for banned words first
            $bannedWordsCheck = $this->checkBannedWords($request->description);
            if (!$bannedWordsCheck['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your feedback contains inappropriate content. Please remove the following words: ' . implode(', ', $bannedWordsCheck['banned_words']),
                    'banned_words' => $bannedWordsCheck['banned_words']
                ], 422);
            }

            $validator = \Validator::make($request->all(), [
                'description' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
            ], [
                'description.required' => 'Feedback description is required',
                'rating.required' => 'Please select a rating',
                'rating.min' => 'Please select a rating between 1 and 5 stars',
                'rating.max' => 'Please select a rating between 1 and 5 stars',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            tbl_feedback::create([
                'user_id' => auth()->id(), // Use current logged-in user
                'description' => $request->description,
                'rating' => $request->rating,
                'status' => 'active', // Default status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $feedback = tbl_feedback::with(['user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'feedback' => $feedback
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Check for banned words first
            $bannedWordsCheck = $this->checkBannedWords($request->description);
            if (!$bannedWordsCheck['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your feedback contains inappropriate content. Please remove the following words: ' . implode(', ', $bannedWordsCheck['banned_words']),
                    'banned_words' => $bannedWordsCheck['banned_words']
                ], 422);
            }

            $validator = \Validator::make($request->all(), [
                'description' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
                'status' => 'nullable|in:active,inactive',
            ], [
                'description.required' => 'Feedback description is required',
                'rating.required' => 'Please select a rating',
                'rating.min' => 'Please select a rating between 1 and 5 stars',
                'rating.max' => 'Please select a rating between 1 and 5 stars',
                'status.in' => 'Status must be either active or inactive',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed'
                ], 422);
            }

            $feedback = tbl_feedback::findOrFail($id);
            
            // Check if the current user owns this feedback (optional security check)
            if ($feedback->user_id != auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only edit your own feedback'
                ], 403);
            }
            
            $feedback->update([
                'description' => $request->description,
                'rating' => $request->rating,
                'status' => $request->input('status', 'active'), // Default to active if not provided
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $feedback = tbl_feedback::findOrFail($id);
            
            // Check if the current user owns this feedback (optional security check)
            if ($feedback->user_id != auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own feedback'
                ], 403);
            }
            
            $feedback->delete();

            return response()->json([
                'success' => true,
                'message' => 'Feedback deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting feedback'
            ], 500);
        }
    }

    /**
     * Check if the text contains banned words
     */
    private function checkBannedWords($text)
    {
        // Comprehensive list of banned words
        $bannedWords = [
            // Profanity and offensive language
            'fuck', 'fucking', 'fucked', 'fucker', 'fuckers',
            'shit', 'shitting', 'shitted', 'shitter', 'shitters',
            'bitch', 'bitches', 'bitching', 'bitched',
            'asshole', 'assholes', 'ass', 'asses',
            'damn', 'damned', 'damning',
            'hell', 'hells',
            'crap', 'craps', 'crapping', 'crapped',
            'piss', 'pissing', 'pissed', 'pisser',
            'dick', 'dicks', 'dickhead', 'dickheads',
            'cock', 'cocks', 'cockhead', 'cockheads',
            'pussy', 'pussies',
            'whore', 'whores', 'whoring', 'whored',
            'slut', 'sluts', 'slutting', 'slutty',
            'bastard', 'bastards',
            'son of a bitch', 'sob',
            'motherfucker', 'motherfuckers', 'motherfucking',
            
            // Racial slurs and offensive terms
            'nigger', 'niggers', 'nigga', 'niggas',
            'chink', 'chinks', 'chinky',
            'spic', 'spics', 'spick', 'spicks',
            'kike', 'kikes',
            'wetback', 'wetbacks',
            'gook', 'gooks',
            'coon', 'coons',
            'honky', 'honkies',
            'cracker', 'crackers',
            'redneck', 'rednecks',
            'hillbilly', 'hillbillies',
            
            // Homophobic slurs
            'fag', 'fags', 'faggot', 'faggots', 'faggy',
            'dyke', 'dykes', 'dike', 'dikes',
            'queer', 'queers', 'queering',
            'homo', 'homos', 'homosexual',
            'tranny', 'trannies', 'transgender',
            
            // Violence and threats
            'kill', 'killing', 'killed', 'killer', 'killers',
            'murder', 'murdering', 'murdered', 'murderer', 'murderers',
            'suicide', 'suicidal', 'suiciding',
            'bomb', 'bombing', 'bombed', 'bomber', 'bombers',
            'terrorist', 'terrorists', 'terrorism',
            'shoot', 'shooting', 'shot', 'shooter', 'shooters',
            'stab', 'stabbing', 'stabbed', 'stabber', 'stabbers',
            'rape', 'raping', 'raped', 'rapist', 'rapists',
            'molest', 'molesting', 'molested', 'molester', 'molesters',
            'abuse', 'abusing', 'abused', 'abuser', 'abusers',
            'torture', 'torturing', 'tortured', 'torturer', 'torturers',
            
            // Drugs and illegal substances
            'cocaine', 'coke', 'crack', 'crack cocaine',
            'heroin', 'heroine', 'smack', 'dope',
            'marijuana', 'marihuana', 'weed', 'pot', 'grass', 'hash', 'hashish',
            'meth', 'methamphetamine', 'crystal meth', 'ice',
            'ecstasy', 'mdma', 'molly',
            'lsd', 'acid', 'hallucinogen',
            'pills', 'uppers', 'downers', 'speed',
            'drugs', 'drug', 'drugging', 'drugged',
            'overdose', 'overdosing', 'overdosed',
            
            // Sexual content
            'porn', 'porno', 'pornography', 'pornographic',
            'sex', 'sexual', 'sexually', 'sexing',
            'fuck', 'fucking', 'fucked', 'fucker',
            'screw', 'screwing', 'screwed', 'screwer',
            'bang', 'banging', 'banged', 'banger',
            'nude', 'naked', 'nudity',
            'breast', 'breasts', 'boob', 'boobs', 'boobies',
            'penis', 'penises', 'dick', 'dicks', 'cock', 'cocks',
            'vagina', 'vaginas', 'pussy', 'pussies',
            'orgasm', 'orgasms', 'orgasmic',
            'masturbate', 'masturbating', 'masturbated', 'masturbation',
            'prostitute', 'prostitutes', 'prostitution',
            'escort', 'escorts', 'escorting',
            
            // Hate speech and discrimination
            'hate', 'hating', 'hated', 'hater', 'haters',
            'racist', 'racism', 'racists',
            'sexist', 'sexism', 'sexists',
            'homophobic', 'homophobia',
            'transphobic', 'transphobia',
            'discrimination', 'discriminating', 'discriminated',
            'prejudice', 'prejudiced', 'prejudicial',
            'bigot', 'bigots', 'bigotry', 'bigoted',
            'nazi', 'nazis', 'nazism',
            'hitler', 'hitlers',
            'supremacist', 'supremacists', 'supremacy',
            'white power', 'black power',
            
            // Spam and scam related
            'spam', 'spamming', 'spammed', 'spammer', 'spammers',
            'scam', 'scamming', 'scammed', 'scammer', 'scammers',
            'fraud', 'frauding', 'frauded', 'fraudster', 'fraudsters',
            'phishing', 'phished', 'phisher', 'phishers',
            'malware', 'virus', 'viruses', 'trojan', 'trojans',
            'hack', 'hacking', 'hacked', 'hacker', 'hackers',
            'steal', 'stealing', 'stole', 'stolen', 'thief', 'thieves',
            'rob', 'robbing', 'robbed', 'robber', 'robbers',
            'cheat', 'cheating', 'cheated', 'cheater', 'cheaters',
            
            // Additional offensive terms
            'retard', 'retarded', 'retards', 'retarding',
            'idiot', 'idiots', 'idiotic', 'idiotically',
            'stupid', 'stupidity', 'stupidly',
            'dumb', 'dumber', 'dumbest', 'dumbass', 'dumbasses',
            'moron', 'morons', 'moronic',
            'imbecile', 'imbeciles', 'imbecilic',
            'lunatic', 'lunatics', 'lunacy',
            'psycho', 'psychos', 'psychotic',
            'crazy', 'crazier', 'craziest', 'craziness',
            'insane', 'insanity', 'insanely',
            'mental', 'mentally', 'mentality',
            
            // Internet slang and abbreviations
            'wtf', 'what the fuck',
            'stfu', 'shut the fuck up',
            'gtfo', 'get the fuck out',
            'fml', 'fuck my life',
            'omfg', 'oh my fucking god',
            'lmfao', 'laughing my fucking ass off',
            'roflmao', 'rolling on floor laughing my ass off',
            'af', 'as fuck',
            'tf', 'the fuck',
            'btw', 'by the way',
            'fyi', 'for your information',
            'tbh', 'to be honest',
            'imo', 'in my opinion',
            'imho', 'in my humble opinion',
            
            // Additional profanity variations
            'f*ck', 'f**k', 'f***', 'f****',
            'sh*t', 'sh**', 'sh***', 'sh****',
            'b*tch', 'b**ch', 'b***h', 'b****h',
            'a**', 'a***', 'a****',
            'd*ck', 'd**k', 'd***', 'd****',
            'c*ck', 'c**k', 'c***', 'c****',
            'p*ssy', 'p**sy', 'p***y', 'p****y',
            
            // Leet speak variations
            'fuck', 'fuk', 'fukc', 'fuking', 'fuked',
            'shit', 'shyt', 'sh1t', 'shyt', 'shiting',
            'bitch', 'b1tch', 'b1tch', 'b1tching',
            'ass', 'a55', 'a55hole', 'a55holes',
            'damn', 'd4mn', 'd4mned', 'd4mning',
            'hell', 'h3ll', 'h3lls',
            'crap', 'cr4p', 'cr4ps', 'cr4pping',
            'piss', 'p155', 'p155ing', 'p155ed',
            'dick', 'd1ck', 'd1cks', 'd1ckhead',
            'cock', 'c0ck', 'c0cks', 'c0ckhead',
            'pussy', 'p155y', 'p155ies',
            'whore', 'wh0re', 'wh0res', 'wh0ring',
            'slut', 'slut', 'sluts', 'slutting',
            'bastard', 'b4stard', 'b4stards',
            
            // Additional offensive combinations
            'son of a bitch', 'son of a b*tch', 'son of a b**ch',
            'motherfucker', 'motherf*cker', 'motherf**ker',
            'piece of shit', 'piece of sh*t', 'piece of sh**t',
            'piece of crap', 'piece of cr4p',
            'what the hell', 'what the h3ll',
            'what the fuck', 'what the f*ck', 'what the f**k',
            'go to hell', 'go to h3ll',
            'go fuck yourself', 'go f*ck yourself', 'go f**k yourself',
            'fuck you', 'f*ck you', 'f**k you',
            'fuck off', 'f*ck off', 'f**k off',
            'fuck this', 'f*ck this', 'f**k this',
            'fuck that', 'f*ck that', 'f**k that',
            'fuck me', 'f*ck me', 'f**k me',
            'fuck him', 'f*ck him', 'f**k him',
            'fuck her', 'f*ck her', 'f**k her',
            'fuck them', 'f*ck them', 'f**k them',
            'fuck it', 'f*ck it', 'f**k it',
            'fuck up', 'f*ck up', 'f**k up',
            'fuck around', 'f*ck around', 'f**k around',
            'fuck with', 'f*ck with', 'f**k with',
            'fuck over', 'f*ck over', 'f**k over',
            'fuck up', 'f*ck up', 'f**k up',
            'fuck off', 'f*ck off', 'f**k off',
            'fuck out', 'f*ck out', 'f**k out',
            'fuck in', 'f*ck in', 'f**k in',
            'fuck on', 'f*ck on', 'f**k on',
            'fuck at', 'f*ck at', 'f**k at',
            'fuck by', 'f*ck by', 'f**k by',
            'fuck for', 'f*ck for', 'f**k for',
            'fuck to', 'f*ck to', 'f**k to',
            'fuck from', 'f*ck from', 'f**k from',
            'fuck of', 'f*ck of', 'f**k of',
            'fuck and', 'f*ck and', 'f**k and',
            'fuck or', 'f*ck or', 'f**k or',
            'fuck but', 'f*ck but', 'f**k but',
            'fuck so', 'f*ck so', 'f**k so',
            'fuck if', 'f*ck if', 'f**k if',
            'fuck when', 'f*ck when', 'f**k when',
            'fuck where', 'f*ck where', 'f**k where',
            'fuck why', 'f*ck why', 'f**k why',
            'fuck how', 'f*ck how', 'f**k how',
            'fuck what', 'f*ck what', 'f**k what',
            'fuck who', 'f*ck who', 'f**k who',
            'fuck which', 'f*ck which', 'f**k which',
            'fuck whose', 'f*ck whose', 'f**k whose',
            'fuck whom', 'f*ck whom', 'f**k whom',
        ];

        $text = strtolower($text);
        $foundBannedWords = [];

        foreach ($bannedWords as $word) {
            // Check for exact word matches (with word boundaries)
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $text)) {
                $foundBannedWords[] = $word;
            }
        }

        return [
            'valid' => empty($foundBannedWords),
            'banned_words' => $foundBannedWords
        ];
    }
}
