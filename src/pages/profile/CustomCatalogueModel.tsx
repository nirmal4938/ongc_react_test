import Modal from "@/components/modal/Modal";
import moment from "moment";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
interface CustomBonusModelTimesheetTableProp {
  employeeName: string;
  setModel: (status: boolean) => void;
  customCatalogue?: {
    id: number;
    startDate: string | null;
    catalogueNumber: string;
  }[];
  employeeDetails: IEmployeeData;
}
const CustomCatalogueModel = (props: CustomBonusModelTimesheetTableProp) => {
  const renderCatalogueHistory = () => {
    if (props?.customCatalogue && props?.customCatalogue?.length > 0) {
      return props.customCatalogue?.map(
        (
          data: {
            id: number;
            startDate: string | null;
            catalogueNumber: string;
          },
          index
        ) => {
          return (
            <tr key={Math.floor(Math.random() * 1000) + 1}>
              <td className="py-3 font-medium text-sm/18px">
                {data.catalogueNumber ?? "-"}
              </td>
              <td className="py-3 font-medium text-sm/18px">
                {data.startDate
                  ? moment(data.startDate).format("DD/MM/YYYY")
                  : moment(props?.employeeDetails?.startDate).format(
                      "DD/MM/YYYY"
                    )}
                {" - "}
                {index + 1 ===
                props?.employeeDetails?.employeeCatalogueNumber?.length
                  ? props?.employeeDetails?.terminationDate
                    ? moment(props?.employeeDetails?.terminationDate).format(
                        "DD/MM/YYYY"
                      )
                    : "ToDate"
                  : moment(
                      props?.employeeDetails?.employeeCatalogueNumber?.[
                        index + 1
                      ]?.startDate
                    ).format("DD/MM/YYYY")}
              </td>
            </tr>
          );
        }
      );
    } else {
      <tr key={Math.floor(Math.random() * 1000) + 1}>
        <td className="py-3 font-medium text-sm/18px">"No Data Found</td>
      </tr>;
    }
  };
  return (
    <>
      <Modal
        title={props.employeeName}
        width="max-w-[709px]"
        closeModal={() => props.setModel(false)}
        hideFooterButton={true}
        okbtnText="Ok"
        hideCancelButton={true}
        onClickHandler={() => {
          props.setModel(false);
        }}
      >
        {props?.customCatalogue &&
        Object.keys(props.customCatalogue)?.length > 0 ? (
          <div className="table-wrapper overflow-x-auto ">
            <table className="small w-full">
              <thead>
                <tr>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Catalogue Number
                  </th>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>{renderCatalogueHistory()}</tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};
export default CustomCatalogueModel;
