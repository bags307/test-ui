'use client';

import { useState, useEffect } from 'react';
import { MessageList } from './message-list';
import { InputArea } from './input-area';
import { VoiceControl } from '../voice/voice-control';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
  timestamp: Date;
}

export function ChatDrawer() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const voiceStatus = useStore((state) => state.state.voice.status);
  const setVoiceStatus = useStore((state) => state.setVoiceStatus);
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array(7).fill(0.1));

  // Simulate voice activity
  useEffect(() => {
    if (voiceStatus === 'active') {
      const interval = setInterval(() => {
        const newData = new Float32Array(7);
        for (let i = 0; i < newData.length; i++) {
          newData[i] = Math.random() * 0.5 + 0.2; // Random values between 0.2 and 0.7
        }
        setAudioData(newData);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setAudioData(new Float32Array(7).fill(0.1));
    }
  }, [voiceStatus]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: 'user', content: input, timestamp: new Date() },
    ]);
    setInput('');

    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I received your message: ' + input,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setVoiceStatus(voiceStatus === 'active' ? 'inactive' : 'active');
  };

  const handleFileSelect = async (files: File[]) => {
    const attachments = await Promise.all(
      files.map(async (file) => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }))
    );

    setMessages([
      ...messages,
      {
        role: 'user',
        content: 'Sent attachments:',
        attachments,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className={`flex h-full transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-[600px]'}`}>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {!isCollapsed && (
        <Card className="flex-1 flex flex-col p-4 gap-4">
          <MessageList messages={messages} />
          <VoiceControl
            isActive={voiceStatus === 'active'}
            audioData={audioData}
            onToggle={handleVoiceToggle}
          />
          <InputArea
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onVoiceToggle={handleVoiceToggle}
            onFileSelect={handleFileSelect}
          />
        </Card>
      )}
    </div>
  );
}