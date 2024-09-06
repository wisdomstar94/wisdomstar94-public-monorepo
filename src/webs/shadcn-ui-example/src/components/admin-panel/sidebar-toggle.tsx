import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SidebarToggle() {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => {
          const isSidebarOpenContain = document.body.classList.contains('sidebar-open');
          const date = new Date();
          date.setFullYear(2099);

          if (isSidebarOpenContain) {
            document.cookie = 'sidebar_state=; expires=' + date.toUTCString() + '; path=/';
          } else {
            document.cookie = 'sidebar_state=sidebar-open; expires=' + date.toUTCString() + '; path=/';
          }

          document.body.classList.toggle('sidebar-open');
        }}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform ease-in-out duration-700', 'rotate-180 sidebar-open:rotate-0')} />
      </Button>
    </div>
  );
}
