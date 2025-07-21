import { Dispatch, useEffect, useState } from "react";
import Radio from "../radio/Radio";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";

import {
  clientDataSelector,
  setUserActiveClient,
  userActiveClientSelector,
} from "@/redux/slices/clientSlice";
import SelectComponent from "../formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";

const UserFilter = ({
  handleFilter,
  setOpenFilter,
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: Dispatch<React.SetStateAction<string>>;
  handleFilter: (queryString: string) => void;
  setOpenFilter: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const clientDetails = useSelector(clientDataSelector);
  const clientId = useSelector(userActiveClientSelector);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (clientDetails) {
      const resp: Option[] | Option = [];
      for (const i in clientDetails) {
        if (clientDetails[i]?.loginUserData?.name) {
          resp.push({
            label: String(clientDetails[i]?.loginUserData?.name),
            value: String(clientDetails[i]?.id),
          });
        }
      }
      resp && setClientOptions(resp);
      if (clientId === 0 && resp.length > 0) {
        dispatch(setUserActiveClient((resp[0] as Option).value));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetails]);

  const handleApplyFilter = () => {
    setLoader(true);
    if (clientId !== 0 && selectedValue === "client") {
      const query = clientId && clientId !== 0 ? `&clientId=${clientId}` : "";
      handleFilter(query);
    } else {
      handleFilter("");
    }
    setLoader(false);
    setOpenFilter(false);
  };

  const cancelFilter = () => {
    handleFilter("");
    setOpenFilter(false);
    dispatch(setUserActiveClient(0));
  };

  return (
    <div>
      <Modal
        hideFooterButton={false}
        loaderButton={loader}
        width="max-w-[450px]"
        title={""}
        okbtnText="Apply Filter"
        closeModal={cancelFilter}
        onClickHandler={handleApplyFilter}
      >
        <>
          <div className="flex gap-5 w-full p-1 mb-5">
            <Radio
              name="filterType"
              id="By Client"
              label="By Client"
              labelClass="!text-black whitespace-nowrap"
              value={"client"}
              onChangeHandler={(e) => setSelectedValue(e.target.value)}
              checked={selectedValue === "client"}
            />
            <Radio
              id="All"
              name="filterType"
              label="All"
              labelClass="!text-black whitespace-nowrap"
              value={"all"}
              onChangeHandler={(e) => {
                setSelectedValue(e.target.value);
                dispatch(setUserActiveClient(0));
              }}
              checked={selectedValue === "all"}
            />
          </div>
          {selectedValue && selectedValue === "client" && (
            <div className="px-1">
              <SelectComponent
                name=""
                options={clientOptions}
                selectedValue={clientId}
                onChange={(option: Option | Option[]) => {
                  dispatch(setUserActiveClient((option as Option).value));
                }}
                placeholder="Select"
                label="Select Client"
                isCompulsory
                className="bg-white"
              />
            </div>
          )}
        </>
      </Modal>
    </div>
  );
};

export default UserFilter;
