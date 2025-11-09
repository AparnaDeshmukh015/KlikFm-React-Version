import { callPostAPI } from "../../../../services/apis";
import { ENDPOINTS } from "../../../../utils/APIEndpoints";

 export const getFacilityDetails = async (location:any, setConfigurationDetails:any, setSelectedDetails:any, setValue:any, setChecked:any, setHolidayList:any,setPPM_SCHEDULAR:any) => {
    if (location?.state !== null) {
      let editData: any = location?.state;

      let payload: any = {
        FACILITY_ID: editData?.facilityId,
        LOCATION_ID: editData?.locationId,
      };

      const res = await callPostAPI(ENDPOINTS?.BUILDING_DETAILS, payload);
      if (res.FLAG === 1) {
        setConfigurationDetails(res?.DASHBOARDCONFIGLIST);
        setSelectedDetails(res.FACILITYDETAILS[0]);
        setValue(
          "ISEQUIPMENT_EDIT",
          res?.FACILITYDETAILS[0].ISEQUIPMENT_EDIT === true ? true : false
        );
        setValue(
          "ISLOCATION_EDIT",
          res?.FACILITYDETAILS[0]?.ISLOCATION_EDIT === true ? true : false
        );
        setValue(
          "isImgRequired",
          res?.FACILITYDETAILS[0]?.isImgRequired === true ? true : false
        );
        setChecked(res?.FACILITYDETAILS[0]?.ACTIVE === true ? true : false);
        setValue("ACTIVE", res?.FACILITYDETAILS[0]?.ACTIVE);
        setHolidayList(res?.HOLIDAYLIST);
        setValue("FACILITY_NAME", res.FACILITYDETAILS[0]?.FACILITY_NAME);
        setValue(
          "FACILITY_LEGAL_NAME",
          res.FACILITYDETAILS[0]?.LEGAL_ENTITY_NAME
        );

        setValue("FACILITY_ADDRESS", res?.FACILITYDETAILS[0]?.FACILITY_ADDRESS);

        setValue("FACILITY_CITY", res.FACILITYDETAILS[0]?.FACILITY_CITY);
        setValue("FACILITY_STATE", res.FACILITYDETAILS[0]?.FACILITY_STATE);
        setValue("FACILITY_ZIP", res.FACILITYDETAILS[0]?.FACILITY_ZIP);
        setValue(
          "FACILITY_COUNTRY",
          res.FACILITYDETAILS[0]?.FACILITY_COUNTRY_CODE
        );

        setValue("FACILITY_EMAIL_ID", res.FACILITYDETAILS[0]?.EMAIL_ID);
        setValue(
          "FACILITY_CONTACT_NUMBER",
          res.FACILITYDETAILS[0]?.CONTACT_NUMBER
        );
        setValue("AREA_UNIT", res.FACILITYDETAILS[0]?.AREA_UNIT);
        setValue(
          "REDIRECT_APPROVAL",
          res.FACILITYDETAILS[0]?.REDIRECT_APPROVAL === true ? true : false
        );
        setValue(
          "MATREQ_APPROVAL",
          res.FACILITYDETAILS[0]?.MATREQ_APPROVAL === true ? true : false
        );
        setValue(
          "ISALLREQ",
          res.FACILITYDETAILS[0]?.ISALLREQ === true ? true : false
        );
        setValue(
          "OBEM_INTEG_REQUIRED",
          res.FACILITYDETAILS[0]?.OBEM_INTEG_REQUIRED === true ? true : false
        );
        setValue(
          "ISPRECONDITION",
          res.FACILITYDETAILS[0]?.ISPRECONDITION === true ? true : false
        );

        setPPM_SCHEDULAR(res.FACILITYDETAILS[0]?.PPM_SCHEDULAR);
      }
    }
  };

 export  const clearField=(setValue:any, setPPM_SCHEDULAR:any) => {
setValue("FACILITY_NAME", "");
      setValue("FACILITY_LEGAL_NAME", "");

      setValue("FACILITY_ADDRESS", "");

      setValue("FACILITY_CITY", "");
      setValue("FACILITY_STATE", "");
      setValue("FACILITY_ZIP", "");
      setValue("FACILITY_COUNTRY", "");

      setValue("FACILITY_EMAIL_ID", "");
      setValue("FACILITY_CONTACT_NUMBER", "");
      setValue("AREA_UNIT", "");
      setValue("REDIRECT_APPROVAL", false);
      setValue("MATREQ_APPROVAL", false);
      setValue("OBEM_INTEG_REQUIRED", false);

      setPPM_SCHEDULAR([]);
  }