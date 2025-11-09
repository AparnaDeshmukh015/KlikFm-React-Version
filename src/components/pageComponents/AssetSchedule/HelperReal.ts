import { toast } from "react-toastify";

 export const handleFormSubmit = (watchAll:any, setErrorName:any, seterrorreq:any, setVisible : any) => {
    if (!watchAll?.SCHEDULER?.SCHEDULE_NAME && !watchAll?.SCHEDULER?.PERIOD) {
      toast.error("Please fill in all required fields.");
      // setError(true);
      setErrorName(true);
    } else if (!watchAll?.SCHEDULER?.SCHEDULE_NAME) {
      toast.error("Please fill in all required fields.");
      setErrorName(true);
    } else if (!watchAll?.SCHEDULER?.PERIOD) {
      toast.error("Please fill in all required fields.");
    }
    else if (!watchAll?.SCHEDULER?.Record) {
      toast.error("Please fill in all required fields.");
      seterrorreq(true)
    } else {
      setVisible(false);
      seterrorreq(false)
      // set
    }
  };

 export const getScheduleOption = (selectedData: any, setValue:any, convertTime:any) => {
      if (selectedData) {
        setValue(
          "SCHEDULER.DAILY_ONCE_AT_TIME",
          selectedData !== "0"
            ? convertTime(selectedData?.DAILY_ONCE_AT_TIME)
            : "00:00"
        );
        // Every
        setValue(
          "SCHEDULER.DAILY_ONCE_EVERY_DAYS",
          selectedData !== "0" ? selectedData?.DAILY_ONCE_EVERY_DAYS : 0
        );
  
        //// Multiple
        setValue(
          "SCHEDULER.DAILY_EVERY_PERIOD",
          selectedData !== "0" ? selectedData?.DAILY_EVERY_PERIOD : 0
        );
        setValue(
          "SCHEDULER.DAILY_EVERY_STARTAT",
          selectedData !== "0"
            ? convertTime(selectedData?.DAILY_EVERY_STARTAT)
            : "00:00"
        );
        setValue(
          "SCHEDULER.DAILY_EVERY_ENDAT",
          selectedData !== "0"
            ? convertTime(selectedData?.DAILY_EVERY_ENDAT)
            : "00:00"
        );
  
        //Periodic Weekly
        //// On
        setValue(
          "SCHEDULER.WEEKLY_1_WEEKDAY",
          selectedData !== "0" ? selectedData?.WEEKLY_1_WEEKDAY : "0"
        );
        //// Every
        setValue(
          "SCHEDULER.WEEKLY_1_EVERY_WEEK",
          selectedData !== "0" ? selectedData?.WEEKLY_1_EVERY_WEEK : "0"
        );
        //// Prefered Time
        setValue(
          "SCHEDULER.WEEKLY_1_PREFERED_TIME",
          selectedData !== "0"
            ? convertTime(selectedData?.WEEKLY_1_PREFERED_TIME)
            : "00:00"
        );
  
        /// Periodic Monthly
        //// Month Option
        if (selectedData?.MONTHLY_1_MONTHDAY) {
        } else if (selectedData?.MONTHLY_2_WEEK_NUM) {
        }
        setValue(
          "SCHEDULER.MONTHLY_1_MONTHDAY",
          selectedData !== "0" ? selectedData?.MONTHLY_1_MONTHDAY : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_1_MONTH_NUM",
          selectedData !== "0" ? selectedData?.MONTHLY_1_MONTH_NUM : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_1_PREFERED_TIME",
          selectedData !== "0"
            ? convertTime(selectedData?.MONTHLY_1_PREFERED_TIME)
            : "00:00"
        );
        setValue(
          "SCHEDULER.MONTHLY_2ND_MONTHDAY",
          selectedData !== "0" ? selectedData?.MONTHLY_2ND_MONTHDAY : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_2ND_MONTH_NUM",
          selectedData !== "0" ? selectedData?.MONTHLY_2ND_MONTH_NUM : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_2ND_PREFERED_TIME",
          selectedData !== "0"
            ? convertTime(selectedData?.MONTHLY_2ND_PREFERED_TIME)
            : "00:00"
        );
        ////Week
        setValue(
          "SCHEDULER.MONTHLY_2_WEEK_NUM",
          selectedData !== "0" ? selectedData?.MONTHLY_2_WEEK_NUM : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_2_WEEKDAY",
          selectedData !== "0" ? selectedData?.MONTHLY_2_WEEKDAY : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_2_MONTH_NUM",
          selectedData !== "0" ? selectedData?.MONTHLY_2_MONTH_NUM : "0"
        );
        setValue(
          "SCHEDULER.MONTHLY_2_WEEK_PREFERED_TIME",
          selectedData !== "0"
            ? convertTime(selectedData?.MONTHLY_2_WEEK_PREFERED_TIME)
            : "00:00"
        );
  
        //Run Hour Based
        setValue(
          "SCHEDULER.RUN_HOURS",
          selectedData !== "0" ? selectedData?.RUN_HOURS : "0"
        );
        setValue(
          "SCHEDULER.RUN_AVG_DAILY",
          selectedData !== "0" ? selectedData?.RUN_AVG_DAILY : "0"
        );
        setValue(
          "SCHEDULER.RUN_THRESHOLD_MAIN_TRIGGER",
          selectedData !== "0" ? selectedData?.RUN_THRESHOLD_MAIN_TRIGGER : "0"
        );
        setValue("SCHEDULER.SCHEDULE_ID", selectedData?.SCHEDULE_ID || "");
      }
    };