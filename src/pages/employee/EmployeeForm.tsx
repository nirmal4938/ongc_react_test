import AddUpdateEmployee from "./AddUpdateEmployee";
import { useParams } from "react-router-dom";

const EmployeeForm = () => {
  const { id } = useParams();
  return (
    <>
      <div className="pb-6">
        <div className="card py-30px px-10  bg-white rounded-10  ">
          <div className="form-header">
            <h5 className="text-26px/8 text-black font-semibold">
              {id ? "Update" : "Add"} Employee
            </h5>
          </div>
          <div className="form-body my-6 ">
            <div className="mb-5 ">
              <div className=" rounded-10    ">
                <AddUpdateEmployee
                  id={id ?? ""}
                  openModal={true}
                  // setOpenModal={() => {}}
                  // fetchAllData={() => {
                  //   // fetchAllEmployee();
                  // }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeForm;
