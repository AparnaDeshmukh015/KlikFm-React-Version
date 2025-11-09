import { useFieldArray, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../../components/Input/Input";
import { Card } from "primereact/card";
import DateCalendar from "../../../components/Calendar/Calendar";
import Select from "../../../components/Dropdown/Dropdown";
import Field from "../../../components/Field";
import Checkboxs from "../../../components/Checkbox/Checkbox";
import DocumentUpload from "../../../components/pageComponents/DocumentUpload/DocumentUpload";
import AssetSchedule from "../../../components/pageComponents/AssetSchedule/AssetScheduleForm";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { callPostAPI } from "../../../services/apis";
import "../../../components/Table/Table.css";
import "../../../components/DialogBox/DialogBox.css";
import moment from "moment";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { saveTracker} from "../../../utils/constants";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";
import { eventNotification, helperEventNotification } from "../../../utils/eventNotificationParameter";

import { decryptData } from "../../../utils/encryption_decryption";
import { selectedLocationTemplate, locationOptionTemplate, FormHeader, OtherDetails } from "./utils/HelperComponent";
import {getAssetDetails,getScheduleList,getDefaultValues, validationError, saveServiceMaster, helperEventNotificationLocal} from "./utils/helper"
import ServiceDetails from "./utils/ServiceDetails";
const ServiceMasterForm = (props: any) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const location: any = useLocation();
  const { t } = useTranslation();
  const [options, setOptions] = useState<any>({});
  const [selectedDetails, setSelectedDetails] = useState<any>([]);
  const [scheduleTaskList, setScheduleTaskList] = useState([]);
  const [editStatus, setEditStatus] = useState<any | null>(false);
  const [schedId, setScheId] = useState<any | null>(0)
  const [typeList, setTypeList] = useState<any | null>([]);
  const [Descriptionlength, setDescriptionlength] = useState(0);
  const [issueList, setIssueList] = useState<any | null>([])
  const [selectedScheduleTaskDetails, setSelectedScheduleTaskDetails] =
    useState<any>();
      const [selectedscheduleID, setselectedscheduleID] = useState<any | null>();
  const [assetTypeState, setAssetTypeState] = useState<any | null>(false)
  const [IsSubmit, setIsSubmit] = useState<any | null>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null)
  const getId: any = localStorage.getItem("Id");
  const assetId: any = JSON.parse(getId);
  let { pathname } = useLocation();
  const [, menuList]: any = useOutletContext();
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];
  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setDescriptionlength(value.length);
  };
  const {
    register,
    resetField,
    handleSubmit,
    getValues,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(
    props,
    search,
    assetId,
    selectedScheduleTaskDetails,
    t
  ),
    mode: "all",
  });
  const User_Name = decryptData((localStorage.getItem("USER_NAME")))
  const watchAll: any = watch();
  const MANINTENANCE: any = watch("UNDERAMC");
  const onSubmit = useCallback(async (payload: any) => {
    if (IsSubmit) return true
    setIsSubmit(true)
   
    let schedule_id: any = "0"
    try {
       const res :any= await saveServiceMaster(payload, selectedSchedule, payload.SCHEDULE_ID, search, selectedDetails, editStatus)
      if (res?.FLAG === true) {
        toast?.success(res?.MSG);
        helperEventNotificationLocal( search, payload,watchAll,User_Name,currentMenu, eventNotification)
       if (location?.state === null) {
          props?.getAPI();
          props?.isClick();
        }
      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error);
    } finally {
      setIsSubmit(false)
    }
  }, [IsSubmit, props, selectedDetails, search, watchAll, location, currentMenu, eventNotification, User_Name, selectedSchedule,])

  const { fields, append: colAppend } = useFieldArray({
    name: "EXTRA_COL_LIST",
    control,
  });
  const ASSET_DESCWatch: any = watch("ASSET_DESC")
  useEffect(() => {
    if (ASSET_DESCWatch)
      setDescriptionlength(ASSET_DESCWatch.length);
  }, [ASSET_DESCWatch]);

  const getRequestList = async (ASSETGROUP_ID: any, ASSET_NONASSET?: any) => {
    const payload: any = {
      ASSETGROUP_ID: ASSETGROUP_ID,
      ASSET_NONASSET: ASSET_NONASSET?.key
        ? ASSET_NONASSET?.key
        : ASSET_NONASSET,
    };

    const res = await callPostAPI(
      ENDPOINTS.GET_SERVICEREQUEST_WORKORDER,
      payload, null
    );

    if (res?.FLAG === 1) {
      setIssueList(res?.WOREQLIST)
      if (search === "?edit=") {
      }
    } else {
      setIssueList([])
    }
  }

  const getOptions = async () => {
    try {
      const res = await callPostAPI(
        ENDPOINTS.GETASSETMASTEROPTIONS,
        {ASSETTYPE: "N"}
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

      const columnCaptions = res?.CONFIGLIST.map((item: any) => ({
        FIELDNAME: item.FIELDNAME,
        LABEL: item?.COLUMN_CAPTION,
        VALUE: "",
      }));

      if (res?.FLAG === 1) {
        if (search === "?edit=") {

          if (location?.state !== null) {
            await getAssetDetails(columnCaptions,location,props,assetId,setValue,
     setScheId,getRequestList,colAppend,setSelectedDetails,setSelectedScheduleTaskDetails, location?.state?.ASSET_ID);
          } else { await getAssetDetails(columnCaptions,location,props,assetId,setValue,
     setScheId,getRequestList,colAppend,setSelectedDetails,setSelectedScheduleTaskDetails); }
        } else {
          colAppend(columnCaptions);
        }
      }
    } catch (error) { }
    finally {}
  };

   const getSelectedScheduleId = (selectedScheduleId: number) =>
    setselectedscheduleID(selectedScheduleId);
 
  useEffect(() => {
    if (watchAll?.GROUP) {
      const assetTypeList: any = options?.assetType?.filter(
        (f: any) => f.ASSETGROUP_ID === watchAll?.GROUP?.ASSETGROUP_ID
      );
      setTypeList(assetTypeList);
    }
  }, [watchAll?.GROUP]);
  useEffect(() => {
    if (watchAll?.TYPE !== null) {
      (async function () {
        if (currentMenu || location.state !== null) {
          await getScheduleList(watchAll, setScheduleTaskList,setSelectedSchedule,setValue,search); }
      })();
    }
  }, [watchAll?.TYPE]);

  useEffect(() => {
    (async function () {
      if (currentMenu || location.state !== null) {
        await getOptions();
        await saveTracker(currentMenu)
      }
    })();
  }, []);

  useEffect(() => {
    validationError(errors,isSubmitting, t) 
  }, [isSubmitting]);
  return (
    <>
      <section className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormHeader
          header={props?.headerName}
          IsSubmit={IsSubmit}
           props={props}
          />
          <ServiceDetails
          {...{
            control,
            register,
            setValue,
            errors,
            options,
            selectedDetails,
            MANINTENANCE,
            props,
            t,
            getRequestList,
            typeList,
            setAssetTypeState,
            selectedLocationTemplate,
            locationOptionTemplate,
            Descriptionlength,
            handleInputChange,
          }}
        />
      
          <AssetSchedule
            errors={errors}
            setValue={setValue}
            watchAll={watchAll}
            register={register}
            control={control}
            resetField={resetField}
            scheduleTaskList={scheduleTaskList}
            scheduleId={search === '?edit=' && assetTypeState === true ? 0 : search === '?edit=' ? schedId : 0}
            getValues={getValues}
            setEditStatus={setEditStatus}
            isSubmitting={isSubmitting}
            AssetSchedule={true}
            issueList={issueList}
            setScheduleTaskList={setScheduleTaskList}
            setAssetTypeState={setAssetTypeState}
            assetTypeState={assetTypeState}
            setSelectedSchedule={setSelectedSchedule}
            getSelectedScheduleId={getSelectedScheduleId}
          />
          <Card className="mt-2 ">
            <DocumentUpload
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              getValues={getValues}
              errors={errors}

            />
          </Card>
          <OtherDetails
          control={control}
          register={register}
          setValue={setValue}
          options={options}
          selectedDetails={selectedDetails}
          fields={fields}
          t={t}
        />
        </form>
      </section>
    </>
  );
};

export default ServiceMasterForm;

