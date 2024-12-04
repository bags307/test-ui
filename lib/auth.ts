import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { toast } from 'sonner';

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    // Clear auth cookie
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  } catch (error: any) {
    toast.error('Error signing out: ' + error.message);
  }
};

export const setAuthCookie = async (token: string) => {
  // Set auth cookie with HttpOnly and secure flags
  const secure = process.env.NODE_ENV === 'production' ? 'secure;' : '';
  document.cookie = `auth=${token}; path=/; ${secure} samesite=strict; max-age=86400`;
};