export interface IContractTemplateVersionData {
  id?: number;
  contractTemplate?: {
    contractName: string;
    clientId: number | null;
  };
  versionName?: string | null;
  contractTemplateId: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
}

export interface AddUpdateContractTemplateVersionProps {
  id?: string;
  contractTemplateVersionId: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}
