import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { FC } from 'react';

const Page: FC = () => {
  return (
    <>
      <div className="w-full flex gap-2 relative">
        <div className="w-[100px] relative flex-shrink-0 flex-grow-0">left area</div>
        <div className="w-full relative">
          <Popover>
            <PopoverTrigger className="w-full">
              <div className="w-full bg-slate-100 box-border px-2 py-1 flex justify-between items-start">
                <div className="inline-flex">Open</div>
                <div className="inline-flex flex-shrink-0 flex-grow-0">
                  <ChevronDown />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full">Place content for the popover here.</PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Page;
