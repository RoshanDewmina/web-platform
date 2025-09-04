import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export function useAdmin() {
  const { user, isLoaded } = useUser();

  const isAdmin = useMemo(() => {
    if (!isLoaded || !user) return false;
    
    // Check both metadata and publicMetadata for admin role
    const metadata = user.publicMetadata as any;
    return metadata?.role === 'admin';
  }, [user, isLoaded]);

  return {
    isAdmin,
    isLoaded,
    user
  };
}
