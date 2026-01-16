import React from 'react';
import { Button } from './ui/button';

interface SuggestedActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
  visible?: boolean;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({
  actions,
  onActionClick,
  visible = true,
}) => {
  if (!visible || actions.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-3 text-xs sm:text-sm whitespace-normal text-left justify-start hover:bg-gray-50 transition-colors"
            onClick={() => onActionClick(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};
