import moment from "moment";
import { decryptData } from "../../../../utils/encryption_decryption";
import { toast } from "react-toastify";
import { formateDate, onlyDateFormat } from "../../../../utils/constants";
import {
  eventNotification,
  helperEventNotification,
} from "../../../../utils/eventNotificationParameter";
import { callPostAPI } from "../../../../services/apis";
import { ENDPOINTS } from "../../../../utils/APIEndpoints";
import { AnyARecord } from "node:dns";
import { helperDeleteFileAws, helperGetWorkOrderAwsDoclist } from "./helperAwsFileupload";
export const getDefaultValues = (props: any, search: string, locationIdData: string) => {
  const userId = decryptData(localStorage.getItem("USER_ID"));

  return {
    WO_ID: search === "?add=" ? 0 : localStorage.getItem("WO_ID"),
    SER_REQ_NO: props?.selectedData?.SER_REQ_NO ?? "",
    REQ_ID: "",
    ASSET_ID: "",
    GROUP: "",
    TYPE: "",
    MODE: props?.selectedData ? "E" : "A",
    PARA: "",
    WO_TYPE: "CM",
    RAISEDBY_ID: userId,
    ASSET_NONASSET: "",
    LOCATION_ID: search === "?add=" ? locationIdData : "",
    REQUESTTITLE_ID: "",
    SEVERITY_CODE: props?.selectedData?.SEVERITY_CODE ?? 3,
    ASSETTYPE: "",
    WO_DATE: props?.selectedData?.WO_DATE ?? moment().format("DD-MM-YYYY"),
    WO_REMARKS: "",
    ASSIGN_TEAM_ID: "",
    ASSIGN_WORKFORCE_ID: "",
    DOC_LIST: [],
    TECH_ID: [],
    EMAIL_ID: "",
    PHONE_NO: "",
    RAISED_BY: userId,
    REPORTER_NAME: "",
    REPORTER_EMAIL: "",
    REPORTER_MOBILE: "",
    REMARKS: "",
  };
};
export const isOnlySpaces = (str: any) => {
    if (str?.length === 0) {
      return true;
    } else {
      return str.trim() === "";
    }
  };
export const validateDocuments = (payload: any, search: string, uploadSupportMandatory: boolean, selectedDetails: any) => {
  if (!uploadSupportMandatory) return true;
  const needsDocs = (search === "?add=") || (search === "?edit=" && selectedDetails?.ISEDITSRQ === 1);
  if (needsDocs && payload?.DOC_LIST?.length === 0) {
    toast.error("Please select required fields");
    return false;
  }
  return true;
};

export const validateCancelRemarks = (payload: any, buttonMode: string) => {
  if (buttonMode !== "CANCEL") return true;
  if (!payload?.REMARKS || isOnlySpaces(payload?.REMARKS)) {
    toast.error("Please enter the remarks");
    return false;
  }
  return true;
};

export const validateTechnicianAssignment = (payload: any, buttonMode: string, technicianList: any[], assignStatus: boolean, IsAssignAdd: boolean, search: string) => {
  if (buttonMode === "PRECANCEL" && technicianList.length === 0 && !payload?.REMARKS?.trim()) {
    toast.error("Please fill the required field");
    return false;
  }
  if (search === "?add=" && IsAssignAdd && payload?.TECH_ID?.length === 0) {
    toast.error("Please fill the required field");
    return false;
  }
  if (buttonMode === "CONVERT" && technicianList.length === 0) {
    toast.error("Please fill the required field");
    return false;
  }
  if (buttonMode === "CONVERT" && technicianList.length === 0 && assignStatus) {
    toast.error("Please fill the required field");
    return false;
  }
  return true;
};

