import { FilterMatchMode } from "primereact/api";
import {
  dateFormat,
  dateFormatDropDownList,
  formateDate,
  LOCALSTORAGE,
} from "../../../utils/constants";
import moment from "moment";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { toast } from "react-toastify";

export const relevantFields = [
  "LOCATION_DESCRIPTION",
  "STATUS_DESC",
  "REPORTED_NAME",
  "ASSIGN_NAME",
  "WO_TYPE",
  "WO_DATE",
  "TEAM_ID",
  "SEVERITY",
  "SUB_STATUS_DESC",
];

const filterKeys = [
  "ASSIGN_NAME",
  "global",
  "WO_TYPE",
  "WO_START",
  "SUB_STATUS_DESC",
  "LOCATION_DESCRIPTION",
  "SEVERITY",
  "TEAMNAME",
  "WO_NO",
  "REPORTED_NAME",
  "WO_END",
  "STATUS_DESC",
  "WO_DATE",
];

const filterConfig: Record<string, FilterMatchMode> = {
  ASSIGN_NAME: FilterMatchMode.IN,
  global: FilterMatchMode.CONTAINS,
  WO_TYPE: FilterMatchMode.IN,
  SUB_STATUS_DESC: FilterMatchMode.IN,
  LOCATION_DESCRIPTION: FilterMatchMode.IN,
  SEVERITY: FilterMatchMode.IN,
  TEAMNAME: FilterMatchMode.IN,
  WO_NO: FilterMatchMode.IN,
  STATUS_DESC: FilterMatchMode.IN,
  REPORTED_NAME: FilterMatchMode.IN,
  WO_DATE: FilterMatchMode.IN,
  WO_START: FilterMatchMode.IN,
  WO_END: FilterMatchMode.IN,
};

export const clearFilterKeys = (dispatch: any, updateFilter: any) => {
  filterKeys.forEach((key) => {
    dispatch(updateFilter({ key, value: null }));
  });
};

export const clearFilterState = (setFilters: any) => {
  setFilters((prev: any) => {
    const clearedFilters = Object.fromEntries(
      Object.entries(filterConfig).map(([key, mode]) => [
        key,
        { value: null, matchMode: mode },
      ])
    );

    return { ...prev, ...clearedFilters };
  });
};
export const clearSubStatus = (statusData: any[]) => {
  return statusData?.map((group: any) => {
    if (typeof group !== "object") return group; // keep strings as is

    return {
      ...group,
      items: group?.items?.map((item: any) => ({
        ...item,
        ISChecked: false,
      })),
    };
  });
};
export const filterDefaultValues: any = {
  ASSIGN_NAME: { value: null, matchMode: FilterMatchMode.IN },
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  WO_TYPE: { value: null, matchMode: FilterMatchMode.IN },
  SUB_STATUS_DESC: { value: null, matchMode: FilterMatchMode.IN },
  LOCATION_DESCRIPTION: { value: null, matchMode: FilterMatchMode.IN },
  SEVERITY: { value: null, matchMode: FilterMatchMode.IN },
  TEAM_ID: { value: null, matchMode: FilterMatchMode.IN },
  WO_NO: { value: null, matchMode: FilterMatchMode.IN },
  STATUS_DESC: { value: null, matchMode: FilterMatchMode.IN },
  REPORTED_NAME: { value: null, matchMode: FilterMatchMode.IN },
  WO_DATE: { value: null, matchMode: FilterMatchMode.IN },
  WO_START: { value: null, matchMode: FilterMatchMode.IN },
  WO_END: { value: null, matchMode: FilterMatchMode.IN },
  LOCATIONDATA: { value: null, matchMode: FilterMatchMode.IN },
  STATUSLABEL: { value: null, matchMode: FilterMatchMode.IN },
};

export const getStatus = (date: string | null, time: Date) => {
  if (date == null) return "NA";
  const dateObj = new Date(date);
  if (dateObj < time) return "Overdue";
  return "";
};

export const handlerDetailFilter = (
  _filterData: any,
  responseData: any,
  property: any
) => {
  const data: any = _filterData?.map((idObj: any) =>
    responseData.find((loc: any) => loc[property] === idObj[property])
  );
  return data;
};

export const getFilterValue = (
  key: string,
  localValue: any,
  location: any,
  filterGroup: any,
  defaultValue: any = []
) => {
  if (location?.state === "workorder") {
    return filterGroup?.[key]?.value ?? defaultValue;
  }
  return localValue ?? defaultValue;
};

