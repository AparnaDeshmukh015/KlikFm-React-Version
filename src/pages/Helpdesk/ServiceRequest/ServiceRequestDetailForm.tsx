import Buttons from "../../../components/Button/Button";
import { Card } from "primereact/card";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import "../../../components/Button//Button.css";
import Field from "../../../components/Field";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { toast } from "react-toastify";
import Select from "../../../components/Dropdown/Dropdown";
import moment from "moment";
import CancelDialogBox from "../../../components/DialogBox/CancelDialogBox";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
  LOCALSTORAGE,
  saveTracker,
  formateDate,
  COOKIES,
  isAws,
} from "../../../utils/constants";
import {
  eventNotification,
  helperEventNotification,
} from "../../../utils/eventNotificationParameter";
import { InputTextarea } from "primereact/inputtextarea";
import userIcon from "../../../assest/images/Avatar.png";
import "../Workorder/WorkorderMaster.css";
import { TabView, TabPanel } from "primereact/tabview";
import noDataIcon from "../../../assest/images/nodatafound.png";
import MultiSelects from "../../../components/MultiSelects/MultiSelects";
import { Dialog } from "primereact/dialog";
import { Chip } from "primereact/chip";
import "./ServiceRequest.css";

import { decryptData } from "../../../utils/encryption_decryption";
import LoaderS from "../../../components/Loader/Loader";
import ReopenDialogBox from "../../../components/DialogBox/ReopenDialogBox";
import WorkCompletion from "../../../components/DialogBox/WorkCompletion";
import { EquipmentSummaryDetails } from "../Workorder/WorkOrderHelperRE.tsx/EquipmentSummaryDetails";
import { AcceptedDetails } from "../Workorder/WorkOrderHelperRE.tsx/AcceptedDetails";
import { RectifiedDetails } from "../Workorder/WorkOrderHelperRE.tsx/RectifiedDetails";
import { CompletedDetails } from "../Workorder/WorkOrderHelperRE.tsx/CompletedDetails";
import { ReporterDetails } from "../Workorder/WorkOrderHelperRE.tsx/ReporterDetails";
import { ActivityTimelineRE } from "../Workorder/WorkOrderHelperRE.tsx/ActivityTimelineRE";
import { ShowAssigneeList } from "../Workorder/InfraWorkrderHelper/ShowAssigneeList";
import { builddWorkOrderNotification, buildServiceRequestNotification, deleteDocument, getDefaultValues, getDocmentList, getLocation, getOptionDetails, helperPara, isOnlySpaces } from "./utils/helperServiceRequestReal";
import { locationOptionTemplate, selectedLocationTemplate } from "./utils/HelperServiceRequestRealComponent";
import { AddServiceRequestReal } from "./utils/AddServiceRequestReal";
import ServiceRequestDetailsCard from "./utils/ServiceRequestDetailsReal";
import { helperAwsFileupload } from "./utils/helperAwsFileupload";