export const buildServiceRequestNotification=async(currentMenu:any, buttonMode:any,search:any,selectedDetails:any,resService:any,watchAll:any,res:any, PriorityEditStatus:any)=>{
    const notifcation: any = {
                      FUNCTION_CODE: currentMenu?.FUNCTION_CODE,
                      EVENT_TYPE: buttonMode === "CONVERT" ? "W" : "S",
                      AddToServiceRequest: "",
                      STATUS_CODE:
                        buttonMode === "CANCEL"
                          ? 8
                          : buttonMode === "PRECANCEL"
                            ? 18
                            : buttonMode === "CONVERT"
                              ? 1
                              : search === "?edit="
                                ? 2
                                : 1,
                      WO_ID: search === "?edit=" ? selectedDetails?.WO_ID : 0,
                      WO_NO:
                        buttonMode === "CONVERT" ||
                          buttonMode === "CANCEL" ||
                          search === "?edit="
                          ? selectedDetails?.WO_NO
                          : res?.WO_NO,
                      PARA1:
                        search === "?edit="
                          ? decryptData(localStorage.getItem("USER_NAME"))
                          : decryptData(localStorage.getItem("USER_NAME")),
                      PARA2:
                        search === "?edit="
                          ? formateDate(selectedDetails?.SERVICEREQ_CREATE_TIME)
                          : formateDate(
                            resService?.SERVICEREQUESTDETAILS[0]
                              ?.SERVICEREQ_CREATE_TIME
                          ),
                      PARA3:
                        search === "?edit="
                          ? selectedDetails?.SER_REQ_NO
                          : res?.WO_NO,
                      PARA4:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.ASSET_NONASSET ===
                            "A"
                            ? "Equipment"
                            : "Soft Services"
                          : search === "?edit="
                            ? selectedDetails?.ASSET_NONASSET === "A"
                              ? "Equipment"
                              : "Soft Services"
                            : "",
                      PARA5:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]
                            ?.LOCATION_DESCRIPTION
                          : search === "?edit="
                            ? selectedDetails?.LOCATION_DESCRIPTION
                            : "",
                      PARA6:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.ASSET_NAME
                          : search === "?edit="
                            ? selectedDetails?.ASSET_NAME
                            : "",
                      PARA7:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.REQ_DESC
                          : search === "?edit="
                            ? selectedDetails?.REQ_DESC
                            : "",
                      PARA8:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.WO_REMARKS
                          : search === "?edit="
                            ? selectedDetails?.WO_REMARKS
                            : "",
                      PARA9:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.SEVERITY_DESC
                          : PriorityEditStatus
                            ? watchAll?.SEVERITY_CODE?.SEVERITY
                            : search === "?edit="
                              ? selectedDetails?.SEVERITY_DESC
                              : "",
                      PARA10:
                        search === "?add="
                          ? resService?.SERVICEREQUESTDETAILS[0]?.SEVERITY_DESC
                          : PriorityEditStatus
                            ? watchAll?.SEVERITY_CODE?.SEVERITY
                            : search === "?edit="
                              ? selectedDetails?.SEVERITY_DESC
                              : "",
                    };
    
                    const eventPayload = { ...eventNotification, ...notifcation };
    
                    await helperEventNotification(eventPayload);
}

export const builddWorkOrderNotification = async(resWork:any,search:any) => {
 const notifcation: any = {
                  FUNCTION_CODE: "HD001",
                  WO_NO: resWork?.WORKORDERDETAILS[0]?.WO_NO,
                  EVENT_TYPE: "W",
                  STATUS_CODE: resWork?.WORKORDERDETAILS[0]?.CURRENT_STATUS,
                  PARA1:
                    search === "?edit="
                      ? decryptData(localStorage.getItem("USER_NAME"))
                      : decryptData(localStorage.getItem("USER_NAME")),
                  PARA2: resWork?.WORKORDERDETAILS[0]?.WO_NO,
                  PARA3:
                    resWork?.WORKORDERDETAILS[0]?.WO_DATE === null
                      ? ""
                      : onlyDateFormat(resWork?.WORKORDERDETAILS[0]?.WO_DATE),
                  PARA4: resWork?.WORKORDERDETAILS[0]?.USER_NAME,
                  PARA5: resWork?.WORKORDERDETAILS[0]?.LOCATION_DESCRIPTION,
                  PARA6: resWork?.WORKORDERDETAILS[0]?.ASSET_NAME,
                  PARA7: resWork?.WORKORDERDETAILS[0]?.REQ_DESC,
                  PARA8: resWork?.WORKORDERDETAILS[0]?.SEVERITY_DESC,
                  PARA9:
                    resWork?.WORKORDERDETAILS[0]?.REPORTED_AT === null
                      ? ""
                      : formateDate(resWork?.WORKORDERDETAILS[0]?.REPORTED_AT),
                  PARA10: resWork?.WORKORDERDETAILS[0]?.ACKNOWLEDGED_AT,
                  PARA11: resWork?.WORKORDERDETAILS[0]?.ATTEND_AT,
                  PARA12: resWork?.WORKORDERDETAILS[0]?.RECTIFIED_AT,
                  PARA13: resWork?.WORKORDERDETAILS[0]?.COMPLETED_AT,
                  PARA14: resWork?.WORKORDERDETAILS[0]?.CANCELLED_AT,
                  PARA15: "",
                  PARA16: resWork?.WORKORDERDETAILS[0]?.ACKNOWLEDGED_BY_NAME,
                  PARA17: "",
                  PARA18: resWork?.WORKORDERDETAILS[0]?.RECTIFIED_BY_NAME,
                  PARA19: resWork?.WORKORDERDETAILS[0]?.COMPLETED_BY_NAME,
                  PARA20: resWork?.WORKORDERDETAILS[0]?.CANCELLED_BY_NAME, //cancelled BY
                  PARA21: "", //approve on
                  PARA22: "", //approve by,
                  PARA23: "", //denied on,
                  PARA24: "", //denied by
                };

                const eventPayload = { ...eventNotification, ...notifcation };

                await helperEventNotification(eventPayload);
}

