'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2 } from 'lucide-react';
import { pineconeService } from '@/lib/services/pinecone';

interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
}

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const searchResults = await pineconeService.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memory..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {results.map((result) => (
            <Card key={result.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{result.metadata.title || 'Untitled'}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.metadata.description || 'No description'}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Score: {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              {result.metadata.tags && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {result.metadata.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
          {results.length === 0 && !isSearching && (
            <p className="text-center text-muted-foreground py-8">
              No results found
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}