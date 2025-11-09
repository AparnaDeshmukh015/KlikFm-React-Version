
import { Card } from "primereact/card";
import { useEffect, useState, memo } from "react";
import { set, useForm } from "react-hook-form";
import { Tooltip } from "primereact/tooltip";
import success from "../../../assest/images/success.gif";
import { TabView, TabPanel, TabPanelHeaderTemplateOptions } from "primereact/tabview";
import "./WorkorderMaster.css";
import reviewIcon from "../../../assest/images/IconContainer.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Field from "../../../components/Field";
import { useLocation, useNavigate, useOutletContext, } from "react-router-dom";
import Buttons from "../../../components/Button/Button";
import Select from "../../../components/Dropdown/Dropdown";
import { clearFilters } from "../../../store/filterstore";
import { useDispatch } from "react-redux";
import { formateDate, helperNullDate, isAws, priorityIconList } from "../../../utils/constants";
import { Badge } from "primereact/badge";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { Dialog } from "primereact/dialog";
import LoaderS from "../../../components/Loader/Loader";
import { PATH } from "../../../utils/pagePath";
import { decryptData } from "../../../utils/encryption_decryption";
import CancelWoDialog from "./InfraWorkorderDialog/CancelWoDialog";
import AssignWoDialog from "./InfraWorkorderDialog/AssignWoDialog";
import Button from "../../../components/Button/Button";
import { InputTextarea } from "primereact/inputtextarea";
import SuccessDialog from "./InfraWorkorderDialog/SuccessDialog";
import RedirectWoDialog from "./InfraWorkorderDialog/RedirectWoDialog";
import InfraSidebarVisibal from "./InfraWorkorderDialog/InfraSidebarVisibal";
import PTWApprovalDialog from "./InfraWorkorderDialog/PTWApprovalDialog";
import AddResolutionDialog from "./InfraWorkorderDialog/AddResolutionDialog";
import RequestResumeDialog from "./InfraWorkorderDialog/RequestResumeDialog";
import WoDocumentUpload from "../../../components/pageComponents/DocumentUpload/WoDocumentUpload";
import { SplitButton } from "primereact/splitbutton";
import DeclinePTWDialog from "./InfraWorkorderDialog/DeclinePTWDialog";
import ProceedPTWDialog from "./InfraWorkorderDialog/ProceedPTWDialog";
import NormalizeToTest from "./InfraWorkorderDialog/NormalizeToTest";
import PdfReport from "./PdfReport/PdfReport";
import { ShowEquipmentDetails } from "./InfraWorkrderHelper/ShowEquipmentDetails";
import { ActivityTimelinetable } from "./InfraWorkrderHelper/ActivityTimelinetable";
import { ShowAssigneeList } from "./InfraWorkrderHelper/ShowAssigneeList";
import { InfraSidebarStatus } from "./InfraWorkrderHelper/InfraSidebarStatus";
import { ActivityTimeLineHeader } from "./InfraWorkrderHelper/ActivityTimeLineHeader";
import NoItemToShow from "./InfraWorkrderHelper/NoItemToShow";
import { ResolutionDetails } from "./InfraWorkrderHelper/ResolutionDetails";
import { WoDetails } from "./InfraWorkrderHelper/WoDetails";
import { helperAwsFileupload, helperDeleteFileAws, helperGetWorkOrderAwsDoclist } from "../ServiceRequest/utils/helperAwsFileupload";
import { deleteDocument } from "../ServiceRequest/utils/helperServiceRequestReal";
interface taskDetails {
  TASK_ID: any;
  TASK_NAME: any;
}

interface docType {
  DOC_SRNO: any;
  DOC_NAME: string;
  DOC_DATA: any;
  DOC_EXTENTION: string;
  DOC_SYS_NAME: any;
  ISDELETE: any;
  DOC_TYPE: any;
}

interface partList {
  PART_ID: string;
  PART_CODE: string;
  UOM_CODE: any;
  UOM_NAME: any;
  PART_NAME: any;
  STOCK: any;
  USED_QUANTITY: any;
}

interface docType {
  DOC_SRNO: any;
  DOC_NAME: string;
  DOC_DATA: any;
  DOC_EXTENTION: string;
  DOC_SYS_NAME: any;
  ISDELETE: any;
  DOC_TYPE: any;
}