export const helperPara=(buttonMode:any, search:any, t:any, technicianStatus:any)=>{
     return buttonMode === "PRECANCEL"
          ? {
            para1: `Service Request has been`,
            para2: "Cancelled-Preconditional",
          }
          : buttonMode === "CANCEL"
            ? { para1: `${t("Service Request")}`, para2: "Cancelled" }
            : buttonMode === "CONVERT"
              ? { para1: `${t("Work Order")}`, para2: "Generated" }
              : search === "?edit="
                ? { para1: `${t("Service Request")}`, para2: "Updated" }
                : technicianStatus === "A"
                  ? { para1: `${t("Work Order")}`, para2: "Generated" }
                  : { para1: `${t("Service Request")}`, para2: "Created" };
}

export const deleteDocument = async(selectedDetails:any, docCancel:any) => {
    helperDeleteFileAws(selectedDetails?.WO_ID,selectedDetails?.WO_NO, docCancel);
}

export const getServiceRequestDetails=()=>{
    
}



export const documentValidation = (search:any, payload:any, uploadSupportMandatory:any,selectedDetails:any, setUploadError:any, setIsSubmit:any) => {
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
}

export  const getLocation = async (setlocationtypeOptions:any, search:any, iseditDetails:AnyARecord) => {
    if (search === "?add=" || iseditDetails) {
      const res1 = await callPostAPI(
        ENDPOINTS.LOCATION_HIERARCHY_LIST,
        null,
        "HD004"
      );
      if (res1?.FLAG === 1) {
        setlocationtypeOptions(res1?.LOCATIONHIERARCHYLIST);
      }
    }
  };

  export const getDocmentList = async (WO_ID: any, setisloading:any, setValue:any,setDocOption:any, setSignatureDoc:any ) => {
      setisloading(true);
      try {
        // setisloading(true)
          const res = await helperGetWorkOrderAwsDoclist(WO_ID, "AS067") 
       
  
        setValue("DOC_LIST", res?.WORKORDERDOCLIST);
        if (res?.FLAG === 1) {
          setDocOption(res?.WORKORDERDOCLIST);
          setSignatureDoc(res?.DIGITAlSIGNLIST);
        }
      } catch (error: any) {
        setisloading(false);
      } finally {
        setisloading(false);
      }
    };

    export const getOptionDetails = async (setValue:any, setSelectedDetails:any,selectedDetails:any, setLoading:any, options:any, setTechnicianList:any, locationtypeOptions:any
       , getWoOrderList:any, workOrderOption:any, assetList:any, type:any, TeamList:any, Currenttechnician:any, setTechnicianData:any, setActivityTimeLineList:any, setCurrentStatus:any, props:any, setDescriptionlength:any,
       GET_ASSETGROUPTEAMLIST:any
     ) => {
        try {
          setLoading(true);
          const res = await callPostAPI(
            ENDPOINTS.GET_SERVICEREQUEST_DETAILS,
            { WO_ID: localStorage.getItem("WO_ID") },
            "HD004"
          );
    
          if (res?.FLAG === 1) {
            setTechnicianList(res?.ASSIGNTECHLIST);
            if (res?.SERVICEREQUESTDETAILS?.length > 0) {
              setSelectedDetails(res?.SERVICEREQUESTDETAILS[0]);
            } else {
              toast.error("No Data Found");
            }
            if (locationtypeOptions?.length > 0) {
              const selectedLoaction: any = locationtypeOptions?.filter(
                (f: any) =>
                  f.LOCATION_ID === res?.SERVICEREQUESTDETAILS[0]?.LOCATION_ID
              );
    
              if (selectedLoaction?.length > 0) {
                setValue("LOCATION_ID", selectedLoaction[0]);
              }
            }
            if (
              options?.assetGroup?.length > 0 ||
              options?.serviceGroup?.length > 0
            ) {
              if (selectedDetails?.ASSET_NONASSET === "A") {
                const selectedGroupa: any = options?.assetGroup?.filter(
                  (f: any) =>
                    f?.ASSETGROUP_ID ===
                    res?.SERVICEREQUESTDETAILS[0]?.ASSETGROUP_ID
                );
    
                setValue("GROUP", selectedGroupa[0]);
              } else {
                const selectedGroupn: any = options?.serviceGroup?.filter(
                  (f: any) =>
                    f?.ASSETGROUP_ID ===
                    res?.SERVICEREQUESTDETAILS[0]?.ASSETGROUP_ID
                );
    
                setValue("GROUP", selectedGroupn[0]);
              }
            }
    
            await getWoOrderList(
              res?.SERVICEREQUESTDETAILS[0]?.ASSETGROUP_ID,
              res?.SERVICEREQUESTDETAILS[0]?.ASSET_NONASSET
            );
    
            if (workOrderOption?.length > 0) {
              const selectedissue: any = workOrderOption?.filter(
                (f: any) => f?.REQ_ID === res?.SERVICEREQUESTDETAILS[0]?.REQ_ID
              );
    
              setValue("REQ_ID", selectedissue[0]);
            }
            setValue(
              "ASSET_NONASSET",
              res?.SERVICEREQUESTDETAILS[0]?.ASSET_NONASSET
            );
            if (assetList?.length > 0) {
              const selectedAsset: any = assetList?.filter(
                (f: any) => f?.ASSET_ID === res?.SERVICEREQUESTDETAILS[0]?.ASSET_ID
              );
    
              setValue("ASSET_ID", selectedAsset[0]);
            }
            if (type?.length > 0) {
              const selectedType: any = type?.filter(
                (f: any) =>
                  f?.ASSETTYPE_ID === res?.SERVICEREQUESTDETAILS[0]?.ASSETTYPE_ID
              );
    
              setValue("TYPE", selectedType[0]);
            }
            setValue(
              "ASSET_NONASSET",
              res?.SERVICEREQUESTDETAILS[0]?.ASSET_NONASSET
            );
            setValue("WO_REMARKS", res?.SERVICEREQUESTDETAILS[0]?.WO_REMARKS);
            setDescriptionlength(res?.SERVICEREQUESTDETAILS[0]?.WO_REMARKS?.length);
            setValue(
              "WO_DATE",
              onlyDateFormat(res?.SERVICEREQUESTDETAILS[0]?.WO_DATE)
            );
            if (TeamList?.length > 0) {
              const selectedTeam: any = TeamList?.filter(
                (f: any) => f?.TEAM_ID === res?.SERVICEREQUESTDETAILS[0]?.TEAM_ID
              );
    
              setValue("ASSIGN_TEAM_ID", selectedTeam[0]);
            }
    
            if (Currenttechnician?.length > 0 && res?.ASSIGNTECHLIST?.length > 0) {
              // const selectedtech: any = Currenttechnician?.filter((f: any) => f?.USER_ID === res?.ASSIGNTECHLIST[0]?.USER_ID)
    
              const selectedTechs = Currenttechnician?.filter((tech: any) =>
                res?.ASSIGNTECHLIST?.some(
                  (assign: any) => assign?.USER_ID === tech?.USER_ID
                )
              );
    
              setValue("TECH_ID", selectedTechs);
              setTechnicianData(selectedTechs);
            }
            if (options?.severityLIST?.length > 0) {
              const selectedSeverity: any = options?.severityLIST?.filter(
                (f: any) =>
                  f.SEVERITY_ID === res?.SERVICEREQUESTDETAILS[0]?.SEVERITY_CODE
              );
    
              setValue("SEVERITY_CODE", selectedSeverity[0]);
            }
    
            setActivityTimeLineList(res?.ACTIVITYTIMELINELIST);
            setValue("DOC_LIST", res?.WODOCLIST);
    
            setCurrentStatus(res?.SERVICEREQUESTDETAILS[0]?.CURRENT_STATUS);
            if (props?.selectedData?.STATUS_DESC === "Cancelled") {
              // setStatus(false);
            } else {
              // setStatus(true);
            }
            let ASSETGROUP_ID = res?.SERVICEREQUESTDETAILS[0]?.ASSETGROUP_ID;
            await GET_ASSETGROUPTEAMLIST(ASSETGROUP_ID);
          } else {
            toast.error("No Data Found");
          }
        } catch (error: any) {
          toast.error(error);
        } finally {
          setLoading(false);
        }
      };
  