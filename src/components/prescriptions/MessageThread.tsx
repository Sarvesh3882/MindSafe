'use client';

// Message Thread Component
// Display conversation between student and counsellor
// Author: MindSafe India Development Team

import { useEffect, useState } from 'react';
import { MessageCircle, User, Clock, Edit2, Check, X, Save } from 'lucide-react';
import { PrescriptionMessage } from '@/types/prescription';
import { showToast } from '@/components/ui/Toast';

interface MessageThreadProps {
  prescriptionId: string;
  currentUserId: string;
  currentUserRole: 'student' | 'counsellor';
}

export function MessageThread({ prescriptionId, currentUserId, currentUserRole }: MessageThreadProps) {
  const [messages, setMessages] = useState<PrescriptionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadMessages();
    
    // Note: Realtime disabled for now - messages will refresh on page load
    // To enable realtime, ensure Supabase Realtime is enabled for prescription_messages table
    
    // Optionally poll for new messages every 10 seconds
    const pollInterval = setInterval(() => {
      loadMessages();
    }, 10000);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, [prescriptionId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/prescription-messages/${prescriptionId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      } else {
        setError(data.error || 'Failed to load messages');
      }
    } catch (err) {
      setError('An error occurred while loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const canEdit = (message: PrescriptionMessage) => {
    if (message.sender_id !== currentUserId) return false;
    
    const sentAt = new Date(message.sent_at);
    const now = new Date();
    const diffMs = now.getTime() - sentAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    return diffMins < 5; // 5-minute edit window
  };

  const startEdit = (message: PrescriptionMessage) => {
    setEditingMessageId(message.id);
    setEditText(message.message_text);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const saveEdit = async (messageId: string) => {
    if (!editText.trim() || editText.length > 2000) {
      return;
    }

    try {
      const response = await fetch(`/api/prescription-messages/edit/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: editText.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Update message in local state
        setMessages(messages.map(m => 
          m.id === messageId 
            ? { ...m, message_text: editText.trim(), edited_at: new Date().toISOString() }
            : m
        ));
        cancelEdit();
        showToast('Message updated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to edit message', 'error');
      }
    } catch (err) {
      showToast('An error occurred while editing the message', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={loadMessages}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No messages yet</p>
        <p className="text-sm text-gray-400 mt-1">Start a conversation about this recommendation</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId;
        const senderRole = message.sender_role;
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
              {/* Message Header */}
              <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-center gap-1.5 text-xs ${
                  isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {senderRole === 'counsellor' ? 'Counsellor' : 'You'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500">{formatTime(message.sent_at)}</span>
                  {message.edited_at && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Edit2 className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">edited</span>
                    </>
                  )}
                </div>
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  isOwnMessage
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                }`}
              >
                {editingMessageId === message.id ? (
                  // Edit Mode
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={2000}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${editText.length > 2000 ? 'text-red-600' : 'text-gray-500'}`}>
                        {editText.length}/2000
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(message.id)}
                          disabled={!editText.trim() || editText.length > 2000}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message_text}</p>
                )}
              </div>

              {/* Read Status */}
              {isOwnMessage && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  {message.read_at ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs text-gray-500">Read</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Sent</span>
                  )}
                </div>
              )}

              {/* Edit Button */}
              {canEdit(message) && editingMessageId !== message.id && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
                  onClick={() => startEdit(message)}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
