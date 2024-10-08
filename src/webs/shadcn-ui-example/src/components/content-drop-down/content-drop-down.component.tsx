import { ChevronDown } from 'lucide-react';
import { Dispatch, FC, ReactNode, SetStateAction } from 'react';

export type ContentDropDownPropsType = {
  label: ReactNode;
  content: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ContentDropDown: FC<ContentDropDownPropsType> = ({ label, content, open, setOpen }) => {
  return (
    <>
      <div className="w-full relative flex">
        {/* trigger */}
        <button
          className="w-full flex items-center justify-between px-2.5 py-2 cursor-pointer bg-neutral-100 group/content-dropdown-button"
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          <div className="w-full h-full absolute top-0 left-0 bg-black/5 hidden group-hover/content-dropdown-button:flex" />
          <div className="inline-flex min-w-0">{label}</div>
          <div className="inline-flex flex-shrink-0 flex-grow-0">
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {/* content */}
        <div className={`w-full h-[1px] flex gap-2 absolute bottom-0 left-0 items-start ${open ? 'flex' : 'hidden'}`}>
          <div className="w-full flex flex-wrap relative bg-neutral-100">{content}</div>
        </div>
      </div>
    </>
  );
};
