/** @format */

import { Dispatch, SetStateAction } from "react";

import { HeaderContent } from "../cms/cmsInterface";

export interface IHeaderMegaMenu {
  setHideMegaMenu: Dispatch<SetStateAction<boolean>>;
  headerMenu?: HeaderContent;
}

export interface NotificationAttributes {
  id: number;
  userId: number;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}
export interface NotificationOutput {
  date: Date | string;
  data: NotificationAttributes[];
}
