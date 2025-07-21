import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteContact, GetAllContact } from "@/services/contactService";
import { IContactData } from "@/interface/contact/contactInterface";
import AddUpdateContact from "./AddUpdateContact";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { useNavigate } from "react-router-dom";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const ContactList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Contact ? pageState?.value : {};
  const clientId = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Contact
      ? pageStateData?.page ?? 1
      : currentPage;
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Contact Modal
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [contactData, setContactData] = useState<{
    data: IContactData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [contactId, setContactId] = useState<string>("");

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    //   fetchAllClient("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clientId && (currentPage === 1 || currentPageNumber != currentPage))
      fetchAllContact();

    setPageState({
      state: DefaultState.Contact as string,
      value: {
        ...pageStateData,
        page: contactData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType]);

  async function fetchAllContact(query?: string) {
    dispatch(showLoader());
    let queryString =
      `?limit=${limit}&page=${currentPage}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    setLoader(true);
    if (clientId) {
      const response = await GetAllContact(queryString);

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setContactData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const handleOpenModal = (id: string) => {
    setContactId(id);
    setOpen(true);
  };

  const contactDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteContact(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllContact();
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const actionButton = (id: string, slug: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Contact, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              navigate(`/setup/contact/view/${slug}`);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Contact, PermissionEnum.Update) && (
          <EditButton
            onClickHandler={() => {
              setContactId(id);
              setOpenModal(true);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Contact, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Name",
      name: "name",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Email",
      name: "email",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Address",
      name: "address1",
      option: {
        sort: true,
      },
    },
    {
      header: "City",
      name: "city",
      option: {
        sort: true,
      },
    },
    {
      header: "Region",
      name: "region",
      option: {
        sort: true,
      },
    },
    {
      header: "Postal Code",
      name: "postalCode",
      option: {
        sort: true,
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; slug: string; status: string }) =>
        actionButton(props.id, props.slug),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllContact}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={contactData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Contact,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Contact,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setContactId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Contact}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={contactData.totalPage}
        dataCount={contactData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          loaderButton={deleteLoader}
          onClickHandler={() => contactDelete(contactId)}
          confirmationText="Are you sure you want to delete this contact?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateContact
          id={contactId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllContact();
          }}
        />
      )}
    </>
  );
};

export default ContactList;