const ServiceRequestDetailForm = (props: any) => {
  let [CURRENT_STATUS, setCurrentStatus] = useState<any>(0);
  const [selectedFacility, menuList]: any = useOutletContext();
  const [transactionStatus, setTransactionStatus] = useState<any | null>();
  const { t } = useTranslation();
  const navigate: any = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [Descriptionlength, setDescriptionlength] = useState(0);
  const [options, setOptions] = useState<any | null>([]);
  const [TeamList, setTeamList] = useState<any | null>([]);
  const [workOrderOption, setWorkOrderOption] = useState<any | null>([]);
  const [technician, setTechnician] = useState<any | null>([]);
  const [Currenttechnician, setCurrentTechnician] = useState<any | null>([]);
  const [selectedDetails, setSelectedDetails] = useState<any>([]);
  const [assignStatus, setAssignStatus] = useState(false);
  const [technicianStatus, setTechnicianStatus] = useState<any | null>();
  const [locationtypeOptions, setlocationtypeOptions] = useState([]);
  const [technicianData, setTechnicianData] = useState<any | null>([]);
  const [loading, setLoading] = useState<any | null>(false);
  const [isloading, setisloading] = useState<any | null>(false);
  const [editStatus, setEditStatus] = useState(true);
  const [PriorityEditStatus, setPriorityEditStatus] = useState(false);
  const [IsSubmit, setIsSubmit] = useState<any | null>(false);
  const [IsGenerateWorkOrder, setIsGenerateWorkOrder] = useState<any | null>(false);
  const [docCancel, setdocCancel] = useState<any | null>([]);
  const [docOption, setDocOption] = useState<any | null>([]);
  const [signatureDoc, setSignatureDoc] = useState<any | null>([]);
  const [type, setType] = useState<any | null>([]);
  const [technicianList, setTechnicianList] = useState<any | null>([]);
  const [ActivityTimeLineList, setActivityTimeLineList] = useState<any | null>([]);
  const [severity, setSeverity] = useState<any | null>([]);
  const [assetList, setAssetList] = useState<any | null>([]);
  const getId: any = localStorage.getItem("Id");
  const dataId = JSON.parse(getId);
  const [error, setError] = useState<any | null>(false);
  const [locationId, setLocationId] = useState<any | null>("");
  const [cancelError, setCancelError] = useState<any | null>(false);
  const [uploadSupportMandatory, setUploadSupportMandatory] = useState<any | null>(false);
  let { pathname } = useLocation();
  const [uploadError, setUploadError] = useState<any | null>(false);
  const [iseditDetails, setiseditDetails] = useState<any | null>(false);
  const [isShowAssignee, setisShowAssignee] = useState<any | null>(false);
  const [isPreCondition, setIsPreCondtion] = useState<any | null>(false);
  const [isPreConditionStatus, setIsPreConditionStatus] = useState<any | null>(false);
  const [Remarklength, setReamrkLength] = useState<any | null>(0);
  let locationData: any = localStorage.getItem("LOCATIONNAME");
  const IsAssignAdd = decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN));
  let locationIdData: any = JSON.parse(locationData);
  let showdetails = true;
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => {
      if (detail?.FUNCTION_CODE === "AS007") {
        showdetails = false;
      }
      return detail.URL === pathname;
    })[0];

  const currentWorkOrderRights = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => {
      return detail.URL === "/workorderlist";
    })[0];

  const assestTypeLabel: any = [
    { name: "Equipment", key: "A" },
    { name: "Soft Services", key: "N" },
  ];

  const { search } = useLocation();
  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setDescriptionlength(value?.length);
  };
  const [uploadMandatroy, setUploadMandatroy] = useState<any | null>(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    resetField,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues:getDefaultValues(props, search, locationIdData),
    mode: "onSubmit",
  });
  const doclist = watch("DOC_LIST");
  useEffect(() => {
    const sevrityList: any = severity?.filter(
      (f: any) => f.SEVERITY_ID === f?.SEVERITY_ID
    );
    setSeverity(sevrityList);
  }, [PriorityEditStatus]);

  const onClickEditButton = () => {
    setdocCancel([]);
    setiseditDetails(!iseditDetails);
    setisShowAssignee(!isShowAssignee);
    setAssignStatus(!assignStatus);
  };

  const OpenAssignUserPopUp = () => {
    if (!assignStatus) {
      setEditStatus(true);
      setAssignStatus(true);
      setisShowAssignee(true);
    } else if (assignStatus) {
      setEditStatus(false);
      setAssignStatus(false);
      setisShowAssignee(false);
    }
  };

  const onClickCancelButton = () => {
    setisShowAssignee(false);
    setValue("TECH_ID", []);
    setValue("ASSIGN_TEAM_ID", "");
    handleClearAll();
    if (editStatus && assignStatus && !PriorityEditStatus) {
      setAssignStatus(false);
      setiseditDetails(false);
      return;
    } else if (
      editStatus &&
      assignStatus &&
      !PriorityEditStatus &&
      search === "?add="
    ) {
      setAssignStatus(false);
      navigate("/servicerequestlist");
      return;
    } else if (editStatus && !assignStatus && PriorityEditStatus) {
      setValue("SEVERITY_CODE", "");
      setPriorityEditStatus(false);
      return;
    } else if (editStatus && assignStatus && PriorityEditStatus) {
      setAssignStatus(false);
      setPriorityEditStatus(false);
      return;
    } else if (
      editStatus &&
      assignStatus &&
      !PriorityEditStatus &&
      search === "?edit="
    ) {
      setValue("ASSIGN_TEAM_ID", "");
      setAssignStatus(false);
      return;
    } else {
      navigate("/servicerequestlist");
    }
  };

  const ASSET_NONASSET: any = watch("ASSET_NONASSET");
  const watchAll: any = watch();

  const onSubmit = useCallback(
    async (payload: any, e: any) => {
      setIsSubmit(true);
      if (IsGenerateWorkOrder === true && search === "?edit=") {
        return true;
      }
       console.log(docCancel, 'docCancel111')
      // documentValidation(search, payload, uploadSupportMandatory,selectedDetails, setUploadError, setIsSubmit)
      if (search === "?add=" && uploadSupportMandatory) {
        if (payload?.DOC_LIST?.length === 0) {
          toast.error("Please select required fields");

          setUploadError(true);
          setIsSubmit(false);
          return true;
        }
      } else if (
        search === "?edit=" &&
        uploadSupportMandatory &&
        selectedDetails?.ISEDITSRQ === 1
      ) {
        if (payload?.DOC_LIST?.length === 0) {
          toast.error("Please select required fields");
          setUploadError(true);
          setIsSubmit(false);
          return true;
        }
      }
      setAssignStatus(false);
      setisShowAssignee(false);
      setiseditDetails(false);
      setIsGenerateWorkOrder(true);
      const buttonMode: any = e?.nativeEvent?.submitter?.name;
      if (
        buttonMode === "PRECANCEL" &&
        technicianList?.length === 0 &&
        payload?.REMARKS?.trim() === ""
      ) {
        toast?.error("Please fill the required field");
        setCancelError(true);
        setError(false);
        setIsSubmit(false);
        setIsGenerateWorkOrder(false);
        return;
      }
      setUploadError(false);

      if (buttonMode === "Accept" || buttonMode === "Reopen") {
        return;
      }
      if (search === "?add=" && IsAssignAdd && payload?.TECH_ID?.length === 0 && technicianStatus === "M") {
        toast?.error("Please fill the required field");
        setError(true);
        setIsSubmit(false);
        setIsGenerateWorkOrder(false);
        return;
      }
      if (buttonMode === "CONVERT" && technicianList?.length === 0) {
        toast?.error("Please fill the required field");
        setError(true);
        setIsSubmit(false);
        setIsGenerateWorkOrder(false);
        return;
      }
      if (
        buttonMode === "CONVERT" &&
        technicianList?.length === 0 &&
        assignStatus
      ) {
        toast?.error("Please fill the required field");
        setIsSubmit(false);
        setIsGenerateWorkOrder(false);
        return;
      }

      let isValid: any = true;
      payload.ASSET_NONASSET = ASSET_NONASSET?.key
        ? ASSET_NONASSET?.key
        : ASSET_NONASSET;
      payload.ASSET_ID =
        iseditDetails === true
          ? payload?.ASSET_ID?.ASSET_ID
          : payload?.ASSET_ID?.ASSET_ID !== undefined
            ? payload?.ASSET_ID?.ASSET_ID
            : selectedDetails?.ASSET_ID;

      payload.LOCATION_ID =
        payload?.LOCATION_ID?.LOCATION_ID !== undefined
          ? payload?.LOCATION_ID?.LOCATION_ID
          : selectedDetails?.LOCATION_ID;

      payload.CONTACT_NAME =
        search === "?edit="
          ? selectedDetails?.CONTACT_NAME
          : payload?.REPORTER_NAME;
      payload.CONTACT_EMAIL =
        search === "?edit="
          ? selectedDetails?.CONTACT_EMAIL
          : payload?.REPORTER_EMAIL;
      payload.CONTACT_PHONE =
        search === "?edit="
          ? selectedDetails?.CONTACT_PHONE
          : payload?.REPORTER_MOBILE;
      payload.REQ_ID =
        payload?.REQ_ID?.REQ_ID !== undefined
          ? payload?.REQ_ID?.REQ_ID
          : selectedDetails?.REQ_ID;

      payload.SEVERITY_CODE = payload?.SEVERITY_CODE?.SEVERITY_ID !== undefined ?
        payload?.SEVERITY_CODE?.SEVERITY_ID
        : selectedDetails?.SEVERITY_CODE;

      payload.ACTIVE = 1;
      payload.ASSIGN_TEAM_ID =
        payload.ASSIGN_TEAM_ID?.TEAM_ID !== undefined
          ? payload.ASSIGN_TEAM_ID?.TEAM_ID
          : selectedDetails?.TEAM_ID;

      payload.ASSETGROUP_ID =
        payload?.GROUP?.ASSETGROUP_ID !== undefined
          ? payload?.GROUP?.ASSETGROUP_ID
          : selectedDetails?.ASSETGROUP_ID;

      payload.ASSETTYPE_ID =
        iseditDetails === true
          ? payload?.TYPE?.ASSETTYPE_ID
          : payload?.TYPE?.ASSETTYPE_ID !== undefined
            ? payload?.TYPE?.ASSETTYPE_ID
            : selectedDetails?.ASSETTYPE_ID;

      payload.SER_REQ_NO = selectedDetails?.SER_REQ_NO
        ? selectedDetails?.SER_REQ_NO
        : buttonMode === "CONVERT"
          ? selectedDetails?.SER_REQ_NO
          : selectedDetails?.SER_REQ_NO;
      if (locationtypeOptions?.length > 0) {
        locationtypeOptions.forEach((element: any) => {
          if (payload?.LOCATION_ID === element?.LOCATION_ID) {
            payload.LOCATION_DESCRIPTION = element?.LOCATION_DESCRIPTION;
          } else {
          }
        });
      } else {
        payload.LOCATION_DESCRIPTION = selectedDetails?.LOCATION_DESCRIPTION;
      }
      console.log(payload, 'final payload')
 
      setError(false);
      payload.WO_DATE =
        search === "?edit="
          ? props?.selectedData?.WO_DATE
          : moment(new Date()).format("DD-MM-YYYY");
      payload.MODE =
        buttonMode !== "" ? buttonMode : search === "?edit=" ? "E" : "A";
      delete payload?.ASSETTYPE;
      delete payload?.DOC;
      delete payload?.REQUESTTITLE_ID;
      delete payload?.RAISEDBY_ID;
      delete payload?.GROUP;
      delete payload?.TYPE;
      delete payload?.REPORTER_MOBILE;
      delete payload?.REPORTER_NAME;
      delete payload?.REPORTER_EMAIL;
      payload.TYPE = "13";
      payload.PARA =helperPara(buttonMode, search, t, technicianStatus)
        
      if (buttonMode === "CANCEL") {
        if (
          payload?.REMARKS === undefined ||
          payload?.REMARKS === " " ||
          payload?.REMARKS === null
        ) {
          toast.error("Please enter the remarks");
          setIsGenerateWorkOrder(false);
          setIsSubmit(false);
          return;
        }
        if (isOnlySpaces(payload?.REMARKS)) {
          toast.error("Please enter the remarks");
          setIsGenerateWorkOrder(false);
          setIsSubmit(false);
          return;
        }
      }

      const TECH_DATA = payload?.TECH_ID?.filter(
        (f: any) => f.TEAM_ID === payload?.ASSIGN_TEAM_ID
      );

      if (TECH_DATA?.length === technicianList?.length) {
        const sameUserIds = TECH_DATA.map((t: any) => t.USER_ID)
          .sort((a: any, b: any) => a - b)
          .every(
            (id: any, index: any) =>
              id ===
              technicianList
                .map((t: any) => t.USER_ID)
                .sort((a: any, b: any) => a - b)[index]
          );
        if (sameUserIds) {
          payload.TECH_ID = [];
        }
      } else {
        payload.TECH_ID =
          payload?.TECH_ID?.length > 0 ? TECH_DATA : technicianList;
      }

      if (
        technicianStatus === "M" &&
        decryptData(localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)) !== "T" &&
        decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) === true
      ) {
        if (!PriorityEditStatus) {
          if (TECH_DATA === 0) {
            isValid = false;
          }
        }
      }
