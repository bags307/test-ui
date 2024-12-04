'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Brain,
  Settings,
  Activity,
  Database,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Conversations',
    href: '/conversations',
    icon: MessageSquare,
  },
  {
    title: 'Memory',
    href: '/memory',
    icon: Brain,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: Activity,
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge',
    icon: Database,
  },
  {
    title: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-2',
            pathname === item.href && 'bg-secondary'
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
}