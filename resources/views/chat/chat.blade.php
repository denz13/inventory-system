@extends('layout._partials.master')

@section('content')

<div class="col-span-12 mt-6 -mb-6 intro-y">
    <h2 class="intro-y text-lg font-medium mt-10">
        Chat
    </h2>

    <div class="intro-y chat grid grid-cols-12 gap-5 mt-5">
        <!-- BEGIN: Chat Side Menu -->
        <div class="col-span-12 lg:col-span-4 2xl:col-span-3">

            <div class="tab-content">
                <div id="chats" class="tab-pane active" role="tabpanel" aria-labelledby="chats-tab">
                    <div class="pr-1">
                        <div class="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
                            <div class="relative text-slate-500">
                                <input type="text" id="searchUsers" class="form-control py-3 px-4 border-transparent bg-slate-100 pr-10" placeholder="Search for messages or users...">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 hidden sm:absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <div class="overflow-x-auto scrollbar-hidden">
                                <div class="flex mt-5">
                                    @foreach($recentChats as $chat)
                                    <a href="javascript:;" class="w-10 mr-4 cursor-pointer quick-chat-user relative" data-user-id="{{ $chat->id }}" data-user-name="{{ $chat->name }}" data-user-photo="{{ $chat->photo ? asset('storage/profiles/' . $chat->photo) : asset('img/user.jpg') }}">
                                        <div class="w-10 h-10 flex-none image-fit rounded-full relative">
                                            <img alt="{{ $chat->name }}" class="rounded-full" src="{{ $chat->photo ? asset('storage/profiles/' . $chat->photo) : asset('img/user.jpg') }}">
                                            @if($chat->is_online)
                                            <div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>
                                            @endif
                                            @if($chat->unread_count > 0)
                                            <div class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                                {{ $chat->unread_count > 9 ? '9+' : $chat->unread_count }}
                                            </div>
                                            @endif
                                        </div>
                                        <div class="text-xs text-slate-500 truncate text-center mt-2">{{ Str::limit($chat->name, 10) }}</div>
                                    </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4" id="usersList">
                        @foreach($users as $user)
                        <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-3 user-item"
                            data-user-id="{{ $user->id }}"
                            data-user-name="{{ $user->name }}"
                            data-user-photo="{{ $user->photo ? asset('storage/profiles/' . $user->photo) : asset('img/user.jpg') }}">
                            <div class="w-12 h-12 flex-none image-fit mr-1 relative">
                                <img alt="{{ $user->name }}" class="rounded-full" src="{{ $user->photo ? asset('storage/profiles/' . $user->photo) : asset('img/user.jpg') }}">
                                @if($user->is_online)
                                <div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>
                                @endif
                                @if($user->unread_count > 0)
                                <div class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white">
                                    {{ $user->unread_count > 9 ? '9+' : $user->unread_count }}
                                </div>
                                @endif
                            </div>
                            <div class="ml-2 overflow-hidden flex-1">
                                <div class="flex items-center justify-between">
                                    <a href="javascript:;" class="font-medium">{{ $user->name }}</a>
                                    @if($user->unread_count > 0)
                                    <span class="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                        {{ $user->unread_count }} {{ $user->unread_count === 1 ? 'unread message' : 'unread messages' }}
                                    </span>
                                    @endif
                                </div>
                                <div class="w-full truncate text-slate-500 text-xs mt-0.5">
                                    @if($user->is_online)
                                    Online
                                    @else
                                    Offline
                                    @endif
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Chat Side Menu -->

        <!-- BEGIN: Chat Content -->
        <div class="intro-y col-span-12 lg:col-span-8 2xl:col-span-9">
            <div class="chat__box box">
                <!-- BEGIN: Chat Active -->
                <div id="chatActive" class="hidden h-full flex flex-col">
                    <div class="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                                <img id="activeUserPhoto" alt="User" class="rounded-full" src="{{ asset('img/user.jpg') }}">
                            </div>
                            <div class="ml-3 mr-auto">
                                <div id="activeUserName" class="font-medium text-base"></div>
                                <div class="text-xs sm:text-sm">
                                    <span id="activeUserStatus" class="text-slate-500">Offline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="messagesContainer" class="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1">
                        <!-- Messages will be loaded here -->
                    </div>

                    <div class="pt-4 pb-10 sm:py-4 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
                        <textarea id="messageInput" class="chat__box__input form-control dark:bg-darkmode-600 h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0" rows="1" placeholder="Type your message..."></textarea>
                        <button id="sendMessageBtn" class="w-8 h-8 sm:w-10 sm:h-10 block bg-primary text-white rounded-full flex-none flex items-center justify-center mr-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="send" data-lucide="send" class="lucide lucide-send w-4 h-4">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- END: Chat Active -->

                <!-- BEGIN: Chat Default -->
                <div id="chatDefault" class="h-full flex items-center">
                    <div class="mx-auto text-center">
                        <div class="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                            <img alt="{{ $currentUser->name }}" src="{{ $currentUser->photo ? asset('storage/profiles/' . $currentUser->photo) : asset('img/user.jpg') }}">
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Hey, {{ $currentUser->name }}!</div>
                            <div class="text-slate-500 mt-1">Please select a user to start messaging.</div>
                        </div>
                    </div>
                </div>
                <!-- END: Chat Default -->
            </div>
        </div>
        <!-- END: Chat Content -->
    </div>
</div>

<!-- Hidden data for JavaScript -->
<input type="hidden" id="currentUserId" value="{{ $currentUser->id }}">
<input type="hidden" id="csrfToken" value="{{ csrf_token() }}">

<!-- Message Templates -->
<template id="currentUserMessageTemplate">
    <div class="chat__box__text-box flex items-end float-right mb-4">
        <div class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-l-md rounded-t-md">
            <span class="message-text"></span>
            <div class="mt-1 text-xs text-slate-500 message-time"></div>
        </div>
        <div class="w-10 h-10 hidden sm:block flex-none image-fit relative ml-5">
            <img alt="User" class="rounded-full message-avatar" src="">
        </div>
    </div>
    <div class="clear-both"></div>
</template>

<template id="otherUserMessageTemplate">
    <div class="chat__box__text-box flex items-end float-left mb-4">
        <div class="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5">
            <img alt="User" class="rounded-full message-avatar" src="">
        </div>
        <div class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md">
            <span class="message-text"></span>
            <div class="mt-1 text-xs text-slate-500 message-time"></div>
        </div>
    </div>
    <div class="clear-both"></div>
</template>

@endsection

@push('scripts')
<script src="{{ asset('js/chat/chat.js') }}?v={{ time() }}"></script>
@endpush