export const statusColor = (element: any) => {
  const baseStatus = element?.split(" (Re-open)")[0];
  let data: any = localStorage.getItem("statusColorCode");
  const dataColor: any = JSON.parse(data);
  return dataColor.find((item: any) => item.STATUS_DESC === baseStatus)?.COLORS;
};
export const formatServiceRequestList = (
  list: any,
  pathname: any,
  facility_type: any
) => {
  let WORK_ORDER_LIST = list;
  WORK_ORDER_LIST = WORK_ORDER_LIST.map((element: any) => {
    return {
      WO_CREATED_TIME:
        pathname === "/servicerequestlist"
          ? formateDate(element.SERVICE_CREATED_TIME)
          : element.WO_REPORTED_AT !== null
          ? formateDate(element.WO_REPORTED_AT || element.WO_CREATED_TIME)
          : "",
      WO_CREATED: moment(element?.WO_REPORTED_AT).format(dateFormat()),
      WO_TYPE: element?.WO_TYPE,
      STATUS_COLOURS: statusColor(element?.STATUS_DESC),
      SEVERITY: element?.SEVERITY,
      SER_REQ_NO: pathname === "/servicerequestlist" ? element?.SER_REQ_NO : "",
      WO_NO: element?.WO_NO,
      LOCATION_NAME: element?.LOCATION_NAME,
      LOCATION_DESCRIPTION: element?.LOCATION_DESCRIPTION,
      STATUS_DESC: element?.STATUS_DESC,
      ASSIGN_NAME: element?.ASSIGN_NAME,
      WO_TYPE_NAME: element?.WO_TYPE_NAME,
      WO_GROUP_REQ:
        facility_type === "I"
          ? element?.GROUP_ISSUE
          : `${element?.ASSETGROUP_NAME}>${element?.REQ_DESC}`,
      WO_ID: element?.WO_ID,
      PRIORITY_COLOURS: element?.COLORS,
      DESCRIPTION: element.DESCRIPTION,
      TEAMNAME: element?.TEAM_NAME,
      SUB_STATUS_DESC: element?.SUB_STATUS_DESC,
      ICON_ID: element?.ICON_ID,
      REPORTED_NAME: element?.RAISED_BY_NAME,
      FUNCTION_CODE: pathname === "/servicerequestlist" ? "HD004" : "HD001",
    };
    // }
  });

  return WORK_ORDER_LIST;
};

export const transformStatusData = (data: any) => {
  const grouped: any = {};
  data.forEach(
    ({ MAIN_STATUS, MAIN_STATUS_DESC, SUB_STATUS_DESC, STATUS_CODE }: any) => {
      // Condition to hide specific entry
      if (
        MAIN_STATUS === 1 &&
        MAIN_STATUS_DESC.trim() === "Assignment" &&
        STATUS_CODE === "45" &&
        SUB_STATUS_DESC.trim() === "PTW Approved w/o Isolation"
      ) {
        return; // Skip this iteration, don't add it
      }

      const mainKey: any = MAIN_STATUS;
      const mainLabel = MAIN_STATUS_DESC.trim();
      const subLabel = SUB_STATUS_DESC.trim();

      if (!grouped[mainKey]) {
        grouped[mainKey] = {
          label: mainLabel,
          MAIN_STATUS: mainKey,
          items: [],
          seen: new Set(), // to avoid duplicate sub labels
        };
      }

      const group = grouped[mainKey];

      if (!group.seen.has(subLabel)) {
        group.items.push({
          label: subLabel,
          value: subLabel,
          STATUS_CODE: STATUS_CODE,
          ISChecked: false,
        });
        group.seen.add(subLabel);
      }
    }
  );

  return Object.values(grouped).map(({ seen, ...group }: any) => group);
};

export const getLabel = (items: any, defaultLabel: any, singleLabel: any) => {
  if (!items || items.length === 0) {
    return defaultLabel;
  } else if (items.length === 1) {
    return singleLabel;
  } else {
    return `${items.length} items selected`;
  }
};

export const getLocation = async (selectedFacility: any, setNodes: any) => {
  let Currentfacility: any = JSON?.parse(
    localStorage?.getItem(LOCALSTORAGE?.FACILITY)!
  );

  let filterFacility: any = Currentfacility?.filter(
    (f: any) => f?.FACILITY_ID === selectedFacility?.FACILITY_ID
  );

  const payload: any = {
    LOCATION_ID: filterFacility[0]?.LOCATION_ID,
    ISLOCATIONFILTERFLAG: 1,
  };

  const res = await callPostAPI(ENDPOINTS?.GETHIRARCHY_LIST, payload);
  if (res?.FLAG === 1) {
    setNodes(res?.LOCATIONHIERARCHYLIST);
  }
};

