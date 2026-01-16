import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Smile, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const commonEmojis = ['😊', '👍', '❤️', '😂', '🤔', '👋', '🎉', '🔥', '✨', '💯', '🙏', '💪'];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Message...',
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg shrink-0">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled || isLoading}
            >
              <Smile className="w-5 h-5" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                <div className="grid grid-cols-4 gap-2">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="text-2xl hover:bg-gray-100 rounded p-2 transition-colors flex items-center justify-center"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-gray-400"
            disabled={disabled || isLoading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={disabled || isLoading || !message.trim()}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
