import Button from "@/components/formComponents/button/Button";
import { PlusIcon } from "@/components/svgIcons";
import ModelList from "./models/ModelList";
import TypeList from "./type/TypeList";
import PositionList from "./positions/PositionList";
import CapacityList from "./capacities/CapacityList";
import { useState } from "react";
import AddSummary from "./AddSummary";
import { ISummaryData } from "@/interface/transport/transportInterface";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

const TransportSummary = () => {
  const { getPermissions } = usePermission();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editSummaryData, setEditSummaryData] = useState<ISummaryData>({});
  const [addedOrUpdatedDataType, setAddedOrUpdatedDataType] =
    useState<string>("");
  return (
    <>
      {getPermissions(
        FeaturesNameEnum.TransportSummary,
        PermissionEnum.Create
      ) && (
        <div className="flex justify-end mb-4">
          <Button
            variant={"primary"}
            parentClass=""
            icon={<PlusIcon />}
            onClickHandler={() => {
              setEditSummaryData({});
              setOpenModal(true);
            }}
          >
            {"Add"}
          </Button>
        </div>
      )}

      {getPermissions(
        FeaturesNameEnum.TransportSummary,
        PermissionEnum.View
      ) && (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <ModelList
              setOpenModal={setOpenModal}
              setEditSummaryData={setEditSummaryData}
              addedOrUpdatedDataType={addedOrUpdatedDataType}
              setAddedOrUpdatedDataType={setAddedOrUpdatedDataType}
            />
            <TypeList
              setOpenModal={setOpenModal}
              setEditSummaryData={setEditSummaryData}
              addedOrUpdatedDataType={addedOrUpdatedDataType}
              setAddedOrUpdatedDataType={setAddedOrUpdatedDataType}
            />
            <CapacityList
              setOpenModal={setOpenModal}
              setEditSummaryData={setEditSummaryData}
              addedOrUpdatedDataType={addedOrUpdatedDataType}
              setAddedOrUpdatedDataType={setAddedOrUpdatedDataType}
            />
            <PositionList
              setOpenModal={setOpenModal}
              setEditSummaryData={setEditSummaryData}
              addedOrUpdatedDataType={addedOrUpdatedDataType}
              setAddedOrUpdatedDataType={setAddedOrUpdatedDataType}
            />
          </div>
        </div>
      )}
      {openModal && (
        <AddSummary
          setOpenModal={setOpenModal}
          setEditSummaryData={setEditSummaryData}
          editData={editSummaryData}
          setAddedOrUpdatedDataType={setAddedOrUpdatedDataType}
        />
      )}
    </>
  );
};

export default TransportSummary;