debugger
      if (isValid === true) {
        try {
          
         
          setdocCancel([]);
          const res = await callPostAPI(
            ENDPOINTS.SAVE_SERVICEREQUEST,
            payload,
            "HD004"
          );
  
          if (res?.FLAG === true) {
             if (docCancel?.length > 0 && search === "?edit=") {
            deleteDocument(selectedDetails, docCancel);
          }
          if(isAws === true){    
          helperAwsFileupload(payload?.DOC_LIST);
          }
            const resService = await callPostAPI(
              ENDPOINTS.GET_SERVICEREQUEST_DETAILS,
              {
                WO_NO: res?.WO_NO,
                WO_ID: 0,
              }
            );
            setCurrentStatus(
              resService?.SERVICEREQUESTDETAILS[0]?.CURRENT_STATUS
            );
            if (buttonMode !== "CONVERT" && technicianStatus === "M") {
              if (resService?.FLAG === 1) {
                buildServiceRequestNotification(currentMenu, buttonMode,search,selectedDetails,resService,watchAll,res, PriorityEditStatus)
               setIsGenerateWorkOrder(false);
                setIsSubmit(false);
              }
            } else {
              const resWork: any = await callPostAPI(
                ENDPOINTS.GET_WORKORDER_DETAILS,
                {
                  WO_ID:
                    technicianStatus === "A" &&
                      resService?.SERVICEREQUESTDETAILS[0]?.ISSERVICEREQ === false
                      ? resService?.SERVICEREQUESTDETAILS[0]?.WO_ID
                      : selectedDetails?.WO_ID,
                }
              );
              if (resWork?.FLAG === 1) {
                builddWorkOrderNotification(resWork,search)
                setIsSubmit(false);
                setIsGenerateWorkOrder(false);
              }
            }

            toast?.success(res?.MSG);
            setIsSubmit(false);
            if (
              resService?.SERVICEREQUESTDETAILS[0]?.WO_ASSIGN === "A" &&
              resService?.SERVICEREQUESTDETAILS[0]?.ISSERVICEREQ === false
            ) {
              localStorage.setItem(
                "WO_ID",
                resService?.SERVICEREQUESTDETAILS[0]?.WO_ID
              );
              setIsGenerateWorkOrder(false);

              if (
                decryptData(
                  localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                ) === "O"
              ) {
                navigate(`/servicerequestlist`);
                props?.getAPI();
              } else {
                setTimeout(() => {
                  if(currentWorkOrderRights === undefined) {
                      navigate(`/servicerequestlist`);
                  }else {
                  navigate(`/workorderlist?edit=`);
                  }
                }, 1000);
              }
            } else if (buttonMode === "CONVERT") {
              setIsGenerateWorkOrder(false);
              navigate(`/servicerequestlist`);
            } else if (
              (PriorityEditStatus === true || assignStatus === true) &&
              search === "?edit="
            ) {
              setPriorityEditStatus(false);
              setAssignStatus(false);
              setEditStatus(true);
              setError(false);
              setIsSubmit(false);
              setIsGenerateWorkOrder(false);
             getOptionDetails(setValue, setSelectedDetails,selectedDetails, setLoading, options, setTechnicianList, locationtypeOptions
       , getWoOrderList, workOrderOption, assetList, type, TeamList, Currenttechnician, setTechnicianData, setActivityTimeLineList, setCurrentStatus, props, setDescriptionlength,
       GET_ASSETGROUPTEAMLIST);
              setiseditDetails(false);
              navigate(`/servicerequestlist?edit=`);
            } else {
              navigate(`/servicerequestlist`);
            }
          } else {
            setIsSubmit(false);
            setIsGenerateWorkOrder(false);
            toast.error(res?.MSG);
          }
        } catch (error: any) {
          setIsSubmit(false);
          setIsGenerateWorkOrder(false);
          toast?.error(error);
        }
      } else {
        if (PriorityEditStatus) {
          setPriorityEditStatus(false);
          setAssignStatus(false);
          setEditStatus(true);
          setError(false);
          setIsSubmit(false);
          setIsGenerateWorkOrder(false);
        } else {
          setIsSubmit(false);
          setIsGenerateWorkOrder(false);
          setError(true);
          toast.error("Please fill the required fields");
        }
      }
    },
    [
      ASSET_NONASSET,
      technicianList,
      assignStatus,
      selectedDetails,
      PriorityEditStatus,
      locationtypeOptions,
      search,
      props,
      t,
      currentMenu,
      decryptData,
      helperEventNotification,
      navigate,
      eventNotification,
      isOnlySpaces,
      formateDate,
      localStorage,
      setIsSubmit,
      setIsGenerateWorkOrder,
      setError,
      setPriorityEditStatus,
      setAssignStatus,
      setEditStatus,
      toast,
      callPostAPI,
      ENDPOINTS,
      docCancel
    ]
  );

  const GetOpenList = () => {
    navigate(`/servicerequestlist`, { state: "workorder" });
  };
  
  const getOptions = async () => {
    try {
      setLoading(true);
      const res = await callPostAPI(
        ENDPOINTS?.GET_SERVICEREQUST_MASTERLIST,
        {},
        "HD004"
      );
      if (res?.FLAG === 1) {
        setOptions({
          userList: res?.USERLIST,
          severityLIST: res?.SEVERITYLIST,
          wo_list: res?.WORIGHTSLIST,
          assetGroup: res?.ASSETGROUPLIST?.filter(
            (f: any) => f?.ASSETGROUP_TYPE === "A"
          ),
          serviceGroup: res?.ASSETGROUPLIST.filter(
            (f: any) => f?.ASSETGROUP_TYPE === "N"
          ),
          assetType: res?.ASSETTYPELIST,
          assestOptions: res?.ASSETLIST,
          userMaster: res?.USERLIST,
        });
        setTeamList(res?.TEAMLIST);
        setSeverity(res?.SEVERITYLIST);
        //setUserId(parseInt(id));
        const userData: any = decryptData(localStorage?.getItem("USER"));
        const userDetails: any = userData;
        setValue("REPORTER_NAME", userDetails?.USER_NAME);
        setValue("REPORTER_EMAIL", userDetails?.USER_EMAILID);
        setValue("REPORTER_MOBILE", userDetails?.USER_MOBILENO);
        setTransactionStatus({
          cancel: res?.WORIGHTSLIST?.find(
            (f: any) => f?.FUNCTION_CODE === "SR002"
          ),
        });
        setLocationId(locationIdData);
        if (search === "?edit=") {
          await getOptionDetails(setValue, setSelectedDetails,selectedDetails, setLoading, options, setTechnicianList, locationtypeOptions
       , getWoOrderList, workOrderOption, assetList, type, TeamList, Currenttechnician, setTechnicianData, setActivityTimeLineList, setCurrentStatus, props, setDescriptionlength,
       GET_ASSETGROUPTEAMLIST)
          await getDocmentList(localStorage.getItem("WO_ID"), setisloading, setValue,setDocOption, setSignatureDoc);
        }
      }
    } catch (error: any) {
      toast?.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationtypeOptions?.length > 0 && selectedDetails?.LOCATION_ID) {
      const selectedLoaction: any = locationtypeOptions?.filter(
        (f: any) => f?.LOCATION_ID === selectedDetails?.LOCATION_ID
      );

      if (selectedLoaction?.length > 0) {
        setValue("LOCATION_ID", selectedLoaction[0]);
      }
    }
  }, [selectedDetails?.LOCATION_ID, iseditDetails, locationtypeOptions]);

  useEffect(() => {
    console.log(9999)
    // if(search === "?add=") {
    if(search !== "?edit=") {
    const selectedSeverity =
      options?.severityLIST?.length >= 1
        ? options?.severityLIST.find(
          (option: any) => option?.SEVERITY === "Low"
        )
        : null;

    setValue("SEVERITY_CODE", selectedSeverity);
      }
  }, [options?.severityLIST]);
   console.log("docCancel", docCancel);
  const getWoOrderList = async (ASSETGROUP_ID: any, ASSET_NONASSET?: any) => {
    setDescriptionlength(0);
    const payload: any = {
      ASSETGROUP_ID: ASSETGROUP_ID,
      ASSET_NONASSET: ASSET_NONASSET?.key
        ? ASSET_NONASSET?.key
        : ASSET_NONASSET,
    };

    const res = await callPostAPI(
      ENDPOINTS.GET_SERVICEREQUEST_WORKORDER,
      payload,
      "HD004"
    );

    if (res?.FLAG === 1) {
      setValue("REQ_ID", "");
      setWorkOrderOption(res?.WOREQLIST);
      setCurrentTechnician([]);
      setTechnicianData([]);
      watchAll.TECH_ID = [];
    } else if (res?.FLAG === 0) {
      setWorkOrderOption([]);
      setCurrentTechnician([]);
      setTechnicianData([]);
      watchAll.TECH_ID = [];
    }
    if (search === "?add=" || search === "?edit=") {
      await GET_ASSETGROUPTEAMLIST(ASSETGROUP_ID);
    }
  };

  useEffect(() => {
    if (watchAll?.ASSET_NONASSET?.key !== undefined) {
      if (selectedDetails?.ASSET_NONASSET === watchAll?.ASSET_NONASSET?.key) {
        setValue("TYPE", "");
        setValue("ASSET_ID", "");
        setType([]);
        setAssetList([]);
      } else {
        setValue("TYPE", "");
        setValue("ASSET_ID", "");
        setType([]);
        setAssetList([]);
        setValue("REQ_ID", "");
        setValue("WO_REMARKS", "");
      }
      //
    }
  }, [watchAll?.ASSET_NONASSET]);

  const statusColor = (element: any) => {
    const baseStatus = element?.split(" (Re-open)")[0];
    let data: any = localStorage?.getItem("statusColorCode");
    const dataColor: any = JSON?.parse(data);
    return dataColor?.find((item: any) => item?.STATUS_DESC === baseStatus)
      ?.COLORS;
  };
  const GET_ASSETGROUPTEAMLIST = async (ASSETGROUP_ID: any) => {
    const payload: any = {
      ASSETGROUP_ID: ASSETGROUP_ID,
    };
    const res = await callPostAPI(
      ENDPOINTS?.GET_ASSETGROUPTEAMLIST,
      payload,
      "HD004"
    );

    if (res?.FLAG === 1) {
      setTeamList(res?.TEAMLIST);
      setTechnician(res?.TECHLIST);
      setCurrentTechnician(res?.TECHLIST);
    } else {
      setTeamList([]);
      setTechnician([]);
    }
  };

  useEffect(() => {
    if (watchAll?.ASSET_NONASSET) {
      setValue("TYPE", "");
      setValue("ASSET_ID", "");
      setType([]);
      setAssetList([]);
    }
  }, [watchAll?.ASSET_NONASSET]);

  useEffect(() => {
    if (watchAll?.GROUP) {
      setValue("ASSET_ID", "");
      const assetGroupId: any = watchAll?.GROUP?.ASSETGROUP_ID
        ? watchAll?.GROUP?.ASSETGROUP_ID
        : watchAll?.GROUP?.ASSETGROUP_ID;
      const assetTypeList: any = options?.assetType?.filter(
        (f: any) => f?.ASSETGROUP_ID === assetGroupId
      );
      setType(assetTypeList);
    }
  }, [watchAll?.GROUP]);

  useEffect(() => {
    if (watchAll?.TYPE) {
      const assetTypeId = watchAll?.TYPE?.ASSETTYPE_ID
        ? watchAll?.TYPE?.ASSETTYPE_ID
        : watchAll?.TYPE?.ASSETTYPE_ID;
      const assetList: any = options?.assestOptions?.filter(
        (f: any) => f.ASSETTYPE_ID === assetTypeId
      );

      setAssetList(assetList);
    }
  }, [watchAll?.TYPE]);

 

  const handlerShowDetails = () => {
    const payload = {
      ASSET_ID: selectedDetails?.ASSET_ID,
      WO_ID: props?.selectedData?.WO_ID,
    };

    if (selectedDetails?.ASSET_NONASSET === "A") {
      navigate(`/assetmasterlist?edit=`, { state: payload });
    } else {
      navigate(`/servicemasterlist?edit=`, { state: payload });
    }
  };

 

  const GetAddAssignee = (e: any) => {
    if (e?.target?.value !== "" || e?.target?.value !== undefined) {
      setCurrentTechnician(technician);
    }
  };

  let techData: any = [];
  let techData1: any = [];

  const handleRemove = (removeTechnician: any) => {
    techData = watchAll.TECH_ID;
    setValue("TECH_ID", techData1);
    watchAll.TECH_ID = watchAll?.TECH_ID?.filter(
      (f: any) => f?.USER_ID !== removeTechnician?.USER_ID
    );
    setTechnicianData(watchAll?.TECH_ID);
  };

  const handleClearAll = () => {
    setTechnicianData([]);
  };
  
  useEffect(() => {
    if (currentMenu || iseditDetails) {
      setCurrentStatus(props?.selectedData?.CURRENT_STATUS);
      (async function () {
        if (search === "?add=" || iseditDetails) {
          await getLocation(setlocationtypeOptions,  search, iseditDetails);
        }
        await getOptions();
        await saveTracker(currentMenu);
      })();
    }
  }, [currentMenu, iseditDetails]);

  useEffect(() => {
   
    if (
      (!isSubmitting && Object?.values(errors)[0]?.type === "required") ||
      (!isSubmitting && Object?.values(errors)[0]?.type === "maxLength")
    ) {
      if (search === "?add=" && uploadSupportMandatory === true) {
          
        if (doclist?.length === 0) {
       
          const check: any = Object?.values(errors)[0]?.message;
          toast?.error(t(check));
          setUploadError(true);
        }
      } else if(technicianStatus === "A"){
     
         setError(false);
      }else {
    
        const check: any = Object?.values(errors)[0]?.message;
        toast?.error(t(check));
      }
      if (
        technicianStatus === "M" &&
        decryptData(localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)) !== "T"
      ) {
        if (watchAll?.TECH_ID?.length <= 0) {
          setError(true);
        }
      }
    }
  }, [isSubmitting]);


  const getFacility = async () => {
    const res = await callPostAPI(ENDPOINTS?.BUILDING_DETAILS, {}, "HD004");
    setTechnicianStatus(res?.FACILITYDETAILS[0]?.WO_ASSIGN);

    setUploadSupportMandatory(
      res?.FACILITYDETAILS[0]?.isImgRequired === true ? true : false
    );
    setUploadMandatroy(
      res?.FACILITYDETAILS[0]?.isImgRequired === true ? true : false
    );
    setIsPreCondtion(
      res?.FACILITYDETAILS[0]?.ISPRECONDITION === true ? true : false
    );
  };
 
  useEffect(() => {
    (async function () {
      await getFacility();
    })();
  }, [selectedFacility]);

  if (loading) {
    return <LoaderS />;
  }

  return (
    <>
      <section className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="fixedContainer">
            <div className="flex justify-between">
              <div>
                <p className="Helper_Text Menu_Active flex mb-1">
                  {`Service Request`}
                  {search === "?add=" && (
                    <p className="Helper_Text Menu_Active ">
                      {" "}
                      Add / New Service Request
                    </p>
                  )}
                </p>
                {search === "?add=" && (
                  <h6 className=" Text_Primary Main_Service_Header_Text mb-1">
                    {t("Add Service Request")}
                  </h6>
                )}
                {search === "?edit=" && (
                  <div className="flex gap-2">
                    <h6 className="Text_Primary  Main_Service_Header_Text mb-1">
                      {selectedDetails?.ASSETGROUP_NAME} &gt;{" "}
                      {selectedDetails?.REQ_DESC?.length > 100
                        ? `${selectedDetails?.REQ_DESC?.slice(0, 100)}...`
                        : selectedDetails?.REQ_DESC}
                    </h6>
                    <p
                      style={{
                        backgroundColor: statusColor(
                          selectedDetails?.CURRENT_STATUS_DESC
                        ),
                        borderRadius: "50px",
                        padding: "0.5rem 0.8rem ",
                        textAlign: "center",
                        width: "auto",
                        fontSize: "12px",
                      }}
                    >
                      {selectedDetails?.CURRENT_STATUS_DESC ?? ""}
                    </p>
                  </div>
                )}
                {search === "?edit=" && (
                  <>
                    <div className="flex gap-2">
                      <p className="Sub_Service_Header_Text Text_Secondary ">
                        {selectedDetails?.SER_REQ_NO}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div>
                {((search === "?add=" && editStatus) ||
                  (search === "?edit=" &&
                    (assignStatus || PriorityEditStatus))) &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.ISSERVICEREQ !== false && (
                    <Buttons
                      className="Secondary_Button w-20 me-2"
                      label={"Cancel"}
                      // onClick={props?.isClick}
                      onClick={() => {
                        onClickCancelButton();
                      }}
                    />
                  )}

                {((search === "?add=" && editStatus) ||
                  (search === "?edit=" &&
                    (assignStatus || PriorityEditStatus || iseditDetails))) &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.ISSERVICEREQ !== false && (
                    <Buttons
                      disabled={IsSubmit}
                      type="submit"
                      className="Primary_Button  w-20 me-2"
                      label={"Submit"}
                    />
                  )}

                {decryptData(
                  localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                ) !== "T" &&
                  (decryptData(
                    localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                  ) === "S" ||
                    decryptData(
                      localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                    ) === "SA") &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.ISSERVICEREQ === true &&
                  transactionStatus !== undefined &&
                  editStatus &&
                  !PriorityEditStatus &&
                  technicianList?.length > 0 &&
                  !iseditDetails && (
                    <CancelDialogBox
                      header={"Cancel Service Request"}
                      control={control}
                      setValue={setValue}
                      register={register}
                      paragraph={
                        "Are you sure you want to cancel the service request?"
                      }
                      watch={watch}
                      errors={errors}
                      IsSubmit={IsSubmit}
                      setIsSubmit={setIsSubmit}
                    />
                  )}
                {search === "?edit=" &&
                  editStatus &&
                  !PriorityEditStatus &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.WO_ASSIGN === "A" &&
                  !assignStatus &&
                  selectedDetails?.ISSERVICEREQ === true && (
                    <Buttons
                      className="Primary_Button me-2"
                      type="submit"
                      label={"View Work Order"}
                      name="CONVERT"
                    />
                  )}
                {search === "?edit=" &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.WO_ASSIGN === "M" &&
                  selectedDetails?.ISSERVICEREQ === true &&
                  editStatus &&
                  !assignStatus &&
                  !PriorityEditStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  !iseditDetails &&
                  isPreCondition &&
                  technicianList?.length === 0 && (
                    <Buttons
                      className="Primary_Button me-2"
                      type="button"
                      label={"Cancel - Pre Conditional"}
                      // name="CONVERT"

                      onClick={() => setIsPreConditionStatus(true)}
                    />
                  )}
                {search === "?edit=" &&
                  CURRENT_STATUS !== 6 &&
                  selectedDetails?.WO_ASSIGN === "M" &&
                  selectedDetails?.ISSERVICEREQ === true &&
                  editStatus &&
                  !assignStatus &&
                  !PriorityEditStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  !iseditDetails &&
                  !iseditDetails && (
                    <Buttons
                      className="Primary_Button me-2"
                      type="submit"
                      label={"Generate Work Order"}
                      name="CONVERT"
                      disabled={IsGenerateWorkOrder}
                    />
                  )}

                {search === "?edit=" &&
                  CURRENT_STATUS === 7 &&
                  selectedDetails?.IS_ACCEPTED === false &&
                  decryptData(
                    localStorage.getItem(LOCALSTORAGE?.REOPEN_ADD)
                  ) === true && (
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
                          reopentype="2"
                          getList={props?.getAPI}
                          formType={"Service Request"}
                          getAPI={props?.getAPI}
                          functionCode={"HD004"}
                        />
                      )}

                      {selectedDetails?.WO_TYPE === "CM" && (
                        <WorkCompletion
                          header={"Accept Work Completion"}
                          control={control}
                          setValue={setValue}
                          register={register}
                          watch={watch}
                          errors={errors}
                          getOptions={getOptions}
                        />
                      )}
                    </>
                  )}
                {iseditDetails && !assignStatus && (
                  <Buttons
                    label={"Cancel"}
                    className=" Secondary_Button  me-2"
                    type="button"
                    onClick={onClickEditButton}
                  />
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

          <div className=" mt-3 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
            <div className="col-span-2 woTabview">
              {(search === "?add=" || iseditDetails) && (
                <>
                    <AddServiceRequestReal
                    t={t}
                    control={control}
                    register={register}
                    setValue={setValue}
                    resetField={resetField}
                    watch={watch}
                    getValues={getValues}
                    errors={errors}
                    assestTypeLabel={assestTypeLabel}
                    options={options}
                    selectedDetails={selectedDetails}
                    type={type}
                    assetList={assetList}
                    locationtypeOptions={locationtypeOptions}
                    locationId={locationId}
                    setLocationId={setLocationId}
                    selectedLocationTemplate={selectedLocationTemplate}
                    locationOptionTemplate={locationOptionTemplate}
                    workOrderOption={workOrderOption}
                    Descriptionlength={Descriptionlength}
                    handleInputChange={handleInputChange}
                    isloading={isloading}
                    setIsSubmit={setIsSubmit}
                    uploadError={uploadError}
                    uploadSupportMandatory={uploadSupportMandatory}
                    docCancel={docCancel}
                    setdocCancel={setdocCancel}
                    getWoOrderList={getWoOrderList}
                    ASSET_NONASSET={ASSET_NONASSET}
                    technicianList={technicianList}
                    setType={setType}
                    setAssetList={setAssetList}
                    setWorkOrderOption={setWorkOrderOption}
                  />
                </>
              )}
              {search === "?edit=" && !iseditDetails && (
                <div className="serviceTabview">
                  <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  >
                    <TabPanel header="Details">
                     <ServiceRequestDetailsCard
                        t={t}
                        selectedDetails={selectedDetails}
                        PriorityEditStatus={PriorityEditStatus}
                        iseditDetails={iseditDetails}
                        control={control}
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        severity={severity}
                        isloading={isloading}
                        docOption={docOption}
                        currentMenu={currentMenu}
                        currentWorkOrderRights={currentWorkOrderRights}
                        formateDate={formateDate}
                        onClickEditButton={onClickEditButton}
                      />
                      {/* Equipment section */}
                      {selectedDetails?.ASSET_NONASSET === "A" && (
                        <Card className="mt-4">
                          <div className="flex flex-wrap justify-between mb-3">
                            <h6 className="Service_Header_Text">
                              Equipment Summary
                            </h6>
                            {CURRENT_STATUS !== 7 &&
                              selectedDetails?.ASSETGROUP_ID !== null &&
                              selectedDetails?.ASSETTYPE_ID !== null &&
                              selectedDetails?.ASSETTYPE_ID1 !== null && (
                                <Buttons
                                  className="Border_Button Secondary_Button "
                                  disabled={showdetails}
                                  label={"Show Details"}
                                  onClick={() => {
                                    handlerShowDetails();
                                  }}
                                />
                              )}
                          </div>
                          <EquipmentSummaryDetails equipmentDetails={selectedDetails} equipmentType={selectedDetails?.ASSET_NONASSET} isServiceReq={true} />
                        </Card>
                      )}

                      {CURRENT_STATUS === 4 ||
                        CURRENT_STATUS === 7 ||
                        selectedDetails?.IS_REOPEN === true ? (
                        <RectifiedDetails rectifiedDetails={selectedDetails} imageDocList={docOption} isloading={isloading} isCardView={true} />
                      ) : (
                        <></>
                      )}
                      {CURRENT_STATUS === 7 &&
                        selectedDetails?.IS_REOPEN === true ? (
                        <>
                          <CompletedDetails completionDetails={selectedDetails} isloading={isloading} signatureDocImage={signatureDoc} isCardView={true} />
                        </>
                      ) : (
                        <></>
                      )}
                      {selectedDetails?.IS_ACCEPTED ? (
                        <>
                          <AcceptedDetails acceptedDetails={selectedDetails} isCardView={true} />
                        </>
                      ) : (
                        <></>
                      )}
                      <ReporterDetails ReporterDetailsProps={selectedDetails} salcedorecedetails={undefined} onClickFunction={() => { }} salseforceAccount={false} />
                    </TabPanel>

                    <TabPanel header="Activity Timeline">
                      <ActivityTimelineRE activityTimeLineData={ActivityTimeLineList} />
                    </TabPanel>
                  </TabView>
                </div>
              )}
            </div>
            <div className="">
              {(search === "?edit=" &&
                !assignStatus &&
                decryptData(
                  localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                ) !== "T" &&
                selectedDetails?.CURRENT_STATUS === 1 &&
                selectedDetails?.ISSERVICEREQ === true &&
               
                decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                true &&
                technicianList?.length === 0) ||
                (search === "?add=" &&
                  !assignStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  decryptData(
                    localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                  ) === "S" &&
                  technicianList?.length === 0 &&
                  technicianStatus === "A") ||
                (search === "?add=" &&
                  !assignStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  technicianList?.length === 0 &&
                  technicianStatus === "M") ||
                (search === "?edit=" &&
                  !assignStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  selectedDetails?.CURRENT_STATUS === 1 &&
                  selectedDetails?.ISSERVICEREQ === true &&
             
                  technicianList?.length === 0 &&
                  technicianStatus === "M") ||
                (search === "?add=" &&
                  !assignStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  true &&
                  decryptData(
                    localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                  ) === "SA" &&
                  technicianList?.length === 0 &&
                  technicianStatus === "A") ||
                (search === "?add=" &&
                  !assignStatus &&
                  decryptData(localStorage.getItem(LOCALSTORAGE?.ISASSIGN)) ===
                  false &&
                  decryptData(
                    localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                  ) === "T" &&
                  technicianList?.length === 0 &&
                  technicianStatus === "A") ? (
                <>
                  <Card className="">
                    <h6 className="Service_Header_Text">
                      {t("Assignees ")}{technicianStatus==="M"&& <span className="text-red-600"> *</span>}
                    </h6>
                    <div className="items-center mt-2 justify-center w-full">
                      <label
                        // htmlFor="dropzone-file"
                        className={`flex flex-col items-center
                       justify-center w-full h-54 border-2 
                        ${error ? "border-red-600" : "border-gray-200 border"}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {technicianStatus === "M" &&
                            decryptData(
                              localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)
                            ) !== "T" &&
                            decryptData(
                              localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                            ) === true ? (
                            <>
                              <img src={noDataIcon} alt="" className="w-12" />

                              <p className="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className=" Text_Primary Input_Label">
                                  {t("No assignees yet")}{" "}
                                </span>
                              </p>
                              <label className="Text_Secondary Helper_Text mb-4">
                                {t(
                                  "Add assignees to work on this service request."
                                )}
                              </label>

                              <Buttons
                                className="Secondary_Button"
                                icon="pi pi-plus"
                                label={t("Add Assignee")}
                                onClick={() => {
                                  OpenAssignUserPopUp();
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <img src={userIcon} alt="" className="w-12" />

                              <p className="mb-2 mt-2 text-sm text-gray-500  dark:text-gray-400">
                                <div className="Text_Secondary Helper_Text">
                                  {t("Technician will be added automatically")}{" "}
                                </div>
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </Card>
                </>
              ) : (
                ((search === "?add=" &&
                  !assignStatus &&
                  technicianStatus === "M") ||
                  (search === "?edit=" &&
                    technicianList?.length === 0 &&
                    !assignStatus &&
                    technicianStatus === "M")) && (
                  <>
                    {selectedDetails?.CURRENT_STATUS === 6 ? (
                      <></>
                    ) : (
                      <Card className="">
                        <h6 className="Service_Header_Text">
                          Assignee will be Assigned by supervisor
                        </h6>
                      </Card>
                    )}
                  </>
                )
              )}

              {(((search === "?add=" || search === "?edit=") &&
                assignStatus &&
                technicianStatus === "M" &&
                IsAssignAdd) ||
                (search === "?edit=" &&
                  assignStatus &&
                  technicianStatus === "M" &&
                  technicianList?.length !== 0 &&
                  IsAssignAdd)) && (
                  <Card className="">
                    <h6 className="Service_Header_Text">{t("Assign To")}</h6>
                    <div className=" grid grid-cols-1 gap-x-3 gap-y-3 ">
                      <Field
                        controller={{
                          name: "ASSIGN_TEAM_ID",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <Select
                                options={TeamList}
                                {...register("ASSIGN_TEAM_ID", {
                                  onChange: (e: any) => GetAddAssignee(e),
                                  required:
                                    technicianStatus === "M" &&
                                      decryptData(
                                        localStorage.getItem(
                                          LOCALSTORAGE?.ROLETYPECODE
                                        )
                                      ) !== "T" &&
                                      decryptData(
                                        localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                                      ) === true
                                      ? "Please fill the required fields"
                                      : "",
                                })}
                                label={"Team"}
                                optionLabel="TEAM_NAME"
                                findKey={"TEAM_ID"}
                                require={
                                  technicianStatus === "M" &&
                                    decryptData(
                                      localStorage.getItem(
                                        LOCALSTORAGE?.ROLETYPECODE
                                      )
                                    ) !== "T" &&
                                    decryptData(
                                      localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                                    ) === true
                                    ? true
                                    : false
                                }
                                setValue={setValue}
                                invalid={
                                  technicianStatus === "M" &&
                                    decryptData(
                                      localStorage.getItem(
                                        LOCALSTORAGE?.ROLETYPECODE
                                      )
                                    ) !== "T" &&
                                    decryptData(
                                      localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                                    ) === true
                                    ? errors.ASSIGN_TEAM_ID
                                    : ""
                                }
                                selectedData={selectedDetails?.TEAM_ID}
                                {...field}
                              />
                            );
                          },
                        }}
                      />

                      <Field
                        controller={{
                          name: "TECH_ID",
                          control: control,
                          render: ({ field }: any) => {
                            return (
                              <MultiSelects
                                options={Currenttechnician}
                                {...register("TECH_ID", {
                                  required: "Please fill the required fields",
                                })}
                                label="Assignee"
                                optionLabel="USER_NAME"
                                require={
                                  technicianStatus === "M" &&
                                    decryptData(
                                      localStorage.getItem(
                                        LOCALSTORAGE?.ROLETYPECODE
                                      )
                                    ) !== "T" &&
                                    decryptData(
                                      localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                                    ) === true
                                    ? true
                                    : false
                                }
                                invalid={
                                  technicianStatus === "M" &&
                                    decryptData(
                                      localStorage.getItem(
                                        LOCALSTORAGE?.ROLETYPECODE
                                      )
                                    ) !== "T" &&
                                    decryptData(
                                      localStorage.getItem(LOCALSTORAGE?.ISASSIGN)
                                    ) === true
                                    ? errors.TECH_ID
                                    : ""
                                }
                                findKey={"USER_ID"}
                                selectedData={technicianData}
                                setValue={setValue}
                                {...field}
                              />
                            );
                          },
                        }}
                        resetFilterOnHide={true}
                      />
                      <div className="flex flex-wrap gap-1">
                        {watchAll.TECH_ID?.map((tech: any) => {
                          return (
                            <>
                              <Chip
                                label={tech?.USER_NAME}
                                removable
                                onRemove={() => handleRemove(tech)}
                              />
                            </>
                          );
                        })}
                      </div>
                      {watchAll?.TECH_ID?.length > 0 && (
                        <div
                          className="Text_Main Service_Alert_Title"
                          onClick={() => handleClearAll()}
                        >
                          {t("Clear All Selection")}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

              {/* )} */}

              {!iseditDetails &&
                ((technicianStatus === "A" && technicianList?.length > 0) ||
                  (technicianStatus === "M" && technicianList?.length > 0)) && (
                  <>
                    <ShowAssigneeList assigneeList={technicianList} TeamName={""} isInfraAssignee={false} />
                  </>
                )}
            </div>
          </div>
        </form>
        <Dialog
          // blockScroll={true}
          header={"Cancel - Pre Conditional"}
          visible={isPreConditionStatus}
          style={{ width: "30vw" }}
          onHide={() => {
            setIsPreConditionStatus(false);
            setValue("REMARKS", "");
            setReamrkLength(0);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="Text_Secondary Input_Label ">
              Remarks (max 250 characters)
              <span className="text-red-600"> *</span>
            </label>
            <div className={` ${cancelError ? "border-red-600" : ""}`}>
              <Field
                controller={{
                  name: "REMARKS",
                  control: control,
                  render: ({ field }: any) => {
                    return (
                      <InputTextarea
                        {...register("REMARKS", {
                          required:
                            isPreCondition === true
                              ? "Please fill the required field."
                              : false,
                          onChange: (e: any) => {
                            setReamrkLength(e?.target?.value?.length);
                            setCancelError(false);
                            setError(false);
                          },
                        })}
                        rows={4}
                        Label={"Remarks"}
                        require={true}
                        maxlength={250}
                        placeholder={
                          isPreCondition
                            ? `Provide additional details`
                            : "Provide additional details(optional)"
                        }
                        setValue={setValue}
                        // invalid={errors?.CancelRemark}
                        {...field}
                      />
                    );
                  },
                }}
              />
              <label
                className={` ${Remarklength === 250 ? "text-red-600" : "Text_Secondary"
                  } Helper_Text`}
              >
                {t(`${Remarklength}/250 characters.`)}
              </label>
            </div>
            <div className="flex justify-end mt-5">
              <Buttons
                name="PRECANCEL"
                className="Primary_Button me-2"
                type="submit"
                label={"Submit"}
              />
              <Button
                className="Cancel_Button  me-2"
                type="button"
                label={"Cancel"}
                onClick={() => {
                  // setVisible(false);
                  setIsPreConditionStatus(false);
                  setValue("REMARKS", "");
                  setReamrkLength(0);
                }}
              />
            </div>
          </form>
        </Dialog>
      </section>
    </>
  );
};

export default ServiceRequestDetailForm;
