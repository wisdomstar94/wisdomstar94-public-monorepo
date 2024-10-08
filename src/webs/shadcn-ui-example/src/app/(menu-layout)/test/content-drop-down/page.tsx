'use client';

import { ContentDropDown } from '@/components/content-drop-down/content-drop-down.component';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { FC, useState } from 'react';

const Page: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full flex gap-2 relative">
        <div className="w-[100px] relative flex-shrink-0 flex-grow-0">
          left area <br />1<br />1<br />1<br />1<br />1
        </div>
        <div className="w-full relative">
          <ContentDropDown
            open={open}
            setOpen={setOpen}
            label={
              <div className="inline-flex gap-2 relative text-xs items-center">
                <ListFilter className="w-4 h-4" />
                <div>test</div>
              </div>
            }
            content={
              <div className="w-full flex flex-wrap gap-2 relative box-border p-2">
                <ul className="w-full flex flex-wrap p-1 box-border relative text-xs gap-2">
                  <li className="w-full flex flex-col flex-wrap gap-1 relative">
                    <div className="text-slate-400">title</div>
                    <div className="text-slate-800">content</div>
                  </li>
                  <li className="w-full flex flex-col flex-wrap gap-1 relative">
                    <div className="text-slate-400">title</div>
                    <div className="text-slate-800">content</div>
                  </li>
                  <li className="w-full flex flex-col flex-wrap gap-1 relative">
                    <div className="text-slate-400">title</div>
                    <div className="text-slate-800">content</div>
                  </li>
                </ul>
                <div className="w-full flex gap-2 justify-end p-1 box-border">
                  <Button variant="outline">초기화</Button>
                  <Button>적용</Button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Page;
