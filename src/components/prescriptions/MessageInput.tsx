'use client';

// Message Input Component
// Send messages about wellness recommendations
// Author: MindSafe India Development Team

import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface MessageInputProps {
  prescriptionId: string;
  onMessageSent?: () => void;
  placeholder?: string;
}

export function MessageInput({ 
  prescriptionId, 
  onMessageSent,
  placeholder = "Share your thoughts or ask questions..."
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      return;
    }

    if (trimmedMessage.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    if (trimmedMessage.length > 1000) {
      setError('Message must not exceed 1000 characters');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/prescription-messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId,
          messageText: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('');
        showToast('Message sent successfully', 'success');
        onMessageSent?.();
      } else {
        setError(data.error || 'Failed to send message');
        showToast(data.error || 'Failed to send message', 'error');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charCount = message.length;
  const isOverLimit = charCount > 1000;
  const isNearLimit = charCount > 900;

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Error Message */}
      {error && (
        <div className="px-4 pt-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-3">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={isSending}
              className={`w-full px-4 py-3 pr-16 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isOverLimit 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300'
              } ${
                isSending ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                minHeight: '48px',
                maxHeight: '200px'
              }}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-2">
              <span className={`text-xs ${
                isOverLimit 
                  ? 'text-red-600 font-medium' 
                  : isNearLimit 
                  ? 'text-orange-600' 
                  : 'text-gray-400'
              }`}>
                {charCount}/1000
              </span>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSending || !message.trim() || isOverLimit}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            title="Send message (Enter)"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}
