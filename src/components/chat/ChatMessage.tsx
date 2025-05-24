
import React from 'react';
import { cn } from '@/lib/utils';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <div className={cn(
      "flex w-full",
      role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        "max-w-[85%] p-3 rounded-lg",
        role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      )}>
        {role === 'assistant' ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-table:text-foreground"
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
};
