'use client';

import { MobileSidebar } from './mobile-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { XPTracker } from '@/components/ui/xp-tracker';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function Navbar() {
  const { user } = useUser();
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      try {
        const res = await fetch('/api/users/stats');
        if (res.ok) {
          const data = await res.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user?.id]);

  return (
    <div className='flex items-center p-4 border-b'>
      <MobileSidebar />
      
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center flex-1 max-w-xl'>
          <div className='relative w-full'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search courses, topics, or friends...'
              className='pl-8'
            />
          </div>
        </div>
        
        <div className='flex items-center gap-2 ml-4'>
          {/* XP Tracker */}
          {!loading && userStats && (
            <XPTracker
              currentXP={userStats.totalXP % 100}
              currentLevel={userStats.currentLevel}
              nextLevelXP={userStats.nextLevelXP}
              totalXP={userStats.totalXP}
              compact={true}
              className="mr-2"
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-5 w-5' />
                <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500'>
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium'>New achievement unlocked!</p>
                  <p className='text-xs text-muted-foreground'>
                    You've completed your first course
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium'>Friend request</p>
                  <p className='text-xs text-muted-foreground'>
                    John Doe wants to be your friend
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium'>Study group invite</p>
                  <p className='text-xs text-muted-foreground'>
                    You've been invited to "JavaScript Masters"
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-center'>
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