export const getDashboardMasterDetails = async (setDateFilterList: any) => {
  try {
    const res = await callPostAPI(ENDPOINTS.GET_DASHBOARD_MASTER, {}, null);
    const responeDate: any = dateFormatDropDownList(res?.DATEFILTERLIST);
    setDateFilterList(responeDate);
  } catch (error: any) {
    toast.error(error);
  }
};

export const onPageChange = async (
  event: any,
  getFilterListData: any,
  setFirst: any,
  setRows: any
) => {
  await getFilterListData({
    PAGE_NUMBER: event.page + 1,
    PAGE_SIZE: event?.rows,
  });
  setFirst(event.first);
  setRows(event.rows);
};

export const clearSelection = async (
  e: any,
  clear_status: any,
  setStautusData: any,
  statusData: any,
  setSubStatusLabel: any,
  setSubStatusData: any
) => {
  e.preventDefault();
  clear_status = true;
  const updatedStatusData: any = statusData?.map((group: any) => ({
    ...group,
    items: group?.items?.map((item: any) => ({
      ...item,
      ISChecked: false,
    })),
  }));

  setStautusData(updatedStatusData);
  setSubStatusLabel([]);
  setSubStatusData([]);
};

export const onStatusChange = (
  e: any,
  item: any,
  setCustomRangeStatus: any,
  statusResponse: any,
  setSubStatusLabel: any,
  setSubStatusData: any,
  setFilters: any,
  setResetStatus: any,
  setStautusData: any,
  subStatusData: any,
  subStatusLabel: any
) => {
  const { value, checked } = e.target;
  setCustomRangeStatus(true);
  if (checked === true) {
    const dataStatusCode = statusResponse
      .filter((status: any) => status.SUB_STATUS_DESC === item?.label)
      .map(({ STATUS_CODE }: any) => ({ STATUS_CODE }));
    const seen = new Set();
    const dataStatusCode1 = statusResponse
      .filter((status: any) => status.SUB_STATUS_DESC === item?.label)
      .map(({ SUB_STATUS_DESC }: any) => ({ SUB_STATUS_DESC }))
      .filter((item: any) => {
        const duplicate = seen.has(item.SUB_STATUS_DESC);
        seen.add(item.SUB_STATUS_DESC);
        return !duplicate;
      });

    setSubStatusLabel((prev: any) => [...prev, ...dataStatusCode1]);
    setSubStatusData((prev: any) => [...prev, ...dataStatusCode]);
    setFilters((prev: any) => {
      return {
        ...prev,
        SUB_STATUS_DESC: { value, matchMode: FilterMatchMode.IN },
      };
    });

    setResetStatus(false);
    setStautusData((prev: any) =>
      checked ? [...prev, value] : prev.filter((code: any) => code !== value)
    );
  } else {
    const dataStatusCode = statusResponse
      .filter((status: any) => status.SUB_STATUS_DESC === item?.label)
      .map(({ STATUS_CODE }: any) => ({ STATUS_CODE }));
    const dataStatusCode1 = statusResponse
      .filter((status: any) => status.SUB_STATUS_DESC === item?.label)
      .map(({ SUB_STATUS_DESC }: any) => ({ SUB_STATUS_DESC }));

    const unmatchedItems = subStatusData.filter(
      (item1: any) =>
        !dataStatusCode.some(
          (item2: any) => item2.STATUS_CODE === item1.STATUS_CODE
        )
    );

    setSubStatusData(unmatchedItems);
    const matchedLabel = dataStatusCode1.map(
      (item: any) => item.SUB_STATUS_DESC
    );
    const unmatchedLabel = subStatusLabel.filter(
      (item: any) => !matchedLabel.includes(item.SUB_STATUS_DESC)
    );

    setSubStatusLabel(unmatchedLabel);
    setStautusData((prev: any) =>
      checked ? [...prev, value] : prev.filter((code: any) => code !== value)
    );
  }
};

export const payloadApi = {
  SEARCH_TEXT: null,
  FROM_DATE: null,
  TO_DATE: null,
  WO_TYPE_LIST: [],
  PRIORITY_LIST: [],
  ASSIGNEE_LIST: [],
  TEAM_LIST: [],
  SUB_STATUS_LIST: [],
  PAGE_NUMBER: 1,
  PAGE_SIZE: 15,
  LOCATION_LIST: [],
  REPORTER_LIST: [],
  STATUS_LIST: [],
  TYPE: "FILTER",
};
