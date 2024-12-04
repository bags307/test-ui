'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileIcon, ImageIcon, FolderIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  thumbnailUrl?: string;
  size: number;
  createdAt: Date;
}

export function FileGallery() {
  const [selectedTab, setSelectedTab] = useState('recent');

  // Sample data - replace with actual data from Firestore
  const files: FileItem[] = [
    {
      id: '1',
      name: 'project-diagram.png',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
      size: 1024 * 1024,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'requirements.pdf',
      type: 'document',
      url: '#',
      size: 512 * 1024,
      createdAt: new Date(),
    },
  ];

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const renderFile = (file: FileItem) => (
    <Card
      key={file.id}
      className="group relative overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
    >
      {file.type === 'image' ? (
        <AspectRatio ratio={16 / 9}>
          <img
            src={file.thumbnailUrl || file.url}
            alt={file.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      ) : (
        <AspectRatio ratio={16 / 9}>
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <FileIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        </AspectRatio>
      )}
      <div className="p-2 space-y-1">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
    </Card>
  );

  return (
    <Card className="p-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full">
          <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
          <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[400px] mt-4">
          <div className="grid grid-cols-2 gap-4">
            {files.map(renderFile)}
          </div>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}