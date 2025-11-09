import { toast } from "react-toastify";
import { helperNullDate } from "../../../../utils/constants";
import { callPostAPI } from "../../../../services/apis";
import { ENDPOINTS } from "../../../../utils/APIEndpoints";
import moment from "moment";
import { helperEventNotification } from "../../../../utils/eventNotificationParameter";


export const validationError = (errors: any,isSubmitting: any, t:any) => {
    const nestedErrors: any = errors?.SCHEDULER || {};
    const firstError: any = Object?.values(nestedErrors)[0];
    const firstErrorObj = Object?.values(errors)[0];
    const type: any = firstErrorObj && typeof firstErrorObj === 'object' && 'type' in firstErrorObj ? firstErrorObj.type : undefined;
    const message: any = (Object?.values(errors)[0] as { message?: string })?.message
    if (
      !isSubmitting &&
      (type === "required" ||
       type === "validate")
    ) {
      const check: any = message;
      toast?.error(t(check));
    } else if (
      !isSubmitting &&
      (firstError?.type === "required" || firstError?.type === "validate")
    ) {
      const check: any = firstError?.message;
      toast?.error(t(check));
    }
}

export const getAssetDetails = async (columnCaptions: any,location:any,props:any,assetId:any,setValue:any,
     setScheId:any,getRequestList:any,colAppend:any,setSelectedDetails:any,setSelectedScheduleTaskDetails:any,ASSET_ID?: any) => {

    const payload: any = {
      ASSET_NONASSET: "N",
      ASSET_ID:
        location?.state !== null
          ? ASSET_ID
          : props?.selectedData === null
            ? assetId?.ASSET_ID
            : props?.selectedData?.ASSET_ID,
    };

    try {

      const res = await callPostAPI(
        ENDPOINTS.ASSETMASTER_DETAILS,
        payload
      );

      if (res?.FLAG === 1) {
        setScheId(res?.ASSETDETAILSLIST[0]?.SCHEDULE_ID !== null ? res?.ASSETDETAILSLIST[0]?.SCHEDULE_ID : 0)
        await getRequestList(res?.ASSETDETAILSLIST[0]?.ASSETGROUP_ID, res?.ASSETDETAILSLIST[0]?.ASSET_NONASSET)

        const configList = res.CONFIGLIST[0];
        for (let key in configList) {
          if (configList[key] === null) {
            delete configList[key];
          }
        }

        const previousColumnCaptions: any = columnCaptions.map((item: any) => ({
          ...item,
          VALUE: configList[item.FIELDNAME],
        }));
        colAppend(previousColumnCaptions);
        const amcDate: any = helperNullDate(
          res?.ASSETDETAILSLIST[0]?.AMC_EXPIRY_DATE
        );

        const commissioningDate: any = helperNullDate(
          res?.ASSETDETAILSLIST[0]?.COMMISSIONING_DATE
        );
        setSelectedDetails(res?.ASSETDETAILSLIST[0]);
        setSelectedScheduleTaskDetails(res?.SCHEDULELIST[0]);
        // setSelectedTaskDetailsList(res?.SCHEDULETASKLIST);
        setValue("DOC_LIST", res?.ASSETDOCLIST);
        setValue("ASSET_CODE", res?.ASSETDETAILSLIST[0]?.ASSET_CODE);
        setValue("BAR_CODE", res?.ASSETDETAILSLIST[0]?.BAR_CODE);
        setValue("ASSET_NAME", res?.ASSETDETAILSLIST[0]?.ASSET_NAME);
        setValue("CAPACITY_SIZE", res?.ASSETDETAILSLIST[0]?.CAPACITY_SIZE);
        setValue("SERIAL_NUMBER", res?.ASSETDETAILSLIST[0]?.SERIAL_NUMBER);
        setValue("ASSET_COST", res?.ASSETDETAILSLIST[0]?.ASSET_COST);
        setValue("BENCHMARK_VALUE", res?.ASSETDETAILSLIST[0]?.BENCHMARK_VALUE);
        setValue("MTBF_HOURS", res?.ASSETDETAILSLIST[0]?.MTBF_HOURS);
        setValue("AMC_EXPIRY_DATE", amcDate);
        setValue("ASSET_DESC", res?.ASSETDETAILSLIST[0]?.ASSET_DESC);
        setValue("COMMISSIONING_DATE", commissioningDate);
        setValue("SCHEDULER.SCHEDULE_TASK_D", res?.SCHEDULETASKLIST);
        setValue("UNDERAMC", res?.ASSETDETAILSLIST[0]?.UNDERAMC);
        setValue("AMC_VENDOR", res?.VENDORELIST[0]?.VENDOR_NAME);
        setValue("SCHEDULE_ID", props?.selectedData?.SCHEDULE_ID || 0);
      }
    } catch (error: any) {
      toast?.error(error);
    } finally {

    }
  };

  export const getScheduleList = async (watchAll:any, setScheduleTaskList:any,setSelectedSchedule:any,setValue:any,search:any) => {
      try {
        if (watchAll?.TYPE?.ASSETTYPE_ID) {
          const payload = {
            ASSETTYPE_ID: watchAll?.TYPE?.ASSETTYPE_ID,
          };
          const res = await callPostAPI(ENDPOINTS.SCHEDULE_LIST, payload);
          setScheduleTaskList(res?.SCHEDULELIST);
          if (search === "?edit=") {
            setSelectedSchedule(res?.SCHEDULELIST[0]?.SCHEDULE_ID || 0)
            setValue("SCHEDULE_ID", res?.SCHEDULELIST[0]?.SCHEDULE_ID || 0);
            setValue("SCHEDULER.SCHEDULE_ID", res?.SCHEDULELIST[0]?.SCHEDULE_ID)
          }
        }
      } catch (error) { }
    };

   export const getOptionApi=async(setOptions:any)=>{
      const res = await callPostAPI(
            ENDPOINTS.GETASSETMASTEROPTIONS,
          { ASSETTYPE: "N"}
          );
    
          const res1 = await callPostAPI(ENDPOINTS.LOCATION_HIERARCHY_LIST, null, "AS0010");
          setOptions({
            assetGroup: res?.ASSESTGROUPLIST,
            assetType: res?.ASSESTTYPELIST,
            assetMake: res?.MAKELIST,
            assetModel: res?.MODELLIST,
            unit: res?.UOMLIST,
            currentState: res?.CURRENTSTATUSLIST,
            obemList: res?.OBMASSETLIST,
            vendorList: res?.VENDORELIST,
            location: res1?.LOCATIONHIERARCHYLIST,
            configList: res?.CONFIGLIST,
          });
          return res1;
   }

    // serviceMaster.defaults.ts
