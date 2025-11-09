import { Card } from "primereact/card";
import { useEffect, useState, memo } from "react";
import { useForm } from "react-hook-form";
import "../../Dashboard/Dashboard.css";
import { Tooltip } from "primereact/tooltip";
import { TabView, TabPanel, TabPanelHeaderTemplateOptions, } from "primereact/tabview";
import "./WorkorderMaster.css";
import noDataIcon from "../../../assest/images/nodatafound.png";
import reviewIcon from "../../../assest/images/IconContainer.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Field from "../../../components/Field";
import InputField from "../../../components/Input/Input";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import Buttons from "../../../components/Button/Button";
import Select from "../../../components/Dropdown/Dropdown";
import { dateFormat, formateDate, isAws, LOCALSTORAGE, onlyDateFormat, saveTracker, } from "../../../utils/constants";
import WORedirectDialogBox from "../../../components/WorkorderDialogBox/WORedirectDialogBox";
import { Badge } from "primereact/badge";
import moment from "moment";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import SidebarVisibal from "./SidebarVisibal";
import { v4 as uuidv4 } from "uuid";
import WorkOrderDialogBox from "../../../components/DialogBox/WorkOrderDalog"
import { Dialog } from "primereact/dialog";
import { helperEventNotification } from "../../../utils/eventNotificationParameter";

