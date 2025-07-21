import Card from "@/components/card/Card";
import Modal from "@/components/modal/Modal";
import Table from "@/components/table/Table";
import { IMessageDetailById } from "@/interface/message/message";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { ILoginUser } from "@/interface/user/userInterface";
import { GetMessageDataById } from "@/services/messageService";
import moment from "moment";
import { useEffect, useState } from "react";

const MessageListById = ({
  id,
  setOpenModal,
}: {
  id?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [logsDataById, setLogsDataById] = useState<IMessageDetailById[]>();

  useEffect(() => {
    if (id) {
      getAllLogsDataById(id);
    }
  }, [id]);

  const getAllLogsDataById = async (id: string) => {
    setLoader(true);
    const response = await GetMessageDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (response?.data?.response_type === "success") {
        setLogsDataById(resultData);
        setLoader(false);
      }
    }
  };

  function getToUserName(data: {
    employeeDetail?: {
      loginUserData: ILoginUser;
    };
    managerUser?: {
      loginUserData: ILoginUser;
    };
    segmentDetail?: {
      employee?: {
        loginUserData?: ILoginUser;
      }[];
    } | null;
  }) {
    if (data.employeeDetail?.loginUserData) {
      const firstName = data.employeeDetail.loginUserData.firstName || "";
      const lastName = data.employeeDetail.loginUserData.lastName || "";
      return `${lastName} ${firstName}`;
    } else if (data.managerUser?.loginUserData) {
      const firstName = data.managerUser.loginUserData.firstName || "";
      const lastName = data.managerUser.loginUserData.lastName || "";
      return `${lastName} ${firstName}`;
    } else if (
      data.segmentDetail?.employee &&
      data.segmentDetail.employee.length > 0
    ) {
      const names = data.segmentDetail.employee.map((item) => {
        const firstName = item?.loginUserData?.firstName || "";
        const lastName = item?.loginUserData?.lastName || "";
        return `${lastName} ${firstName}`;
      });
      return names.join(", ");
    } else {
      return "-";
    }
  }

  const columnData = [
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return props.createdAt
          ? moment(props?.createdAt).format("DD/MM/YYYY hh:mm a")
          : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "To",
      name: "to",
      cell: (props: {
        employeeDetail?: {
          loginUserData: ILoginUser;
        };
        managerUser?: {
          loginUserData: ILoginUser;
        };
        segmentDetail?: {
          employee?: {
            loginUserData?: ILoginUser;
          }[];
        } | null;
      }) => getToUserName(props),
      option: {
        sort: true,
      },
    },
    {
      header: "Error Code",
      name: "errorCode",
      cell: (props: { errorMessage: string }) => {
        return props.errorMessage ? 400 : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "Error Message",
      name: "errorMessage",
      cell: (props: { errorMessage: string }) => {
        return props.errorMessage ? props?.errorMessage : "-";
      },
      option: {
        sort: true,
      },
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
        width="max-w-[900px]"
        hideFooterButton={true}
        title={`Message List`}
        closeModal={() => setOpenModal(false)}
      >
        <>
          <Table
            tableClass="min-w-full"
            headerData={columnData as ITableHeaderProps[]}
            bodyData={logsDataById}
            isButton={false}
            isDropdown={false}
            pagination={false}
            loader={loader}
          />
          {logsDataById && (
            <Card
              title="Message"
              titleClassName="text-dark"
              parentClass="mb-5 mt-2 last:mb-0"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: `${logsDataById[0]?.message || "-"}`,
                }}
                className="font-bold text-black/50 text-left text-16px/9"
              ></p>
            </Card>
          )}
        </>
      </Modal>
    </div>
  );
};

export default MessageListById;