export const getDefaultValues = (
  props: any,
  search: string,
  assetId: any,
  selectedScheduleTaskDetails: any,
  t: (key: string) => string
) => ({
  LOCATION: "",
  ASSET_CODE: props?.selectedData?.ASSET_CODE || "",
  ASSET_NAME: props?.selectedData?.NAME || "",
  GROUP: "",
  TYPE: null,
  BAR_CODE: "",
  CURRENT_STATE: "",
  ACTIVE:
    props?.selectedData?.ACTIVE !== undefined
      ? props?.selectedData?.ACTIVE
      : true,
  ASSET_DESC: "",
  UNDERAMC: props?.selectedData
    ? props?.selectedData?.UNDERAMC
    : assetId?.UNDERAMC,
  AMC_EXPIRY_DATE: "",
  AMC_VENDOR: "",
  ASSET_COST: 0,
  VENDOR_NAME: "",
  COMMISSIONING_DATE: "",
  ASSET: "",
  CAPACITY_SIZE: "",
  SERIAL_NUMBER: "",
  BENCHMARK_VALUE: 0,
  MTBF_HOURS: 0,
  ASSET_ID:
    props?.selectedData === null
      ? assetId?.ASSET_ID
      : props?.selectedData?.ASSET_ID,
  MODE: props?.selectedData || search === "?edit=" ? "E" : "A",
  ASSET_NONASSET: "N",
  PARA:
    props?.selectedData || search === "?edit="
      ? { para1: `${props?.headerName}`, para2: t("Updated") }
      : { para1: `${props?.headerName}`, para2: t("Added") },
  SCHEDULE_ID: 0,
  SCHEDULER: {
    ASSET_NONASSET: "N",
    MODE: "A",
    TEAM_LEAD_ID: 0,
    TEAM_ID: 0,
    SCHEDULE_ID:
      props?.selectedData === null
        ? assetId?.SCHEDULE_ID
        : props?.selectedData?.SCHEDULE_ID,
    SCHEDULE_NAME: selectedScheduleTaskDetails?.SCHEDULE_NAME || null,
    FREQUENCY_TYPE: "",
    PERIOD: "",
    Record: "",
    DAILY_ONCE_EVERY: "O",
    DAILY_ONCE_AT_TIME: "00:00",
    DAILY_ONCE_EVERY_DAYS: 0,
    DAILY_EVERY_PERIOD: 0,
    DAILY_EVERY_PERIOD_UOM: "H",
    DAILY_EVERY_STARTAT: "00:00",
    DAILY_EVERY_ENDAT: "00:00",
    WEEKLY_1_WEEKDAY: "0",
    WEEKLY_1_EVERY_WEEK: "0",
    WEEKLY_1_PREFERED_TIME: "00:00",
    WEEKLY_2_WEEKDAY: "0",
    WEEKLY_2_EVERY_WEEK: "0",
    WEEKLY_2_PREFERED_TIME: "00:00",
    MONTH_OPTION: 0,
    MONTHLY_1_MONTHDAY: "0",
    MONTHLY_1_MONTH_NUM: "0",
    MONTHLY_2_WEEK_NUM: "0",
    MONTHLY_2_WEEKDAY: "0",
    MONTHLY_2_MONTH_NUM: "0",
    RUN_HOURS: "0",
    ACTIVE: 1,
    RUN_AVG_DAILY: "0",
    RUN_THRESHOLD_MAIN_TRIGGER: "0",
    MONTHLY_2ND_MONTHDAY: "0",
    MONTHLY_2ND_MONTH_NUM: "0",
    MONTHLY_1_PREFERED_TIME: "00:00",
    MONTHLY_2ND_PREFERED_TIME: "00:00",
    MONTHLY_2_WEEK_PREFERED_TIME: "00:00",
    SCHEDULE_TASK_D: [
      {
        TASK_ID: 0,
        TASK_DESC: "",
        TASK_TIME: "00:00",
        TIME_UOM_CODE: 0,
        SKILL_ID: 0,
        ACTIVE: 1,
      },
    ],
  },
  TASK_ID: "",
  SKILL_NAME: "",
  SHOW_ACTUALTIME: "",
  EXTRA_COL_LIST: [""],
  DOC_LIST: [],
});