import { decryptData } from "../../../utils/encryption_decryption";
import LoaderFileUpload from "../../../components/Loader/LoaderFileUpload";
import ReopenDialogBox from "../../../components/DialogBox/ReopenDialogBox";
import { MultiSelect } from "primereact/multiselect";
import ImageGalleryComponent from "../ImageGallery/ImageGallaryComponent";
import { clearFilters } from "../../../store/filterstore";
import { useDispatch } from "react-redux";
import { ActivityTimelineRE } from "./WorkOrderHelperRE.tsx/ActivityTimelineRE";
import { ShowAssigneeList } from "./InfraWorkrderHelper/ShowAssigneeList";
import { ReporterDetails } from "./WorkOrderHelperRE.tsx/ReporterDetails";
import { RectifiedDetails } from "./WorkOrderHelperRE.tsx/RectifiedDetails";
import { CompletedDetails } from "./WorkOrderHelperRE.tsx/CompletedDetails";
import { TimelineHeaderRE } from "./WorkOrderHelperRE.tsx/TimelineHeaderRE";
import { AcceptedDetails } from "./WorkOrderHelperRE.tsx/AcceptedDetails";
import { EquipmentSummaryDetails } from "./WorkOrderHelperRE.tsx/EquipmentSummaryDetails";
import { SLATimeDuration } from "./WorkOrderHelperRE.tsx/SLATimeDuration";
import NoItemToShow from "./InfraWorkrderHelper/NoItemToShow";
import {taskDetails, docType, FormValues} from "./Utils/helper"
import { helperAwsFileupload, helperGetWorkOrderAwsDoclist } from "../ServiceRequest/utils/helperAwsFileupload";
let WO_ID: number;
const WorkOrderDetailForm = (props: any) => {
  const dispatch = useDispatch();
  const location: any = useLocation();
  const navigate: any = useNavigate();
  const { t } = useTranslation();
  const { search } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  let { pathname } = useLocation();
  const [selectedFacility, menuList]: any = useOutletContext();
  const id: any = decryptData(localStorage.getItem("USER_ID"));
  const [facilityStatus, setFacilityStatus] = useState<any | null>(null);
  const [isloading, setisloading] = useState<any | null>(false);
  const [DocTitle, setDocTitle] = useState<any | null>("");
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];
  // const [masterListOption, setMasterListOption] = useState<any | null>([]);
  const [docOption, setDocOption] = useState<any | null>([]);
  const [selectedDetails, setSelectedDetails] = useState<any>([]);
  const [technicianList, setTechnicianList] = useState<any | null>([]);
  const [ReassignList, setReassignList] = useState<any | null>([]);
  const [timelineList, setTimelineList] = useState<any | null>([]);
  const [taskList, setTaskList] = useState<any | null>([]);
  const [EditTaskList, setEditTaskList] = useState<any | null>([]);
  const [assetDocList, setAssetDocList] = useState<any | null>([]);
  const [locationStatus, setLocationStatus] = useState<any | null>(false);
  const [options, setOptions] = useState<any | null>([]);
  const [loading, setLoading] = useState<any | null>(false);
  const [status, setStatus] = useState<any | null>(false);
  const [currentStatus, setCurrentStatus] = useState<any | null>();
  const [IsVisibleMaterialReqSideBar, setVisibleMaterialReqSideBar] =
    useState<boolean>(false);
  const [signatureDoc, setSignatureDoc] = useState<any | null>([]);
  const [materiallist, setMaterialRequest] = useState<any | null>([]);
  const [asssetGroup, setasssetGroup] = useState<any | null>();
  const [asssetType, setasssetType] = useState<any | null>();
  const [asssetName, setasssetName] = useState<any | null>();
  const [issueName, setissueName] = useState<any | null>();
  const [partMatOptions, setMaterialPartOptions] = useState<any | null>([]);
  let [imgSrc, setImgSrc] = useState<any | null>();
  const [subStatus, setSubStatus] = useState<any | null>();
  const [approvalStatus, setApprovalStatus] = useState<any | null>(false);
  const [editStatus, setEditStatus] = useState<any | null>(false);
  let [locationtypeOptions, setlocationtypeOptions] = useState([]);
  const [EquipmentGroup, setEquipmentGroup] = useState<any | null>([]);
  const [type, setType] = useState<any | null>([]);
  const [assetList, setAssetList] = useState<any | null>([]);
  const [reassignVisible, setReassignVisible] = useState<boolean>(false);
  const [localGroupId, setLocalGroupID] = useState<any | null>("");
  const [localAssetTypeId, setLocalAssetTypId] = useState<any | null>("");
  const [localAssetId, setLocalAssetId] = useState<any | null>("");
  const [localRequestId, setLocalRequestId] = useState<any | null>("");
  const [visibleImage, setVisibleImage] = useState<boolean>(false);
  const [ViewAddTask, SetViewAddTask] = useState<boolean>(false);
  const [statusButton, setStatusButton] = useState<any | null>(null);
  const [showImage, setShowImage] = useState<any>([]);
  const [showReassingList, setShowReassingList] = useState<any | null>(true);
  const [IsSubmit, setIsSubmit] = useState<any | null>(false);
  const [taskName, setTaskName] = useState<any | null>("");
  const [issueList, setIssueList] = useState<any | null>([]);
  const [docName, setdocName] = useState<any | null>();
  const [salcedorecedetails, setsalcedorecedetails] = useState<any | null>([]);
  const [assignStatus, setAssignStatus] = useState<any | null>(false);
  const [ackStatus, setAckStatus] = useState<any | null>(false);
  const onCategoryChange = (e: any) => {
    const updatedTasklistOptions = taskList?.map((task: any, index: any) => {
      if (index === e.value) {
        task.isChecked = e.checked === true ? 1 : 0;
      }
      return task;
    });
    setTaskList(updatedTasklistOptions);
    setEditTaskList(updatedTasklistOptions);
    setValue("TASKDETAILS", updatedTasklistOptions);
  };
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
      TASK_NAME: "",
    },
    mode: "all",
  });
  const partWatch: any = watch("PARTS_TYPE");
  const partListWatch: any = watch("PART_LIST");
  let doclistWatch: any = watch("DOC_LIST");
  const watchAll: any = watch();
  const eventNotification = async () => {
    const payload: any = { WO_ID: localStorage.getItem("WO_ID") };

    try {
      const res: any = await callPostAPI(
        ENDPOINTS.GET_WORKORDER_DETAILS,
        payload,
        "HD001"
      );

      if (res?.FLAG === 1) {
        const notifcation: any = {
          FUNCTION_CODE: currentMenu?.FUNCTION_CODE,
          WO_NO: res?.WORKORDERDETAILS[0]?.WO_NO,

          EVENT_TYPE: "W",
          STATUS_CODE: res?.WORKORDERDETAILS[0]?.CURRENT_STATUS,
          PARA1:
            search === "?edit="
              ? decryptData(localStorage.getItem("USER_NAME"))
              : decryptData(localStorage.getItem("USER_NAME")),
          PARA2: res?.WORKORDERDETAILS[0]?.WO_NO,
          PARA3:
            res?.WORKORDERDETAILS[0]?.WO_DATE === null
              ? ""
              : onlyDateFormat(res?.WORKORDERDETAILS[0]?.WO_DATE),
          PARA4: res?.WORKORDERDETAILS[0]?.USER_NAME,
          PARA5: res?.WORKORDERDETAILS[0]?.LOCATION_DESCRIPTION,
          PARA6: res?.WORKORDERDETAILS[0]?.ASSET_NAME,
          PARA7: res?.WORKORDERDETAILS[0]?.REQ_DESC,
          PARA8: res?.WORKORDERDETAILS[0]?.SEVERITY_DESC,
          PARA9:
            res?.WORKORDERDETAILS[0]?.REPORTED_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.REPORTED_AT)
              : "",
          PARA10:
            res?.WORKORDERDETAILS[0]?.ACKNOWLEDGED_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.ATTEND_AT)
              : "",
          PARA11:
            res?.WORKORDERDETAILS[0]?.ATTEND_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.ATTEND_AT)
              : "",
          PARA12:
            res?.WORKORDERDETAILS[0]?.RECTIFIED_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.RECTIFIED_AT)
              : "",
          PARA13:
            res?.WORKORDERDETAILS[0]?.COMPLETED_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.COMPLETED_AT)
              : "",
          PARA14:
            res?.WORKORDERDETAILS[0]?.CANCELLED_AT !== null
              ? formateDate(res?.WORKORDERDETAILS[0]?.CANCELLED_AT)
              : "",
          PARA15: "", //updated
          PARA16: res?.WORKORDERDETAILS[0]?.ACKNOWLEDGED_BY_NAME,
          PARA17: "", //attendBy
          PARA18: res?.WORKORDERDETAILS[0]?.RECTIFIED_BY_NAME,
          PARA19: res?.WORKORDERDETAILS[0]?.COMPLETED_BY_NAME,
          PARA20: res?.WORKORDERDETAILS[0]?.CANCELLED_BY_NAME, //cancelled BY
          PARA21: "", //approve on
          PARA22: "", //approve by,
          PARA23: "", //denied on,
          PARA24: "", //denied by
        };

        const eventPayload = { ...eventNotification, ...notifcation };

        await helperEventNotification(eventPayload);
      }
    } catch (error: any) { }
  };

  function base64ToFile(base64: string, fileName: string, mimeType?: string): File {
  const bstr = atob(base64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], fileName, { type: mimeType });
}

  const handlingStatus = async (
    eventNotificationStatus?: any,
    e?: any,
    REMARK?: string | undefined,
    statusCode?: any,
    type?: any,
    REASON_ID?: any,
    sigPad?: any,
    VERIFY_BY?: any,
    RECT_ID?: any
  ) => {
    let isValid: any = true;
    let eventType: any = "";
    let eventPara: any = "";
    let TYPE: any = "";
    let result:any="";
    if (REMARK === "CANCELLED" || type === "") {
      eventType = "CANCELLED";
      eventPara = { para1: `Redirect Request`, para2: "Cancelled" };
    } else if (REMARK === "APPROVE" || type === "") {
      eventType = "APPROVE";
      eventPara = { para1: `Redirect Request`, para2: "Approved" };
      setApprovalStatus(false);
    } else if (REMARK === "Acknowledge" || type === "") {
      setAckStatus(true);
      eventType = "ATT";
      TYPE = "34";
      eventPara = { para1: `Work order`, para2: "Acknowledged" };
      // setIsSubmit(false)
    } else if (REMARK === "WIP" || type === "") {
      eventType = "ATT";
      eventPara = { para1: `Work order`, para2: "is in Progress" };
    } else if (id === "CANCEL" || type === "CANCEL") {
      eventType = "CANCEL";
      eventPara = { para1: `Work order`, para2: "Cancelled" };
    } else if (id === "RCT" || type === "RCT") {
      setIsSubmit(true);
      eventType = "RCT";

      eventPara = { para1: `Work order`, para2: "Rectified" };
    } else if (id === "onHold" || type === "HOLD") {
      eventType = "HOLD";
      eventPara = { para1: `Work order`, para2: "status Changed on hold" };
    } else if (id === "Complete" || type === "Complete") {
      if (sigPad !== "") {
        eventType = "COMP";
        eventPara = { para1: `Work order`, para2: "Completed" };
         result =isAws === true ? base64ToFile(sigPad, "DigitalSignatue"):sigPad?.split("image/png;base64,")[1];
        isValid = true;
      } else {
        isValid = false;
        toast.error("Please select digital signature ");
      }
    }
    if (REMARK === "CONTINUE" || type === "CONTINUE") {
      eventType = "CONTINUE";
      eventPara = {
        para1: `Work Order`,
        para2: "Status Changed To Work In Progress",
      };
      setIsSubmit(true);
    }

  

    
    const payloadDoc: any = {
      DOC_SRNO: 1,
      DOC_NAME: "Digital_Sign" + WO_ID,
      DOC_DATA: result,
      DOC_EXTENTION: "image/png",
      DOC_SYS_NAME: uuidv4(),
      ISDELETE: false,
      DOC_TYPE: "D",
    };
    //const signData =[...signatureDoc, payloadDoc];

    let docfilterList: any = [];
    if (doclistWatch && doclistWatch?.length > 0) {
      docfilterList = doclistWatch?.filter(
        (doc: any) => doc.UPLOAD_TYPE === "A" || doc.UPLOAD_TYPE === "B"
      );
    }
       
    const payload: any = {
      ACTIVE: 1,
      WO_ID: selectedDetails?.WO_ID,
      WO_NO: selectedDetails?.WO_NO,
      MATREQ_NO: props?.selectedData?.MATREQ_NO,
      MODE: "A",
      EVENT_TYPE: eventType,
      REMARKS:
        REMARK === "Acknowledge" || REMARK === "CONTINUE"
          ? ""
          : REMARK !== "" || REMARK !== undefined
            ? REMARK
            : "",
      SUB_STATUS: selectedDetails?.SUB_STATUS,
      DOC_LIST: currentStatus === 4 ? [payloadDoc] : docfilterList,
      DOC_DATE: moment(new Date()).format("DD-MM-YYYY"),
      REASON_ID: selectedDetails?.REASON_ID,
      TYPE: TYPE,
      PARA: eventPara,
      APPROVAL_TYPE: "R",
      VERIFY_BY: VERIFY_BY !== "" || VERIFY_BY !== undefined ? VERIFY_BY : "",
      REASSIGN_TYPE: currentStatus === 1 ? "B" : "",
      RECT_ID:
        selectedDetails?.RECT_ID !== null ? selectedDetails?.RECT_ID : RECT_ID,
    };
    console.log("payload", payload);
 
    try {
      if (isValid === true) {
        const res = await callPostAPI(
          ENDPOINTS.SET_WORKSTATUS_Api,
          payload,
          "HD001"
        );
        setValue("TASK_NAME", "");

        if (res.FLAG === true) {
          if(payload?.DOC_LIST.length>0 && isAws === true){
          
          helperAwsFileupload(payload?.DOC_LIST)
          }
          toast.success(res?.MSG);
          if (REMARK === "Acknowledge" || REMARK === "CONTINUE") {
            setIsSubmit(false);
            await getOptions();
          } else {
            setIsSubmit(false);
            await getOptionDetails(WO_ID);
          }
          if (eventNotificationStatus === true) {
            await eventNotification();
          }
          // props?.getAPI();
          await getDocmentList(WO_ID);
          if (id === "CANCEL") {
            props?.isClick();
          }
        } else {
          toast.error(res?.MSG);
        }
      }
    } catch (error: any) {
      toast(error);
    } finally {
      if (REMARK === "Acknowledge" || type === "CONTINUE") {
        setIsSubmit(false);
      }
    }
  };

  useEffect(() => {
    if (location?.state !== null) {
      (async function () {
        let WO_ID = localStorage.getItem("WO_ID");
        await getOptionDetails(WO_ID);
      })();
    }
  }, [location?.state])


  const formatServiceRequestList = (list: any) => {
    let WORK_ORDER_LIST = list;

    WORK_ORDER_LIST = WORK_ORDER_LIST.map((element: any) => {
      return {
        ...element,
      };
    });
    return WORK_ORDER_LIST;
  };

  const getOptionDetails = async (WO_ID: any, reponseData?: any) => {
    const payload: any = { WO_ID: WO_ID };
    setLoading(true);
    try {
      let res: any = await callPostAPI(
        ENDPOINTS.GET_WORKORDER_DETAILS,
        payload,
        "HD001"
      );

      if (res && res.FLAG === 1) {
        setLocalGroupID(res?.WORKORDERDETAILS[0]?.ASSETGROUP_ID);
        setLocalAssetTypId(res?.WORKORDERDETAILS[0]?.ASSETTYPE_ID);
        setLocalAssetId(res?.WORKORDERDETAILS[0]?.ASSET_ID);
        setLocalRequestId(res?.WORKORDERDETAILS[0]?.REQ_ID);
        setSelectedDetails(res?.WORKORDERDETAILS[0]);
        if (locationStatus === false) {
          const res1 = await callPostAPI(
            ENDPOINTS.LOCATION_HIERARCHY_LIST,
            null,
            "HD001"
          );

          if (res1?.FLAG === 1) {
            const location: any = res1?.LOCATIONHIERARCHYLIST.map((f: any) => ({
              LOCATIONTYPE_ID: f?.LOCATIONTYPE_ID,
              LOCATIONTYPE_NAME: f?.LOCATIONTYPE_NAME,
              LOCATION_DESCRIPTION:
                f?.LOCATION_DESCRIPTION && f?.LOCATION_DESCRIPTION.trim() !== ""
                  ? f?.LOCATION_DESCRIPTION
                  : "no label",
              LOCATION_ID: f?.LOCATION_ID,
              LOCATION_NAME: f?.LOCATION_NAME,
            }));
            setlocationtypeOptions(location);
          }
        }
        if (
          res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 1 ||
          res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 3
        ) {
          try {
            const payload: any = {
              ASSETGROUP_ID: res?.WORKORDERDETAILS[0]?.ASSETGROUP_ID,
              ASSET_NONASSET: res?.WORKORDERDETAILS[0]?.ASSET_NONASSET,
            };

            const res1 = await callPostAPI(
              ENDPOINTS.GET_SERVICEREQUEST_WORKORDER,
              payload,
              null
            );

            if (res?.FLAG === 1) {
              setIssueList(res1?.WOREQLIST);
            } else {
              setIssueList(res1?.WOREQLIST);
            }
          } catch (error: any) {
          } finally {
          }
        }

        setTechnicianList(res?.ASSIGNTECHLIST);
        setTimelineList(res?.ACTIVITYTIMELINELIST);
        setStatus(res?.WORKORDERDETAILS[0]?.STATUS_DESC);
        setCurrentStatus(res?.WORKORDERDETAILS[0]?.CURRENT_STATUS)
        setValue("WORK_ORDER_NO", res?.WORKORDERDETAILS[0]?.WO_NO);
        setValue("WO_TYPE", res?.WORKORDERDETAILS[0]?.WO_TYPE);
        setValue("RAISED_BY", res?.WORKORDERDETAILS[0]?.USER_NAME);
        setValue("LOCATION_NAME", res?.WORKORDERDETAILS[0]?.LOCATION_NAME);
        setValue(
          "LOCATION_DESCRIPTION",
          res?.WORKORDERDETAILS[0]?.LOCATION_DESCRIPTION
        );

        setasssetGroup(res?.WORKORDERDETAILS[0]?.ASSETGROUP_ID);
        setasssetType(res?.WORKORDERDETAILS[0]?.ASSETTYPE_ID);
        setasssetName(res?.WORKORDERDETAILS[0]?.ASSET_ID);
        setissueName(res?.WORKORDERDETAILS[0]?.REQ_ID);
        setValue(
          "WO_DATE",
          moment(res?.WORKORDERDETAILS[0]?.WO_DATE).format(dateFormat())
        );
        setOptions({
          assetGroup: reponseData?.ASSETGROUPLIST?.filter(
            (f: any) =>
              f.ASSETGROUP_TYPE === res?.WORKORDERDETAILS[0]?.ASSET_NONASSET
          ),
          assetType: reponseData?.ASSETTYPELIST,
          assestOptions: reponseData?.ASSETLIST,
          teamList: reponseData?.TEAMLIST,
          vendorList: reponseData?.VENDORLISTLIST,
          technicianList: reponseData?.USERLIST,
          statusList: reponseData?.STATUSLIST,
          reasonList: reponseData?.REASONLIST,
        });
        setEquipmentGroup(
          reponseData?.ASSETGROUPLIST?.filter(
            (f: any) =>
              f.ASSETGROUP_TYPE === res?.WORKORDERDETAILS[0]?.ASSET_NONASSET
          )
        );
        setValue("REQ_DESC", res?.WORKORDERDETAILS[0]?.REQ_DESC);
        setValue("WO_REMARKS", res?.WORKORDERDETAILS[0]?.WO_REMARKS);
        setValue("SEVERITY_DESC", res?.WORKORDERDETAILS[0]?.SEVERITY_DESC);
        setValue("TEAM_NAME", res?.WORKORDERDETAILS[0]?.TEAM_NAME);
        setValue("ASSET_NAME", res?.WORKORDERDETAILS[0]?.ASSET_NAME);
        setValue("TECH_NAME", res?.WORKORDERDETAILS[0]?.TECH_NAME);
        setValue("DOC_LIST", res?.WORKORDERDOCLIST);
        setValue("ASSET_NONASSET", res?.WORKORDERDETAILS[0]?.ASSET_NONASSET);
        setValue("ASSETGROUP_NAME", res?.WORKORDERDETAILS[0]?.ASSETGROUP_NAME);
        setValue("ASSETTYPE_NAME", res?.WORKORDERDETAILS[0]?.ASSETTYPE_NAME);

        let req = res?.WORKORDERDETAILS[0]?.REQ_ID;
        setValue("REQ_ID", req);
        await getTaskList(
          res?.WORKORDERDETAILS[0]?.ASSETTYPE_ID,
          res?.WORKORDERDETAILS[0]?.WO_ID,
          res?.WORKORDERTASKLIST
        );
        setSubStatus(res?.WORKORDERDETAILS[0]?.SUB_STATUS);
        if (
          (res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 5 &&
            decryptData(localStorage.getItem("ROLETYPECODE")) === "SA") ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "S" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "BM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SA" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "S" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "BM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SM"
        ) {
          setApprovalStatus(true);
        }

        if (res?.WORKORDERDETAILS[0]?.CURRENT_STATUS >= 3) {
          const payload: any = {
            MATREQ_ID: res?.WORKORDERDETAILS[0]?.MATREQ_ID,
            MATREQ_NO: res?.WORKORDERDETAILS[0]?.MATREQ_NO,
            WO_ID: WO_ID,
            TYPE: "W",
          };
          try {
            const res1 = await callPostAPI(
              ENDPOINTS.GET_MATERIAL_REQUISITION_DETAILS,
              payload,
              "HD001"
            );
            let PART_LIST = res1?.PARTLIST;
            let SAMPEL_PART_LIST = res1?.PARTLIST;

            let MAT_REQUISITION_DETAILS = res1?.MATREQUISITIONDETAILS.map(
              (item: any) => ({
                ...item,
                MATREQ_NO: res1?.MATREQUISITIONDETAILS[0]?.MATREQ_NO,
              })
            );

            let CHECK_PART_LIST = [];
            for (let i = 0; i < SAMPEL_PART_LIST.length; i++) {
              const item = SAMPEL_PART_LIST[i];
              if (item.STATUS !== 8) {
                CHECK_PART_LIST.push(item);
              }
            }
            setMaterialPartOptions(PART_LIST);
            setMaterialRequest(MAT_REQUISITION_DETAILS);
            setLoading(false);
          } catch (error: any) {
            toast.error(error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getOptionDetailsOverdue = async (WO_ID: any, reponseData?: any) => {
    const payload: any = {
      WO_ID: WO_ID == null ? localStorage.getItem("WO_ID") : WO_ID,
    };
    try {
      let res: any = await callPostAPI(
        ENDPOINTS.GET_WORKORDER_DETAILS,
        payload,
        "HD001"
      );

      if (res?.FLAG === 1) {
        props?.getAPI();
        if (
          res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 1 ||
          res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 3
        ) {
          try {
            const payload: any = {
              ASSETGROUP_ID: res?.WORKORDERDETAILS[0]?.ASSETGROUP_ID,
              ASSET_NONASSET: res?.WORKORDERDETAILS[0]?.ASSET_NONASSET,
            };

            const res1 = await callPostAPI(
              ENDPOINTS.GET_SERVICEREQUEST_WORKORDER,
              payload,
              null
            );

            if (res?.FLAG === 1) {
              setIssueList(res1?.WOREQLIST);
            } else {
              setIssueList(res1?.WOREQLIST);
            }
          } catch (error: any) {
          } finally {
          }
        }

        setTechnicianList(res?.ASSIGNTECHLIST);
        setTimelineList(res?.ACTIVITYTIMELINELIST);
        const updatedServiceRequestList: any = formatServiceRequestList(
          res?.WORKORDERDETAILS
        );
        setSelectedDetails(updatedServiceRequestList[0]);

        setStatus(res?.WORKORDERDETAILS[0]?.STATUS_DESC);
        setCurrentStatus(res?.WORKORDERDETAILS[0]?.CURRENT_STATUS);
        setValue("WORK_ORDER_NO", res?.WORKORDERDETAILS[0]?.WO_NO);
        setValue("WO_TYPE", res?.WORKORDERDETAILS[0]?.WO_TYPE);
        setValue("RAISED_BY", res?.WORKORDERDETAILS[0]?.USER_NAME);
        setValue("LOCATION_NAME", res?.WORKORDERDETAILS[0]?.LOCATION_NAME);
        setValue(
          "LOCATION_DESCRIPTION",
          res?.WORKORDERDETAILS[0]?.LOCATION_DESCRIPTION
        );

        setValue(
          "WO_DATE",
          moment(res?.WORKORDERDETAILS[0]?.WO_DATE).format(dateFormat())
        );
        setOptions({
          assetGroup: reponseData?.ASSETGROUPLIST?.filter(
            (f: any) =>
              f.ASSETGROUP_TYPE === res?.WORKORDERDETAILS[0]?.ASSET_NONASSET
          ),
          assetType: reponseData?.ASSETTYPELIST,
          assestOptions: reponseData?.ASSETLIST,
          teamList: reponseData?.TEAMLIST,
          vendorList: reponseData?.VENDORLISTLIST,
          technicianList: reponseData?.USERLIST,
          statusList: reponseData?.STATUSLIST,
          reasonList: reponseData?.REASONLIST,
        });
        setEquipmentGroup(
          reponseData?.ASSETGROUPLIST?.filter(
            (f: any) =>
              f.ASSETGROUP_TYPE === res?.WORKORDERDETAILS[0]?.ASSET_NONASSET
          )
        );
        setType(reponseData?.ASSETTYPELIST);
        setValue("REQ_DESC", res?.WORKORDERDETAILS[0]?.REQ_DESC);
        setValue("WO_REMARKS", res?.WORKORDERDETAILS[0]?.WO_REMARKS);
        setValue("SEVERITY_DESC", res?.WORKORDERDETAILS[0]?.SEVERITY_DESC);
        setValue("TEAM_NAME", res?.WORKORDERDETAILS[0]?.TEAM_NAME);
        setValue("ASSET_NAME", res?.WORKORDERDETAILS[0]?.ASSET_NAME);
        setValue("TECH_NAME", res?.WORKORDERDETAILS[0]?.TECH_NAME);
        setValue("DOC_LIST", res?.WORKORDERDOCLIST);
        setValue("ASSET_NONASSET", res?.WORKORDERDETAILS[0]?.ASSET_NONASSET);
        setValue("ASSETGROUP_NAME", res?.WORKORDERDETAILS[0]?.ASSETGROUP_NAME);
        setValue("ASSETTYPE_NAME", res?.WORKORDERDETAILS[0]?.ASSETTYPE_NAME);
        let req = res?.WORKORDERDETAILS[0]?.REQ_ID;
        setValue("REQ_ID", req);
        await getTaskList(
          res?.WORKORDERDETAILS[0]?.ASSETTYPE_ID,
          res?.WORKORDERDETAILS[0]?.WO_ID,
          res?.WORKORDERTASKLIST
        );

        setSubStatus(res?.WORKORDERDETAILS[0]?.SUB_STATUS);

        if (
          (res?.WORKORDERDETAILS[0]?.CURRENT_STATUS === 5 &&
            decryptData(localStorage.getItem("ROLETYPECODE")) === "SA") ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "S" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "BM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SA" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "S" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "BM" ||
          decryptData(localStorage.getItem("ROLETYPECODE")) === "SM"
        ) {
          setApprovalStatus(true);
        }
        if (res?.WORKORDERDETAILS[0]?.CURRENT_STATUS >= 3) {
          const payload: any = {
            MATREQ_ID: res?.WORKORDERDETAILS[0]?.MATREQ_ID,
            MATREQ_NO: res?.WORKORDERDETAILS[0]?.MATREQ_NO,
            WO_ID: WO_ID,
            TYPE: "W",
          };
          try {
            const res1 = await callPostAPI(
              ENDPOINTS.GET_MATERIAL_REQUISITION_DETAILS,
              payload,
              "HD001"
            );
            let PART_LIST = res1?.PARTLIST;
            let SAMPEL_PART_LIST = res1?.PARTLIST;

            let MAT_REQUISITION_DETAILS = res1?.MATREQUISITIONDETAILS.map(
              (item: any) => ({
                ...item,
                MATREQ_NO: res1?.MATREQUISITIONDETAILS[0]?.MATREQ_NO,
              })
            );

            let CHECK_PART_LIST = [];
            for (let i = 0; i < SAMPEL_PART_LIST.length; i++) {
              const item = SAMPEL_PART_LIST[i];
              if (item.STATUS !== 8) {
                CHECK_PART_LIST.push(item);
              }
            }

            setMaterialPartOptions(PART_LIST);
            setMaterialRequest(MAT_REQUISITION_DETAILS);
            setLoading(false);
          } catch (error: any) {
            toast.error(error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getTaskList = async (
    ASSETTYPE_ID: any,
    WO_ID: any,
    WORKORDERTASKLIST: any
  ) => {
    const payload = {
      ASSETTYPE_ID: ASSETTYPE_ID,
      WO_ID: WO_ID,
    };

    try {
      const res = await callPostAPI(ENDPOINTS.TASK_LIST, payload, "HD001");
      if (WORKORDERTASKLIST?.length > 0) {
        const workOrderTaskMap = WORKORDERTASKLIST.reduce(
          (map: any, task: any) => {
            if (task?.TASK_ID === 0 || task.isChecked === 1) {
              map[task.TASK_ID] = task.isChecked;
            }
            return map;
          },
          {}
        );

        const updatedTaskList = [
          ...res?.TASKLIST?.map((task: any) => ({
            ...task,
            isChecked: workOrderTaskMap.hasOwnProperty(task.TASK_ID)
              ? workOrderTaskMap[task.TASK_ID]
              : task.isChecked,
          })),
          ...WORKORDERTASKLIST.filter(
            (task: any) => task.TASK_ID === 0 || task.isChecked === 1
          )
            .filter(
              (task: any) =>
                !res?.TASKLIST?.some((t: any) => t.TASK_ID === task?.TASK_ID)
            )
            .map((task: any) => ({
              TASK_ID: task?.TASK_ID,
              TASK_NAME: task?.TASK_DESC,
              FACILITY_ID: task?.FACILITY_ID,
              ASSETTYPE_ID: task?.ASSETTYPE_ID,
              ACTIVE: true,
              isChecked: task.isChecked,
            })),
        ];
        const sortedTasks = updatedTaskList.sort(
          (a: any, b: any) => b.isChecked - a.isChecked
        );

        setTaskList(sortedTasks);
        setEditTaskList(sortedTasks);
      } else {
        setTaskList(res?.TASKLIST);
        setEditTaskList(res?.TASKLIST);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    (async function () {
      if (options?.assetGroup !== undefined) {
        setEquipmentGroup(options?.assetGroup);
      }

      if (watchAll?.ASSETGROUP_ID) {
        const assetGroupId: any = watchAll?.ASSETGROUP_ID?.ASSETGROUP_ID
          ? watchAll?.ASSETGROUP_ID?.ASSETGROUP_ID
          : watchAll?.ASSETGROUP_ID?.ASSETGROUP_ID;

        if (assetGroupId !== undefined) {
          if (options?.assetType !== undefined) {
            var assetTypeList: any = options?.assetType?.filter(
              (f: any) => f?.ASSETGROUP_ID === assetGroupId
            );
            setType(assetTypeList);
          }
        }
        await getRequestList(
          watchAll?.ASSETGROUP_ID?.ASSETGROUP_ID,
          watchAll?.ASSETGROUP_ID?.ASSETGROUP_TYPE
        );
        setValue("REQ_ID", selectedDetails?.REQ_ID);
      }
    })();
  }, [watchAll?.ASSETGROUP_ID]);

  useEffect(() => {
    if (watchAll?.ASSETTYPE_ID) {
      const assetTypeId = watchAll?.ASSETTYPE_ID?.ASSETTYPE_ID
        ? watchAll?.ASSETTYPE_ID?.ASSETTYPE_ID
        : watchAll?.ASSETTYPE_ID?.ASSETTYPE_ID;
      const assetList: any = options?.assestOptions?.filter(
        (f: any) => f.ASSETTYPE_ID === assetTypeId
      );
      setAssetList(assetList);
    }
  }, [watchAll?.ASSETTYPE_ID]);

  const getDocmentList = async (WO_ID: any) => {
    setisloading(true);
    try {
      const res = await helperGetWorkOrderAwsDoclist(WO_ID,"HD001")  
      if (res?.FLAG === 1) {
        setAssetDocList(res?.ASSETDOCLIST);
        setDocOption(res?.WORKORDERDOCLIST);
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
  const getOptions = async () => {
    try {
      const res = await callPostAPI(
        ENDPOINTS.GET_SERVICEREQUST_MASTERLIST,
        {
          WO_ID: WO_ID,
        },
        "HD001"
      );
      if (res?.FLAG === 1) {
        // setMasterListOption(res);
      }

      if (search === "?edit=") {
        let WO_ID = localStorage.getItem("WO_ID");
        await getOptionDetails(WO_ID, res);
        await getDocmentList(WO_ID);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  function OpenLocationDropDown() {
    setIsSubmit(false);
    if (locationStatus === true) {
      setLocationStatus(false);
    } else if (locationStatus === false) {
      setLocationStatus(true);
    }
  }

  const OpenEditStatusDropDown = () => {
    setAssignStatus(false);
    if (editStatus === true) {
      selectedDetails.ASSET_ID = localAssetId;
      selectedDetails.ASSETGROUP_ID = localGroupId;
      selectedDetails.ASSETTYPE_ID = localAssetTypeId;
      selectedDetails.REQ_ID = localRequestId;
      setEditStatus(false);
      setValue("TECH_ID", []);
      setTaskList(EditTaskList);
    } else if (editStatus === false) {
      selectedDetails.ASSET_ID = asssetName;
      selectedDetails.ASSETGROUP_ID = asssetGroup;
      selectedDetails.ASSETTYPE_ID = asssetType;
      selectedDetails.REQ_ID = issueName;
      setValue("REQ_ID", selectedDetails?.REQ_ID);
      setShowReassingList(false);
      setReassignVisible(false);
      setEditStatus(true);
      setTaskList(EditTaskList);
    }
  };

  const getSalceforceDetails = async () => {
    try {
      const res = await callPostAPI(ENDPOINTS.SALCEFORCE_DETAILS, {
        SF_CASE_NO: selectedDetails?.SF_CASE_NO,
      });
      if (res?.FLAG === 1) {
        setsalcedorecedetails(res?.CONTACTDETAILS);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const onSubmit = async (payload: any, e: any) => {
    if (IsSubmit) return true;
    setIsSubmit(true);

    const buttonMode: any = e?.nativeEvent?.submitter?.name;
    payload.ACTIVE = 1;
    delete payload?.ASSETGROUP_NAME;
    delete payload?.ASSETTYPE;
    delete payload?.ASSETTYPE_NAME;
    delete payload?.LOCATION_NAME;
    delete payload?.SEVERITY_DESC;
    delete payload?.PART_LIST;
    delete payload?.PARTS_TYPE;
    delete payload?.ASSET_NAME;
    delete payload?.TEAM_NAME;
    delete payload?.TASK_DES;
    delete payload?.TECH_NAME;
    delete payload?.STRUCTURE_ID;
    delete payload?.WARRANTY_END_DATE;
    delete payload?.LAST_MAINTANCE_DATE;
    delete payload?.REQUESTTITLE_ID;
    delete payload?.RAISEDBY_ID;
    delete payload?.DESCRIPTION;

    if (editStatus === true || locationStatus === true) {
      try {
        delete payload?.TASKDETAILS;
        payload.MODE = "E";
        if (locationStatus === true) {
          payload.ASSETGROUP_ID = selectedDetails?.ASSETGROUP_ID;
          payload.ASSETTYPE_ID = selectedDetails?.ASSETTYPE_ID;
          payload.ASSET_ID = selectedDetails?.ASSET_ID;
        } else {
          payload.ASSETGROUP_ID = payload?.ASSETGROUP_ID?.ASSETGROUP_ID;
          payload.ASSETTYPE_ID = payload?.ASSETTYPE_ID?.ASSETTYPE_ID;
          payload.ASSET_ID = payload?.ASSET_ID?.ASSET_ID;
        }
        payload.LOCATION_ID =
          payload?.LOCATION_ID?.LOCATION_ID !== undefined
            ? payload?.LOCATION_ID?.LOCATION_ID
            : selectedDetails?.LOCATION_ID;
        payload.RAISED_BY =
          payload?.RAISEDBY_ID?.USER_ID !== undefined
            ? payload?.RAISEDBY_ID?.USER_ID
            : selectedDetails?.RAISED_BY;
        payload.REQ_ID =
          payload?.REQ_ID?.REQ_ID !== undefined
            ? payload?.REQ_ID?.REQ_ID
            : selectedDetails?.REQ_ID;
        payload.SEVERITY_CODE =
          payload.SEVERITY_CODE !== undefined &&
            payload.SEVERITY_CODE.SEVERITY_ID !== undefined
            ? payload.SEVERITY_CODE.SEVERITY_ID
            : selectedDetails?.SEVERITY_CODE;
        payload.ASSIGN_TEAM_ID = selectedDetails.ASSIGN_TEAM_ID;
        payload.REASSIGN_TYPE =
          currentStatus === 1 && selectedDetails.ATTEND_AT == null ? "B" : "";

        payload.WO_ID = selectedDetails?.WO_ID;
        payload.PARA = { para1: `Work order`, para2: "updated" };
        payload.WO_DATE =
          payload.WO_DATE !== undefined
            ? moment(payload?.WO_DATE).format("DD-MM-YYYY")
            : payload.WO_DATE;
        delete payload?.STATUS_CODE;

        const res = await callPostAPI(
          ENDPOINTS.SAVE_WORKORDER,
          payload,
          "HD001"
        );
        if (res?.FLAG === true) {
          //window.location.reload()
          toast?.success(res?.MSG);
          await getOptions();
          if (
            editStatus === true &&
            assignStatus === true &&
            decryptData(localStorage.getItem("ROLETYPECODE")) !== "SA"
          ) {
            props?.getAPI();
            navigate("/workorderlist");
          }
          // getOptionDetails(WO_ID);
          setEditStatus(false);
          setLocationStatus(false);
          setShowReassingList(false);
          setIsSubmit(false);

          // setGroupStatus(false)
        } else {
          toast?.error(res?.MSG);
          setIsSubmit(false);
          //setGroupStatus(false)
        }
      } catch (error: any) {
        toast?.error(error);
      } finally {
        setIsSubmit(false);
      }
    } else if (editStatus === false || locationStatus === false) {
      delete payload.ASSET_NONASSET;
      delete payload.ASSETGROUP_ID;
      delete payload.ASSETTYPE_ID;
      delete payload.ASSET_ID;
      delete payload.LOCATION_ID;
      delete payload.RAISED_BY;
      delete payload.REQ_ID;
      delete payload.SEVERITY_CODE;
      delete payload.ASSIGN_TEAM_ID;
      delete payload.TECH_ID;
      delete payload?.STATUS_CODE;
      delete payload?.REQ_DESC;
      delete payload?.CURRENT_STATUS;
      delete payload?.DOC_LIST;
      delete payload?.MODE;
      delete payload?.WORK_ORDER_NO;
      delete payload?.WO_DATE;
      delete payload?.WO_NO;
      delete payload?.WO_REMARKS;
      delete payload?.WO_TYPE;
      delete payload?.TASKDETAILS;
      if (buttonMode === "task") {
        const checkedTasks = taskList.filter((task: any) => task.isChecked);

        const checkedTasksWith: any = checkedTasks.map(
          (task: any, index: any) => ({
            ...task,
            SEQNO: index + 1, // SEQNO is index + 1
          })
        );
        const taskDetails = checkedTasksWith?.map((task: any, index: any) => {
          return {
            TASK_ID: task.TASK_ID,
            TASK_NAME: task.TASK_NAME,
            TECH_ID: "",
            TASK_SRNO: index + 1,
            TIME_UOM_CODE: "M",
            SHOW_ACTUAL_TIME: "012:00",
            REMARKS: "Test",
          };
        });

        payload.WO_ID = WO_ID;
        payload.MODE = "A";
        payload.REMARKS = "Test";
        delete payload?.TASK_NAME;
        delete payload?.TASKDETAILS;

        payload.TASK_LIST = taskDetails;
        payload.PARA = { para1: `Task Details`, para2: "added" };
        if (checkedTasks?.length > 0) {
          const res = await callPostAPI(
            ENDPOINTS.SAVE_WO_TASK_PART,
            payload,
            "HD001"
          );

          if (res.FLAG === true) {
            toast?.success(res?.MSG);

            await getOptions();
            await getOptionDetails(WO_ID);
            setIsSubmit(false);
            setValue("TASK_NAME", "");
          } else {
            toast?.error(res?.MSG);
            setIsSubmit(false);
          }
        } else if (checkedTasks?.length === 0) {
          setIsSubmit(false);
          toast.error(" Please select at least one task");
        }
      } else {
        if (buttonMode === "parts") {
          const isAnyQTYUndefined = partListWatch.some(
            (item: any) =>
              item.USED_QUANTITY === undefined ||
              item.USED_QUANTITY === null ||
              item?.USED_QUNATITY === ""
          );
          payload.RAISED_BY = decryptData(localStorage.getItem("USER_ID"));
          payload.RETURN_TYPE = partWatch?.key;
          payload.PARTLIST = partListWatch;
          payload.PARA = { para1: `Part Details`, para2: "created" };
          payload.TASKDETAILS = [];
          if (isAnyQTYUndefined === false) {
            try {
              const res = await callPostAPI(
                ENDPOINTS.SAVE_USEDPARTS,
                payload,
                "HD001"
              );
              if (res.FLAG === true) {
                toast?.success(res?.MSG);
                await getOptionDetails(WO_ID);

                setIsSubmit(false);
              } else {
                toast?.error(res?.MSG);
              }
            } catch (error: any) {
              toast?.error(error);
            } finally {
              setIsSubmit(false);
            }
          } else {
            toast.error("please fill the used quantity ");
            setIsSubmit(false);
          }
        }
      }
    }
  };
  const DetailsHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className="flex justify-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <span className="white-space-nowrap">Details</span>
        <Tooltip target=".custom-target-icon" />
        {
          // FACILITY["REDIRECT_APPROVAL"] === true
          selectedDetails?.ISAPPROVALCNC === false &&
            selectedDetails?.ISAPPROVED === false &&
            selectedDetails?.CURRENT_STATUS === 5 &&
            (selectedDetails?.SUB_STATUS === "1" ||
              selectedDetails?.SUB_STATUS === "2" ||
              selectedDetails?.SUB_STATUS === "3" ||
              selectedDetails?.SUB_STATUS === "4" ||
              selectedDetails?.SUB_STATUS === "5") ? (
            <Badge
              value="i"
              className="custom-target-icon"
              data-pr-position="top"
              data-pr-tooltip="Redirect Approval"
            />
          ) : (
            <></>
          )
        }
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
        <span className="white-space-nowrap">Material</span>
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

  const footer = <></>;

  // const TASK_NAME = watch("TASK_NAME");
  const setPushList = (data: any) => {
    taskList.push({ TASK_ID: "0", TASK_NAME: data });
    reset({ TASK_NAME: "" });
  };

  const AddTask = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (taskName !== undefined) {
      if (taskName.trim() !== "") {
        setPushList(taskName);
      } else {
        toast.error("Please Enter Task Details");
      }
      setValue("TASK_NAME", "");
    } else {
      toast.error("Please Enter Task Details");
    }
    setTaskName("");
  };

  const OpenViewAddTask = () => {
    if (!ViewAddTask) {
      SetViewAddTask(true);
    } else {
      SetViewAddTask(false);
    }
  };


  const GetOpenList = () => {
    //  props?.isClick()
    if (location?.state === "service") {
      dispatch(clearFilters());
      navigate(`/workorderlist`);
    } else {
      navigate(`/workorderlist`, { state: "workorder" });
    }
  };

  const getLocDesc = (e: any) => {
    setValue("LOCATION_DESCRIPTION", e);
  };

  const getRequestList = async (
    ASSETGROUP_ID: any,
    ASSET_NONASSET?: any,
    reqId?: any
  ) => {
    try {
      const payload: any = {
        ASSETGROUP_ID: ASSETGROUP_ID,
        ASSET_NONASSET: ASSET_NONASSET,
      };

      const res = await callPostAPI(
        ENDPOINTS.GET_SERVICEREQUEST_WORKORDER,
        payload,
        "HD001"
      );

      if (res?.FLAG === 1) {
        setIssueList(res?.WOREQLIST);
        setValue("REQ_ID", reqId);
        selectedDetails.REQ_ID = issueName;
      } else {
        setIssueList(res?.WOREQLIST);
      }
    } catch (error: any) {
    } finally {
    }
  };

  const getEquipmentGroup = async (groupId: any, groupType: any) => {
    try {
      selectedDetails.ASSETTYPE_ID = "";
      selectedDetails.ASSET_ID = "";
      selectedDetails.REQ_ID = "";
      setValue("ASSETTYPE_ID", "");
      setValue("ASSET_ID", "");
      setValue("REQ_ID", "");
      setValue("TECH_ID", []);
      // setGroupStatus(true)
      let id: any = localStorage.getItem("WO_ID");
      WO_ID = parseInt(id);
      const res = await callPostAPI(
        ENDPOINTS?.GET_ASSET_GROUP_CHECK,
        {
          ASSETGROUP_ID: groupId,
          WO_ID: WO_ID,
        },
        "HD001"
      );
      await getRequestList(groupId, groupType);
      if (res?.FLAG === false) {
        const res1 = await callPostAPI(
          ENDPOINTS?.GET_ASSETGROUPTEAMLIST,
          {
            WO_ID: WO_ID,
            ASSETGROUP_ID: groupId,
          },
          "HD001"
        );
        if (res1?.FLAG === 1) {
          let ReassignList = res1?.TECHLIST;
          if (res1?.TECHLIST?.length === 0) {
            setShowReassingList(true);
            setReassignVisible(true);
            setReassignList(ReassignList);
          } else {
            technicianList.forEach((element: any) => {
              ReassignList.forEach((item: any) => {
                if (element.TEAM_ID === item.TEAM_ID) {
                  setShowReassingList(false);
                  setReassignVisible(false);
                  setReassignList(ReassignList);
                } else {
                  setShowReassingList(true);
                  setReassignVisible(true);
                  setReassignList(ReassignList);
                }
              });
            });
          }
          setValue("TECH_ID", []);
          setValue("ASSET_ID", "");
          setTaskList([]);
        } else {
          setShowReassingList(true);
          setReassignVisible(true);
          setReassignList([]);
        }
      } else if (res?.FLAG === true) {
        setReassignVisible(false);
      }
    } catch (e: any) {
      toast.error(e);
    }
  };

  const getEquipmentType = (e: any) => {
    selectedDetails.ASSETTYPE_ID = e?.target?.value?.ASSETTYPE_ID;
    setValue("ASSETTYPE_ID", e?.target?.value?.ASSETTYPE_ID);
    if (taskList.length > 0) {
      setTaskList([]);
    } else {
      return;
    }
  };
  const getServiceType = (e: any) => {
    selectedDetails.ASSETTYPE_ID = e?.target?.value?.ASSETTYPE_ID;
    setValue("ASSETTYPE_ID", e?.target?.value?.ASSETTYPE_ID);

    if (taskList.length > 0) {
      setTaskList([]);
    } else {
      return;
    }
  };

  const getSoftServiceGroup = () => {
    setType([]);
    setAssetList([]);
    setValue("ASSETTYPE_ID", "");
    setValue("ASSET_ID", "");
  };

  const GetVisibleSiderBar = (val: any) => {
    if (val === 0 && !IsVisibleMaterialReqSideBar) {
      setVisibleMaterialReqSideBar(true);
    } else {
      setVisibleMaterialReqSideBar(false);
    }
  };

  const GetCancelEdit = () => {
    resetField("ASSET_ID");
    resetField("ASSETGROUP_ID");
    resetField("ASSETTYPE_ID");
    resetField("REQ_ID");
    setValue("TECH_ID", []);
    selectedDetails.ASSET_ID = asssetName;
    selectedDetails.ASSETGROUP_ID = asssetGroup;
    selectedDetails.ASSETTYPE_ID = asssetType;
    selectedDetails.REQ_ID = issueName;

    if (editStatus === true) {
      setEditStatus(false);
    } else if (editStatus === false) {
      selectedDetails.ASSET_ID = asssetName;
      selectedDetails.ASSETGROUP_ID = asssetGroup;
      selectedDetails.ASSETTYPE_ID = asssetType;
      selectedDetails.REQ_ID = issueName;
      setShowReassingList(false);
      setReassignVisible(true);
    }
    if (locationStatus === true) {
      setLocationStatus(false);
    }
  };

  useEffect(() => {
    if (currentMenu) {
      let id: any = localStorage.getItem("WO_ID");
      WO_ID = parseInt(id);
      (async function () {
        await getOptions();
        await saveTracker(currentMenu);
        await getFacility();
      })();
    }
  }, [currentMenu]);

  useEffect(() => {
    const location: any = locationtypeOptions?.filter(
      (f: any) => f.LOCATION_ID === f.LOCATION_ID
    );
    setlocationtypeOptions(location);
  }, [locationStatus]);

  useEffect(() => {
    const group: any = EquipmentGroup?.filter(
      (f: any) => f?.ASSETGROUP_ID === f?.ASSETGROUP_ID
    );
    setEquipmentGroup(group);
  }, [editStatus, statusButton]);

  const remarkMapping: any = {
    "1": selectedDetails?.REDIRECT_INSTRUCTIONS,
    "2": selectedDetails?.COLLABRAT_REMARKS,
    "3": selectedDetails?.VENDOR_REDIRECT_REMARKS,
    "4": selectedDetails?.CANCELLED_REMARKS,
    "5": selectedDetails?.ONHOLD_REMARKS,
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

  const getFacility = async () => {
    const res = await callPostAPI(ENDPOINTS?.BUILDING_DETAILS, {}, "HD001");
    if (res?.FLAG === 1) {
      setFacilityStatus(res?.FACILITYDETAILS[0]);
    }
  };

  useEffect(() => { }, [selectedFacility]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // adjust scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const remark =
    remarkMapping[selectedDetails?.SUB_STATUS] || "No additional remark";
  if (loading) {
    return <LoaderFileUpload IsScannig="false" />;
  }

  return (
    <>
      <section className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          {selectedDetails?.length !== 0 ? (
            <>
              <Card
                className={`containerBox  ${isScrolled ? "fixedContainer1" : "topFixed"
                  }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="Helper_Text Menu_Active mb-1">
                      Work Order /{" "}
                    </p>
                    <h6 className="Text_Primary Main_Service_Header_Text mb-1">
                      {selectedDetails?.ASSETGROUP_NAME ?? ""} -{" "}
                      {selectedDetails?.REQ_DESC ?? ""}
                    </h6>
                    <p className="Sub_Service_Header_Text Text_Secondary">
                      {selectedDetails?.WO_NO ?? ""}
                    </p>
                  </div>
                  <div>
                    {/* List */}

                    {(editStatus === true || locationStatus === true) && (
                      <Buttons
                        type="button"
                        className="Secondary_Button w-20 me-2"
                        label={"Cancel"}
                        onClick={GetCancelEdit}
                      />
                    )}
                    {/* Save */}

                    {(locationStatus === true || editStatus === true) &&
                      (currentStatus === 1 || currentStatus === 3) && (
                        <Buttons
                          type="submit"
                          disabled={IsSubmit}
                          className="Primary_Button  w-20 me-2"
                          label={"Save"}
                        />
                      )}

                    {/* Redirect */}
                    {selectedDetails?.ISREDIRECT &&
                      currentStatus !== 6 &&
                      status !== "Cancelled" &&
                      currentStatus !== 7 &&
                      editStatus === false &&
                      locationStatus === false &&
                      (currentStatus === 3 || currentStatus === 1) ? (
                      <WORedirectDialogBox
                        control={control}
                        setValue={setValue}
                        register={register}
                        REMARK={""}
                        handlingStatus={handlingStatus}
                        watch={watch}
                        ASSIGN_TEAM_ID={"ASSIGN_TEAM_ID"}
                        getAPI={props?.getAPI}
                        currentStatus={currentStatus}
                        errors={errors}
                        subStatus={selectedDetails.SUB_STATUS}
                        options={options}
                        getOptionDetails={getOptionDetails}
                        eventNotification={eventNotification}
                        setIsSubmit={setIsSubmit}
                        IsSubmit={IsSubmit}
                        selectedAssigneeTech={technicianList}
                      />
                    ) : (
                      <></>
                    )}

                    {/* Acknowledge */}

                    {currentStatus === 1 &&
                      editStatus === false &&
                      locationStatus === false && (
                        <Buttons
                          className=" Primary_Button  me-2"
                          type="button"
                          disabled={ackStatus}
                          name="ACK"
                          label={"Acknowledge"}
                          onClick={async (e: any) => {
                            if (ackStatus) return true;
                            setAckStatus(true);
                            setStatusButton("Acknowledge");
                            await handlingStatus(true, e, "Acknowledge");
                          }}
                        />
                      )}

                    {/* Rectified */}

                    {currentStatus >= 3 &&
                      status !== "Cancelled" &&
                      currentStatus !== 4 &&
                      editStatus === false &&
                      locationStatus === false &&
                      currentStatus !== 7 && (
                        <>
                          {currentStatus !== 5 ? (
                            <WorkOrderDialogBox
                              header={"Rectified"}
                              errors={errors}
                              control={control}
                              setValue={setValue}
                              register={register}
                              getValues={getValues}
                              name={"RCT"}
                              REMARK={"REMARK"}
                              handlingStatus={handlingStatus}
                              watch={watch}
                              label={"Rectified"}
                              isReopen={selectedDetails?.IS_REOPEN}
                            />
                          ) : (
                            selectedDetails?.ISAPPROVED === true &&
                            selectedDetails?.CURRENT_STATUS === 5 &&
                            selectedDetails?.SUB_STATUS === "5" && (
                              <Buttons
                                className=" Primary_Button   me-2"
                                type="button"
                                disabled={IsSubmit}
                                name="CONTINUE"
                                label={"Continue Work Order"}
                                onClick={async (e: any) => {
                                  if (IsSubmit) return true;
                                  setIsSubmit(true);
                                  setStatusButton("CONTINUE");
                                  await handlingStatus(false, e, "CONTINUE");
                                }}
                              />
                            )
                          )}
                        </>
                      )}

                    {currentStatus == 4 &&
                      selectedDetails?.ISCOMPLETERIGHTS === 1 ? (
                      <WorkOrderDialogBox
                        header={"Complete"}
                        control={control}
                        setValue={setValue}
                        register={register}
                        name={"Complete"}
                        handlingStatus={handlingStatus}
                        watch={watch}
                        label={"Complete"}
                        errors={errors}
                        currentStatus={currentStatus}
                        signature={imgSrc}
                      />
                    ) : (
                      <></>
                    )}
                    {currentStatus == 4 &&
                      selectedDetails?.ISCOMPLETERIGHTS === 1 ? (
                      <>
                        {selectedDetails?.WO_TYPE === "CM" && (
                          <ReopenDialogBox
                            header={"Re-open"}
                            control={control}
                            setValue={setValue}
                            register={register}
                            watch={watch}
                            REMARK={"REMARK"}
                            errors={errors}
                            reopentype="1"
                            // getOptions={getOptions}
                            getList={props?.getAPI}
                            formType={"Work Order"}
                            functionCode={"HD001"}
                          />
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    <Buttons
                      label={"List"}
                      className=" Secondary_Button  me-2"
                      type="button"
                      name="LIST"
                      onClick={GetOpenList}
                    />
                  </div>
                </div>
              </Card>
              <TimelineHeaderRE statusDetails={selectedDetails} currentStatus={currentStatus} />
              <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div className="col-span-2 mt-3 woTabview">
                  <div className="woDetailTabview">
                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      <TabPanel headerTemplate={DetailsHeaderTemplate}>
                        <Card className="mt-2">
                          <div>
                            {selectedDetails?.ISAPPROVALCNC === false &&
                              selectedDetails?.ISAPPROVED === false &&
                              selectedDetails?.CURRENT_STATUS === 5 &&
                              (selectedDetails?.SUB_STATUS === "1" ||
                                selectedDetails?.SUB_STATUS === "2" ||
                                selectedDetails?.SUB_STATUS === "3" ||
                                selectedDetails?.SUB_STATUS === "4" ||
                                selectedDetails?.SUB_STATUS === "5") ? (
                              <>
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
                                          <label className="Text_Primary mb-2 review_Service_Header_Text">
                                            {selectedDetails?.STATUS_DESC}{" "}
                                            Request
                                          </label>

                                          <p
                                            className="Text_Primary Input_Text"
                                            data-pr-tooltip={remark}
                                            data-pr-position="bottom"
                                          >
                                            {remark}
                                          </p>
                                          {selectedDetails?.SUB_STATUS ===
                                            "4" ||
                                            selectedDetails?.SUB_STATUS ===
                                            "1" ? (
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
                                    <SidebarVisibal
                                      reassignVisible={reassignVisible}
                                      headerTemplate={selectedDetails?.STATUS_DESC}
                                      selectedDetails={selectedDetails}
                                      subStatus={selectedDetails?.SUB_STATUS}
                                      approvalStatus={approvalStatus}
                                      handlingStatus={handlingStatus}
                                      ASSIGNTECHLIST={technicianList}
                                      WORKORDER_DETAILS={selectedDetails}
                                      getOptions={getOptions}
                                      statusCode={
                                        selectedDetails.CURRENT_STATUS
                                      }
                                      DUPLICATE_BY={
                                        selectedDetails.DUPLICATE_BY
                                      }
                                      IsVisibleMaterialReqSideBar={
                                        IsVisibleMaterialReqSideBar
                                      }
                                      setVisibleMaterialReqSideBar={
                                        setVisibleMaterialReqSideBar
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className="flex flex-wrap justify-between">
                            <h6 className="Service_Header_Text">
                              Work Order Details
                            </h6>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                            <div className=" flex flex-col gap-4">
                              <div>
                                <label className="Text_Secondary Helper_Text  ">
                                  Priority
                                </label>
                                <p className="Text_Primary Service_Alert_Title  ">
                                  {selectedDetails?.SEVERITY_DESC}
                                </p>
                              </div>
                              <div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Type
                                  </label>

                                  {selectedDetails?.ASSET_NONASSET === "A" ? (
                                    <>
                                      <p className="Text_Primary Service_Alert_Title  ">
                                        Equipment{" "}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="Text_Primary Service_Alert_Title  ">
                                        Soft Services
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="Text_Secondary Helper_Text  ">
                                  Reporter
                                </label>
                                <p className="Menu_Active Service_Alert_Title">
                                  {selectedDetails?.USER_NAME}
                                </p>
                              </div>
                              <div>
                                <label className="Text_Secondary Helper_Text  ">
                                  Work Order Date & Time
                                </label>
                                <p className="Text_Primary Service_Alert_Title  ">
                                  {selectedDetails?.REPORTED_AT
                                    ? formateDate(selectedDetails?.REPORTED_AT)
                                    : "NA"}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className=" flex flex-col gap-4">
                                <div>
                                  <div>
                                    <label className="Text_Secondary Helper_Text  ">
                                      Location
                                    </label>
                                  </div>

                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {locationStatus === false && (
                                      <>
                                        {selectedDetails?.LOCATION_DESCRIPTION}

                                        {(currentStatus === 1 ||
                                          currentStatus == 3) && (
                                            <>
                                              {" "}
                                              {facilityStatus?.ISLOCATION_EDIT ===
                                                true && (
                                                  <i
                                                    className="pi pi-pencil Menu_Active ml-2 cursor-pointer"
                                                    onClick={() =>
                                                      OpenLocationDropDown()
                                                    }
                                                  ></i>
                                                )}
                                            </>
                                          )}
                                      </>
                                    )}

                                    {locationStatus === true && (
                                      <Field
                                        controller={{
                                          name: "LOCATION_ID",
                                          control: control,
                                          render: ({ field }: any) => {
                                            return (
                                              <Select
                                                options={locationtypeOptions}
                                                {...register("LOCATION_ID", {
                                                  onChange: (e: any) => {
                                                    getLocDesc(
                                                      e?.target?.value
                                                        ?.LOCATION_DESCRIPTION
                                                    );
                                                  },
                                                })}
                                                filter={true}
                                                optionLabel="LOCATION_DESCRIPTION"
                                                findKey={"LOCATION_ID"}
                                                selectedData={
                                                  selectedDetails?.LOCATION_ID
                                                }
                                                setValue={setValue}
                                                invalid={errors.LOCATION_ID}
                                                {...field}
                                              />
                                            );
                                          },
                                        }}
                                      />
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Description
                                  </label>
                                  {selectedDetails?.WO_REMARKS === null ||
                                    selectedDetails?.WO_REMARKS === "" ? (
                                    <>
                                      <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="Text_Primary Service_Alert_Title  ">
                                        {selectedDetails?.WO_REMARKS}
                                      </p>
                                    </>
                                  )}
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Supporting Files(
                                    {
                                      docOption?.filter(
                                        (e: any) => e.UPLOAD_TYPE === "W"
                                      ).length
                                    }
                                    )
                                  </label>
                                  {isloading === true ? (
                                    <div className="imageContainer  flex justify-center items-center z-400">
                                      <>
                                        <LoaderFileUpload IsScannig={false} />
                                      </>
                                    </div>
                                  ) : docOption?.filter(
                                    (e: any) => e.UPLOAD_TYPE === "W"
                                  ).length > 0 ? (<>
                                      <ImageGalleryComponent
                                        uploadType="W"
                                        docOption={docOption}
                                        Title={"Service Request"}
                                      />  </>
                                  ) : (
                                    <>
                                      <NoItemToShow />
                                    </>
                                  )}

                                  <Dialog
                                    visible={visibleImage}
                                    style={{ width: "50vw" }}
                                    onHide={() => {
                                      setVisibleImage(false);
                                    }}
                                  >
                                    <>
                                      <a
                                        href={showImage}
                                        download={docName}
                                        className="flex flex-col"
                                        title={`Download ${docName}`}
                                      >
                                        <i
                                          className="pi pi-download"
                                          style={{
                                            fontSize: "24px",
                                            marginBottom: "8px",
                                            display: "flex",
                                            justifyContent: "end",
                                          }}
                                        ></i>
                                      </a>
                                      <img
                                        src={showImage}
                                        alt=""
                                        className="w-full bg-cover"
                                      />
                                      <h5>{docName}</h5>
                                      <h6>{DocTitle}</h6>
                                    </>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>

                          {currentStatus === 4 ||
                            currentStatus === 7 ||
                            selectedDetails?.IS_REOPEN === true ? (
                            <RectifiedDetails
                              rectifiedDetails={selectedDetails}
                              imageDocList={docOption}
                              isloading={isloading}
                              isCardView={false}
                            />
                          ) : (
                            <></>
                          )}

                          {(currentStatus === 7 &&
                            selectedDetails?.IS_REOPEN === true) ||
                            (currentStatus === 7 &&
                              selectedDetails?.IS_REOPEN === null) ? (
                            <CompletedDetails
                              completionDetails={selectedDetails}
                              isloading={isloading}
                              signatureDocImage={signatureDoc}
                            /> ) : (<></> )}
                          {selectedDetails?.IS_ACCEPTED === true && (
                            <AcceptedDetails acceptedDetails={selectedDetails} isCardView={false} />
                          )}
                        </Card>

                        {/* when its no data */}
                        {decryptData(localStorage.getItem("ROLETYPECODE")) !==
                          "O" ||
                          (decryptData(localStorage.getItem("ROLETYPECODE")) !==
                            "H" &&
                            selectedDetails?.ASSET_NONASSET !== "N" && (
                              <Card className="mt-2">
                                <h6 className="Service_Header_Text">
                                  Equipment Summary
                                </h6>
                                <NoItemToShow />
                              </Card>
                            ))}
                        {selectedDetails?.ASSET_NONASSET !== "N" && (
                          <Card className="mt-2">
                            <div className="flex flex-wrap justify-between">
                              <h6 className="Service_Header_Text">
                                Equipment Summary
                              </h6>
                              {facilityStatus?.ISEQUIPMENT_EDIT === true && (
                                <>
                                  {(currentStatus === 1 ||
                                    currentStatus == 3) && (
                                      <Buttons
                                        className="Secondary_Button"
                                        icon="pi pi-pencil"
                                        label={"Edit"}
                                        onClick={() => {
                                          OpenEditStatusDropDown();
                                        }}
                                      />
                                    )}
                                </>
                              )}
                            </div>

                            {editStatus === false && (
                              <EquipmentSummaryDetails equipmentDetails={selectedDetails} equipmentType={selectedDetails?.ASSET_NONASSET} isServiceReq={false} />
                            )}
                            {editStatus === true ? (
                              <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Equipment Group{" "}
                                    <span className="text-red-600"> *</span>
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSETGROUP_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              require={false}
                                              options={EquipmentGroup}
                                              {...register("ASSETGROUP_ID", {
                                                required:
                                                  "Please fill the required fields",
                                                onChange: async (e: any) => {
                                                  setType([]);
                                                  setAssetList([]);
                                                  await getEquipmentGroup(
                                                    e?.target?.value
                                                      ?.ASSETGROUP_ID,
                                                    e?.target?.value
                                                      ?.ASSETGROUP_TYPE
                                                  );
                                                },
                                              })}
                                              optionLabel="ASSETGROUP_NAME"
                                              findKey={"ASSETGROUP_ID"}
                                              selectedData={
                                                selectedDetails?.ASSETGROUP_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              invalid={errors.ASSETGROUP_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Ownership Status
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.OWN_LEASE === null ||
                                      selectedDetails?.OWN_LEASE === "" ||
                                      selectedDetails?.OWN_LEASE === undefined
                                      ? "NA"
                                      : selectedDetails?.OWN_LEASE === "O"
                                        ? "Owned"
                                        : selectedDetails?.OWN_LEASE === "L"
                                          ? "Leased"
                                          : "NA"}
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Last Maintenance Date
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.LAST_MAINTANCE_DATE ==
                                      null ||
                                      selectedDetails?.LAST_MAINTANCE_DATE === ""
                                      ? "NA"
                                      : onlyDateFormat(
                                        selectedDetails?.LAST_MAINTANCE_DATE
                                      )}
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Equipment Type{" "}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSETTYPE_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={type}
                                              {...register("ASSETTYPE_ID", {
                                                onChange: (e: any) => {
                                                  getEquipmentType(e);
                                                },
                                              })}
                                              //require={false}
                                              optionLabel="ASSETTYPE_NAME"
                                              findKey={"ASSETTYPE_ID"}
                                              selectedData={
                                                selectedDetails?.ASSETTYPE_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Warranty End Date
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <p className="Text_Primary Service_Alert_Title  ">
                                      {selectedDetails?.WARRANTY_END_DATE ==
                                        null ||
                                        selectedDetails?.WARRANTY_END_DATE === ""
                                        ? "NA"
                                        : onlyDateFormat(
                                          selectedDetails?.WARRANTY_END_DATE
                                        )}
                                    </p>
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Upcoming Schedule
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.UPCOMING_SCHEDULE_DATE
                                      ?
                                      onlyDateFormat(
                                        selectedDetails?.UPCOMING_SCHEDULE_DATE
                                      )
                                      : "NA"}
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Equipment Name{" "}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSET_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={assetList}
                                              {...register("ASSET_ID", {
                                                onChange: (e: any) => {
                                                  selectedDetails.ASSET_ID =
                                                    e?.target?.value?.ASSET_ID;
                                                  setValue(
                                                    "ASSET_ID",
                                                    e?.target?.value?.ASSET_ID
                                                  );
                                                },
                                              })}
                                              optionLabel="ASSET_NAME"
                                              findKey={"ASSET_ID"}
                                              selectedData={
                                                selectedDetails?.ASSET_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Vendor Name
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.VENDOR_NAME === "" ||
                                      selectedDetails?.VENDOR_NAME === null ||
                                      selectedDetails?.VENDOR_NAME === undefined
                                      ? "NA"
                                      : selectedDetails?.VENDOR_NAME}
                                  </p>
                                </div>

                                {reassignVisible && showReassingList && (
                                  <div>
                                    <label className="Text_Secondary Helper_Text  ">
                                      Assign To{" "}
                                      <span className="text-red-600"> *</span>
                                    </label>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                      <Field
                                        controller={{
                                          name: "TECH_ID",
                                          control: control,
                                          render: ({ field }: any) => {
                                            return (
                                              <MultiSelect
                                                require={false}
                                                options={ReassignList}
                                                {...register("TECH_ID", {
                                                  required:
                                                    "Please fill the required fields",
                                                  onChange: () => {
                                                    setAssignStatus(true);
                                                  },
                                                })}
                                                optionLabel="USER_NAME"
                                                findKey={"TECH_ID"}
                                                selectedData={
                                                  selectedDetails?.TECH_ID
                                                }
                                                filter={true}
                                                setValue={setValue}
                                                invalid={errors.TECH_ID}
                                                {...field}
                                              />
                                            );
                                          },
                                        }}
                                      />
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    {" "}
                                    {/* <span className="text-red-600"> *</span> */}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "REQ_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={issueList}
                                              //options={[]}
                                              {...register("REQ_ID", {
                                                required:
                                                  "Please fill the required fields",
                                              })}
                                              label={"Issue"}
                                              optionLabel="REQ_DESC"
                                              require={true}
                                              findKey={"REQ_ID"}
                                              filter={true}
                                              selectedData={
                                                selectedDetails?.REQ_ID
                                              }
                                              setValue={setValue}
                                              invalid={errors.REQ_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </Card>
                        )}

                        {selectedDetails?.ASSET_NONASSET === "N" && (
                          <Card className="mt-2">
                            <div className="flex flex-wrap justify-between">
                              <h6 className="Service_Header_Text">
                                Soft Service Summary
                              </h6>
                              {(currentStatus === 1 || currentStatus === 3) && (
                                <Buttons
                                  className="Secondary_Button"
                                  icon="pi pi-pencil"
                                  label={"Edit"}
                                  onClick={() => {
                                    OpenEditStatusDropDown();
                                  }}
                                />
                              )}
                            </div>

                            {editStatus === false && (

                              <EquipmentSummaryDetails equipmentDetails={selectedDetails} equipmentType={"N"} isServiceReq={false} />
                            )}
                            {editStatus === true && (
                              <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Service Group{" "}
                                    <span className="text-red-600"> *</span>
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSETGROUP_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={EquipmentGroup}
                                              {...register("ASSETGROUP_ID", {
                                                required:
                                                  "Please fill the required fields",
                                                onChange: async (e: any) => {
                                                  getSoftServiceGroup();
                                                  await getEquipmentGroup(
                                                    e?.target?.value
                                                      ?.ASSETGROUP_ID,
                                                    e?.target?.value
                                                      ?.ASSETGROUP_TYPE
                                                  );
                                                },
                                              })}
                                              require={false}
                                              optionLabel="ASSETGROUP_NAME"
                                              findKey={"ASSETGROUP_ID"}
                                              selectedData={
                                                selectedDetails?.ASSETGROUP_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              invalid={errors.ASSETGROUP_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Last Maintenance Date
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.LAST_MAINTANCE_DATE ==
                                      null ||
                                      selectedDetails?.LAST_MAINTANCE_DATE === ""
                                      ? "NA"
                                      : onlyDateFormat(
                                        selectedDetails?.LAST_MAINTANCE_DATE
                                      )}
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Upcoming Schedule
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.UPCOMING_SCHEDULE_DATE
                                      ?  onlyDateFormat(
                                        selectedDetails?.UPCOMING_SCHEDULE_DATE
                                      )
                                      : "NA"}
                                  </p>
                                </div>

                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Service Type
                                    {/* {" "}<span className="text-red-600"> *</span> */}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSETTYPE_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={type}
                                              {...register("ASSETTYPE_ID", {
                                                // required: "Please fill the required fields",
                                                onChange: (e: any) => {
                                                  getServiceType(e);
                                                },
                                              })}
                                              require={false}
                                              optionLabel="ASSETTYPE_NAME"
                                              findKey={"ASSETTYPE_ID"}
                                              selectedData={
                                                selectedDetails?.ASSETTYPE_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              invalid={errors.ASSETTYPE_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Vendor Name
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    {selectedDetails?.VENDOR_NAME === "" ||
                                      selectedDetails?.VENDOR_NAME === null ||
                                      selectedDetails?.VENDOR_NAME === undefined
                                      ? "NA"
                                      : selectedDetails?.VENDOR_NAME}
                                  </p>
                                </div>
                                <div></div>
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    Service Name
                                    {/* {" "} <span className="text-red-600"> *</span> */}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "ASSET_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={assetList}
                                              {...register("ASSET_ID", {
                                                // required:"Please fill the required fields",
                                                onChange: (e: any) => {
                                                  selectedDetails.ASSET_ID =
                                                    e?.target?.value?.ASSET_ID;
                                                  setValue(
                                                    "ASSET_ID",
                                                    e?.target?.value?.ASSET_ID
                                                  );
                                                },
                                              })}
                                              optionLabel="ASSET_NAME"
                                              require={false}
                                              findKey={"ASSET_ID"}
                                              selectedData={
                                                selectedDetails?.ASSET_ID
                                              }
                                              filter={true}
                                              setValue={setValue}
                                              invalid={errors?.ASSET_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                                {reassignVisible && showReassingList && (
                                  <div>
                                    <label className="Text_Secondary Helper_Text  ">
                                      Assign To{" "}
                                      <span className="text-red-600"> *</span>
                                    </label>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                      <Field
                                        controller={{
                                          name: "TECH_ID",
                                          control: control,
                                          render: ({ field }: any) => {
                                            return (
                                              <MultiSelect
                                                require={false}
                                                options={ReassignList}
                                                {...register("TECH_ID", {
                                                  required:
                                                    "Please fill the required fields",
                                                  onChange: () => {
                                                    setAssignStatus(true);
                                                  },
                                                })}
                                                optionLabel="USER_NAME"
                                                findKey={"TECH_ID"}
                                                selectedData={
                                                  selectedDetails?.TECH_ID
                                                }
                                                filter={true}
                                                setValue={setValue}
                                                invalid={errors.TECH_ID}
                                                {...field}
                                              />
                                            );
                                          },
                                        }}
                                      />
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <label className="Text_Secondary Helper_Text  ">
                                    {" "}
                                  </label>
                                  <p className="Text_Primary Service_Alert_Title  ">
                                    <Field
                                      controller={{
                                        name: "REQ_ID",
                                        control: control,
                                        render: ({ field }: any) => {
                                          return (
                                            <Select
                                              options={issueList}
                                              //options={[]}
                                              {...register("REQ_ID", {
                                                required:
                                                  "Please fill the required fields",
                                              })}
                                              label={"Issue"}
                                              optionLabel="REQ_DESC"
                                              require={true}
                                              findKey={"REQ_ID"}
                                              filter={true}
                                              selectedData={
                                                selectedDetails?.REQ_ID
                                              }
                                              setValue={setValue}
                                              invalid={errors.REQ_ID}
                                              {...field}
                                            />
                                          );
                                        },
                                      }}
                                    />
                                  </p>
                                </div>
                              </div>
                            )}
                          </Card>
                        )}
                        <ReporterDetails
                          ReporterDetailsProps={selectedDetails}
                          salcedorecedetails={salcedorecedetails}
                          onClickFunction={getSalceforceDetails}
                        />
                        {currentStatus !== 1 && (
                          <Card className="mt-2">
                            <div className="flex flex-wrap justify-between">
                              <h6 className="Service_Header_Text">
                                Tasks & Resources
                              </h6>

                              <div className="w-1/2 flex flex-wrap justify-end">
                                {currentStatus !== 1 &&
                                  currentStatus !== 7 &&
                                  currentStatus !== 6 &&
                                  currentStatus !== 5 &&
                                  !ViewAddTask && (
                                    <div>
                                      <Buttons
                                        className="Secondary_Button mb-1"
                                        // icon="pi pi-plus"
                                        label={"Add Task"}
                                        onClick={() => {
                                          OpenViewAddTask();
                                        }}
                                      />
                                    </div>
                                  )}

                                {currentStatus !== 1 &&
                                  taskList?.length > 0 &&
                                  currentStatus !== 7 &&
                                  currentStatus !== 5 &&
                                  currentStatus !== 6 && (
                                    <Buttons
                                      type="submit"
                                      className="Primary_Button ml-2"
                                      label={"Save Task"}
                                      name={"task"}
                                    />
                                  )}
                              </div>
                            </div>
                            <div className="dashboardTab">
                              <TabView
                                activeIndex={activeTaskIndex}
                                onTabChange={(e) => setActiveTaskIndex(e.index)}
                              >
                                <TabPanel header={t("Tasks")}>
                                  {0 === 0 ? (
                                    <>
                                      {taskList.map(
                                        (category: any, index: any) => {
                                          return currentStatus !== 6 &&
                                            currentStatus !== 7 ? (
                                            <div
                                              key={index}
                                              className="mb-1 flex align-items-center"
                                            >
                                              <Checkbox
                                                inputId={category.TASK_ID}
                                                name="category"
                                                value={index}
                                                onChange={onCategoryChange}
                                                checked={
                                                  category.isChecked === 1
                                                    ? true
                                                    : false
                                                }
                                              />
                                              <label
                                                htmlFor={category.key}
                                                className=" Service_Alert_Title w-full ml-2"
                                              >
                                                {category.TASK_NAME}
                                              </label>
                                            </div>
                                          ) : category.isChecked === 1 ? (
                                            <div
                                              key={index}
                                              className="w-full flex align-items-center"
                                            >
                                              <label
                                                htmlFor={category.key}
                                                className="Service_Alert_Title ml-2"
                                              >
                                                <i className="pi pi-check-square mr-2"></i>
                                                {category.TASK_NAME}
                                              </label>
                                            </div>
                                          ) : (
                                            <></>
                                          );
                                        }
                                      )}
                                      <div className=" w-full flex mt-2 gap-2">
                                        {currentStatus !== 1 &&
                                          currentStatus !== 7 &&
                                          currentStatus !== 6 &&
                                          // currentStatus !== 5 &&
                                          ViewAddTask ? (
                                          <div className="w-full">
                                            <label className="Text_Secondary Helper_Text  ">
                                              Task Details{" "}
                                              <span className="text-red-600">
                                                {" "}
                                                *
                                              </span>
                                            </label>
                                            <Field
                                              controller={{
                                                name: "TASK_NAME",
                                                control: control,
                                                render: ({ field }: any) => {
                                                  return (
                                                    <InputField
                                                      {...register(
                                                        "TASK_NAME",
                                                        { onChange(event) {
                                                            setTaskName(
                                                              event.target.value
                                                            );
                                                          },
                                                        }
                                                      )}
                                                      // require={true}
                                                      maxLength={150}
                                                      setValue={setValue}
                                                      {...field}
                                                    />
                                                  );
                                                },
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <></>
                                        )}

                                        {currentStatus !== 1 &&
                                          currentStatus !== 7 &&
                                          currentStatus !== 6 &&
                                          ViewAddTask && (
                                            <div>
                                              <Buttons
                                                className="Secondary_Button mt-5"
                                                icon="pi pi-plus"
                                                label=""
                                                onClick={(e: any) => {
                                                  AddTask(e);
                                                }}
                                              />
                                            </div>
                                          )}
                                      </div>
                                    </>
                                  ) : (
                                    <>No Data Found</>
                                  )}
                                </TabPanel>
                                <TabPanel header={t("Resources")}>
                                  {assetDocList?.length > 0 ? (
                                    <>
                                      {assetDocList.map(
                                        (category: any, index: any) => {
                                          return (
                                            <div
                                              key={index}
                                              className="w-full flex align-items-center"
                                            >
                                              <label
                                                htmlFor={category.key}
                                                className="Service_Alert_Title ml-2"
                                              >
                                                <i className="pi pi-clipboard mr-2"></i>
                                                {category.DOC_NAME}
                                              </label>
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <>No Data Found</>
                                  )}
                                </TabPanel>
                              </TabView>
                            </div>
                          </Card>
                        )}
                      </TabPanel>
                      {currentStatus !== 1 && (
                        <TabPanel headerTemplate={MaterialHeaderTemplate}>
                          {partMatOptions.length === 0 && (
                            <Card className="mt-2">
                              <h6 className="Service_Header_Text">
                                Material Details
                              </h6>
                              <div className="flex items-center mt-2 justify-center w-full">
                                <label
                                  htmlFor="dropzone-file"
                                  className="flex flex-col items-center justify-center w-full h-52 border-2
                                  border-gray-200 border rounded-lg  "
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {partMatOptions.length === 0 ? (
                                      <>
                                        <img
                                          src={noDataIcon}
                                          alt=""
                                          className="w-12"
                                        />
                                        <p className="mb-2 mt-2 text-sm text-gray-500  dark:text-gray-400">
                                          <span className="Text_Primary Service_Alert_Title ">
                                            {t("No items to show")}{" "}
                                          </span>
                                        </p>
                                        <label className="Text_Secondary Helper_Text mb-4">
                                          {t(
                                            "No materials added to this work order."
                                          )}
                                        </label>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {(currentStatus !== 4 &&
                                      currentStatus !== 6 &&
                                      currentStatus !== 1 &&
                                      currentStatus === 7) ||
                                      status === "Rectified" ||
                                      currentStatus === 5 ||
                                      currentStatus === 6 ? (
                                      <></>
                                    ) : (
                                      <Buttons
                                        className="Secondary_Button"
                                        icon="pi pi-plus"
                                        label={"Add Material Requisition"}
                                        onClick={() => {
                                          navigate(
                                            `/materialrequestlist?add=`,
                                            {
                                              state: {
                                                wo_ID: WO_ID,
                                                remark:
                                                  selectedDetails?.WO_REMARKS,
                                                MATREQ_ID:
                                                  selectedDetails?.MATREQ_ID,
                                              },
                                            }
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </label>
                              </div>
                            </Card>
                          )}
                          {partMatOptions.length > 0 && (
                            <Card className="mt-2">
                              <div>
                                {selectedDetails?.ISMATAPPROVALCNC === false &&
                                  selectedDetails?.ISMATAPPROVED === false &&
                                  selectedDetails?.CURRENT_STATUS === 5 &&
                                  selectedDetails?.SUB_STATUS === "6" ? (
                                  <>
                                    <div className="reviewContainer">
                                      <div className="flex justify-between">
                                        <div className="flex flex-wrap">
                                          <div className="flex flex-wrap">
                                            <img
                                              src={reviewIcon}
                                              alt=""
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-3">
                                              <label className="Text_Primary mb-2 review_Service_Header_Text">
                                                Material Requisition
                                              </label>

                                              {selectedDetails?.SUB_STATUS ===
                                                "6" &&
                                                decryptData(
                                                  localStorage.getItem(
                                                    LOCALSTORAGE?.ROLETYPECODE
                                                  )
                                                ) === "T" ? (
                                                <>
                                                  {materiallist[0]?.REMARKS !==
                                                    null ||
                                                    materiallist[0]?.REMARKS !==
                                                    "" ||
                                                    materiallist[0]?.REMARKS !==
                                                    undefined ? (
                                                    <>
                                                      <p>
                                                        {
                                                          materiallist[0]
                                                            ?.REMARKS
                                                        }
                                                      </p>
                                                    </>
                                                  ) : (
                                                    <>{""}</>
                                                  )}
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              {(materiallist[0]?.REMARKS ===
                                                "" ||
                                                materiallist[0]?.REMARKS ===
                                                null) &&
                                                decryptData(
                                                  localStorage.getItem(
                                                    LOCALSTORAGE?.ROLETYPECODE
                                                  )
                                                ) === "T" ? (
                                                "No remarks Added"
                                              ) : (
                                                <></>
                                              )}
                                              {selectedDetails?.SUB_STATUS ===
                                                "6" &&
                                                (decryptData(
                                                  localStorage.getItem(
                                                    LOCALSTORAGE?.ROLETYPECODE
                                                  )
                                                ) === "S" ||
                                                  decryptData(
                                                    localStorage.getItem(
                                                      LOCALSTORAGE?.ROLETYPECODE
                                                    )
                                                  ) === "SA") && (
                                                  <>
                                                    <p className="Text_Primary Helper_Text">
                                                      Review and approve the
                                                      material requisition for
                                                      this work order.
                                                    </p>
                                                  </>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                        <SidebarVisibal
                                          reassignVisible={reassignVisible}
                                          headerTemplate={
                                            selectedDetails?.STATUS_DESC
                                          }
                                          // selectedParts={selectedParts}
                                          MATERIAL_LIST={materiallist}
                                          PART_LIST={partMatOptions}
                                          subStatus={subStatus}
                                          selectedDetails={selectedDetails}
                                          getOptions={getOptions}
                                          IsVisibleMaterialReqSideBar={
                                            IsVisibleMaterialReqSideBar
                                          }
                                          setVisibleMaterialReqSideBar={
                                            setVisibleMaterialReqSideBar
                                          }
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>

                              <div className="flex flex-wrap justify-between">
                                <h6 className="Service_Header_Text">
                                  Material Details
                                </h6>
                                {currentStatus !== 4 &&
                                  currentStatus !== 6 &&
                                  currentStatus !== 1 &&
                                  currentStatus !== 7 &&
                                  currentStatus !== 5 ? (
                                  <Buttons
                                    className="Secondary_Button"
                                    icon="pi pi-plus"
                                    label={"Add Material Requisition"}
                                    onClick={() => {
                                      navigate(
                                        `/materialrequestlist?add=`,
                                        {
                                          state: {
                                            wo_ID: WO_ID,
                                            remark: selectedDetails?.WO_REMARKS,
                                          },
                                        }
                                      );
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="mt-2">
                                <DataTable
                                  value={partMatOptions}
                                  showGridlines
                                  emptyMessage={t("No Data found.")}
                                  footer={footer}
                                >
                                  <Column
                                    field="PART_NAME"
                                    header="Material Name"
                                    className="w-30"
                                    body={(rowData: any) => {
                                      return (
                                        <>
                                          <div>
                                            <label className="Text_Primary Service_Alert_Title">
                                              {rowData?.PART_NAME}
                                            </label>
                                            <p className="  Text_Secondary Helper_Text">
                                              {rowData?.PART_CODE}
                                            </p>
                                          </div>
                                        </>
                                      );
                                    }}
                                  ></Column>

                                  <Column
                                    field="MATREQ_NO"
                                    header={t("Mat Req No")}
                                    className="w-30"
                                    body={(rowData: any) => {
                                      return (
                                        <>
                                          <p
                                            className={`${selectedDetails?.ISMATAPPROVALCNC ===
                                              false &&
                                              selectedDetails?.ISMATAPPROVED ===
                                              false &&
                                              selectedDetails?.CURRENT_STATUS ===
                                              5 &&
                                              selectedDetails?.SUB_STATUS ===
                                              "6"
                                              ? "cursor-pointer"
                                              : ""
                                              } `}
                                            onClick={() => {
                                              GetVisibleSiderBar(0);
                                            }}
                                          >
                                            {rowData.MATREQ_NO}
                                          </p>
                                        </>
                                      );
                                    }}
                                  ></Column>
                                  <Column
                                    field="ISSUED_QTY"
                                    header="Quantity"
                                  ></Column>

                                  <Column
                                    field="STATUS_DESC"
                                    header="Status"
                                  ></Column>
                                </DataTable>
                              </div>
                            </Card>
                          )}
                        </TabPanel>
                      )}
                      <TabPanel headerTemplate={ActivityHeaderTemplate}>
                        <ActivityTimelineRE activityTimeLineData={timelineList} />
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
                <div className=" mt-3 ">
                  <SLATimeDuration slaTimeDetails={selectedDetails} currentStatus={currentStatus} getOptionDetailsOverdue={getOptionDetailsOverdue} />
                  <ShowAssigneeList assigneeList={technicianList} TeamName={("")} isInfraAssignee={false} />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </form>
      </section>
    </>
  );
};

export default memo(WorkOrderDetailForm);
