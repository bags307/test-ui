'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainNav } from '@/components/layout/main-nav';
import { SystemStatus } from '@/components/layout/system-status';
import { UserNav } from '@/components/layout/user-nav';
import { ChatDrawer } from '@/components/chat/chat-drawer';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const showChatDrawer = pathname !== '/conversations';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      });
    });

    return () => unsubscribe();
  }, [setUser, router]);

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-card p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-2xl">Sam</span>
        </div>
        <MainNav />
        <SystemStatus />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b px-6 flex items-center justify-between">
          <h1 className="font-semibold">Dashboard</h1>
          <UserNav />
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          {showChatDrawer && <ChatDrawer />}
        </div>
      </div>
    </div>
  );
}