export const helperEventNotificationLocal = async (
  search: any,
  payload: any,
  watchAll: any,
  User_Name: any,
  currentMenu: any,
  eventNotification: any
) => {
  const notifcation: any = {
    FUNCTION_CODE: currentMenu?.FUNCTION_CODE,
    "EVENT_TYPE": "M",
    "STATUS_CODE": search === "?edit=" ? 2 : 1,
    "PARA1": search === "?edit=" ? User_Name : User_Name,
    PARA2: payload?.ASSET_CODE,
    PARA3: payload?.ASSET_NAME,
    PARA4: watchAll?.GROUP?.ASSETGROUP_NAME,
    PARA5: watchAll?.TYPE?.ASSETTYPE_NAME,
    PARA6: payload?.UNDERAMC ? moment(payload.AMC_EXPIRY_DATE).format("YYYY-MM-DD") : "",
    PARA7: payload?.UNDERAMC
      ? payload?.AMC_VENDOR?.VENDOR_ID : "",
    // PARA8: "asset_nonasset",
  };

  const eventPayload = { ...eventNotification, ...notifcation };
  await helperEventNotification(
   eventPayload
  );
};

export  const handlerShowService = (navigate:any, location:any) => {
    navigate(`/servicerequestlist?edit=`, { state: location?.state?.WO_ID });
  };

