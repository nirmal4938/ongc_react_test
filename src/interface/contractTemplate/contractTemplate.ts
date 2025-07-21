export interface IContractTemplateData {
  id?: number;
  contractName: string;
  clientId: number;
  isActive?: boolean;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}

export interface AddUpdateContractTemplateProps {
  id?: string;
  clientId: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}
