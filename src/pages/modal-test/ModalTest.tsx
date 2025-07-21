import Card from "@/components/card/Card";
import Button from "@/components/formComponents/button/Button";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import Date from "@/components/formComponents/dateComponent/DateComponent";
import DateRange from "@/components/formComponents/dateRange/DateRange";
import TextField from "@/components/formComponents/textField/TextField";
import Textarea from "@/components/formComponents/textarea/Textarea";
import Modal from "@/components/modal/Modal";
import Radio from "@/components/radio/Radio";
import { Form, Formik } from "formik";
import { useState } from "react";

const ModalTest = () => {
  const [ClientAdd, setClientAdd] = useState(false);
  const [AddContact, setAddContact] = useState(false);
  const [AddSegment, setAddSegment] = useState(false);
  const [AddSubSegment, setAddSubSegment] = useState(false);
  const [AddBonusTypes, setAddBonusTypes] = useState(false);
  const [EditRotation, setEditRotation] = useState(false);
  const [AddFolder, setAddFolder] = useState(false);
  const [AddMedicalType, setAddMedicalType] = useState(false);
  const [RequestType, setRequestType] = useState(false);
  const [ViewMessage, setViewMessage] = useState(false);
  const [AddNewMessage, setAddNewMessage] = useState(false);
  const [AddUser, setAddUser] = useState(false);
  const [ColumnInfo, setColumnInfo] = useState(false);
  const [AddAdjustment, setAddAdjustment] = useState(false);
  const [EmployeeImportResults, setEmployeeImportResults] = useState(false);
  const [EditProfile, setEditProfile] = useState(false);
  const [EditEmployeeFile, setEditEmployeeFile] = useState(false);
  const [TitreDeConge, setTitreDeConge] = useState(false);
  const [NewMedical, setNewMedical] = useState(false);
  const [Documents, setDocuments] = useState(false);
  const [AddEmployeeContract, setAddEmployeeContract] = useState(false);
  const [AddTransportModel, setAddTransportModel] = useState(false);
  const [AddDriver, setAddDriver] = useState(false);
  const [UploadFiles, setUploadFiles] = useState(false);

  const defaultInitialValues = {
    sdsd: "",
  };
  return (
    <>
      {/* Client Add */}
      <Button onClickHandler={() => setClientAdd(!ClientAdd)} variant={"gray"}>
        Add Client
      </Button>
      {ClientAdd && (
        <Modal
          width="max-w-[870px]"
          title="Add Client"
          closeModal={() => setClientAdd(!ClientAdd)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Overview" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass="col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Groupement Berkine SH/AAC"}
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass="col-span-2"
                      placeholder="Select"
                      label="Country"
                      isCompulsory
                      className="bg-white"
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={"EXPRO"}
                    />
                    <CheckBox
                      label="Active"
                      parentClass="mb-5 last:mb-0"
                      labelClass="!text-black"
                    />
                  </div>
                </Card>
                <Card title="Timesheet" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <Date
                      name="sd"
                      smallFiled
                      label={"Start Date"}
                      placeholder={"Other Info (e.g. Month)"}
                    />
                    <Date
                      name="sd"
                      smallFiled
                      label={"End Date"}
                      placeholder={"Other Info (e.g. Month)"}
                    />

                    <Date
                      name="sd"
                      smallFiled
                      label={"Auto Update End Date"}
                      placeholder={"Other Info (e.g. Month)"}
                    />
                    <Date
                      name="sd"
                      smallFiled
                      label={"Timesheet Start Day"}
                      placeholder={"Other Info (e.g. Month)"}
                    />

                    <Textarea
                      parentClass="col-span-2"
                      name="sdsd"
                      type="text"
                      smallFiled={true}
                      placeholder={"Approval Email"}
                      label={"Timesheet Start Day"}
                    />
                    <div className="col-span-2 flex flex-wrap">
                      <CheckBox
                        label="Show Prices"
                        labelClass="Show Prices"
                        parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                      />
                      <CheckBox
                        label="Show Cost Centre"
                        labelClass="Show Cost Centre"
                        parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                      />
                      <CheckBox
                        label="Show Catalogue No"
                        labelClass="Show Catalogue No"
                        parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                      />
                    </div>
                  </div>
                </Card>
                <Card title="Titre de Congé" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Titre de Congé Email"}
                      placeholder={"Titre de Congé Email"}
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass="col-span-2"
                      placeholder="Select"
                      label="Start Months Back"
                      isCompulsory
                      className="bg-white"
                    />
                    <CheckBox
                      label="Reset Balance for Segment change"
                      labelClass="Show Prices"
                      parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                    />
                  </div>
                </Card>

                <Card
                  title="Medical Email Notification"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <Textarea
                      parentClass=""
                      name="sdsd"
                      type="text"
                      smallFiled={true}
                      placeholder={"Submission"}
                      label={"Submission"}
                    />
                    <Textarea
                      parentClass=""
                      name="sdsd"
                      type="text"
                      smallFiled={true}
                      placeholder={"Today"}
                      label={"Today"}
                    />
                    <Textarea
                      parentClass=""
                      name="sdsd"
                      type="text"
                      smallFiled={true}
                      placeholder={"Monthly"}
                      label={"Monthly"}
                    />
                  </div>
                </Card>

                <Card
                  title="Medical Email Notification"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-4 gap-5">
                    <div className="">
                      <CheckBox
                        label="Show N° S.S."
                        labelClass="text-sm/18px !text-black font-medium"
                      />
                      {/* <p className="text-sm/18px text-black font-medium">Show N° S.S.</p> */}
                    </div>
                    <div className="">
                      <CheckBox
                        label="Show Carte Chifa"
                        labelClass="text-sm/18px !text-black font-medium"
                      />
                      {/* <p className="text-sm/18px text-black font-medium">Show Carte Chifa</p> */}
                    </div>
                    <div className="col-span-2">
                      <CheckBox
                        label="Show Salary Info (Applies to Timesheet Preparation & Approval users)"
                        labelClass="text-sm/18px !text-black font-medium"
                      />
                      {/* <p className="text-sm/18px text-black font-medium">Show Salary Info <span className="text-10px/3 font-normal">(Applies to Timesheet Preparation & Approval users)</span></p> */}
                    </div>
                    <div className="">
                      <CheckBox
                        label="Show Rotation"
                        labelClass="text-sm/18px !text-black font-medium"
                      />
                      {/* <p className="text-sm/18px text-black font-medium">Show Rotation</p> */}
                    </div>
                    <div className="">
                      <CheckBox
                        label="Show Balance"
                        labelClass="text-sm/18px !text-black font-medium"
                      />
                      {/* <p className="text-sm/18px text-black font-medium">Show Balance</p> */}
                    </div>
                  </div>
                </Card>

                <Card title="Logo" parentClass="mb-5 last:mb-0">
                  <TextField
                    name="sdsd"
                    type="text"
                    label={"Logo Filename"}
                    smallFiled={true}
                    placeholder={"Name"}
                  />
                </Card>

                <Card title="Labels" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-1 gap-5">
                      <TextField
                        name="sdsd"
                        type="text"
                        label={"Segment"}
                        smallFiled={true}
                        placeholder={"Segment"}
                      />
                      <TextField
                        name="sdsds"
                        type="text"
                        label={"Sub-Segment"}
                        smallFiled={true}
                        placeholder={"Sub-Segment"}
                      />
                      <TextField
                        name="sdsdwe"
                        type="text"
                        label={"Bonus Type"}
                        smallFiled={true}
                        placeholder={"Bonus Type"}
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Edit Contact */}
      <Button
        onClickHandler={() => setAddContact(!AddContact)}
        variant={"gray"}
      >
        Add Contact
      </Button>
      {AddContact && (
        <Modal
          width="max-w-[870px]"
          title="Add Contact"
          closeModal={() => setAddContact(!AddContact)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Overview" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Groupement Berkine SH/AAC"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Email"}
                      placeholder={"hades@2hsv.com"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 1"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 2"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 3"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 4"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"City"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Region"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Postal Code"}
                      placeholder={"new city, usa"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Country"}
                      placeholder={"new city, usa"}
                    />

                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Country"
                      isCompulsory
                      className="bg-white"
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={"EXPRO"}
                    />
                    <CheckBox
                      label="Active"
                      parentClass="mb-5 last:mb-0"
                      labelClass="!text-black"
                    />
                  </div>
                </Card>
                <Card title="Xero" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Due Date Days"}
                      placeholder={"Other Info (e.g. Month)"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Branding Theme"}
                      placeholder={"Other Info (e.g. Month)"}
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Segment */}
      <Button
        onClickHandler={() => setAddSegment(!AddSegment)}
        variant={"gray"}
      >
        Add New Segments
      </Button>
      {AddSegment && (
        <Modal
          width="max-w-[870px]"
          title="Add New Segments"
          closeModal={() => setAddSegment(!AddSegment)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Contact"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Cost Centre"}
                      placeholder={""}
                    />
                  </div>
                </Card>
                <Card
                  title="Weekend and Overtime Bonuses"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Friday Bonus"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Saturday Bonus"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Overtime O1 Bonus"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Overtime O2 Bonus"}
                      placeholder={""}
                    />
                  </div>
                </Card>
                <Card title="Accounts" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"VAT Rate"}
                      placeholder={"Other Info (e.g. Month)"}
                    />
                    {/* <TextField name="sdsd" parentClass="" type="text" smallFiled={true} label={'Xero Format'} placeholder={'Other Info (e.g. Month)'} /> */}
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Xero Format"
                      isCompulsory
                      className="bg-white"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Segment */}
      <Button
        onClickHandler={() => setAddSubSegment(!AddSubSegment)}
        variant={"gray"}
      >
        Add New Sub Segments
      </Button>
      {AddSubSegment && (
        <Modal
          width="max-w-[870px]"
          title="Add New Sub-Segments"
          closeModal={() => setAddSubSegment(!AddSubSegment)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Segment" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Select segment"
                      isCompulsory
                      className="bg-white"
                    />
                  </div>
                </Card>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Cost Centre"}
                      placeholder={""}
                    />
                    {/* <TextField name="sdsd" parentClass="" type="text" smallFiled={true} label={'Overtime O2 Bonus'} placeholder={''} /> */}
                  </div>
                </Card>
                <Card
                  title="Weekend and Public Holiday Bonuses"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-2 gap-5">
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Friday Bonus"
                      isCompulsory
                      className="bg-white"
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Saturday Bonus"
                      isCompulsory
                      className="bg-white"
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Overtime O1 Bonus"
                      isCompulsory
                      className="bg-white"
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      // parentClass=""
                      placeholder="Select"
                      label="Overtime O2 Bonus"
                      isCompulsory
                      className="bg-white"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Bonus Types */}
      <Button
        onClickHandler={() => setAddBonusTypes(!AddBonusTypes)}
        variant={"gray"}
      >
        Add Bonus Types
      </Button>
      {AddBonusTypes && (
        <Modal
          width="max-w-[570px]"
          title="Add Bonus Types"
          closeModal={() => setAddBonusTypes(!AddBonusTypes)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=" col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=" "
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={""}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=" "
                      type="text"
                      smallFiled={true}
                      label={"Name (Shown on Timesheet)"}
                      placeholder={""}
                    />
                    <CheckBox
                      parentClass="col-span-2"
                      label="Active"
                      labelClass=" !text-black"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Rotations */}
      <Button
        onClickHandler={() => setEditRotation(!EditRotation)}
        variant={"gray"}
      >
        Add Rotations
      </Button>
      {EditRotation && (
        <Modal
          width="max-w-[570px]"
          title="Add Rotations"
          closeModal={() => setEditRotation(!EditRotation)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=" col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={""}
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="On"
                      className="bg-white"
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="Off"
                      className="bg-white"
                    />
                    <CheckBox
                      parentClass="col-span-2"
                      label="Active"
                      labelClass=" !text-black"
                    />
                    <hr className="col-span-2" />
                    <div className="grid grid-cols-4 gap-y-4 gap-x-2 col-span-2">
                      <p className="col-span-4 text-base/5 font-semibold text-black">
                        Days Worked (Resident)
                      </p>
                      <CheckBox label="Monday" labelClass=" !text-black" />
                      <CheckBox label="Tuesday" labelClass=" !text-black" />
                      <CheckBox label="Wednesday" labelClass=" !text-black" />
                      <CheckBox label="Thursday" labelClass=" !text-black" />
                      <CheckBox label="Friday" labelClass=" !text-black" />
                      <CheckBox label="Saturday" labelClass=" !text-black" />
                      <CheckBox label="Sunday" labelClass=" !text-black" />
                    </div>
                    <hr className="col-span-2" />
                    <CheckBox label="Weekend Bonus" labelClass=" !text-black" />
                    <CheckBox
                      label="Overtime Bonus"
                      labelClass=" !text-black"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Folder */}
      <Button onClickHandler={() => setAddFolder(!AddFolder)} variant={"gray"}>
        Add Folder
      </Button>
      {AddFolder && (
        <Modal
          width="max-w-[570px]"
          title="Add Folder"
          closeModal={() => setAddFolder(!AddFolder)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="Index"
                      className="bg-white"
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="TypeId"
                      className="bg-white"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Medical Type */}
      <Button
        onClickHandler={() => setAddMedicalType(!AddMedicalType)}
        variant={"gray"}
      >
        Add Medical Type
      </Button>
      {AddMedicalType && (
        <Modal
          width="max-w-[540px]"
          title="Add Medical Type"
          closeModal={() => setAddMedicalType(!AddMedicalType)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid gap-5">
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Index"}
                      placeholder={"Enter Name"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                    />
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="Format"
                      className="bg-white"
                    />
                    <TextField
                      name="sdsd"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Days before expiry"}
                      placeholder={"Enter Name"}
                    />
                    <CheckBox label="Active" />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Request Type */}
      <Button
        onClickHandler={() => setRequestType(!RequestType)}
        variant={"gray"}
      >
        Add Request Type
      </Button>
      {RequestType && (
        <Modal
          title="Add Request Type"
          width="max-w-[541px]"
          closeModal={() => setRequestType(!RequestType)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <TextField
                      name="sdsd"
                      parentClass="mb-5 last:mb-0"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Name"}
                    />
                    <TextField
                      name="sdsd"
                      parentClass="mb-5 last:mb-0"
                      type="text"
                      smallFiled={true}
                      label={"Notification Emails"}
                      placeholder={"Emails"}
                    />
                    <CheckBox
                      label="Active"
                      parentClass="mb-5 last:mb-0"
                      labelClass="!text-black"
                    />
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* View Message */}
      <Button
        onClickHandler={() => setViewMessage(!ViewMessage)}
        variant={"gray"}
      >
        View Message
      </Button>
      {ViewMessage && (
        <Modal
          title="View Message"
          width="max-w-[826px]"
          closeModal={() => setViewMessage(!ViewMessage)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Message" parentClass="mb-5 last:mb-0">
                  <p className="text-sm/18px text-black font-medium">dsdsd</p>
                </Card>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <table className="small w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          Start Date{" "}
                        </th>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          #
                        </th>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          To
                        </th>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          Error Code
                        </th>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          Error Message
                        </th>
                        <th className="text-left pb-3 border-b border-solid border-black/5">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px">
                          GRPA000771
                        </td>
                        <td className="py-3 font-medium text-sm/18px">
                          Hadfi Marouane
                        </td>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px">Send</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px">
                          GRPA000771
                        </td>
                        <td className="py-3 font-medium text-sm/18px">
                          Hadfi Marouane
                        </td>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px"></td>
                        <td className="py-3 font-medium text-sm/18px">Send</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add New Message */}
      <Button
        onClickHandler={() => setAddNewMessage(!AddNewMessage)}
        variant={"gray"}
      >
        Add New Message
      </Button>
      {AddNewMessage && (
        <Modal
          title="Add New Message"
          width="max-w-[709px]"
          closeModal={() => setAddNewMessage(!AddNewMessage)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="To" parentClass="mb-5 last:mb-0">
                  <>
                    <SelectComponent
                      options={[]}
                      isMulti={true}
                      placeholder="00"
                      label="Select tag"
                      className="bg-white"
                      parentClass="mb-5 last:mb-0"
                    />
                    <TextField
                      name="sdsd"
                      parentClass="mb-5 last:mb-0 max-w-[215px]"
                      type="text"
                      smallFiled={true}
                      label={"Select one or more segmenrt"}
                      placeholder={""}
                    />
                  </>
                </Card>

                <Card
                  title="Message (Max 160 characters)"
                  parentClass="mb-5 last:mb-0"
                >
                  <>
                    <Textarea
                      parentClass="col-span-2"
                      name="sdsd"
                      type="text"
                      smallFiled={true}
                      placeholder={""}
                      label={"Message"}
                    />
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add User */}
      <Button onClickHandler={() => setAddUser(!AddUser)} variant={"gray"}>
        Add User
      </Button>
      {AddUser && (
        <Modal
          title="Add User"
          width="max-w-[709px]"
          closeModal={() => setAddUser(!AddUser)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        name="sdsd"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"Name"}
                        placeholder={""}
                      />
                      <TextField
                        name="sdsd"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"Email"}
                        placeholder={""}
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={true}
                        placeholder="00"
                        label="Role"
                        className="bg-white"
                        parentClass="col-span-2"
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={true}
                        placeholder="00"
                        label="Time Zone"
                        className="bg-white"
                        parentClass="col-span-2"
                      />
                      <CheckBox label="Send Email Notifications" />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Column Info */}
      <Button
        onClickHandler={() => setColumnInfo(!ColumnInfo)}
        variant={"gray"}
      >
        Column Info
      </Button>
      {ColumnInfo && (
        <Modal
          hideFooterButton={true}
          title="Column Info"
          width="max-w-[709px]"
          closeModal={() => setColumnInfo(!ColumnInfo)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <table className="small w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Column
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Name
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">A</td>
                          <td className="py-3 font-medium text-sm/18px">N°</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Employee Number
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">B</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Position°
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Employee Name
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">C</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Type
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Salary or Bonus
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">D</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Affectation
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Segment and Sub-Segment
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">E</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Service Month°
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Month
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">F</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Monthly Salary
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            Portal: Employee Number
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Adjustment */}
      <Button
        onClickHandler={() => setAddAdjustment(!AddAdjustment)}
        variant={"gray"}
      >
        Add Adjustment
      </Button>
      {AddAdjustment && (
        <Modal
          title="Add Adjustment"
          width="max-w-[709px]"
          closeModal={() => setAddAdjustment(!AddAdjustment)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Name
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Crescenzi Giovanni
                        </span>
                      </div>
                      <div className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Matricule
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          T000004
                        </span>
                      </div>
                    </div>
                  </>
                </Card>
                <Card title="Adjustment" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Select Employee"
                        className="bg-white"
                        parentClass=""
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Total Adjustment"
                        className="bg-white"
                        parentClass=""
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Employee Import Results */}
      <Button
        onClickHandler={() => setEmployeeImportResults(!EmployeeImportResults)}
        variant={"gray"}
      >
        Employee Import Results
      </Button>
      {EmployeeImportResults && (
        <Modal
          hideFooterButton={true}
          title="Employee Import Results"
          width="max-w-[1030px]"
          closeModal={() => setEmployeeImportResults(!EmployeeImportResults)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <table className="small w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Row No
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Status
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">1</td>
                          <td className="py-3 font-medium text-sm/18px">OK</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Start Import v2
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">1</td>
                          <td className="py-3 font-medium text-sm/18px">OK</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Start Import v2
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">1</td>
                          <td className="py-3 font-medium text-sm/18px">OK</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Start Import v2
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">1</td>
                          <td className="py-3 font-medium text-sm/18px">OK</td>
                          <td className="py-3 font-medium text-sm/18px">
                            Start Import v2
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Edit Profile */}
      <Button
        onClickHandler={() => setEditProfile(!EditProfile)}
        variant={"gray"}
      >
        Edit Profile
      </Button>
      {EditProfile && (
        <Modal
          title="Edit Profile"
          width="max-w-[564px]"
          closeModal={() => setEditProfile(!EditProfile)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <div className="flex justify-between items-center mb-18px">
                      <div className="profile-img-wrap w-20 h-20 overflow-hidden rounded-lg bg-gray-50">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXMKvjoFY41ypWrRdVnut-cXUZPCAXcY18PA&usqp=CAU"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="upload-wrap">
                        <div className="upload-inner relative">
                          <input
                            type="file"
                            id="ProfileUpdate"
                            className=""
                            hidden
                          />
                          <label
                            htmlFor="ProfileUpdate"
                            className="py-3 px-3 cursor-pointer bg-primaryRed rounded-lg hover:bg-primaryRed/80 text-white text-13px/4 font-semibold transition-all duration-300"
                          >
                            Upload photo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        smallFiled
                        name="defr"
                        type="text"
                        label={"Surname"}
                        parentClass="col-span-2"
                      />
                      <TextField
                        smallFiled
                        name="defr"
                        type="text"
                        label={"Forename"}
                        parentClass="col-span-2"
                      />
                      <TextField
                        smallFiled
                        name="defr"
                        type="text"
                        label={"Fonction"}
                        parentClass=""
                      />
                      <TextField
                        smallFiled
                        name="defr"
                        type="text"
                        label={"Matricule"}
                        parentClass=""
                      />
                      <TextField
                        smallFiled
                        name="defr"
                        type="text"
                        label={"Contract Number"}
                        parentClass=""
                      />
                      <DateComponent
                        smallFiled
                        name="sde"
                        parentClass=""
                        label={"Start Date"}
                      />
                      <DateComponent
                        smallFiled
                        name="sde"
                        parentClass=""
                        label={"Contract Signed Date"}
                      />
                      <DateComponent
                        smallFiled
                        name="sde"
                        parentClass=""
                        label={"Contract End Date"}
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Edit Employee File */}
      <Button
        onClickHandler={() => setEditEmployeeFile(!EditEmployeeFile)}
        variant={"gray"}
      >
        Edit Employee File
      </Button>
      {EditEmployeeFile && (
        <Modal
          title="Edit Employee File"
          width="max-w-[564px]"
          closeModal={() => setEditEmployeeFile(!EditEmployeeFile)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Employee:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Ibtissem Tala Bouzerouf
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          File name:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Avenant Talabouzerouf 07 Novembre 2020.pdf
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid gap-5">
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Folder"
                        className="bg-white"
                        parentClass=""
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Name"
                        className="bg-white"
                        parentClass=""
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Titre de Congé */}
      <Button
        onClickHandler={() => setTitreDeConge(!TitreDeConge)}
        variant={"gray"}
      >
        Titre de Congé
      </Button>
      {TitreDeConge && (
        <Modal
          title="Titre de Congé"
          width="max-w-[709px]"
          closeModal={() => setTitreDeConge(!TitreDeConge)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <SelectComponent
                      options={[]}
                      isMulti={false}
                      placeholder="00"
                      label="Select Employee"
                      className="bg-white"
                      parentClass=""
                    />
                  </>
                </Card>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Employee:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Fonction:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Algiers Support Driver
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Medical Check Date:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Segment:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Security
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Rotation:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Resident 30
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <table className="small w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Date
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Description
                          </th>
                          <th className="text-left pb-3 border-b border-solid border-black/5">
                            Reliquat
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 font-medium text-sm/18px">
                            01/06/2023
                          </td>
                          <td className="py-3 font-medium text-sm/18px">
                            -----
                          </td>
                          <td className="py-3 font-medium text-sm/18px">9</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                </Card>
                <Card title="Titre de Congé Dates" parentClass="mb-5 last:mb-0">
                  <>
                    <DateRange />
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* New Medical */}
      <Button
        onClickHandler={() => setNewMedical(!NewMedical)}
        variant={"gray"}
      >
        New Medical
      </Button>
      {NewMedical && (
        <Modal
          title="New Medical"
          width="max-w-[709px]"
          closeModal={() => setNewMedical(!NewMedical)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Select Employee"
                        className="bg-white"
                        parentClass=""
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Select Client"
                        className="bg-white"
                        parentClass=""
                      />
                    </div>
                  </>
                </Card>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Employee:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Fonction:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Algiers Support Driver
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Medical Check Date:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Segment:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Security
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Rotation:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Resident 30
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Medical Check Expiry:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Resident 30
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card
                  title="Medical Request Details"
                  parentClass="mb-5 last:mb-0"
                >
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <DateComponent name="wdsd" />
                      <DateComponent name="wdsd" />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Documents */}
      <Button onClickHandler={() => setDocuments(!Documents)} variant={"gray"}>
        Documents
      </Button>
      {Documents && (
        <Modal
          title="New Medical"
          width="max-w-[870px]"
          closeModal={() => setDocuments(!Documents)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Name"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Contract Number"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Mobile Number"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Email"}
                      />
                      <DateComponent
                        smallFiled
                        name="wdsd"
                        label={"Delivery Date"}
                      />
                      <div className="col-span-2 flex max-w-[200px] justify-between">
                        <Radio
                          name="helo1"
                          label="Collection"
                          labelClass="!text-black"
                        />
                        <Radio
                          name="helo1"
                          label="Delivery"
                          labelClass="!text-black"
                        />
                      </div>
                    </div>
                  </>
                </Card>
                <Card title="Required Documents" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"ATS"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Attestation de Travail"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Certificat de Travail"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={"Contract / Avenant"}
                      />
                      <TextField
                        smallFiled
                        name="sdsd"
                        type="text"
                        label={
                          "Fiche de Pay (Payslips), needs to include the month"
                        }
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Employee Contract */}
      <Button
        onClickHandler={() => setAddEmployeeContract(!AddEmployeeContract)}
        variant={"gray"}
      >
        Add Employee Contract
      </Button>
      {AddEmployeeContract && (
        <Modal
          title="Add Employee Contract"
          width="max-w-[709px]"
          closeModal={() => setAddEmployeeContract(!AddEmployeeContract)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <SelectComponent
                      options={[]}
                      isMulti={false}
                      placeholder="00"
                      label="Select Employee"
                      className="bg-white"
                      parentClass=""
                    />
                  </>
                </Card>
                <Card title="Employee Details" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Employee:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Fonction:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Algiers Support Driver
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Medical Check Date:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          GRPA000771 Hadfi Marouane
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Segment:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Security
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Rotation:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Resident 30
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card title="Employee Details" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Contract"
                        className="bg-white"
                        parentClass=""
                      />
                      <TextField
                        name="sd"
                        type="text"
                        label={"New Contract Number"}
                        smallFiled
                      />
                      <div className="col-span-2">
                        <DateRange />
                      </div>
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Transport Model */}
      <Button
        onClickHandler={() => setAddTransportModel(!AddTransportModel)}
        variant={"gray"}
      >
        Add Transport Model
      </Button>
      {AddTransportModel && (
        <Modal
          title="Add Transport Model"
          width="max-w-[583px]"
          closeModal={() => setAddTransportModel(!AddTransportModel)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <>
                    <TextField
                      smallFiled
                      name="sds"
                      type="text"
                      label={"Name"}
                    />
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Add Driver */}
      <Button onClickHandler={() => setAddDriver(!AddDriver)} variant={"gray"}>
        Add Driver
      </Button>
      {AddDriver && (
        <Modal
          title="Add Driver"
          width="max-w-[583px]"
          closeModal={() => setAddDriver(!AddDriver)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted");
            }}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid gap-5">
                      <TextField
                        smallFiled
                        name="sds"
                        type="text"
                        label={"Driver No"}
                      />
                      <TextField
                        smallFiled
                        name="sds"
                        type="text"
                        label={"First Name"}
                      />
                      <TextField
                        smallFiled
                        name="sds"
                        type="text"
                        label={"Last Name"}
                      />
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Position"
                        className="bg-white"
                        parentClass=""
                      />
                      <DateComponent
                        smallFiled
                        name="sdswr"
                        label={"Company Start"}
                      />
                      <DateComponent
                        smallFiled
                        name="sdswr"
                        label={"Experience Start"}
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Upload Files */}
      <Button
        onClickHandler={() => setUploadFiles(!UploadFiles)}
        variant={"gray"}
      >
        Upload Files
      </Button>
      {UploadFiles && (
        <Modal
          title="Upload Files"
          width="max-w-[583px]"
          closeModal={() => setUploadFiles(!UploadFiles)}
        >
          <Formik
            initialValues={defaultInitialValues}
            onSubmit={() => {
              console.log("submitted..");
            }}
          >
            {() => (
              <Form>
                <Card title="Overview" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Driver No.:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          xcxc
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Position:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          Test Position
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card
                  title="Select folder upload."
                  parentClass="mb-5 last:mb-0"
                >
                  <>
                    <div className="grid gap-5">
                      <SelectComponent
                        options={[]}
                        isMulti={false}
                        placeholder="00"
                        label="Folder"
                        className="bg-white"
                        parentClass=""
                      />
                      {/* <FileInput /> */}
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default ModalTest;