export const saveServiceMaster=async(payload:any, selectedSchedule:any, schedule_id:any, search:any,selectedDetails:any, editStatus:any )=>{
  console.log("payloadpayload111",payload) 
  if (!payload.SCHEDULE_ID || editStatus) {
          const schedulerData = payload.SCHEDULER;
          const updatedTaskList: any =
            payload?.SCHEDULER?.SCHEDULE_TASK_D?.filter(
              (task: any) => task.isChecked === true
            );
          const tasksWithoutIsChecked = updatedTaskList.map(
            ({ isChecked, ...rest }: any) => rest
          );
  
          schedulerData.ASSET_NONASSET = "N";
  
          schedulerData.MAKE_ID = payload?.MAKE_ID;
          schedulerData.MODEL_ID = payload?.MODEL_ID;
          schedulerData.FREQUENCY_TYPE =
            schedulerData?.PERIOD?.FREQUENCY_TYPE || "";
          schedulerData.PERIOD = schedulerData?.PERIOD?.VALUE || "";
          schedulerData.DAILY_ONCE_EVERY =
            schedulerData?.DAILY_ONCE_EVERY?.key || "";
          schedulerData.MONTHLY_2_WEEK_NUM =
            schedulerData?.MONTHLY_2_WEEK_NUM?.MONTHLY_2_WEEK_NUM || "0";
          schedulerData.MONTHLYONCETWICE = schedulerData?.MONTHLYONCETWICE?.key;
          schedulerData.MODE = !!payload.SCHEDULE_ID ? "E" : "A";
          const timeConvert = [
            "DAILY_ONCE_AT_TIME",
            "DAILY_EVERY_STARTAT",
            "DAILY_EVERY_ENDAT",
            "WEEKLY_1_PREFERED_TIME",
            "MONTHLY_1_PREFERED_TIME",
            "MONTHLY_2_WEEK_PREFERED_TIME",
            "MONTHLY_2ND_PREFERED_TIME",
          ];
  
          timeConvert?.forEach((elem: any) => {
            if (moment(schedulerData[elem])?.isValid()) {
              schedulerData[elem] = moment(schedulerData[elem]).format("HH:mm");
            }
          });
          timeConvert.forEach((elem: any) => {
            if (moment(schedulerData[elem])?.isValid()) {
              schedulerData[elem] = moment(schedulerData[elem]).format("HH:mm");
            }
          });
  
          schedulerData.MONTH_OPTION =
            schedulerData?.MONTH_OPTION?.MONTH_OPTION || "";
          schedulerData.SCHEDULE_TASK_D =
            tasksWithoutIsChecked === false ? [] : tasksWithoutIsChecked;
          const schedulerPayload: any = {
            ...payload?.SCHEDULER,
            ASSETTYPE_ID: payload?.TYPE?.ASSETTYPE_ID,
            REQ_ID: schedulerData?.Record?.REQ_ID
          };
  
          if (schedulerData?.SCHEDULE_NAME !== null) {
            const res1 = await callPostAPI(
              ENDPOINTS.SCHEDULE_SAVE,
              schedulerPayload
            );
            schedule_id = res1?.SCHEDULE_ID;
          }
        }
  
        delete payload?.SCHEDULER;
        const updateColList: any = payload?.EXTRA_COL_LIST?.filter(
          (item: any) => item?.VALUE
        ).map((data: any) => ({
          [data?.FIELDNAME]: data?.VALUE,
        }));
        //  payload.SCHEDULE_ID = payload?.SCHEDULE_ID !== 0 ? payload?.SCHEDULE_ID : 0;
        payload.SCHEDULE_ID = selectedSchedule === null ? schedule_id : selectedSchedule;
        payload.EXTRA_COL_LIST = updateColList || [];
        payload.ACTIVE = payload?.ACTIVE === true ? 1 : 0;
        payload.LOCATION_ID = payload?.LOCATION?.LOCATION_ID;
        payload.ASSETGROUP_ID = payload?.GROUP?.ASSETGROUP_ID;
        payload.ASSETTYPE_ID = payload?.TYPE?.ASSETTYPE_ID;
        payload.MAKE_ID = "";
        payload.MODEL_ID = "";
        payload.UNDERAMC = payload.UNDERAMC === true ? 1 : 0;
        payload.CS_ID = payload?.CURRENT_STATE?.CS_ID;
        payload.VENDOR_ID = payload?.VENDOR_NAME?.VENDOR_ID || "";
        payload.OBEM_ASSET_ID = "";
        payload.OWN_LEASE = payload?.ASSET?.key || "";
        payload.AMC_VENDOR = payload?.UNDERAMC
          ? payload?.AMC_VENDOR?.VENDOR_ID
          : "";
        payload.AMC_EXPIRY_DATE = payload?.UNDERAMC
          ? moment(payload.AMC_EXPIRY_DATE).format("YYYY-MM-DD")
          : "";
        payload.COMMISSIONING_DATE = payload.COMMISSIONING_DATE
          ? moment(payload.COMMISSIONING_DATE).format("YYYY-MM-DD")
          : "";
        payload.WARRANTY_END_DATE = payload.WARREANTY_DATE
          ? moment(payload.WARREANTY_DATE).format("YYYY-MM-DD")
          : "";
        payload.LAST_MAINTANCE_DATE = payload.LAST_DATE
          ? moment(payload.LAST_DATE).format("YYYY-MM-DD")
          : "";
  
        delete payload?.LOCATION;
        delete payload?.GROUP;
        delete payload?.TYPE;
        delete payload?.MODEL;
        delete payload?.MAKE;
        delete payload?.CURRENT_STATE;
        delete payload?.VENDOR_NAME;
        delete payload?.LINK_OBEM;
        delete payload.LAST_DATE;
        delete payload?.WARREANTY_DATE;
        delete payload?.AMC_DATE;
        delete payload?.ASSET;
        payload.ASSET_ID = search === "?edit=" ? selectedDetails?.ASSET_ID : "";
        console.log("payloadpayload",payload)
        const res = await callPostAPI(ENDPOINTS.ASSETMASTER_SAVE, payload);
        return res;
}
