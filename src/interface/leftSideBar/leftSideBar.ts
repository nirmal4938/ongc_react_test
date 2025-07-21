import { IIconInputProps } from "@/components/svgIcons";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

export interface IMenuList {
  id: number;
  name: string;
  link: string;
  icon: ({ className }: IIconInputProps) => JSX.Element;
  subMenu: boolean;
  featureName?: FeaturesNameEnum[];
  permission?: PermissionEnum[];
  subMenuList?: ISubMenuList[];
}

export interface ISubMenuList {
  name: string;
  id: string;
  link: string;
}
