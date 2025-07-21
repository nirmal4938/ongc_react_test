import { IIconInputProps } from "@/components/svgIcons";

export interface ISidebar {
  name: string;
  icon: ({ className }: IIconInputProps) => JSX.Element;
  route: string | null;
  subRoute?: { name: string; router: string }[] | null;
}
