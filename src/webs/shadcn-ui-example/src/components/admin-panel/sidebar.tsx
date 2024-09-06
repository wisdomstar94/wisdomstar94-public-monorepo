import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/admin-panel/menu';
import { SidebarToggle } from '@/components/admin-panel/sidebar-toggle';

export function Sidebar() {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        'w-[90px] sidebar-open:w-72'
      )}
    >
      <SidebarToggle />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button className={cn('transition-transform ease-in-out duration-300 mb-1', 'translate-x-1 sidebar-open:translate-x-0')} variant="link" asChild>
          <Link href="/dashboard" className="flex items-center gap-2 h-9">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                '-translate-x-96 opacity-0 hidden sidebar-open:translate-x-0 sidebar-open:opacity-100 sidebar-open:block'
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>
        <Menu />
      </div>
    </aside>
  );
}
