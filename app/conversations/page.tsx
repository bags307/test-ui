'use client';

import { useState, useEffect } from 'react';
import { MessageList } from '@/components/chat/message-list';
import { InputArea } from '@/components/chat/input-area';
import { VoiceControl } from '@/components/voice/voice-control';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Neo4jBrowser } from '@/components/graph/neo4j-browser';
import { LogViewer } from '@/components/logs/log-viewer';
import { FileGallery } from '@/components/files/file-gallery';
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

export default function ConversationsPage() {
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
  const [activeTab, setActiveTab] = useState('chat');
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array(128).fill(0.1));

  // Simulate voice activity with more natural waveform
  useEffect(() => {
    if (voiceStatus === 'active') {
      const interval = setInterval(() => {
        const newData = new Float32Array(128);
        for (let i = 0; i < newData.length; i++) {
          newData[i] = 
            Math.sin(Date.now() * 0.01 + i * 0.1) * 0.3 +
            Math.sin(Date.now() * 0.02 + i * 0.2) * 0.2 +
            Math.sin(Date.now() * 0.005 + i * 0.05) * 0.1 +
            (Math.random() * 0.1);
        }
        setAudioData(newData);
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAudioData(new Float32Array(128).fill(0.1));
    }
  }, [voiceStatus]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: 'user', content: input, timestamp: new Date() },
    ]);
    setInput('');

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
    if (voiceStatus !== 'active') {
      toast.success('Voice input activated');
    }
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

    toast.success(`Uploaded ${files.length} file(s)`);
  };

  return (
    <div className="h-full grid grid-cols-[1fr,400px] gap-6">
      <Card className="flex flex-col p-4">
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
          fullWidth
        />
      </Card>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="graph" className="flex-1">Graph</TabsTrigger>
            <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="graph">
            <Neo4jBrowser
              url="http://localhost:7474"
              isFullscreen={isGraphFullscreen}
              onToggleFullscreen={() => setIsGraphFullscreen(!isGraphFullscreen)}
            />
          </TabsContent>
          <TabsContent value="files">
            <FileGallery />
          </TabsContent>
          <TabsContent value="logs">
            <LogViewer logs={[]} maxHeight="500px" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}