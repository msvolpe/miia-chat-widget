import React from 'react';

interface ChatFooterProps {
  botName?: string;
  poweredByText?: string;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  botName = 'Miia',
  poweredByText = 'Powered by',
}) => {
  return (
    <footer className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-100 bg-white shrink-0">
      <div className="flex items-center justify-center gap-1.5">
        <span>{poweredByText}</span>
        <span className="font-medium text-gray-700">{botName}</span>
      </div>
    </footer>
  );
};
