import { useEffect, useState } from "react";
import { decryptData } from "../../../utils/encryption_decryption";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Buttons from "../../../components/Button/Button";
import Field from "../../../components/Field";
import Select from "../../../components/Dropdown/Dropdown";
import "./ServiceRequest.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import WoDocumentUpload from "../../../components/pageComponents/DocumentUpload/WoDocumentUpload";
import InputField from "../../../components/Input/Input";
import { TabView, TabPanel, TabPanelHeaderTemplateOptions, } from "primereact/tabview";
import success from "../../../assest/images/success.gif";
import { formateDate, isAws, priorityIconList, } from "../../../utils/constants";
import { toast } from "react-toastify";
import {PATH } from "../../../utils/pagePath";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import HierarchyDialog from "../../../components/HierarchyDialog/HierarchyDialog";
import { ShowEquipmentDetails } from "../Workorder/InfraWorkrderHelper/ShowEquipmentDetails";
import { ActivityTimelinetable } from "../Workorder/InfraWorkrderHelper/ActivityTimelinetable";
import { ReporterDetails } from "../Workorder/WorkOrderHelperRE.tsx/ReporterDetails";
import { WoDetails } from "../Workorder/InfraWorkrderHelper/WoDetails";
import { helperAwsFileupload, helperGetWorkOrderAwsDoclist } from "./utils/helperAwsFileupload";
const InfraServiceRequest = (props: any) => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const navigate: any = useNavigate();
  const [selectedFacility, menuList]: any = useOutletContext();
  const [docCancel, setdocCancel] = useState<any | null>([]);
  const [selectedDetails, setSelectedDetails] = useState<any>([]);
  const [IsSubmit, setIsSubmit] = useState<any | null>(false);
  const [visibleEquipmentlist, showEquipmentlist] = useState(false);
  const [Descriptionlength, setDescriptionlength] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [issueDescription, setIssueDescription] = useState<any | null>();
  const [docOption, setDocOption] = useState<any | null>([]);
  const [issueLength, setIssueLength] = useState<any | null>(0);
  const [curStatus, setCurStatus] = useState<any>(0);
  const [curSubStatus, setCurSubStatus] = useState<any>(0);
  const [isloading, setisloading] = useState<any | null>(false);
  const [visibleWorkorder, setVisibleWorkorder] = useState<boolean>(false);
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState("");
  const [nodecollapse, setnodecollapse] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedassetid, seselectedassetid] = useState("");
  const [optiionList, setOptionList] = useState<any | null>([]);
  const [editStatus, seteditStatus] = useState<boolean>(false);
  const [assetTreeDetails, setAssetTreeDetails] = useState<any | null>([]);
  const [cancelvisible, setcancelvisible] = useState(false);
  const [serviceRequestId, setServiceRequestId] = useState<any | null>("");
  const [loading, setLoading] = useState<any | null>(false);
  const [activityTimeLineList, setActivityTimeLineList] = useState<any | null>([]);
  const [newtimelinelist, setNewTimelineList] = useState<any | null>([]);
  const [expandedKeys, setExpandedKeys] = useState<any | null>({
    "0": true,
    "0-0": true,
  });
  const [nodes, setNodes] = useState<any | null>([]);
  const [filteredData, setFilteredData] = useState<any | null>(nodes);
  const [showEditSummary, setShowEditSummary] = useState<boolean>(false);
  const [visibleViewWorkorder, setVisibleViewWorkorder] = useState<boolean>(false);
  const [successvisible, setsuccessvisible] = useState<boolean>(false);
  const [visibleSuccess_Popup, successVisiblePopup] = useState<boolean>(false);
  const [selectedPriorityIconName, setselectedPriorityIconName] = useState<any | null>();
  const [serviceReqStatus, setserviceReqStatus] = useState<any | null>();
  let { pathname } = useLocation();
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => {
      return detail.URL === pathname;
    })[0];
  const userDetails: any = decryptData(localStorage.getItem("USER"))
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    resetField,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      WO_ID: search === "?add=" ? 0 : localStorage.getItem("WO_ID"),
      ASSET_ID: "",
      MODE: search === "?edit=" ? "E" : "A",
      PARA:
        props?.selectedData || search === "?edit="
          ? { para1: `${"Service Request"}`, para2: t("Updated") }
          : { para1: `${"Service Request"}`, para2: t("Added") },
      RAISEDBY_ID: decryptData(localStorage.getItem("USER_ID")),
      ASSET_NONASSET: "A",
      SEVERITY_CODE: "",
      WO_DESCRIPTION: "",
      ASSIGN_TEAM_ID: "",
      DOC_LIST: [],
      TECH_LIST: [],
      REPORTER_NAME: userDetails?.USER_NAME ?? "",
      REPORTER_EMAIL: userDetails?.USER_EMAILID ?? "",
      REPORTER_MOBILE: userDetails?.USER_MOBILENO ?? "",
      ISSUE_DESCRIPTION: "",
      WO_TYPE_CODE: "",
      REMARKS: "",
      EQUIPMENT_NAME: selectedEquipmentKey ?? "",
    },
    mode: "onSubmit",
  });

  const accept = async () => {
    await handleSubmit((data, e) => {
      onSubmit(data, e, "CANCEL");
    })();
  };
  const watchEQUIPMENT_NAME = watch("EQUIPMENT_NAME");
  useEffect(() => {
    if (watchEQUIPMENT_NAME !== "") {
      setShowEditSummary(true);
    }
  }, [watchEQUIPMENT_NAME]);

  useEffect(() => {
    const selectedSeverity =
      optiionList?.PRIORITYLIST?.length >= 1
        ? optiionList?.PRIORITYLIST.find(
          (option: any) => option.SEVERITY === "Low"
        )
        : null;

    setValue("SEVERITY_CODE", selectedSeverity);
  }, [optiionList?.PRIORITYLIST]);

  const onSubmit = async (payload: any, e: any, mode?: any) => {
    setIsSubmit(true);
    let buttonMode: any = e?.nativeEvent?.submitter?.name;
    buttonMode = buttonMode === undefined ? mode : buttonMode;
    payload.WO_TYPE = payload?.WO_TYPE_CODE?.WO_TYPE_CODE;
    payload.ASSET_NONASSET = "A";
    payload.ISSUE_DESCRIPTION = payload?.ISSUE_DESCRIPTION;
    payload.TEAM_ID = payload?.ASSIGN_TEAM_ID?.TEAM_ID;
    payload.PRIORITY_ID = payload?.SEVERITY_CODE?.SEVERITY_ID;
    payload.MODE = buttonMode !== "" ? buttonMode : payload.MODE;
    payload.WO_ID = search === "?edit=" ? selectedDetails?.WO_ID : 0;
    payload.ASSET_ID = selectedassetid
      ? selectedassetid
      : selectedDetails?.ASSET_ID;
    if (search === "?edit=" && selectedDetails?.WO_NO) {
      payload.WO_NO = selectedDetails?.WO_NO;
    }
    payload.DOC_LIST =
      buttonMode === "CONVERT" || buttonMode === "CANCEL"
        ? []
        : payload?.DOC_LIST;
    payload.PARA =
      payload?.MODE === "E"
        ? { para1: `${"Service Request"}`, para2: t("Updated") }
        : payload?.MODE === "CANCEL"
          ? { para1: `${"The service request has been "}`, para2: t("cancelled") }
          : { para1: `${"Service Request"}`, para2: t("Added") };
    payload?.MODE === "E"
      ? setserviceReqStatus("updated")
      : setserviceReqStatus("cancelled");
    delete payload.WO_TYPE_CODE;
    delete payload.ASSIGN_TEAM_ID;
    delete payload.SEVERITY_CODE;
    const input = payload?.WO_DESCRIPTION;
    const descriptionData = input.replace(/\n/g, " ");
    payload.WO_DESCRIPTION = descriptionData;
    try {
      const res = await callPostAPI(
        ENDPOINTS.SAVE_INFRA_SERVICE_REQUEST,
        payload
      );
      
      if (res?.FLAG) {
        if(isAws === true ){
         helperAwsFileupload(payload?.DOC_LIST);
        }
        if (search === "?add=") {
          setIsSubmit(true);
          setServiceRequestId(res?.WO_NO);
          setsuccessvisible(true);
        } else if (buttonMode === "E") {
          successVisiblePopup(true);
          setTimeout(async () => {
            successVisiblePopup(false);
            setIsSubmit(false);
            navigate(`/servicerequestlist?edit=`);
            seteditStatus(false);
            await getServicererquestDetails();
            await getDocmentList(localStorage.getItem("WO_ID"));
          }, 2000);
        } else if (buttonMode === "CONVERT") {
          setVisibleViewWorkorder(true);
          setIsSubmit(false);
        } else if (buttonMode === "CANCEL") {
          successVisiblePopup(true);
          setTimeout(async () => {
            successVisiblePopup(false);
            navigate(`/servicerequestlist`);
            await getServicererquestDetails();
            await getDocmentList(localStorage.getItem("WO_ID"));
            setIsSubmit(false);
            setIsSubmit(false);
          }, 2000);
        }
      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error);
    } finally {
    }
  };
  useEffect(() => {
    if (
      (!isSubmitting && Object?.values(errors)[0]?.type === "required") ||
      (!isSubmitting && Object?.values(errors)[0]?.type === "validate")
    ) {
      const check: any = Object?.values(errors)[0]?.message;
      toast?.error(t(check));
    }
  }, [isSubmitting]);

  const ClosePopUp = () => {
    setsuccessvisible(!successvisible);
  };
  const CloseSuccessPopUp = () => {
    successVisiblePopup(false);
  };

  const viewServiceRequest = (e: any) => {
    e.preventDefault();
    localStorage.setItem("WO_ID", serviceRequestId);
    navigate("/workorderlist?edit=");
    setsuccessvisible(!successvisible);
    setIsSubmit(false);
  };
  const addServiceRequest = () => {
    setSelectedKey("");
    seselectedassetid("");
    setIssueLength(0);
    setIssueDescription(0);
    setDescriptionlength(0);
    collapseAll();
    navigate(PATH?.SERVICEREQUEST + "?add=");
    reset();
    setsuccessvisible(!successvisible);
    setShowEditSummary(false);
    setIsSubmit(false);
    const selectedSeverity =
      optiionList?.PRIORITYLIST?.length >= 1
        ? optiionList?.PRIORITYLIST.find(
          (option: any) => option.SEVERITY === "Low"
        )
        : null;
    if (selectedSeverity) {
      setValue("SEVERITY_CODE", selectedSeverity);
    }
  };

  const getServiceRequestMasterListInfra = async () => {
    try {
      const res = await callPostAPI(ENDPOINTS.GET_INFRA_MASTER_SERVICE_REQUEST);
      if (res?.FLAG === 1) {
        setOptionList(res);
      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error.message);
    }
  };

  const getAssetDetailsList = async (assetid: any) => {
    try {
      const payload = {
        ASSET_ID: assetid ?? 0,
      };
      const res = await callPostAPI(ENDPOINTS.GET_INFRA_ASSET_DETAILS, payload);
      console.log(res, "res")
      if (res?.FLAG === 1) {
        setAssetTreeDetails(res?.ASSETDETAILSLIST);
      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error.message);
    }
  };
  const checkEditStatus = () => {
    setValue("DOC_LIST", docOption);
    setValue("ISSUE_DESCRIPTION", selectedDetails?.ISSUE_DESCRIPTION);
    setValue("WO_DESCRIPTION", selectedDetails?.DESCRIPTION);
    setValue("EQUIPMENT_NAME", selectedDetails?.ASSET_NAME);
    const selectedteam = optiionList?.TEAMLIST?.filter((item: any) => {
      return item?.TEAM_ID === selectedDetails?.ASSIGN_TEAM_ID;
    });
    setValue("ASSIGN_TEAM_ID", selectedteam[0]);
    setIssueLength(selectedDetails?.DESCRIPTION?.length);
    setDescriptionlength(selectedDetails?.DESCRIPTION?.length);
    seteditStatus((prev) => !prev);
  };

  const CancelSR = () => {
    seteditStatus((prev) => !prev);
    resetField("ISSUE_DESCRIPTION");
    resetField("WO_DESCRIPTION");
    resetField("SEVERITY_CODE");
    resetField("ASSIGN_TEAM_ID");
    const selectedteam = optiionList?.TEAMLIST?.filter((item: any) => {
      return item?.TEAM_ID === selectedDetails?.ASSIGN_TEAM_ID;
    });
    setValue("ASSIGN_TEAM_ID", selectedteam[0]);
  };
  useEffect(() => {
    if (activityTimeLineList) {
      const newItemList = activityTimeLineList?.map((item: any) => ({
        ...item,
        CREATEDON: formateDate(item?.CREATEDON),
      }));
      setNewTimelineList(newItemList);
    }
  }, [activityTimeLineList, search]);
  const getServicererquestDetails = async () => {
    try {
      const res = await callPostAPI(
        ENDPOINTS.GET_WORKORDER_DETAILS,
        { WO_ID: localStorage.getItem("WO_ID") },
        currentMenu?.FUNCTION_CODE
      );
      if (res?.FLAG === 1) {
        setSelectedDetails(res?.WORKORDERDETAILS[0]);
        setIssueDescription(res?.WORKORDERDETAILS[0]?.ISSUE_DESCRIPTION);
        setDescriptionlength(res?.WORKORDERDETAILS[0]?.DESCRIPTION?.length);
        setIssueLength(res?.WORKORDERDETAILS[0]?.ISSUE_DESCRIPTION?.length);
        setValue(
          "ISSUE_DESCRIPTION",
          res?.WORKORDERDETAILS[0]?.ISSUE_DESCRIPTION
        );
        setValue("WO_DESCRIPTION", res?.WORKORDERDETAILS[0]?.DESCRIPTION);
        setValue("EQUIPMENT_NAME", res?.WORKORDERDETAILS[0]?.ASSET_NAME);
        setCurStatus(res?.WORKORDERDETAILS[0]?.CURRENT_STATUS);
        setCurSubStatus(res?.WORKORDERDETAILS[0]?.SUB_STATUS);
        setActivityTimeLineList(res?.ACTIVITYTIMELINELIST);
        await getAssetDetailsList(res?.WORKORDERDETAILS[0]?.ASSET_ID);
      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error.message);
    }
  };

  const getDocmentList = async (WO_ID: any) => {
    setisloading(true);
    try {
     const res = await helperGetWorkOrderAwsDoclist(WO_ID, currentMenu?.FUNCTION_CODE) ;

      if (res?.FLAG === 1) {
        setDocOption(res?.WORKORDERDOCLIST);
        setValue("DOC_LIST", res?.WORKORDERDOCLIST);
      } else {
      }
    } catch (error: any) {
      setisloading(false);
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (search === "?edit=" || editStatus) {
        await getServicererquestDetails();
        await getDocmentList(localStorage.getItem("WO_ID"));
      }
    };
    fetchData();
  }, [search === "?edit=" || editStatus]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDetails?.ASSET_ID && selectedDetails?.ASSIGN_TEAM_ID) {
        await getAssetDetailsList(selectedDetails?.ASSET_ID);
      }
    };
    fetchData();
  }, [editStatus]);

  useEffect(() => {
    (async function () {
      await getServiceRequestMasterListInfra();
    })();
  }, [selectedFacility]);

  const collapseAll = () => {
    setExpandedKeys({});
    setnodecollapse(false);
  };

  useEffect(() => {
    if (selectedDetails) {
      optiionList?.WOTYPELIST?.filter((item: any) => {
        if (item.WO_TYPE_CODE === selectedDetails?.WO_TYPE) {
          setValue("WO_TYPE_CODE", item);
        }
      });
      optiionList?.PRIORITYLIST?.filter((item: any) => {
        if (item.SEVERITY_ID === selectedDetails?.SEVERITY_CODE) {
          setValue("SEVERITY_CODE", item);
        }
      });
      const PriorityIconName = priorityIconList?.filter(
        (e: any) => e?.ICON_ID === selectedDetails?.ICON_ID
      )[0]?.ICON_NAME;
      setselectedPriorityIconName(PriorityIconName);
    }
  }, [
    search === "?edit=",
    editStatus,
    optiionList,
    selectedDetails,
    optiionList?.PRIORITYLIST,
  ]);

  console.log(assetTreeDetails, "assetTreeDetails")
  const handleInputChange = (event: any) => {
    const value = event?.target?.value;
    setDescriptionlength(value?.length);
  };

  const onClickCancelButton = () => {
    navigate(`/workorderlist`);
  };

  const GetOpenList = () => {
    navigate(`/servicerequestlist`, { state: "workorder" });
  };

  const ActivityHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className="flex justify-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="white-space-nowrap">Activity Timeline</span>
      </div>
    );
  };
  const DetailsHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className="flex justify-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="white-space-nowrap">Details</span>
      </div>
    );
  };

  return (
    <>
      <section className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="fixedContainer">
            <div className="flex justify-between">
              <div className="w-3/4">
                <p className="Helper_Text Menu_Active flex mb-1 flex flex-col">
                  {`Service Request`}
                </p>
                {search === "?edit=" && editStatus && (
                  <h6 className=" Text_Primary Main_Header_Text mb-1">
                    {t("Edit Service Request")}
                  </h6>
                )}
                {!editStatus && (
                  <h6 className="Text_Primary Main_Header_Text mb-1">
                    {selectedDetails?.ISSUE_DESCRIPTION ?? ""}
                  </h6>
                )}
                <p className="flex flex-col Helper_Text">
                  {" "}
                  {selectedDetails?.ISSERVICEREQ === true
                    ? selectedDetails?.WO_NO
                    : selectedDetails?.SER_REQ_NO}
                </p>
                {search === "?add=" && (
                  <h6 className=" Text_Primary Main_Header_Text mb-1">
                    {t("Add Service Request")}
                  </h6>
                )}
              </div>
              <div>
                {search === "?add=" && (
                  <>
                    <Buttons
                      className="Secondary_Button w-20 me-2"
                      label={"Cancel"}
                      onClick={() => {
                        onClickCancelButton();
                      }}
                    />
                    <Buttons
                      disabled={IsSubmit}
                      type="submit"
                      className="Primary_Button  w-20 me-2"
                      label={"Submit"}
                    />
                  </>
                )}

                <Dialog
                  visible={cancelvisible}
                  style={{ width: "550px" }}
                  className="dialogBoxStyle"
                  onHide={() => {
                    if (!cancelvisible) return;
                    setcancelvisible(false);
                  }}
                >
                  <div className="grid justify-items-center">
                    <div className="flex flex-wrap flex-col text-center ">
                      <h6 className="Text_Primary mb-3">Confirmation</h6>
                      <p className="Input_Text text-center">
                        Are you sure you want to cancel service request?
                      </p>
                      <div className="flex justify-center gap-3 mt-[35px]">
                        <Button
                          className="Secondary_Button "
                          label={"Cancel"}
                          onClick={() => setcancelvisible(false)}
                        />
                        <Buttons
                          className="Primary_Button "
                          label={"Save"}
                          name="CONVERT"
                          onClick={() => accept}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog>

                {search === "?edit=" && editStatus === false && (
                  <>
                    {" "}
                    <Buttons
                      type="button"
                      className="Secondary_Button me-2"
                      disabled={IsSubmit}
                      label={"List"}
                      onClick={GetOpenList}
                    />
                  </>
                )}
                {search === "?edit=" &&
                  editStatus === false &&
                  curStatus !== 5 &&
                  selectedDetails?.ISSERVICEREQ &&
                  selectedDetails?.ISCANCLE === 1 && (
                    <>
                      <Buttons
                        type="button"
                        className="Secondary_Button me-2"
                        disabled={IsSubmit}
                        label={"Cancel Service Request"}
                        onClick={(e: any) => {
                          setcancelvisible(true);
                        }}
                      />
                    </>
                  )}

                {search === "?edit=" &&
                  editStatus === false &&
                  curStatus !== 5 &&
                  selectedDetails?.ISSERVICEREQ &&
                  selectedDetails?.ISGENERATE === 1 && (
                    <Buttons
                      type="button"
                      className="Primary_Button me-2"
                      disabled={IsSubmit}
                      label={"Generate Work order"}
                      onClick={() => setVisibleWorkorder(true)}
                    />
                  )}

                <Dialog
                  visible={visibleWorkorder}
                  style={{ width: "550px" }}
                  className="dialogBoxStyle"
                  onHide={() => {
                    if (!visibleWorkorder) return;
                    setVisibleWorkorder(false);
                  }}
                >
                  <div className="grid justify-items-center">
                    <div className="flex flex-wrap flex-col text-center ">
                      <h6 className="Text_Primary mb-3">
                        Confirm Work Order Generation
                      </h6>
                      <p className="Input_Text text-center">
                        Are you sure you want to generate this work order? Once
                        generated, the service request cannot be edited. All
                        changes must be made directly in the work order.
                      </p>
                      <div className="flex justify-center gap-3 mt-[35px]">
                        <Button
                          className="Secondary_Button"
                          label={"Cancel"}
                          onClick={() => setVisibleWorkorder(false)}
                        />
                        <Buttons
                          className="Primary_Button "
                          label={"Generate work order"}
                          name="CONVERT"
                          onClick={async (e: any) => {
                            // setVisibleViewWorkorder(true);
                            setVisibleWorkorder(false);
                            await handleSubmit((data, event) =>
                              onSubmit(data, e, "CONVERT")
                            )(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog>

                <Dialog
                  visible={visibleViewWorkorder}
                  style={{ width: "550px" }}
                  className="dialogBoxStyle"
                  onHide={async () => {
                    await getServicererquestDetails();
                    if (!visibleViewWorkorder) return;
                    setVisibleViewWorkorder(false);
                  }}
                >
                  <div className="grid justify-items-center">
                    <div className="text-center ">
                      <h6 className="Text_Primary mb-3">
                        Work Order Generated!
                      </h6>
                      <p className="Input_Text text-center">
                        Your work order has been successfully generated.
                      </p>
                      <div className="flex justify-center gap-3 mt-[35px]">
                        <Button
                          type="button"
                          className="Secondary_Button "
                          label={"Back to Service Request"}
                          onClick={() => {
                            setVisibleViewWorkorder(false);

                            localStorage.setItem(
                              "WO_ID",
                              selectedDetails?.WO_ID
                            );
                            window.location.reload();
                            navigate(PATH?.SERVICEREQUEST + "?edit=");
                          }}
                        />
                        <Button
                          className="Primary_Button"
                          label={"View Work Order"}
                          onClick={() => (
                            localStorage.setItem(
                              "WO_ID",
                              JSON.stringify(selectedDetails?.WO_ID)
                            ),
                            navigate(PATH?.WORKORDERMASTER + "?edit=")
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog>
                {search === "?edit=" && editStatus && (
                  <>
                    <Buttons
                      type="button"
                      className="Secondary_Button me-2"
                      label={"Cancel"}
                      onClick={CancelSR}
                    />
                    <Buttons
                      type="submit"
                      name="E"
                      disabled={IsSubmit}
                      className="Primary_Button me-2"
                      label={"Update"}
                    />
                  </>
                )}
                {search === "?edit=" &&
                  editStatus === false &&
                  !selectedDetails?.ISSERVICEREQ && (
                    <Buttons
                      type="button"
                      className="Primary_Button me-2"
                      disabled={IsSubmit}
                      label={"View Work Order"}
                      onClick={(e: any) => {
                        localStorage.setItem(
                          "WO_ID",
                          JSON.stringify(selectedDetails?.WO_ID)
                        );
                        navigate(PATH?.WORKORDERMASTER + "?edit=");
                      }}
                    />
                  )}
              </div>
            </div>
          </Card>
          <div className=" mt-3 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
            <div className="col-span-2 woTabview">
              {search === "?add=" || (search === "?edit=" && editStatus) ? (
                <>
                  <Card>
                    <div className="flex flex-wrap justify-between mb-3">
                      <h6 className="Header_Text">{t("Request Details")}</h6>
                    </div>
                    <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 lg:grid-cols-2">

                      <Field
                        controller={{
                          name: "WO_TYPE_CODE",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <Select
                                options={optiionList?.WOTYPELIST}
                                {...register("WO_TYPE_CODE", {
                                  required: "Please fill the required fields",
                                })}
                                label={"Type of Work"}
                                optionLabel="WO_TYPE_NAME"
                                findKey="WO_TYPE_CODE"
                                require={true}
                                filter={true}
                                selectedData={selectedDetails?.WO_TYPE}
                                disabled={search === "?edit=" ? true : false}
                                setValue={setValue}
                                invalid={errors.WO_TYPE_CODE}
                                {...field}
                              />
                            );
                          },
                        }}
                      />
                      <Field
                        controller={{
                          name: "SEVERITY_CODE",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <Select
                                options={optiionList?.PRIORITYLIST}
                                {...register("SEVERITY_CODE", {
                                  required: "Please fill the required fields",
                                })}
                                label={"Priority"}
                                optionLabel="SEVERITY"
                                findKey="SEVERITY_ID"
                                require={true}
                                filter={true}
                                selectedData={selectedDetails?.SEVERITY_CODE}
                                setValue={setValue}
                                invalid={errors.SEVERITY_CODE}
                                {...field}
                              />
                            );
                          },
                        }}
                      />
                      <div className="col-span-2">
                        <div>
                          <Field
                            controller={{
                              name: "EQUIPMENT_NAME",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <InputField
                                    {...register("EQUIPMENT_NAME", {
                                      required: t(
                                        "Please fill the required fields."
                                      ),
                                      validate: (value) =>
                                        value.trim() !== "" ||
                                        t("Please fill the required fields."),
                                    })}
                                    require={true}
                                    label="Equipment"
                                    invalid={errors.EQUIPMENT_NAME}
                                    readOnly={true}
                                    placeholder={true}
                                    setValue={setValue}
                                    onClick={(e: any) =>
                                      showEquipmentlist(true)
                                    }
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                        </div>

                        <div className="mt-2">
                          {showEditSummary && (
                            <ShowEquipmentDetails
                              assetTreeDetails={assetTreeDetails}
                              isServiceRequest={true}
                              isCardView={true}
                            />
                          )}

                        </div>
                        <HierarchyDialog
                          showEquipmentlist={showEquipmentlist}
                          visibleEquipmentlist={visibleEquipmentlist}
                          selectedKey={selectedKey}
                          setSelectedKey={setSelectedKey}
                          setValue={setValue}
                          nodes={nodes}
                          filteredData={filteredData}
                          setFilteredData={setFilteredData}
                          setNodes={setNodes}
                          assetTreeDetails={assetTreeDetails}
                          setAssetTreeDetails={setAssetTreeDetails}
                          seselectedassetid={seselectedassetid}
                          isCheckbox={false}
                          loading={loading}
                        />
                        {/*  */}
                      </div>

                      <div className="col-span-2">
                        <Field
                          controller={{
                            name: "ISSUE_DESCRIPTION",
                            control: control,
                            render: ({ field }: any) => {
                              return (
                                <InputField
                                  {...register("ISSUE_DESCRIPTION", {
                                    required: t(
                                      "Please fill the required fields."
                                    ),
                                    onChange: (e: any) => {
                                      setIssueLength(e?.target?.value?.length);
                                      setIssueDescription(e?.target?.value);
                                    },
                                    validate: (value) =>
                                      value.trim() !== "" ||
                                      t("Please fill the required fields."),
                                  })}
                                  require={true}
                                  label="Issue (Max 100 characters)"
                                  maxLength={100}
                                  invalid={errors.ISSUE_DESCRIPTION}
                                  setValue={issueDescription}
                                  {...field}
                                />
                              );
                            },
                          }}
                        />
                        <label
                          className={` ${issueLength === 100
                            ? "text-red-600"
                            : "Text_Secondary"
                            } Helper_Text`}
                        >
                          {t(`${issueLength}/100 characters`)}
                        </label>
                      </div>
                      <div
                        className={`col-span-2 ${errors?.WO_DESCRIPTION ? "errorBorder" : ""
                          }`}
                      >
                        <label className="Text_Secondary Input_Label">
                          {t("Description (Max 400 characters)")}
                          <span className="text-red-600"> *</span>
                        </label>

                        <Field
                          controller={{
                            name: "WO_DESCRIPTION",
                            control: control,
                            render: ({ field }: any) => {
                              return (
                                <InputTextarea
                                  {...register("WO_DESCRIPTION", {
                                    required: t(
                                      "Please fill the required fields."
                                    ),
                                    onChange: (e: any) => handleInputChange(e),
                                  })}
                                  rows={5}
                                  maxLength={400}
                                  setValue={setValue}
                                  invalid={errors.WO_DESCRIPTION}
                                  {...field}
                                />
                              );
                            },
                          }}
                        />
                        <label
                          className={` ${Descriptionlength === 400
                            ? "text-red-600"
                            : "Text_Secondary"
                            } Helper_Text`}
                        >
                          {t(`${Descriptionlength}/400 characters`)}
                        </label>
                      </div>
                      <div className="col-span-2">
                        <WoDocumentUpload
                          register={register}
                          control={control}
                          setValue={setValue}
                          watch={watch}
                          getValues={getValues}
                          errors={errors}
                          uploadtype="W"
                          uploadLabel="Upload Supporting files"
                          setIsSubmit={setIsSubmit}
                          docCancel={docCancel}
                          setdocCancel={setdocCancel}
                        />
                      </div>
                    </div>
                  </Card>
                  <Card className="mt-2">
                    <div className="flex flex-wrap justify-between mb-3">
                      <h6 className="Header_Text">
                        {t("Reporter Details")}
                      </h6>
                    </div>
                    <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 lg:grid-cols-2">
                      <Field
                        controller={{
                          name: "REPORTER_NAME",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <InputField
                                {...register("REPORTER_NAME", {})}
                                label="Reporter Name"
                                disabled={true}
                                {...field}
                              />
                            );
                          },
                        }}
                      />
                      <Field
                        controller={{
                          name: "REPORTER_EMAIL",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <InputField
                                {...register("REPORTER_EMAIL", {})}
                                label="Reporter Email"
                                disabled={true}
                                {...field}
                              />
                            );
                          },
                        }}
                      />
                      <Field
                        controller={{
                          name: "REPORTER_MOBILE",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <InputField
                                {...register("REPORTER_MOBILE", {})}
                                label="Reporter Mobile Number"
                                disabled={true}
                                {...field}
                              />
                            );
                          },
                        }}
                      />
                    </div>
                  </Card>
                </>
              ) : (
                <></>
              )}
              {search === "?edit=" && editStatus === false ? (
                <>
                  <div className="woDetailTabview">
                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      <TabPanel headerTemplate={DetailsHeaderTemplate}>
                        <Card className="mt-3">
                          <div className="flex flex-wrap justify-between mb-3">
                            <h6 className="Header_Text">
                              {" "}
                              {t("Service Request Details")}
                            </h6>
                            {curStatus !== 5 &&
                              selectedDetails?.ISSERVICEREQ &&
                              selectedDetails?.ISEDIT === 1 && (
                                <Buttons
                                  className="Border_Button Secondary_Button "
                                  label={"Edit Details"}
                                  icon="pi pi-pencil"
                                  type="button"
                                  onClick={(e: any) => {
                                    checkEditStatus();
                                  }}
                                />
                              )}
                          </div>
                          {editStatus === false && (<WoDetails woDetails={selectedDetails} imageDocList={docOption ?? []} selectedPriorityIconName={selectedPriorityIconName} isloading={isloading} isInfraSerReq={true} />)}
                        </Card>
                        <ShowEquipmentDetails assetTreeDetails={assetTreeDetails} isServiceRequest={false} isCardView={true} />
                        <ReporterDetails ReporterDetailsProps={selectedDetails} salcedorecedetails={undefined} onClickFunction={() => { }} salseforceAccount={true} />
                      </TabPanel>
                      <TabPanel headerTemplate={ActivityHeaderTemplate}>
                        <ActivityTimelinetable ActivityTimelineData={newtimelinelist} />
                      </TabPanel>
                    </TabView>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div>
              <Card className="">
                <div className=" grid grid-cols-1 gap-x-3 gap-y-3 ">
                  <div>
                    <div className="pb-4">
                      <h6 className="Header_Text">{t("Assign To")}</h6>
                    </div>
                    <Field
                      controller={{
                        name: "ASSIGN_TEAM_ID",
                        control: control,
                        render: ({ field }: any) => {
                          return (
                            <Select
                              options={optiionList?.TEAMLIST}
                              {...register("ASSIGN_TEAM_ID", {
                                required: t("Please fill the required fields."),
                                onChange: async (e: any) => { },
                              })}
                              label={"Team"}
                              optionLabel="TEAM_NAME"
                              findKey={"TEAM_ID"}
                              setValue={setValue}
                              require={true}
                              selectedData={selectedDetails?.ASSIGN_TEAM_ID}
                              disabled={!editStatus && search !== "?add="}
                              invalid={errors?.ASSIGN_TEAM_ID}
                              {...field}
                            />
                          );
                        },
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>

        <Dialog header="" visible={successvisible} style={{ width: "550px" }} className="dialogBoxStyle" onHide={() => ClosePopUp()} >
          <form>
            <div className="grid justify-items-center">
              <div className="">
                <h6 className="Text_Primary text-center mb-3">
                  Request Submitted
                </h6>
                <p className="Input_Text text-center text-xs">
                  Your service request has been received and a work order has
                  been created. You can check the status anytime from the work
                  order list
                </p>
              </div>
              <div className="flex justify-center gap-3 mt-[35px]">
                <Buttons
                  className="Secondary_Button "
                  label={"Submit Another Request"}
                  onClick={() => addServiceRequest()}
                />
                <Button
                  className="Primary_Button"
                  label={"View Work Order"}
                  onClick={(e: any) => viewServiceRequest(e)}
                />
              </div>
            </div>
          </form>
        </Dialog>
      </section>

      <Dialog header="" visible={visibleSuccess_Popup} style={{ width: "550px" }} className="dialogBoxStyle"
        onHide={() => CloseSuccessPopUp()}>
        <form>
          <div className="grid justify-items-center">
            <div className="">
              {<img src={success} alt="" height={60} width={60} />}
            </div>
            <div className="mt-3">
              <h6 className="Text_Primary text-center mb-3">Success!</h6>
              <p className="Input_Text text-center">{`This service request has been ${serviceReqStatus} successfully`}</p>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default InfraServiceRequest;
