import { VITE_APP_API_URL } from "@/config";
import {
  ArchiveIcon,
  CrossIcon,
  DeleteIcon,
  EditIocn,
  IconEye,
  PDFDownloadIcon,
  PlusIcon,
  UnArchiveIcon,
} from "./svgIcons";

export const imageRender = (imagePath: string | undefined | null) => (
  <img
    src={
      imagePath
        ? String(VITE_APP_API_URL + imagePath)
        : "/assets/images/user.jpg"
    }
    width={50}
    height={50}
    className="rounded-md"
    alt=""
  />
);
export const statusRender = (status: boolean) =>
  status ? (
    <span className="font-semibold text-PrimaryGreen">Active</span>
  ) : (
    <span className="font-semibolds text-tomatoRed">Archived</span>
  );

export const ViewButton = (props: { onClickHandler?: () => void }) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      View
    </span>
    <IconEye className="w-ful h-full pointer-events-none" />
  </span>
);

export const EditButton = (props: { onClickHandler?: () => void }) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      Edit
    </span>
    <EditIocn className="w-ful h-full pointer-events-none" />
  </span>
);

export const ArchiveButton = (props: {
  onClickHandler?: () => void;
  status: boolean;
}) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    {props.status ? (
      <>
        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
          Archive
        </span>
        <ArchiveIcon className="w-ful h-full pointer-events-none" />
      </>
    ) : (
      <>
        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
          Unarchive
        </span>
        <UnArchiveIcon className="w-ful h-full pointer-events-none" />
      </>
    )}
  </span>
);

export const PlusButton = (props: { onClickHandler?: () => void }) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      Add
    </span>
    <PlusIcon className="w-ful h-full pointer-events-none" />
  </span>
);

export const DeleteButton = (props: { onClickHandler?: () => void }) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-red p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      Delete
    </span>
    <DeleteIcon className="w-ful h-full pointer-events-none" />
  </span>
);

export const PDFDownloadButton = (props: { onClickHandler?: () => void }) => (
  <span
    className="relative group w-10 h-10 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-primaryRed p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      Download PDF
    </span>
    <PDFDownloadIcon className="w-ful h-full pointer-events-none" />
  </span>
);

export const CrossButton = (props: {
  tooltip?: string;
  onClickHandler?: () => void;
}) => (
  <span
    className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
    onClick={props.onClickHandler}
  >
    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
      {props?.tooltip ? props?.tooltip : "Cancel"}
    </span>
    <CrossIcon className="w-ful h-full pointer-events-none" />
  </span>
);
