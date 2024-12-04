'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FileIcon, ImageIcon } from 'lucide-react';

interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (attachment: Attachment) => {
    if (attachment.type === 'image') {
      return (
        <div className="relative w-48 overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <img
              src={attachment.url}
              alt={attachment.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
        <FileIcon className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{attachment.name}</span>
          {attachment.size && (
            <span className="text-xs text-muted-foreground">
              {formatFileSize(attachment.size)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="flex-1 mb-4">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'flex flex-col gap-2',
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg max-w-[80%]',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.attachments.map((attachment, index) => (
                      <div key={index}>{renderAttachment(attachment)}</div>
                    ))}
                  </div>
                )}
                <div
                  className={cn(
                    'text-xs mt-1',
                    msg.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}