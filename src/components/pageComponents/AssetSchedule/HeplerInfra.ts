import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";

export const onChangeBtnValue = (btnvalue: any, resetField:any) => {
    if (btnvalue === "Daily") {
      resetField("SCHEDULER.WEEKLY_1_EVERY_WEEK");
      resetField("SCHEDULER.WEEKLY_1_WEEKDAY");
      resetField("SCHEDULER.YEARLY_MONTH");
      resetField("SCHEDULER.EVERY_DAYS");
      resetField("SCHEDULER.MONTHLY_1_MONTH_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_1_MONTHDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.YEARLY_MONTH");
    } else if (btnvalue === "Weekly") {
      resetField("SCHEDULER.EVERY_DAYS");
      resetField("SCHEDULER.MONTHLY_1_MONTH_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_1_MONTHDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.YEARLY_MONTH");
    } else if (btnvalue === "Monthly") {
      resetField("SCHEDULER.WEEKLY_1_EVERY_WEEK");
      resetField("SCHEDULER.WEEKLY_1_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.YEARLY_MONTH");
      resetField("SCHEDULER.MONTHLY_1_MONTHDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
    } else if (btnvalue === "Yearly") {
      resetField("SCHEDULER.WEEKLY_1_EVERY_WEEK");
      resetField("SCHEDULER.WEEKLY_1_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_1_MONTH_NUM");
      resetField("SCHEDULER.MONTHLY_2_WEEKDAY");
      resetField("SCHEDULER.MONTHLY_2_WEEK_NUM");
      resetField("SCHEDULER.MONTHLY_1_MONTHDAY");
    }
  };

//   const getScheduleDetails = async (scheduleid?: any, location:any, selectedscheduleId:any) => {
//       // debugger;
//       try {
//         let scheduleData: any = localStorage.getItem("scheduleId");
//         let locationData: any =
//           location?.state === null
//             ? null
//             : location?.state?.page === "infraPPM"
//             ? location?.state?.page
//             : null;
//         const payload = {
//           // SCHEDULE_ID: props?.selectedData ? props?.selectedData?.SCHEDULE_ID : search === '?edit=' ? dataId?.SCHEDULE_ID : 0,
//           SCHEDULE_ID:
//             scheduleid !== undefined && scheduleid !== 0
//               ? scheduleid
//               : locationData === "infraPPM"
//               ? scheduleData
//               : scheduleid !== 0 &&
//                 scheduleid !== undefined &&
//                 scheduleid !== null
//               ? scheduleid
//               : selectedscheduleId ?? dataId?.SCHEDULE_ID,
//         };
  
//         const res = await callPostAPI(ENDPOINTS.GET_SCHEDULE_DETAILS, payload);
//         if (res && res.FLAG === 1) {
//           setSelectedDetails(res?.SCHEDULEDETAILS[0]);
//           setMONTHLY_1_MONTH_NUMs(res?.SCHEDULEDETAILS[0]?.MONTHLY_1_MONTH_NUM);
  
//           setData(res?.SCHEDULEDETAILS[0].WEEKLY_1_WEEKDAY);
//           setAssetGroupId(res?.SCHEDULEDETAILS[0]?.ASSETGROUP_ID);
//           const scheduleInfraStartDate: any = helperNullDate(
//             res?.SCHEDULEDETAILS[0]?.SCHEDULE_INFRA_START_DATE
//           );
//           setValue("SCHEDULE_NAME", res?.SCHEDULEDETAILS[0]?.SCHEDULE_NAME);
//           setValue("REQ_DESC", res?.SCHEDULEDETAILS[0]?.REQ_DESC);
//           setIssueLength(res?.SCHEDULEDETAILS[0]?.REQ_DESC?.length);
//           setValue(
//             "NOOFOCCURENCE",
//             res?.SCHEDULEDETAILS[0]?.REPEAT_UNTIL_OCCURENCE
//           );
//           setValue("SCHEDULE_INFRA_START_DATE", scheduleInfraStartDate);
//           let letEveryStart: any = convertTime(
//             res?.SCHEDULEDETAILS[0]?.SCHEDULE_INFRA_TIME
//           );
//           // setValue("SCHEDULER.DAILY_EVERY_STARTAT", letEveryStart);
//           setValue("DESCRIPTION", res?.SCHEDULEDETAILS[0]?.SCHEDULE_DESC);
//           setDescriptionlength(res?.SCHEDULEDETAILS[0]?.SCHEDULE_DESC?.length);
  
//           setBtnValue(
//             res?.SCHEDULEDETAILS[0].PERIOD === "W"
//               ? "Weekly"
//               : res?.SCHEDULEDETAILS[0].PERIOD == "M"
//               ? "Monthly"
//               : res?.SCHEDULEDETAILS[0].PERIOD == "Y"
//               ? "Yearly"
//               : "Daily"
//           );
  
//           if (
//             res?.SCHEDULEDETAILS[0].SCHEDULE_INFRA_DAYS !== undefined &&
//             INFRS_EQUIPMENT_OPTIONS.InfraScheduledayNumList?.length > 0
//           ) {
//             const selectedInfradays: any =
//               INFRS_EQUIPMENT_OPTIONS.InfraScheduledayNumList.find(
//                 (e: any) =>
//                   e.DAY_NUM === res?.SCHEDULEDETAILS[0].SCHEDULE_INFRA_DAYS
//               );
//             setValue("SCHEDULER.SCHEDULE_INFRA_DAYS", selectedInfradays);
//           }
  
//           if (res?.SCHEDULEDETAILS[0].PERIOD === "M") {
//             const list = INFRS_EQUIPMENT_OPTIONS.monthNumList1.filter(
//               (e: any) =>
//                 e.MONTH_NUM === res?.SCHEDULEDETAILS[0].MONTHLY_1_MONTH_NUM
//             );
//             if (list) {
//               let preferedTime: any =
//                 res?.SCHEDULEDETAILS[0].MONTHLY_1_PREFERED_TIME;
  
//               let convertPrefredTime: any = convertTime(preferedTime);
  
//               setValue("SCHEDULER.MONTHLY_1_MONTH_NUM", list[0]);
//               setValue(
//                 "SCHEDULER.MONTH_OPTION",
//                 res?.SCHEDULEDETAILS[0].MONTH_OPTION
//               );
//               // setValue("SCHEDULER.MONTHLY_1_PREFERED_TIME", convertPrefredTime)
//               setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//             }
  
//             if (res?.SCHEDULEDETAILS[0].MONTH_OPTION === "1") {
//               setMonthlist("O");
//               setOptiondisbaledWeek(true);
//               setOptiondisbaled(false);
//               const DAY_NUM = INFRS_EQUIPMENT_OPTIONS.dayNumList.find(
//                 (e: any) =>
//                   e.DAY_NUM === res?.SCHEDULEDETAILS[0].MONTHLY_1_MONTHDAY
//               );
//               if (DAY_NUM) {
//                 setValue("SCHEDULER.MONTHLY_1_MONTHDAY", DAY_NUM);
//               }
//               //  setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//               let preferedTime: any =
//                 res?.SCHEDULEDETAILS[0].MONTHLY_1_PREFERED_TIME;
  
//               let convertPrefredTime: any = convertTime(preferedTime);
//               setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//             } else {
//               setOptiondisbaledWeek(false);
//               setOptiondisbaled(true);
//               setMonthlist("T");
//               let preferedTime: any =
//                 res?.SCHEDULEDETAILS[0].MONTHLY_1_PREFERED_TIME;
//               let convertPrefredTime: any = convertTime(preferedTime);
//               setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//               const DAY_NUM1 = INFRS_EQUIPMENT_OPTIONS.weekNumList.find(
//                 (e: any) =>
//                   e.MONTHLY_WEEK_NUM ===
//                   res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEK_NUM
//               );
  
//               if (DAY_NUM1) {
//                 let preferedTime: any =
//                   res?.SCHEDULEDETAILS[0].WEEKLY_1_PREFERED_TIME;
//                 let convertPrefredTime: any = convertTime(preferedTime);
  
//                 setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//                 setValue("SCHEDULER.MONTHLY_2_WEEK_NUM", DAY_NUM1);
//               }
//               const DAY_NUM2 = INFRS_EQUIPMENT_OPTIONS.weekDataLabel.find(
//                 (e: any) =>
//                   e.DAY_CODE === res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEKDAY
//               );
  
//               if (DAY_NUM2) {
//                 let preferedTime: any =
//                   res?.SCHEDULEDETAILS[0].WEEKLY_2_PREFERED_TIME;
//                 let convertPrefredTime: any = convertTime(preferedTime);
//                 setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//                 setValue("SCHEDULER.MONTHLY_2_WEEKDAY", DAY_NUM2);
//               }
//             }
//           } else if (res?.SCHEDULEDETAILS[0].PERIOD === "D") {
//             const Dailylist = INFRS_EQUIPMENT_OPTIONS.dayNumList.find(
//               (e: any) =>
//                 e.DAY_NUM === res?.SCHEDULEDETAILS[0].DAILY_ONCE_EVERY_DAYS
//             );
  
//             if (Dailylist) {
//               setValue("SCHEDULER.EVERY_DAYS", Dailylist);
//             }
//             let preferedTime: any = res?.SCHEDULEDETAILS[0]?.DAILY_ONCE_AT_TIME;
//             let convertPrefredTime: any = convertTime(preferedTime);
//             setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//           } else if (res?.SCHEDULEDETAILS[0].PERIOD === "W") {
//             const Dailylist = INFRS_EQUIPMENT_OPTIONS.weekNumList.find(
//               (e: any) =>
//                 e.MONTHLY_WEEK_NUM === res?.SCHEDULEDETAILS[0].WEEKLY_1_EVERY_WEEK
//             );
  
//             if (Dailylist) {
//               setValue("SCHEDULER.WEEKLY_1_EVERY_WEEK", Dailylist);
//               let preferedTime: any =
//                 res?.SCHEDULEDETAILS[0].WEEKLY_1_PREFERED_TIME;
//               let convertPrefredTime: any = convertTime(preferedTime);
  
//               setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//             }
//           } else if (res?.SCHEDULEDETAILS[0].PERIOD == "Y") {
//             let letEveryStart: any = convertTime(
//               res?.SCHEDULEDETAILS[0]?.YEARLY_PREFERED_TIME
//             );
//             setValue("SCHEDULER.DAILY_EVERY_STARTAT", letEveryStart);
//             const list = INFRS_EQUIPMENT_OPTIONS.monthNumList.find(
//               (e: any) => e.MONTH_NUM === res?.SCHEDULEDETAILS[0].YEARLY_MONTH
//             );
  
//             if (list) {
//               setValue("SCHEDULER.YEARLY_MONTH", list);
//               setValue(
//                 "SCHEDULER.MONTH_OPTION",
//                 res?.SCHEDULEDETAILS[0].MONTH_OPTION
//               );
//               // setMonthlist(res?.SCHEDULEDETAILS[0].MONTH_OPTION)
//             }
//             if (
//               res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEKDAY &&
//               res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEK_NUM
//             ) {
//               setOptiondisbaled(true);
//               setOptiondisbaledWeek(false);
//             } else {
//               setOptiondisbaled(false);
//               setOptiondisbaledWeek(true);
//             }
  
//             if (res?.SCHEDULEDETAILS[0].MONTH_OPTION == 1) {
//               setMonthlist("O");
//               const DAY_NUM = INFRS_EQUIPMENT_OPTIONS.dayNumList.find(
//                 (e: any) =>
//                   e.DAY_NUM === res?.SCHEDULEDETAILS[0].MONTHLY_1_MONTHDAY
//               );
//               if (DAY_NUM) {
//                 setValue("SCHEDULER.MONTHLY_1_MONTHDAY", DAY_NUM);
//               }
//             } else {
//               setMonthlist("T");
//               const DAY_NUM1 = INFRS_EQUIPMENT_OPTIONS.weekNumList.find(
//                 (e: any) =>
//                   e.MONTHLY_WEEK_NUM ===
//                   res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEK_NUM
//               );
//               if (DAY_NUM1) {
//                 setValue("SCHEDULER.MONTHLY_2_WEEK_NUM", DAY_NUM1);
//               }
//               const DAY_NUM2 = INFRS_EQUIPMENT_OPTIONS.weekDataLabel.find(
//                 (e: any) =>
//                   e.DAY_CODE === res?.SCHEDULEDETAILS[0].MONTHLY_2_WEEKDAY
//               );
//               if (DAY_NUM2) {
//                 setValue("SCHEDULER.MONTHLY_2_WEEKDAY", DAY_NUM2);
//               }
//             }
//           }
  
//           setWorkOrder(
//             res?.SCHEDULEDETAILS[0].IS_WO_CREATION == "S"
//               ? "Schedule"
//               : "Immediately"
//           );
//           if (res?.SCHEDULEDETAILS[0].IS_WO_CREATION == "S") {
//             const Dailylist1 = INFRS_EQUIPMENT_OPTIONS.dayNumList.find(
//               (e: any) =>
//                 e.DAY_NUM === res?.SCHEDULEDETAILS[0].WO_BEFORE_CREATION_DAYS
//             );
  
//             if (Dailylist1) {
//               setValue("SCHEDULER.WO_BEFORE_CREATION_DAYS", Dailylist1);
//             }
//           }
//           if (res?.SCHEDULEDETAILS[0].REPEAT_UNTIL) {
//             const repeatUntil = INFRS_EQUIPMENT_OPTIONS.RepeatUntil.find(
//               (e: any) => e.REPEAT_ID === res?.SCHEDULEDETAILS[0].REPEAT_UNTIL
//             );
  
//           }
  
//           setRepeatUntil(`${res?.SCHEDULEDETAILS[0].REPEAT_UNTIL}`);
  
//           if (res?.SCHEDULEDETAILS[0].REPEAT_UNTIL === 2) {
//             const scheduleInfraStartDate: any = helperNullDate(
//               res?.SCHEDULEDETAILS[0]?.REPEAT_END_DATE
//             );
  
//             setValue("SCHEDULE_INFRA_END_DATE", scheduleInfraStartDate);
  
//             // setValue("SCHEDULER.WEEKLY_1_EVERY_WEEK", res?.SCHEDULEDETAILS[0]?.WEEKLY_1_EVERY_WEEK)
//             setData(res?.SCHEDULEDETAILS[0].WEEKLY_1_WEEKDAY);
  
//             const Dailylist1 = LABELS.weekDataLabel.find(
//               (e: any) => e.DAY_CODE === res?.SCHEDULEDETAILS[0].WEEKLY_1_WEEKDAY
//             );
  
//             if (Dailylist1) {
//               setValue("SCHEDULER.WEEKLY_1_WEEKDAY", Dailylist1);
//             }
//           }
  
//           if (pathname === "/assettaskschedulelist" && facility_type === "I") {
//             const typeofWork = options?.WOTYPELIST?.find(
//               (e: any) => e.WO_TYPE_CODE === res?.SCHEDULEDETAILS[0]?.WO_TYPE_CODE
//             );
//             setValue("WO_TYPE_CODE", typeofWork);
  
//             const Department = options?.TEAMLIST?.find(
//               (e: any) => e.TEAM_ID === res?.SCHEDULEDETAILS[0]?.TEAM_ID
//             );
//             setValue("TEAM_ID", Department);
//             const priority = options?.PRIORITYLIST?.find(
//               (e: any) => e.SEVERITY_ID === res?.SCHEDULEDETAILS[0]?.SEVERITY_ID
//             );
//             setValue("SEVERITY_ID", priority);
//           }
  
//           if (res?.SCHEDULEDETAILS[0].PERIOD === "M") {
//             let preferedTime: any =
//               res?.SCHEDULEDETAILS[0].MONTHLY_1_PREFERED_TIME;
//             let convertPrefredTime: any = convertTime(preferedTime);
//             setValue("SCHEDULER.DAILY_EVERY_STARTAT", convertPrefredTime);
//           }
//         }
//       } catch (error) {}
//     };