interface FormValues {
  // SIG: ReactSignatureCanvas | null;
  RAISED_BY: string | null;
  STRUCTURE_ID: string | null;
  ASSET_NONASSET: string | null;
  ASSETTYPE: string | null;
  REQ_DESC: string | null;
  DESCRIPTION: string;
  SEVERITY_CODE: string;
  TASK_DES: string;
  WORK_ORDER_NO: string;
  WO_NO: string | null;
  SEVERITY_DESC: string;
  WO_TYPE: string;
  LOCATION_NAME: string;
  LOCATION_DESCRIPTION: string;
  ASSET_NAME: string;
  ASSETGROUP_NAME: string;
  ASSETTYPE_NAME: string;
  WO_DATE: string;
  WO_REMARKS: string;
  SEVERITY: string;
  REMARK: string;
  PHONE_NO: number;
  EMAIL_ID: any;
  STATUS_DESC: string | null;
  TASKDETAILS: taskDetails[];
  PART_LIST: partList[];
  ASSIGN_TEAM_ID: string;
  TEAM_NAME: string;
  TECH_NAME: string;
  STATUS_CODE: string;
  DOC_LIST: docType[];
  PARTS_TYPE: string;
  REQ_ID: string;
  ASSET_ID: string;
  MODE: string;
  LOCATION_ID: string;
  REQUESTTITLE_ID: string;
  CURRENT_STATUS: any;
  TECH_ID: any;
  RAISEDBY_ID: any;
  ASSETTYPE_ID: any;
  ASSETGROUP_ID: any;
  LAST_MAINTANCE_DATE: any;
  WARRANTY_END_DATE: any;
  TASK_NAME: any;
  BILL_DATE: any;
  VERIFY: any;
  ACTION_ID?: number;
  CANCEL_DOC_LIST?:any[];
}
let CancelData:[]=[];
const InfraWorkOrderForm = (props: any) => {
  const dispatch = useDispatch();
  const navigate: any = useNavigate();
  const { search } = useLocation();
  const location: any = useLocation();
  const [masterList, setmasterList] = useState<any | null>([]);
  const [selectedDetails, setSelectedDetails] = useState<any>([]);
  const [MapButtons, setMapButtons] = useState<any>([]);
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  let { pathname } = useLocation();
  const [selectedFacility, menuList]: any = useOutletContext();
  const id: any = decryptData(localStorage.getItem("USER_ID"));
  const [isloading, setisloading] = useState<any | null>(false);
  const [loader, setloader] = useState<any | null>(false);
  const [docCancel, setdocCancel] = useState<any | null>([]);
  let showdetails = true;
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => {
      if (detail?.FUNCTION_CODE === "AS007") {
        showdetails = false;
      }
      return detail.URL === pathname;
    })[0];
  const [docOption, setDocOption] = useState<any | null>([]);
  const [technicianList, setTechnicianList] = useState<any | null>([]);
  const [timelineList, setTimelineList] = useState<any | null>([]);
  const [WOAcativeList, setWOActiveList] = useState<any | null>([]);
  const [assetDocList, setAssetDocList] = useState<any | null>([]);
  const [loading, setLoading] = useState<any | null>(false);
  const [currentStatus, setCurrentStatus] = useState<any | null>();
  const [assetTreeDetails, setAssetTreeDetails] = useState<any | null>([]);
  const [signatureDoc, setSignatureDoc] = useState<any | null>([]);
  let [imgSrc, setImgSrc] = useState<any | null>();
  const [approvalStatus, setApprovalStatus] = useState<any | null>(false);
  const [reassignVisible, setReassignVisible] = useState<boolean>(false);
  const [IsSubmit, setIsSubmit] = useState<any | null>(false);
  const [assignStatus, setAssignStatus] = useState<any | null>(false);
  const [editDetails, setEditdetails] = useState<boolean>(false);
  const [visibleTestingOhHold, setTestingOnHold] = useState<boolean>(false);
  const [techList, setTechList] = useState<any | null>([]);
  const [assigneeTechList, setAssigneeTechList] = useState<any | null>([]);
  const [selectedTechList, setSelectedTechList] = useState<any | null>([]);
  const [reasonList, setReasonList] = useState<any | null>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [paragraph, Setparagraph] = useState<any>("");
  const [Descriptionlength, setDescriptionlength] = useState(0);
  const [addAssigneeAction, setaddAssigneeAction] = useState<any | null>();
  const [newtimelinelist, setNewTimelineList] = useState<any | null>([]);
  const [visibleSucces, setvisibleSucces] = useState<boolean>(false);
  const [successType, setSuccessType] = useState<any | null>(false);
  const [visibleSuccesReport, setVisibleSuccesReport] = useState<any | null>(false);
  const [selectedPriorityIconName, setselectedPriorityIconName] = useState<any | null>();
  const [descriptionData, setDescriptionData] = useState<any | null>(null);
  const Actionitems = [

    {
      label: "Testing on Hold",
      visible: true,
      command: () => {
        setTestingOnHold(true);
      },
    },
    {
      label: "Normalization not Required ",
      command: async () => {
        updateWOStatusInfra(
          { ACTION_ID: 126 },
          "This work order has been updated successfully."
        );
      },
    },
  ];
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    resetField,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      PARTS_TYPE: "",
      RAISED_BY: props?.selectedData?.RAISED_BY || "",
      STRUCTURE_ID: "",
      ASSET_NONASSET: "",
      REMARK: "",
      ASSETTYPE: "",
      REQ_DESC: "",
      DESCRIPTION: "",
      SEVERITY_CODE: props?.selectedData?.SEVERITY_CODE,
      TASK_DES: "",
      WORK_ORDER_NO: "",
      WO_NO:
        props?.selectedData !== undefined ? props?.selectedData?.WO_NO : "",
      WO_TYPE: "CM",
      LOCATION_NAME: "",
      LOCATION_DESCRIPTION: "",
      ASSET_NAME: "",
      ASSETGROUP_NAME: "",
      ASSETTYPE_NAME: "",
      WO_DATE: "",
      WO_REMARKS: "",
      SEVERITY_DESC: "",
      TASKDETAILS: [{ TASK_ID: "0", TASK_NAME: "" }],
      PART_LIST: [],
      ASSIGN_TEAM_ID: "",
      TEAM_NAME: "",
      TECH_NAME: "",
      STATUS_CODE: "",
      DOC_LIST: [],
      REQ_ID: "",
      ASSET_ID: "",
      MODE: props?.selectedData ? "E" : "A",
      RAISEDBY_ID: "",
      LOCATION_ID: "",
      REQUESTTITLE_ID: "",
      CURRENT_STATUS: 1,
      TECH_ID: [],
      ASSETTYPE_ID: "",
      ASSETGROUP_ID: "",
      LAST_MAINTANCE_DATE: "",
      WARRANTY_END_DATE: "",
      ACTION_ID: 0,
     CANCEL_DOC_LIST:[],
    },
    mode: "all",
  });

  let assigneeActionCode: any;
  useEffect(() => {
    (async function () {
      let WoSearchID: any = search?.split(":/")[1];
      let WO_ID =
        search === "?edit=" ? localStorage.getItem("WO_ID") : WoSearchID;
      await getServiceRequestMasterList(WO_ID);
      await getDocmentList(WO_ID);
    })();
  }, []);
  const techwatcxhh = watch("TECH_ID");

  useEffect(() => {
    masterList?.PRIORITYLIST?.filter((e: any) => {
      if (e?.SEVERITY_ID === selectedDetails?.SEVERITY_CODE) {
        setValue("SEVERITY_CODE", e);
      }
    });
    const PriorityIconName = priorityIconList?.filter(
      (e: any) => e?.ICON_ID === selectedDetails?.ICON_ID
    )[0]?.ICON_NAME;
    setselectedPriorityIconName(PriorityIconName);
  }, [search === "?edit=" && masterList?.PRIORITYLIST && selectedDetails]);

  const getServiceRequestMasterList = async (WO_ID: any) => {
    const payload: any = { WO_ID: WO_ID };
    setLoading(true);
    try {
      let res: any = await callPostAPI(
        ENDPOINTS.GET_INFRA_MASTER_SERVICE_REQUEST,
        payload,
        "HD001"
      );
      setmasterList(res);

      await getWoDetails(WO_ID);
      if (res && res.FLAG === 1) {
      }
    } catch (error: any) {
    } finally {
    }
  };

  const onCancelEdit = () => {
    setEditdetails(false);
    resetField("DESCRIPTION");
     setdocCancel([]);
    resetField("SEVERITY_CODE");
    setValue("DOC_LIST", []);
  };

  const onOpenEditDialog = () => {
    setEditdetails(true);
    setValue("DESCRIPTION", selectedDetails?.DESCRIPTION);
    setDescriptionlength(selectedDetails?.DESCRIPTION?.length);
    const selectedSeverity = masterList?.PRIORITYLIST?.filter((item: any) => {
      return item?.SEVERITY_ID === selectedDetails?.SEVERITY_CODE;
    });

    setValue("SEVERITY_CODE", selectedSeverity[0]);
    setValue("DOC_LIST", docOption);
  };
  const watchDoc = watch("DOC_LIST");

  const updateWOStatusInfra = async (payload: any, paragraph: any) => {
    debugger;
    console.log(CancelData, 'docCancel', payload)
    if (payload?.DOC_LIST?.length > 0) {
      const filteredData = payload?.DOC_LIST?.filter(
        (item: any) => item.UPLOAD_TYPE !== "W"
      );
      console.log(filteredData, 'filteredData')
      payload.DOC_LIST = filteredData;
    }
    let WoSearchID: any = search?.split(":/")[1];
    let WO_ID =
      search === "?edit=" ? localStorage.getItem("WO_ID") : WoSearchID;
    payload.WO_ID = WO_ID;
    setLoading(true);
    setSidebarVisible(false);
    console.log(payload, 'payload')
    try {
      let res: any = await callPostAPI(
        ENDPOINTS.UPDATEWOSTATUSINFRA,
        payload,
        "HD001"
      );

      if (res && res.FLAG === true) {
        if(payload?.DOC_CANCEL_LIST?.length > 0 && search === "?edit="){
           deleteDocument(WO_ID, payload?.DOC_CANCEL_LIST);
        }
          if (payload?.DOC_LIST?.length > 0 && isAws === true) {
                  helperAwsFileupload(payload?.DOC_LIST)
          }
        if (payload.ACTION_ID === 114 || payload.ACTION_ID === 115) {
          setSidebarVisible(!sidebarVisible);
        }
        // setVisible(true);
        setTimeout(() => {
          setVisible(true);
        }, 100);
        setTimeout(() => {
          setVisible(false);
        }, 2000);

        Setparagraph(paragraph);
        await getWoDetails(WO_ID);
        await getDocmentList(WO_ID);
      }

      return res.FLAG;
    } catch (error: any) {
    } finally {
    }
  };

  const getReasonList = async (statuscode: any, substatuscode: any) => {
    try {
      let payload: any = {};
      if (statuscode === 1 && substatuscode === 2) {
        payload = { STATUS_CODE: 5, SUB_STATUS_CODE: 12 };
      }
      if (statuscode === 1 && substatuscode === 1) {
        payload = { STATUS_CODE: 1, SUB_STATUS_CODE: 3 };
      } else if (statuscode === 1 && substatuscode === 3) {
        payload = { STATUS_CODE: 1, SUB_STATUS_CODE: 3 };
      }
      const res = await callPostAPI(ENDPOINTS.GET_CANCEL_REASON_LIST, payload);
      if (res && res?.FLAG) {
        setReasonList(res?.REASONLIST);
      }
    } catch (error) { }
  };

  const getWoDetails = async (WO_ID: any) => {
    const payload: any = { WO_ID: WO_ID };
    setLoading(true);
    try {
      let res: any = await callPostAPI(
        ENDPOINTS.GET_WORKORDER_DETAILS,
        payload,
        "HD001"
      );

      if (res && res.FLAG === 1) {
        setSelectedDetails(res?.WORKORDERDETAILS[0]);
        setCurrentStatus(res?.WORKORDERDETAILS[0]?.CURRENT_STATUS);
        setTimelineList(res?.ACTIVITYTIMELINELIST);
        setWOActiveList(res?.WOACTIVELIST);
        let map_details: any = JSON.parse(res?.MAPBUTTONS[0]?.JsonArray);
        setMapButtons(map_details);
        setValue("DESCRIPTION", res?.WORKORDERDETAILS[0]?.DESCRIPTION);
        setDescriptionData(res?.WORKORDERDETAILS[0]?.DESCRIPTION);
        getAssetDetailsList(res?.WORKORDERDETAILS[0]?.ASSET_ID);
        await getReasonList(
          res?.WORKORDERDETAILS[0]?.CURRENT_STATUS,
          res?.WORKORDERDETAILS[0]?.SUB_STATUS
        );
        setDescriptionlength(res?.WORKORDERDETAILS[0]?.DESCRIPTION?.length);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (timelineList) {
      const newItemList = timelineList?.map((item: any) => ({
        ...item,
        CREATEDON: formateDate(item?.CREATEDON),
      }));
      setNewTimelineList(newItemList);
    }
  }, [timelineList, search]);

  const getAssetDetailsList = async (assetid: any) => {
    try {
      const payload = {
        ASSET_ID: assetid ?? 0,
      };
      const res = await callPostAPI(ENDPOINTS.GET_INFRA_ASSET_DETAILS, payload);
      if (res?.FLAG === 1) {
        setAssetTreeDetails(res?.ASSETDETAILSLIST);
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
      const res =  await helperGetWorkOrderAwsDoclist(WO_ID,"HD001") 
      if (res?.FLAG === 1) {
        setAssetDocList(res?.ASSETDOCLIST);
        setDocOption(res?.WORKORDERDOCLIST);
        setValue("DOC_LIST", res?.WORKORDERDOCLIST);
        const docData: any = [];
        res?.DIGITAlSIGNLIST?.forEach((element: any) => {
          docData.push(element);
        });

        setImgSrc(docData);
        setSignatureDoc(docData);
      }
    } catch (error: any) {
    } finally {
      setisloading(false);
    }
  };

  const updateWoDetails = async (data: any) => {
    // debugger
 
    try {
      if (assigneeTechList?.length > 0) {
        localStorage.removeItem("TECHNICIAN_LIST");
      }
      let WoSearchID: any = search?.split(":/")[1];

      let WO_ID =
        search === "?edit=" ? localStorage.getItem("WO_ID") : WoSearchID;
      const payload: any = {
        WO_ID: WO_ID,
        WO_DESCRIPTION: descriptionData.replace(/\n/g, " "),
        // WO_DESCRIPTION: descriptionData,
        PRIORITY_ID: data?.SEVERITY_CODE?.SEVERITY_ID,
        MODE:
          assigneeTechList?.length > 0 && editDetails === false
            ? "ASSIGN"
            : "E",
        PARA: { para1: `Work order`, para2: "updated" },
        DOC_LIST:
          assigneeTechList?.length > 0 && editDetails === false
            ? []
            : data?.DOC_LIST,
        TECH_ID: assigneeTechList,
        WO_NO: selectedDetails?.WO_NO,
        WO_TYPE: selectedDetails?.WO_TYPE,
        ACTION_ID: data.ACTION_ID,
      };
      if (assigneeTechList?.length > 0) {
        localStorage.setItem(
          "TECHNICIAN_LIST",
          JSON.stringify(assigneeTechList)
        );
      }

      setLoading(true);
    
      console.log(payload, 'payload')
      let res: any = await callPostAPI(
        ENDPOINTS.UPDATE_WO_INFRA,
        payload,
        "HD001"
      );
     debugger;
      if (res && res?.FLAG) {
   
        if(payload?.DOC_LIST?.length > 0){
          helperAwsFileupload( payload?.DOC_LIST)
        }
        setvisibleSucces(true);
        setTimeout(() => {
          setvisibleSucces(false);
        }, 2000);

        setEditdetails(false)
        await getWoDetails(WO_ID);
        await getDocmentList(WO_ID);
      }
    } catch (error: any) {
    } finally {
    }
  };

  const getAssignList = async () => {
    if (selectedDetails && selectedDetails?.ASSIGN_TEAM_ID) {
      var payload: any = {
        TEAM_ID: selectedDetails?.ASSIGN_TEAM_ID,
        WO_ID: selectedDetails?.WO_ID,
      };
    }
    try {
      const res: any = await callPostAPI(
        ENDPOINTS.GET_TEAM_USERLIST_INFRA,
        payload
      );
      let ptw: any = {
        label: "PTW Holder",
        code: "P",
      };
      let assignee1: any = {
        label: "Assignee",
        code: "A",
      };
      if (res && res?.FLAG) {
        const updatedUsers: any = res?.TEAMUSERLIST?.map((user: any) => ({
          ...user,
          sub_roles: user?.ASSING_ROLE === "P" ? ptw : assignee1,
          ASSING_ROLE: user?.ASSING_ROLE,
        }));
        setTechList(updatedUsers);

        const selectedTech: any = updatedUsers?.filter(
          (tech: any) => tech?.SELECT === 1
        );
        setSelectedTechList(updatedUsers);
        setTechnicianList(selectedTech);
        localStorage.setItem("TECHNICIAN_LIST", JSON.stringify(selectedTech));
      }
    } catch (error) { }
  };

  useEffect(() => {
    if (selectedDetails) {
      getAssignList();
    }
  }, [selectedDetails]);

  const ClosePopUp = () => {
    setVisible(!visible);
  };
  const CloseReportPopUp = () => {
    setVisibleSuccesReport(false);
  };
  const handlerReport = () => {
    localStorage.setItem(
      "workDetailsReport",
      JSON.stringify([selectedDetails])
    );
    // navigate(PATH.PDF_REPORT);
    setVisibleSuccesReport(true);
  };

  const handleInputChange = (event: any) => {
    const value = event?.target?.value;
    setDescriptionData(value);
    setDescriptionlength(value?.length);
  };

  const DetailsHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className="flex justify-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="white-space-nowrap">
          Details{" "}
          {[105, 113, 114, 115, 118, 120, 121, 141, 142]?.some((num) =>
            MapButtons?.includes(num)
          ) && (
              <span
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "red", display: "inline-flex", justifyContent: "center",
                  alignItems: "center", marginLeft: "8px", color: "white", fontSize: "12px", fontWeight: "bold",
                }}
              >
                1
              </span>
            )}
        </span>
        <Tooltip target=".custom-target-icon" />
      </div>
    );
  };
  const MaterialHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className="flex justify-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="white-space-nowrap">
          Resolution
          {[131, 132]?.some((num) =>
            [selectedDetails.PREVIOUS_ACTION]?.includes(num)
          ) &&
            [132]?.some((num) => MapButtons?.includes(num)) && (
              <span
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "red", display: "inline-flex",
                  justifyContent: "center", alignItems: "center", marginLeft: "8px", color: "white", fontSize: "12px", fontWeight: "bold",
                }}
              > 1
              </span>
            )}
        </span>
        <Tooltip target=".custom-target-icon1" />
        {
          // FACILITY["MATREQ_APPROVAL"] === true
          selectedDetails?.ISMATAPPROVALCNC === false &&
            selectedDetails?.ISMATAPPROVED === false &&
            selectedDetails?.CURRENT_STATUS === 5 &&
            selectedDetails?.SUB_STATUS === "6" ? (
            <Badge
              value="i"
              className="custom-target-icon1"
              data-pr-position="top"
              data-pr-tooltip="Material Request Approval"
            />
          ) : (
            <></>
          )
        }
      </div>
    );
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

  const onSubmit = async (payload: any, e: any) => { };

  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  let actualDate: any = helperNullDate(selectedDetails?.ACTUAL_START_DATE);

  const GetOpenList = () => {
    if (location?.state === "service") {
      dispatch(clearFilters());
      navigate(`/workorderlist`);
    } else {
      navigate(`/workorderlist`, { state: "workorder" });
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

  return (
    <>
      {loader ? (
        <>
          <LoaderS />
        </>
      ) : (
        <section className="w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <Card className="stickyHeader">
                <div className="flex justify-between">
                  <div className="w-3/5">
                    <p className="Helper_Text Menu_Active mb-1">
                      Work Order /{" "}
                    </p>
                    <h6 className="Text_Primary Main_Header_Text mb-1">
                      {/* {selectedDetails?.ASSETGROUP_NAME ?? ""} -{" "} */}
                      {selectedDetails?.ISSUE_DESCRIPTION ?? ""}
                    </h6>
                    <p className="Sub_Header_Text ">
                      {selectedDetails?.WO_NO ?? ""}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-full">
                      {MapButtons.includes(102) && (
                        <CancelWoDialog
                          header={"Cancel Work Order"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          resetField={resetField}
                          paragraph={""}
                          watch={watch}
                          errors={errors}
                          cancelReasonList={reasonList}
                          updateWOStatusInfra={updateWOStatusInfra}
                        />
                      )}

                      {MapButtons.includes(101) && (
                        <AssignWoDialog
                          header={"Assign"}
                          cssClass={"Primary_Button mr-2"}
                          control={control}
                          setData={setValue}
                          register={register}
                          paragraph={""}
                          watch={watch}
                          errors={errors}
                          TECH_ID={"TECH_ID"}
                          AssigneeList={techList}
                          setTechList={setTechList}
                          setAssigneeTechList={setAssigneeTechList}
                          assigneeTechList={assigneeTechList}
                          setSelectedTechList={setSelectedTechList}
                          updateWoDetails={handleSubmit(updateWoDetails)}
                          selectedTechList={selectedTechList}
                          TEAM_NAME={selectedDetails?.TEAM_NAME}
                          setaddAssigneeAction={setaddAssigneeAction}
                          technicianList={technicianList}
                        />
                      )}
                      {[
                        108, 109, 110, 111, 104, 116, 117, 135, 136, 137, 138,
                      ]?.some((num) => MapButtons?.includes(num)) && (
                          <RedirectWoDialog
                            header={"Redirect"}
                            control={control}
                            setValue={setValue}
                            register={register}
                            paragraph={""}
                            watch={watch}
                            errors={errors}
                            updateWOStatusInfra={updateWOStatusInfra}
                            MapButtons={MapButtons}
                            reasonList={reasonList}
                          />
                        )}

                      {/* new code writeen by priyanka */}
                      {[112]?.some((num) => MapButtons?.includes(num)) && (
                        <ProceedPTWDialog
                          header={"Submit for PTW Approval"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          cssStyle="Primary_Button mr-2"
                          headerText={"Confirm Submission for PTW Approval"}
                          paragraph={
                            "Are you sure you want to submit this Permit to Work for approval?"
                          }
                          sccusspara={
                            "Your request for PTW approval has been successfully submitted."
                          }
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                        />
                      )}

                      {[122]?.some((num) => MapButtons?.includes(num)) && (
                        <AddResolutionDialog
                          header={"Complete"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          paragraph={""}
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                          selectedDetails={selectedDetails}
                          DOC_LIST_DATA={docOption}
                          setTestingOnHold={setTestingOnHold}
                          docCancel={docCancel}
                          setdocCancel={setdocCancel}
                        />
                      )}
                      {[119]?.some((num) => MapButtons?.includes(num)) && (
                        <RequestResumeDialog
                          header={"Request for Resume"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          paragraph={
                            "Are you sure you want to resume this work order?"
                          }
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                        />
                      )}
                      {[130]?.some((num) => MapButtons?.includes(num)) && (
                        <AddResolutionDialog
                          header={"Submit for Closure"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          paragraph={""}
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                          selectedDetails={selectedDetails}
                          DOC_LIST_DATA={docOption}
                        />
                      )}
                      {/* pemding code for normalization form */}

                      {[125, 126]?.some((num) => MapButtons?.includes(num)) && (
                        <SplitButton
                          label={t("More Action")}
                          className="Secondary_SplitButton mr-2"
                          model={Actionitems}

                        />
                      )}
                      {visibleTestingOhHold === true
                        ? [125]?.some((num) => MapButtons?.includes(num)) && (
                          <>
                            <DeclinePTWDialog
                              header={"Testing On Hold"}
                              control={control}
                              setValue={setValue}
                              register={register}
                              paragraph={""}
                              watch={watch}
                              errors={errors}
                              Action_Code={MapButtons}
                              updateWOStatusInfra={updateWOStatusInfra}
                              setTestingOnHold={setTestingOnHold}
                              visibleTestingOhHold={visibleTestingOhHold}
                            />
                          </>
                        )
                        : ""}

                      {[128, 140, 142]?.some((num) =>
                        MapButtons?.includes(num)
                      ) && (
                          <DeclinePTWDialog
                            header={"Fail"}
                            control={control}
                            setValue={setValue}
                            register={register}
                            paragraph={
                              "The work order testing has been marked as failed."
                            }
                            watch={watch}
                            Action_Code={MapButtons}
                            errors={errors}
                            updateWOStatusInfra={updateWOStatusInfra}
                            setTestingOnHold={setTestingOnHold}
                          />
                        )}
                      {[127, 139, 141]?.some((num) =>
                        MapButtons?.includes(num)
                      ) && (
                          <PTWApprovalDialog
                            header={"Pass"}
                            control={control}
                            setValue={setValue}
                            register={register}
                            cssStyle="Primary_Button mr-2"
                            headerText={"Confirm Test Pass"}
                            paragraph={
                              "Are you sure you want to mark this work order as passed?"
                            }
                            sccusspara={
                              "Your approval has been updated successfully."
                            }
                            watch={watch}
                            errors={errors}
                            Action_Code={MapButtons}
                            updateWOStatusInfra={updateWOStatusInfra}
                          />
                        )}
                      {[123, 124]?.some((num) => MapButtons?.includes(num)) && (
                        <NormalizeToTest
                          header={"Normalize To Test"}
                          control={control}
                          setValue={setValue}
                          paragraph={""}
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                          Active_code={MapButtons}
                        />
                      )}
                      {/*  */}
                      {[131]?.some((num) => MapButtons?.includes(num)) && (
                        <DeclinePTWDialog
                          header={"Return For Edit"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          paragraph={
                            "Your request has been updated successfully."
                          }
                          watch={watch}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                          setTestingOnHold={setTestingOnHold}
                        />
                      )}
                      {[133]?.some((num) => MapButtons?.includes(num)) && (
                        <PTWApprovalDialog
                          header={"Proceed"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          cssStyle="Primary_Button mr-2"
                          headerText={"Confirm Closure"}
                          paragraph={
                            "Are you sure you want to submit this resolution and close the work order?"
                          }
                          sccusspara={
                            "Your request for closure has been successfully submitted."
                          }
                          watch={watch}
                          errors={errors}
                          Action_Code={MapButtons}
                          updateWOStatusInfra={updateWOStatusInfra}
                        />
                      )}
                      {[134]?.some((num) => MapButtons?.includes(num)) && (
                        <PTWApprovalDialog
                          header={"Close"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          cssStyle="Primary_Button mr-2"
                          headerText={"Confirm Closure"}
                          paragraph={
                            "Are you sure you want to close this work order?"
                          }
                          sccusspara={
                            "This work order has been successfully closed."
                          }
                          watch={watch}
                          Action_Code={MapButtons}
                          errors={errors}
                          updateWOStatusInfra={updateWOStatusInfra}
                        />
                      )}
                      <Buttons
                        label={"List"}
                        className=" Secondary_Button  me-2"
                        type="button"
                        name="LIST"
                        onClick={GetOpenList}
                      />

                      <Buttons
                        className="Report_Button me-2"
                        label={""}
                        // onClick={props?.isClick}
                        icon="pi pi-download"
                        onClick={() => {
                          handlerReport();
                        }}
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
              </Card>

              {selectedDetails?.IS_SHOW_ACTIVITY_BAR === 1 && (
                <ActivityTimeLineHeader statustimeLineDetails={selectedDetails} currentStatus={currentStatus} />
              )
              }
              <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div className="col-span-2 mt-2 woTabview">
                  <div className="woDetailTabview">
                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      <TabPanel headerTemplate={DetailsHeaderTemplate}>
                        <Card className="mt-2">
                          {selectedDetails?.PREVIOUS_ACTION === 121 && (
                            <div className="reviewContainer">
                              <div className="flex flex-wrap gap-3 justify-between">
                                <div className="flex flex-wrap gap-3">
                                  <img
                                    src={reviewIcon}
                                    alt=""
                                    className="w-auto h-10"
                                  />
                                  <div className="flex flex-wrap">
                                    <div className="ml-3">
                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        121 && (
                                          <label className="Text_Primary mb-2 Avatar_Initials">
                                            Resume Approval Request
                                          </label>
                                        )}

                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        121 && (
                                          <p
                                            className="Text_Primary Input_Text"
                                            data-pr-position="bottom"
                                          >
                                            The resume approval request has been
                                            declined.
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {selectedDetails?.PREVIOUS_ACTION === 121 && (
                                  <InfraSidebarVisibal
                                    header={"Redirect"}
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    Actioncode={MapButtons}
                                    btnText={"Review now"}
                                    updateWOStatusInfra={updateWOStatusInfra}
                                    MapButtons={MapButtons}
                                    selectedDetails={selectedDetails}
                                    subStatus={selectedDetails?.SUB_STATUS_DESC}
                                    setaddAssigneeAction={setaddAssigneeAction}
                                    setTestingOnHold={setTestingOnHold}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {(selectedDetails?.PREVIOUS_ACTION === 140 ||
                            selectedDetails?.PREVIOUS_ACTION === 128 ||
                            selectedDetails?.PREVIOUS_ACTION === 142) && (
                              <div className="reviewContainer">
                                <div className="flex flex-wrap gap-3 justify-between">
                                  <div className="flex flex-wrap gap-3">
                                    <img
                                      src={reviewIcon}
                                      alt=""
                                      className="w-auto h-10"
                                    />
                                    <div className="flex flex-wrap">
                                      <div className="ml-3">
                                        {(selectedDetails?.PREVIOUS_ACTION ===
                                          140 ||
                                          selectedDetails?.PREVIOUS_ACTION ===
                                          128 ||
                                          selectedDetails?.PREVIOUS_ACTION ===
                                          142) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              Testing Failed
                                            </label>
                                          )}

                                        {(selectedDetails?.PREVIOUS_ACTION ===
                                          140 ||
                                          selectedDetails?.PREVIOUS_ACTION ===
                                          128 ||
                                          selectedDetails?.PREVIOUS_ACTION ===
                                          142) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              data-pr-position="bottom"
                                            >
                                              The work order failed to meet the
                                              testing criteria.
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                  {(selectedDetails?.PREVIOUS_ACTION === 140 ||
                                    selectedDetails?.PREVIOUS_ACTION === 128 ||
                                    selectedDetails?.PREVIOUS_ACTION === 142) && (
                                      <InfraSidebarVisibal
                                        header={"Work Order"}
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                        Actioncode={MapButtons}
                                        btnText={"View Details"}
                                        updateWOStatusInfra={updateWOStatusInfra}
                                        MapButtons={MapButtons}
                                        selectedDetails={selectedDetails}
                                        subStatus={selectedDetails?.SUB_STATUS_DESC}
                                        setaddAssigneeAction={setaddAssigneeAction}
                                        setTestingOnHold={setTestingOnHold}
                                      />
                                    )}
                                </div>
                              </div>
                            )}

                          {selectedDetails?.PREVIOUS_ACTION === 113 && (
                            <div className="reviewContainer">
                              <div className="flex flex-wrap gap-3 justify-between">
                                <div className="flex flex-wrap gap-3">
                                  <img
                                    src={reviewIcon}
                                    alt=""
                                    className="w-auto h-10"
                                  />
                                  <div className="flex flex-wrap">
                                    <div className="ml-3">
                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        113 && (
                                          <label className="Text_Primary mb-2 Avatar_Initials">
                                            PTW Approval Request Declined
                                          </label>
                                        )}

                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        113 && (
                                          <p
                                            className="Text_Primary Input_Text"
                                            data-pr-position="bottom"
                                          >
                                            Review the comments and resubmit if
                                            needed.
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {selectedDetails?.PREVIOUS_ACTION === 113 && (
                                  <InfraSidebarVisibal
                                    header={"Work Order"}
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    Actioncode={MapButtons}
                                    btnText={"Review Now"}
                                    updateWOStatusInfra={updateWOStatusInfra}
                                    MapButtons={MapButtons}
                                    selectedDetails={selectedDetails}
                                    subStatus={selectedDetails?.SUB_STATUS_DESC}
                                    setaddAssigneeAction={setaddAssigneeAction}
                                    setTestingOnHold={setTestingOnHold}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {selectedDetails?.PREVIOUS_ACTION === 120 && (
                            <div className="reviewContainer">
                              <div className="flex flex-wrap gap-3 justify-between">
                                <div className="flex flex-wrap gap-3">
                                  <img
                                    src={reviewIcon}
                                    alt=""
                                    className="w-auto h-10"
                                  />
                                  <div className="flex flex-wrap">
                                    <div className="ml-3">
                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        120 && (
                                          <label className="Text_Primary mb-2 Avatar_Initials">
                                            Resume Approval Request
                                          </label>
                                        )}
                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        120 && (
                                          <p
                                            className="Text_Primary Input_Text"
                                            data-pr-position="bottom"
                                          >
                                            Review the comments and resubmit if
                                            needed.
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {selectedDetails?.PREVIOUS_ACTION === 120 && (
                                  <InfraSidebarVisibal
                                    header={"Work Order"}
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    Actioncode={MapButtons}
                                    btnText={"View Details"}
                                    updateWOStatusInfra={updateWOStatusInfra}
                                    MapButtons={MapButtons}
                                    selectedDetails={selectedDetails}
                                    subStatus={selectedDetails?.SUB_STATUS_DESC}
                                    setaddAssigneeAction={setaddAssigneeAction}
                                    setTestingOnHold={setTestingOnHold}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {selectedDetails?.PREVIOUS_ACTION === 125 && (
                            <div className="reviewContainer">
                              <div className="flex flex-wrap gap-3 justify-between">
                                <div className="flex flex-wrap gap-3">
                                  <img
                                    src={reviewIcon}
                                    alt=""
                                    className="w-auto h-10"
                                  />
                                  <div className="flex flex-wrap">
                                    <div className="ml-3">
                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        125 && (
                                          <label className="Text_Primary mb-2 Avatar_Initials">
                                            Testing On Hold
                                          </label>
                                        )}

                                      {selectedDetails?.PREVIOUS_ACTION ===
                                        125 && (
                                          <p
                                            className="Text_Primary Input_Text"
                                            data-pr-position="bottom"
                                          >
                                            The testing process has been
                                            temporarily paused.
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {selectedDetails?.PREVIOUS_ACTION === 125 && (
                                  <InfraSidebarVisibal
                                    header={"Work Order"}
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    Actioncode={MapButtons}
                                    btnText={"View Details"}
                                    updateWOStatusInfra={updateWOStatusInfra}
                                    MapButtons={MapButtons}
                                    selectedDetails={selectedDetails}
                                    subStatus={selectedDetails?.SUB_STATUS_DESC}
                                    setaddAssigneeAction={setaddAssigneeAction}
                                    setTestingOnHold={setTestingOnHold}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {[105, 114, 113, 115, 118, 120, 121, 141, 142]?.some(
                            (num) => MapButtons?.includes(num)
                          ) && (
                              <div className="reviewContainer">
                                <div className="flex flex-wrap gap-3 justify-between">
                                  <div className="flex gap-3 flex-wrap">
                                    <img
                                      src={reviewIcon}
                                      alt=""
                                      className="w-auto h-10"
                                    />
                                    <div className="flex flex-wrap">
                                      <div className="ml-3">
                                        {[113, 114, 115]?.some((num) =>
                                          MapButtons?.includes(num)
                                        ) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              PTW Approval Request
                                            </label>
                                          )}

                                        {[105]?.some((num) =>
                                          MapButtons?.includes(num)
                                        ) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              Reassignment Request
                                            </label>
                                          )}
                                        {[141, 142]?.some((num) =>
                                          MapButtons?.includes(num)
                                        ) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              Testing Suspended
                                            </label>
                                          )}
                                        {[118]?.some((num) =>
                                          MapButtons?.includes(num)
                                        ) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              Suspension Approval Request
                                            </label>
                                          )}
                                        {[120, 121]?.some((num) =>
                                          MapButtons?.includes(num)
                                        ) && (
                                            <label className="Text_Primary mb-2 Avatar_Initials">
                                              Resume Approval Request
                                            </label>
                                          )}

                                        {[113, 114, 115].some((num) =>
                                          MapButtons.includes(num)
                                        ) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              // data-pr-tooltip={remark}
                                              data-pr-position="bottom"
                                            >
                                              A new PTW approval request is awaiting
                                              for approval.
                                            </p>
                                          )}

                                        {[105].some((num) =>
                                          MapButtons.includes(num)
                                        ) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              // data-pr-tooltip={remark}
                                              data-pr-position="bottom"
                                            >
                                              A new reassignment request is pending.
                                            </p>
                                          )}
                                        {[141, 142].some((num) =>
                                          MapButtons.includes(num)
                                        ) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              // data-pr-tooltip={remark}
                                              data-pr-position="bottom"
                                            >
                                              Some related work orders are still
                                              active
                                            </p>
                                          )}
                                        {[118].some((num) =>
                                          MapButtons.includes(num)
                                        ) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              // data-pr-tooltip={remark}
                                              data-pr-position="bottom"
                                            >
                                              A new suspension approval request is
                                              awaiting for your approval.
                                            </p>
                                          )}
                                        {[120, 121].some((num) =>
                                          MapButtons.includes(num)
                                        ) && (
                                            <p
                                              className="Text_Primary Input_Text"
                                              // data-pr-tooltip={remark}
                                              data-pr-position="bottom"
                                            >
                                              A new resume approval request is
                                              awaiting for your approval.
                                            </p>
                                          )}
                                        {selectedDetails?.SUB_STATUS === "4" ||
                                          selectedDetails?.SUB_STATUS === "1" ? (
                                          <>
                                            <p className="Text_Primary Input_Text  ">
                                              {selectedDetails?.REASON_DESC}
                                            </p>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <InfraSidebarVisibal
                                    header={"Redirect"}
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    Actioncode={MapButtons}
                                    btnText={
                                      [141, 142].some((num) =>
                                        MapButtons.includes(num)
                                      )
                                        ? "View Work Orders"
                                        : "Review Now"
                                    }
                                    updateWOStatusInfra={updateWOStatusInfra}
                                    MapButtons={MapButtons}
                                    selectedDetails={selectedDetails}
                                    subStatus={selectedDetails?.SUB_STATUS_DESC}
                                    AssigneeList={techList}
                                    setTechList={setTechList}
                                    setAssigneeTechList={setAssigneeTechList}
                                    assigneeTechList={assigneeTechList}
                                    setSelectedTechList={setSelectedTechList}
                                    updateWoDetails={handleSubmit(
                                      updateWoDetails
                                    )}
                                    selectedTechList={selectedTechList}
                                    TEAM_NAME={selectedDetails?.TEAM_NAME}
                                    setaddAssigneeAction={setaddAssigneeAction}
                                    assigneeActionCode={assigneeActionCode}
                                    WOAcativeList={WOAcativeList}
                                    technicianList={technicianList}
                                    setTestingOnHold={setTestingOnHold}
                                  />
                                </div>
                              </div>
                            )}

                          <div className="flex flex-wrap justify-between mb-3">
                            <h6 className="Header_Text">Work Order Details</h6>
                            {/* PREVIOUS_ACTION */}
                            {currentStatus !== 5 &&
                              selectedDetails?.ISEDIT === 1 &&
                              selectedDetails?.PREVIOUS_ACTION === 0 && (
                                <Buttons
                                  className="Secondary_Button"
                                  label={"Edit"}
                                  icon="pi pi-pencil"
                                  onClick={() => onOpenEditDialog()}
                                />
                              )}
                            <Dialog
                              header="Edit Details"
                              visible={editDetails}
                              style={{ width: "900px" }}
                              className="editWoDialogBox"
                              onHide={() => onCancelEdit()}
                            >
                              <form>
                                <div className="grid grid-cols-1  gap-x-5 gap-y-6 md:grid-cols-3 lg:grid-cols-3 border-b-2 border-gray-200">
                                  <div className="col-span-2 pe-6 border-r-2 border-gray-200">
                                    <div className="mt-4">
                                      <label className="Text_Secondary Input_Label">
                                        Issue
                                      </label>
                                      <p className="Text_Primary Header_Text  ">
                                        {selectedDetails?.ISSUE_DESCRIPTION}
                                      </p>
                                    </div>
                                    <div className="mt-4">
                                      <Field
                                        controller={{
                                          name: "SEVERITY_CODE",
                                          control: control,
                                          render: ({ field }: any) => {
                                            return (
                                              <Select
                                                options={
                                                  masterList?.PRIORITYLIST
                                                }
                                                {...register("SEVERITY_CODE", {
                                                  required:
                                                    "Please fill the required fields",
                                                })}
                                                optionLabel="SEVERITY"
                                                label="Priority"
                                                require={true}
                                                findKey={"SEVERITY_ID"}
                                                filter={true}
                                                selectedData={
                                                  selectedDetails?.SEVERITY_CODE
                                                }
                                                setValue={setValue}
                                                invalid={errors.SEVERITY_CODE}
                                                {...field}
                                              />
                                            );
                                          },
                                        }}
                                      />
                                    </div>
                                    <div className="mt-4">
                                      <label className="Text_Secondary Input_Label">
                                        {t("Description (Max 400 characters)")}
                                        <span className="text-red-600"> *</span>
                                      </label>

                                      <Field
                                        controller={{
                                          name: "DESCRIPTION",
                                          control: control,
                                          render: ({ field }: any) => {
                                            return (
                                              <InputTextarea
                                                {...register("DESCRIPTION", {
                                                  required:
                                                    "please fill the required fields",

                                                  onChange: (e: any) =>
                                                    handleInputChange(e),
                                                })}
                                                rows={5}
                                                maxLength={400}
                                                invalid={errors.DESCRIPTION}
                                                setValue={setValue}
                                                className="resize-none"
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
                                        {t(
                                          `${Descriptionlength}/400 characters.`
                                        )}
                                      </label>
                                    </div>
                                    <div className="mt-4 mb-4">

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
                                        CancelData={CancelData}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <ShowEquipmentDetails assetTreeDetails={assetTreeDetails} isServiceRequest={true} isCardView={false} />
                                </div>

                                <div className="flex justify-end mt-4 gap-3 ">
                                  <Button
                                    name="Cancel"
                                    className="Cancel_Button "
                                    type="button"
                                    label={"Cancel"}
                                    onClick={() => onCancelEdit()}
                                  />
                                  {errors?.DESCRIPTION?.type === "required" ? (
                                    <Buttons
                                      disabled={IsSubmit}
                                      type="submit"
                                      className="Primary_Button  w-20 me-2"
                                      label={"Update"}
                                    />
                                  ) : (
                                    <>
                                      {IsSubmit === true ? (
                                        <Buttons
                                          disabled={IsSubmit}
                                          type="submit"
                                          className="Primary_Button  w-20 me-2"
                                          label={"Update"}
                                        />
                                      ) : (
                                        <SuccessDialog
                                          name="Update"
                                          header={"Update"}
                                          SuccessType={"WoUpdate"}
                                          control={control}
                                          setValue={setValue}
                                          register={register}
                                          paragraph={
                                            "This work order has been updated successfully."
                                          }
                                          watch={watch}
                                          errors={errors}
                                          updateWoDetails={handleSubmit(
                                            updateWoDetails
                                          )}
                                          IsSubmit={IsSubmit}
                                        />
                                      )}
                                    </>
                                  )}

                                </div>
                              </form>
                            </Dialog>
                          </div>
                          <WoDetails woDetails={selectedDetails} imageDocList={docOption ?? []} selectedPriorityIconName={selectedPriorityIconName} isloading={isloading} isInfraSerReq={false} />
                        </Card>
                        <ShowEquipmentDetails assetTreeDetails={assetTreeDetails} isServiceRequest={false} isCardView={true} />
                      </TabPanel>
                      {selectedDetails?.COMPLETED_AT && (
                        <TabPanel headerTemplate={MaterialHeaderTemplate}>
                          <Card className="mt-2">
                            {[131, 132, 148]?.some((num) =>
                              [selectedDetails.PREVIOUS_ACTION]?.includes(num)
                            ) &&
                              [132, 148]?.some((num) =>
                                MapButtons?.includes(num)
                              ) && (
                                <div className="reviewContainer">
                                  <div className="flex justify-between">
                                    <div className="flex flex-wrap">
                                      <img
                                        src={reviewIcon}
                                        alt=""
                                        className="w-auto h-10"
                                      />
                                      <div className="flex flex-wrap">
                                        <div className="ml-3">
                                          <label className="Text_Primary mb-2 Avatar_Initials">
                                            Edit Required
                                          </label>
                                          <p
                                            className="Text_Primary Input_Text"
                                            // data-pr-tooltip={remark}
                                            data-pr-position="bottom"
                                          >
                                            The resolution has been returned
                                            for adjustment.
                                          </p>

                                        </div>
                                      </div>
                                    </div>
                                    <InfraSidebarVisibal
                                      header={"Work order"}
                                      control={control}
                                      setValue={setValue}
                                      watch={watch}
                                      btnText="View Now"
                                      MapButtons={MapButtons}
                                      reassignVisible={reassignVisible}
                                      headerTemplate={selectedDetails?.STATUS_DESC}
                                      selectedDetails={selectedDetails}
                                      subStatus={selectedDetails?.SUB_STATUS_DESC}
                                      updateWOStatusInfra={updateWOStatusInfra}
                                      approvalStatus={approvalStatus}
                                      docOption={docOption}
                                      setTestingOnHold={setTestingOnHold}
                                    />
                                  </div>
                                </div>
                              )}

                            {selectedDetails?.ISADDRESOLUTION === 1 ? (
                              <div className="mt-2">
                                <h6 className="Header_Text">
                                  Resolution Details
                                </h6>
                                <NoItemToShow />
                              </div>
                            ) : (
                              <div>
                                <div className="flex flex-wrap justify-between">
                                  <h6 className="Header_Text">Resolution Details </h6>
                                  {selectedDetails?.ISEDITRESOLUTION == 1 && (
                                    <AddResolutionDialog
                                      header={"Edit Resolution"}
                                      control={control}
                                      setValue={setValue}
                                      register={register}
                                      paragraph={""}
                                      watch={watch}
                                      errors={errors}
                                      updateWOStatusInfra={
                                        updateWOStatusInfra
                                      }
                                      selectedDetails={selectedDetails}
                                      DOC_LIST_DATA={docOption}
                                      Actioncode={MapButtons}
                                    />
                                  )}
                                </div>
                                <ResolutionDetails resolutionDetails={selectedDetails} ImageDocList={docOption ?? []} isloading={isloading} />
                              </div>
                            )}
                          </Card>
                        </TabPanel>
                      )
                      }
                      <TabPanel headerTemplate={ActivityHeaderTemplate}>
                        <ActivityTimelinetable ActivityTimelineData={newtimelinelist} />
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
                <div className="mt-2">
                  <Card className="">
                    <div className="flex flex-wrap justify-between items-center">
                      <div >
                        <h6 className="Header_Text pb-2">
                          {("Assignees")} ({technicianList?.length})
                        </h6>
                      </div>
                      {currentStatus < 4 &&
                        selectedDetails?.ISGENERATE === 1 &&
                        selectedDetails?.PREVIOUS_ACTION !== 134 &&
                        !MapButtons.includes(101) &&
                        technicianList?.length > 0 && (
                          <AssignWoDialog
                            header={"Edit"}
                            cssClass={"Secondary_Button mr-2"}
                            control={control}
                            setData={setValue}
                            register={register}
                            paragraph={""}
                            watch={watch}
                            errors={errors}
                            TECH_ID={"TECH_ID"}
                            AssigneeList={techList}
                            setTechList={setTechList}
                            setAssigneeTechList={setAssigneeTechList}
                            assigneeTechList={assigneeTechList}
                            setSelectedTechList={setSelectedTechList}
                            updateWoDetails={handleSubmit(updateWoDetails)}
                            selectedTechList={selectedTechList}
                            TEAM_NAME={selectedDetails?.TEAM_NAME}
                            setaddAssigneeAction={setaddAssigneeAction}
                            technicianList={technicianList}
                          />
                        )}
                    </div>
                    <div>
                      <ShowAssigneeList assigneeList={technicianList} TeamName={selectedDetails?.TEAM_NAME} isInfraAssignee={true} />
                    </div>
                    <Dialog
                      header=""
                      visible={visible}
                      style={{ width: "550px" }}
                      className="dialogBoxStyle"
                      onHide={() => ClosePopUp()}
                    >
                      <form>
                        <div className="grid justify-items-center mb-3">
                          <div className="">
                            {
                              <img
                                src={success}
                                alt=""
                                height={60}
                                width={60}
                              />
                            }
                          </div>
                          <div className="mt-3">
                            <h6 className="Text_Primary text-center mb-3">
                              Success!
                            </h6>
                            <p className="Input_Text text-center">
                              {paragraph}
                            </p>
                          </div>
                        </div>
                      </form>
                    </Dialog>
                  </Card>
                </div>
              </div>
              <InfraSidebarStatus visible={sidebarVisible} setSidebarVisible={setSidebarVisible} sidebarDetails={selectedDetails} />
            </>
          </form>

          <Dialog
            header=""
            visible={visibleSucces}
            style={{ width: "550px" }}
            className="dialogBoxStyle"
            onHide={() => ClosePopUp()}
          >
            <form>
              <div className="grid justify-items-center mb-3">
                <div className="">
                  {<img src={success} alt="" height={60} width={60} />}
                </div>
                <div className="mt-3 ">
                  <h6 className="Text_Primary text-center mb-3">Success!</h6>
                  <p className="Input_Text text-center">
                    {"This work order has been updated successfully."}
                  </p>
                </div>
              </div>
            </form>
          </Dialog>
          <Dialog
            header=""
            visible={visibleSuccesReport}
            style={{ width: "80vw" }}
            onHide={() => CloseReportPopUp()}
          >
            <>
              <PdfReport />
            </>
          </Dialog>
        </section>
      )}
    </>
  );
};
export default InfraWorkOrderForm;
