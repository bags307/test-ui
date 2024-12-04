'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Paperclip } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface InputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onVoiceToggle: () => void;
  onFileSelect: (files: File[]) => void;
  fullWidth?: boolean;
}

export function InputArea({
  input,
  onInputChange,
  onSend,
  onVoiceToggle,
  onFileSelect,
  fullWidth = false,
}: InputAreaProps) {
  const voiceStatus = useStore((state) => state.state.voice.status);
  const isVoiceActive = voiceStatus === 'active';
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
      setIsFileDialogOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files);
      setIsFileDialogOpen(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className={cn('space-y-4', fullWidth && 'w-full')}>
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <div className="space-y-2">
              <div className="flex justify-center">
                <Paperclip className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                Supported files: Images, PDF, DOC, DOCX
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={1}
        />
        
        <div className="flex gap-2">
          <Button
            variant={isVoiceActive ? 'destructive' : 'secondary'}
            size="icon"
            onClick={onVoiceToggle}
            className="shrink-0"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFileDialogOpen(true)}
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button onClick={onSend} className="flex-1">
            <Send className="h-5 w-5 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}