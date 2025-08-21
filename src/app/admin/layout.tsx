import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  // This is a basic check - you should implement proper role checking
  // via Clerk's public metadata or a database lookup
  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
