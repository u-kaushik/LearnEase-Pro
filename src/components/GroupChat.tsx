import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, Course } from '../types';
import { Send, MessageSquare, Users, Sparkles, Hash, Shield, GraduationCap, User, ArrowLeft, Menu } from 'lucide-react';

interface GroupChatProps {
  courses: Course[];
}

export const GroupChat: React.FC<GroupChatProps> = ({ courses }) => {
  const { user, role } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileChannelView, setMobileChannelView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    { id: 'general', name: 'General Campus Lounge', description: 'Public discussion for all students and faculties' },
    ...courses.map((c) => ({
      id: c.id,
      name: `${c.name} Study Group`,
      description: `Course collaborative channel led by ${c.facultyName}`,
    })),
  ];

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${activeRoomId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user) return;

    setSending(true);
    const textToSend = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await fetch(`/api/chat/${activeRoomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          text: textToSend,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>Group Chat & Discussions</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Real-time peer discussions, faculty office hours & course problem solving
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Room Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[70vh] sm:h-[600px] lg:h-[680px]">
        {/* Left Side: Room Channels (Responsive: hidden on mobile when viewing messages unless toggled) */}
        <div
          className={`lg:col-span-4 border-r border-slate-200 bg-slate-50 flex flex-col h-full ${
            !mobileChannelView ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Discussion Channels
            </h3>
            {mobileChannelView && (
              <button
                onClick={() => setMobileChannelView(false)}
                className="lg:hidden text-xs text-blue-600 font-bold"
              >
                Close
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map((room) => {
              const isSelected = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    setMobileChannelView(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'hover:bg-slate-200/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold truncate">{room.name}</span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {room.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* User Status Footer */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Messages Area */}
        <div
          className={`lg:col-span-8 flex flex-col h-full bg-white ${
            mobileChannelView ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Room Header with Mobile Channel Switcher */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <button
                onClick={() => setMobileChannelView(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 shrink-0"
                title="Switch Channel"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="truncate">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5 truncate">
                  <Hash className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{activeRoom.name}</span>
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate hidden xs:block">
                  {activeRoom.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileChannelView(true)}
              className="lg:hidden text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded shrink-0"
            >
              Channels
            </button>

            <span className="hidden lg:inline text-xs font-medium text-slate-400 shrink-0">
              {messages.length} messages
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 mb-2 stroke-1" />
                <p className="text-xs">No messages yet in #{activeRoom.name}.</p>
                <p className="text-[11px] text-slate-400 mt-1">Start the collaborative discussion below!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.userId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 text-[10px] sm:text-[11px]">
                      <span className="font-bold text-slate-900">{msg.userName}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          msg.userRole === 'admin'
                            ? 'bg-indigo-100 text-indigo-700'
                            : msg.userRole === 'faculty'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {msg.userRole}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden xs:inline">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-md px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-2.5 sm:p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message #${activeRoom.name}...`}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer flex items-center space-x-1 shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
