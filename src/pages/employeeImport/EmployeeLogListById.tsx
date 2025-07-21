import Modal from "@/components/modal/Modal";
import Table from "@/components/table/Table";
import { IImportLogDetail } from "@/interface/importLog/importLog";
import { GetLogsById } from "@/services/importLogService";
import { useEffect, useState } from "react";

const EmployeeLogListById = ({
  id,
  setOpenModal,
}: {
  id?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [logsDataById, setLogsDataById] = useState<IImportLogDetail[]>();

  useEffect(() => {
    if (id) {
      getAllLogsDataById(id);
    }
  }, [id]);

  const getAllLogsDataById = async (id: string) => {
    setLoader(true);
    const response = await GetLogsById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (resultData?.importLogData?.length > 0) {
        setLogsDataById(resultData?.importLogData);
      }
    }
    setLoader(false);
  };

  const columnData = [
    {
      header: "Description",
      name: "description",
      className: "",
      commonClass: "",
    },
    {
      header: "Status",
      name: "status",
      className: "",
      commonClass: "",
    },
  ];

  return (
    <div>
      <Modal
        hideFooterButton={true}
        title={`Employee Import Results`}
        closeModal={() => setOpenModal(false)}
      >
        <>
          <Table
            tableClass="min-w-full"
            headerData={columnData}
            bodyData={logsDataById}
            isButton={false}
            isDropdown={false}
            pagination={false}
            loader={loader}
          />
        </>
      </Modal>
    </div>
  );
};

export default EmployeeLogListById;
