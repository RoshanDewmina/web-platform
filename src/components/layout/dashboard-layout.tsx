import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='h-screen flex overflow-hidden'>
      <div className='hidden md:flex w-72 flex-col fixed inset-y-0'>
        <Sidebar />
      </div>
      <main className='flex-1 md:pl-72'>
        <Navbar />
        <ScrollArea className='flex-1 h-[calc(100vh-73px)]'>
          <div className='p-6'>{children}</div>
        </ScrollArea>
      </main>
    </div>
  );
}
