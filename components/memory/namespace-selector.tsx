'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Namespace {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

const defaultNamespaces: Namespace[] = [
  { 
    id: 'default', 
    name: 'Default', 
    description: 'Default memory namespace',
    count: 156
  },
  { 
    id: 'projects', 
    name: 'Projects', 
    description: 'Project-related memories and contexts',
    count: 89
  },
  { 
    id: 'clients', 
    name: 'Clients', 
    description: 'Client interactions and relationships',
    count: 234
  },
  { 
    id: 'knowledge', 
    name: 'Knowledge Base', 
    description: 'General knowledge and documentation',
    count: 412
  }
];

export function NamespaceSelector() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [namespaces, setNamespaces] = useState<Namespace[]>(defaultNamespaces);
  const [newNamespace, setNewNamespace] = useState({ name: '', description: '' });

  const handleCreateNamespace = () => {
    if (!newNamespace.name) return;
    
    const id = newNamespace.name.toLowerCase().replace(/\s+/g, '-');
    const namespace: Namespace = {
      id,
      name: newNamespace.name,
      description: newNamespace.description,
      count: 0,
    };

    setNamespaces([...namespaces, namespace]);
    setValue(id);
    setDialogOpen(false);
    setNewNamespace({ name: '', description: '' });
    toast.success('Namespace created successfully');
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {value
              ? namespaces.find((namespace) => namespace.id === value)?.name
              : 'Select namespace...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search namespaces..." />
            <CommandEmpty>No namespace found.</CommandEmpty>
            <CommandGroup>
              {namespaces.map((namespace) => (
                <CommandItem
                  key={namespace.id}
                  value={namespace.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === namespace.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div>
                      <p className="font-medium">{namespace.name}</p>
                      {namespace.description && (
                        <p className="text-xs text-muted-foreground">
                          {namespace.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {namespace.count !== undefined && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {namespace.count} items
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Namespace</DialogTitle>
            <DialogDescription>
              Create a new namespace to organize your memory contexts and relationships.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newNamespace.name}
                onChange={(e) =>
                  setNewNamespace({ ...newNamespace, name: e.target.value })
                }
                placeholder="e.g., Projects, Clients, Knowledge Base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newNamespace.description}
                onChange={(e) =>
                  setNewNamespace({ ...newNamespace, description: e.target.value })
                }
                placeholder="Brief description of this namespace"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNamespace}
              disabled={!newNamespace.name.trim()}
            >
              Create Namespace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}