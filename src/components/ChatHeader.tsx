import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  botName?: string;
  avatar?: string;
  onMenuClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  botName = 'Miia AI Agent',
  avatar,
  onMenuClick,
}) => {
  return (
    <header className="bg-black text-white p-4 rounded-t-lg flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          {avatar && <AvatarImage src={avatar} alt={botName} />}
          <AvatarFallback className="bg-white text-black font-bold">
            {botName[0]?.toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-medium text-base">{botName}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={onMenuClick}
      >
        <MoreVertical className="w-5 h-5" />
      </Button>
    </header>
  );
};
