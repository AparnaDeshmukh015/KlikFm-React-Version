import React, { useEffect, useState } from "react";
import "../../../components/Table/Table.css";
import "../../../components/Checkbox/Checkbox.css";
import { toast } from "react-toastify";
import "../../../components/Input/Input.css";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { useLocation, useOutletContext } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import "../../../components/MultiSelects/MultiSelects.css";
import "../../../components/Input/Input.css";

import {
  filterDefaultValues,
  formatServiceRequestList,
  transformStatusData,
  getLocation,
  getDashboardMasterDetails,
  relevantFields,
  onPageChange,
  payloadApi,
  handlerDetailFilter,
  getFilterValue
} from "./HeplerWorkorder";

import { clearFilters, updateFilter } from "../../../store/filterstore";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import LoaderShow from "../../../components/Loader/LoaderShow";
import { helperExportCSV } from "../../../utils/helper";
import TableComponent from "./TableComponent";
import WorkorderMasterListHeader from "./WorkorderMasterListHeader";
import { TableHeaderFilter } from "./InfraWorkorderDialog/TableHeaderFilter";
import moment from "moment";

var dateStatus: any = false;
var globalStatus: any = false;
var clear_location: any = false;
var clear_status: any = false;
const WorkOrderMasterInfra = (props: any) => {
  let { pathname } = useLocation();
  const { search }: any = useLocation();
  const filterGroup = useSelector((state: any) => state.filterGroup);
  const location: any = useLocation();

  const [DateFilterList, setDateFilterList] = useState<any | null>([]);

  const [selectedFacility, menuList]: any = useOutletContext();
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];

  let tableHeader: any = props?.tableHeader?.headerName !== "User Role Master";
  const [clearLocation, setClearLocation] = useState<any>(false);
  const dispatch: any = useDispatch();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [statusData, setStautusData] = useState<any>([]);
  const [statusResponse, setStatusReponse] = useState<any | null>([]);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<any | null>([]);
  const [statusDatas, setStatusDatas] = useState<any | null>("");
  const [selectedDate, setSelectedDate] = useState<any | null>(null);
  const [selectedCustomeDate, setSelectedCustome] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<any | null>([]);
  const [dateWO, setWODate] = useState(null);
  const [filters, setFilters] = useState(filterDefaultValues);
  const [workOrderDateFilter, setWorkOrderDateFilter] = useState<any | null>(
    []
  );
  const [locationName, setLocationName] = useState<any>(null);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [pageCount, setPageCount] = useState<any>(0);
  const [customRangeStatus, setCustomRangeStatus] = useState<any | null>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<any | null>(null);
  const [subStatusData, setSubStatusData] = useState<any | null>([]);
  const [caseTypeFilter, setCaseTypeFilter] = useState<any>([]);
  const [locationFilter, setLocationFilter] = useState<any>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<any>([]);
  const [priorityFilter, setPriorityFilter] = useState<any | null>([]);
  const [teamNameFilter, setTeamNameFilter] = useState<any | null>([]);
  const [locationFilteredData, setLocationFilteredData] = useState<any[]>([]);
  const [reportedBy, setReportedBy] = useState<any | null>([]);
  const [tableData, setTableData] = useState<any | null>([]);
  const [filterDropDownData, setFilterDropDownData] = useState<any>([]);
  const [resetStatus, setResetStatus] = useState<any | null>(true);
  const [statusListCount, setstatusListCount] = useState<any | null>([]);
  const [subStatusLabel, setSubStatusLabel] = useState<any | null>([]);
  const [customResetDate, setCustomResetDate] = useState<any | null>(false);
  const [visibleEquipmentlist, showEquipmentlist] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);

  const [locationResetStatus, setLocationResetStatus] = useState<any>(false);
  const [filterLocationData, setFilterLocationData] = useState<any | null>([]);
  const filtersToCheck = [
    teamNameFilter,
    assigneeFilter,
    reportedBy,
    caseTypeFilter,
    priorityFilter,
    statusFilter,
    locationFilter,
    priorityFilter,
    globalFilterValue,
    setSubStatusData,
  ];

  const FACILITY: any = localStorage.getItem("FACILITYID");
  const FACILITYID: any = JSON.parse(FACILITY);
  if (FACILITYID) {
    var facility_type: any = FACILITYID?.FACILITY_TYPE;
  }

  const { setValue } = useForm({
    defaultValues: {
      LOCATIONID: "",
      EQUIPMENT_NAME: "",
    },
    mode: "all",
  });
  const DataDateLocalStorage: any = localStorage.getItem("DateData");
  const Data_Date: any = JSON.parse(DataDateLocalStorage);
  const buildFilter = (
    key: string,
    condition: any[],
    filterKey: keyof typeof filters
  ) =>
    getFilterValue(
      key,
      condition?.length > 0 ? filters?.[filterKey]?.value : [],
      location,
      filterGroup
    );

  const getEffectiveDates = (
    location: any,
    filterGroup: any,
    dateStatus: boolean,
    fromDate: any,
    toDate: any,
    startDate?: any,
    dateWO?: any
  ) => {
    const today = null;
    if (location?.state === "workorder") {
      return {
        from: filterGroup?.WO_START?.value ?? today,
        to: filterGroup?.WO_END?.value ?? today,
      };
    }
    if (dateStatus) {
      return { from: null, to: null };
    }

    if (dateWO && dateWO[0] && dateWO[1]) {
      return {
        from: moment(dateWO[0]).format("YYYY-MM-DD"),
        to: moment(dateWO[1]).format("YYYY-MM-DD"),
      };
    }

    return {
      from: fromDate ?? startDate ?? today,
      to: toDate ?? today,
    };
  };

  const getFilterListData = async (
    pageData: any,
    startDate?: any,
    type?: any,
    status?: any,
    dateWO?: any
  ) => {
    const { from, to } = getEffectiveDates(
      location,
      filterGroup,
      dateStatus,
      fromDate,
      toDate,
      startDate,
      dateWO
    );
    const payload = {
      SEARCH_TEXT: globalStatus ? "" : globalFilterValue ?? null,
      FROM_DATE: from,
      TO_DATE: to,
      WO_TYPE_LIST: buildFilter("WO_TYPE", caseTypeFilter, "WO_TYPE"),
      PRIORITY_LIST: buildFilter("SEVERITY", priorityFilter, "SEVERITY"),
      ASSIGNEE_LIST: buildFilter("ASSIGN_NAME", assigneeFilter, "ASSIGN_NAME"),
      TEAM_LIST: buildFilter("TEAM_ID", teamNameFilter, "TEAM_ID"),
      SUB_STATUS_LIST: clear_status
        ? []
        : location?.state === "workorder"
          ? filterGroup?.SUB_STATUS_DESC?.value
          : subStatusData?.length > 0
            ? subStatusData
            : [],
      PAGE_NUMBER: pageData?.PAGE_NUMBER,
      PAGE_SIZE: pageData?.PAGE_SIZE,
      LOCATION_LIST: buildFilter(
        "LOCATION_DESCRIPTION",
        locationFilter,
        "LOCATION_DESCRIPTION"
      ),
      REPORTER_LIST: buildFilter("REPORTED_NAME", reportedBy, "REPORTED_NAME"),
      STATUS_LIST: buildFilter("STATUS_DESC", statusFilter, "STATUS_DESC"),
      TYPE: type === "EXCEL" ? "EXCEL" : "FILTER",
    };

    setShowLoader(true);
    let apiPayload = status === "clear" ? payloadApi : payload;
    console.log(apiPayload, "apiplayload");
    try {
      const res: any = await callPostAPI(
        ENDPOINTS.FILTER_GET_API_LIST,
        apiPayload,
        currentMenu?.FUNCTION_CODE
      );
      if (res?.FLAG === 1) {
        if (type === "EXCEL") {
          if (res?.WOLIST?.length > 0) {
            helperExportCSV(res?.WOLIST, currentMenu?.FUNCTION_DESC);
          } else {
            setTableData([]);
            toast.warn("No data to export");
          }
        } else {


          const allEmpty = filtersToCheck.every((f) =>
            Array.isArray(f) ? f.length === 0 : f === "" || f == null
          );

          if (allEmpty) {
            if (clear_location === true || clear_status === true) {
              setResetStatus(true);
              setCustomRangeStatus(false);
            }
          }
          setPageCount(res?.WOLIST[0]?.TOTAL_COUNT);
          setstatusListCount(res?.COUNTLIST);

          const updatedList =
            res?.WOLIST?.length > 0
              ? formatServiceRequestList(res?.WOLIST, pathname, facility_type)
              : [];
          if (res?.WOLIST?.length > 0) {
            setRows(15);
            setFirst(0);
          }
          setTableData(updatedList);
          setShowLoader(false);
        }
      } else {
        setTableData([]);
        setShowLoader(false);
      }
    } catch (error: any) {
      setShowLoader(false);
    } finally {
      setShowLoader(false);
    }
  };

  const getAPI = async () => {
    // setShowLoader(true);
    try {
      getDashboardMasterDetails(setDateFilterList);
      let functionCode: any =
        pathname === "/servicerequestlist" ? "HD004" : "HD001";
      const responseFilter: any = await callPostAPI(
        ENDPOINTS.FILTER_GET_API,
        {},
        functionCode
      );
      if (responseFilter?.FLAG === 1) {
        const filteredStatuses = responseFilter?.WOSTATUSLIST?.filter(
          (status: any) =>
            status.STATUS_CODE !== 11 && status.STATUS_CODE !== 12
        );

        setStatusDatas(filteredStatuses);
        setFilterDropDownData(responseFilter);

        if (location?.state === null) {
          dispatch(clearFilters());
          setResetStatus(true);
        } else {
          const hasValue = relevantFields.some(
            (field) => filterGroup?.[field]?.value !== null
          );
          if (hasValue) {
            const fieldMappings = [
              {
                key: "TEAM_ID",
                setter: setTeamNameFilter,
                list: responseFilter?.TEAMLIST,
                idField: "TEAM_ID",
              },
              {
                key: "SEVERITY",
                setter: setPriorityFilter,
                list: responseFilter?.PRIORITYLIST,
                idField: "SEVERITY_ID",
              },
              {
                key: "LOCATION_DESCRIPTION",
                setter: setLocationFilter,
                list: responseFilter?.LOCATIONLIST,
                idField: "LOCATION_ID",
              },
              {
                key: "STATUS_DESC",
                setter: setStatusFilter,
                list: responseFilter?.WOSTATUSLIST,
                idField: "STATUS_CODE",
              },
              {
                key: "ASSIGN_NAME",
                setter: setAssigneeFilter,
                list: responseFilter?.ASSIGNEELIST,
                idField: "USER_ID",
              },
              {
                key: "REPORTED_NAME",
                setter: setReportedBy,
                list: responseFilter?.REPORTERLIST,
                idField: "USER_ID",
              },
              {
                key: "WO_TYPE",
                setter: setCaseTypeFilter,
                list: responseFilter?.WOTYPELIST,
                idField: "WO_TYPE_CODE",
              },
            ];
            if (filterGroup?.SUB_STATUS_DESC?.value) {
              const statusCodes = filterGroup.SUB_STATUS_DESC.value.map(
                (item: any) => item.STATUS_CODE
              );
              const updatedData = statusData.map((group: any) => ({
                ...group,
                items: group.items.map((item: any) => ({
                  ...item,
                  ISChecked: statusCodes.includes(item.STATUS_CODE),
                })),
              }));
              setStautusData(updatedData);
            }
            fieldMappings.forEach(({ key, setter, list, idField }) => {
              if (filterGroup?.[key]?.value) {
                const matched = handlerDetailFilter(
                  filterGroup[key].value,
                  list,
                  idField
                );
                setter(matched);
              }
            });
            if (facility_type === "I") {
              setLocationResetStatus(false);
              setFilterLocationData(filterGroup?.LOCATIONDATA?.value);
              setSubStatusData(filterGroup?.SUB_STATUS_DESC?.value);
              setSubStatusLabel(filterGroup?.STATUSLABEL?.value);
            }

            setWorkOrderDateFilter(filterGroup.WO_DATE.value);
            setResetStatus(false);
            setCustomRangeStatus(true);
            setSelectedDate(filterGroup.WO_DATE.value);
            if (filterGroup?.WO_DATE?.value?.DATE_DESC === "Custom") {
              const data: any = [];
              data.push(new Date(filterGroup?.WO_START?.value));
              data.push(new Date(filterGroup?.WO_END?.value));

              setWODate(data);
            }
            setFilters(filterGroup);
          } else {
            setResetStatus(true);
            setCustomRangeStatus(false);
          }
        }
        const statusOptions1 = transformStatusData(responseFilter?.STATUSLIST);
        setStautusData(statusOptions1);
        setStatusReponse(responseFilter?.STATUSLIST);
        setShowLoader(false);
      } else {
        setFilterDropDownData([]);
        setStautusData([]);
        setShowLoader(false);
      }
      await getFilterListData({ PAGE_NUMBER: 1, PAGE_SIZE: 15 });
    } catch (error: any) {
      toast.error(error);
      setShowLoader(false);
    } finally {
      setShowLoader(false);
    }
  };

  const handlerFilter = (
    e: any,
    typefilter: any,
    _filterType: any,
    _filterValue: any,
    _FilterType: any
  ) => {
    if (fromDate === null && toDate === null) {
      setSelectedDate(null);
    }
    setCustomRangeStatus(true);
    setSelectedCustome(false);
    setCustomResetDate(false);

    let value: any = e?.target?.value;
    if (_filterType === "global") {
      let _filters = { ...filters };

      // _filters["global"].value = value;
      setFilters((prev: any) => ({
        ...prev,
        global: {
          ...prev.global,
          value: value,
        },
      }));
      setFilters(_filters);
      setGlobalFilterValue(value);
      setResetStatus(false);
      dispatch(updateFilter({ key: "global", value }));
    } else {
      typefilter(value);

      const caseTypeIds = value?.map((user: any) => {
        return { [_filterType]: user[_filterValue] };
      });

      value = caseTypeIds;
      setFilters((prev: any) => {
        return {
          ...prev,
          [_FilterType]: { value, matchMode: FilterMatchMode.IN },
        };
      });
      setResetStatus(false);
      dispatch(updateFilter({ key: `${_FilterType}`, value }));
    }
  };

  const handleLocationFilter = (value: any) => {
    if (fromDate === null && toDate === null) {
      setSelectedDate(null);
    }
    if (facility_type === "I") {
      setCustomRangeStatus(true);
      setSelectedCustome(false);
      setCustomResetDate(false);
      setLocationFilter(value);
      setFilterLocationData(value);
      let locationData: any = value;
      const locationIds = value.map((user: any) => {
        return { LOCATION_ID: user?.node_id };
      });

      value = locationIds;
      setFilters((prev: any) => {
        return {
          ...prev,
          LOCATION_DESCRIPTION: { value, matchMode: FilterMatchMode.IN },
        };
      });
      setResetStatus(false);
      setLocationResetStatus(false);
      dispatch(updateFilter({ key: "LOCATION_DESCRIPTION", value }));

      setFilters((prev: any) => {
        return {
          ...prev,
          LOCATIONDATA: {
            value: locationData,
            matchMode: FilterMatchMode.IN,
          },
        };
      });
      dispatch(updateFilter({ key: "LOCATIONDATA", value: locationData }));
    } else {
    }
  };

  const clearLocationFilter = async (location: any) => {
    let value: any = null;
    setFilters((prev: any) => {
      return {
        ...prev,
        LOCATION_DESCRIPTION: { value, matchMode: FilterMatchMode.IN },
      };
    });
    if (
      teamNameFilter?.length > 0 ||
      assigneeFilter?.length > 0 ||
      reportedBy?.length > 0 ||
      caseTypeFilter?.length > 0 ||
      priorityFilter?.length > 0
    ) {
      setLocationFilter(location);

      // clear_location = true;
    } else {
      setLocationFilter(location);
      setFilterLocationData([]);
      dispatch(updateFilter({ key: "LOCATION_DESCRIPTION", value }));
      dispatch(updateFilter({ key: "LOCATIONDATA", value }));
      // clear_location = true;
    }
  };

  const clearFilter = () => {
    filtersToCheck &&
      filtersToCheck.forEach((reset) => {
        if (typeof reset === "function") {
          reset([]); // only call if it's really a function
        }
      });
    setSelectedCustome(false);
    setLocationResetStatus(true);
    setWorkOrderDateFilter([]);
    setSelectedDate(null);
    setCustomRangeStatus(false);
    setWODate(null);
  };
  useEffect(() => {
    if (selectedFacility) {
      (async function () {
        await getLocation(selectedFacility, setNodes);
        clearFilter();
        await getAPI();
      })();
    } else if (currentMenu?.FUNCTION_CODE) {
      (async function () {
        await getLocation(selectedFacility, setNodes);
      })();
      if (location?.state === "workorder") {
        (async function () {
          await getAPI();
        })();
      } else {
        (async function () {
          clearFilter();
          await getAPI();
        })();
      }
    }
  }, [selectedFacility, pathname, search, location?.state, currentMenu]);

  useEffect(() => {
    showEquipmentlist(false);
  }, []);

  return (
    <>
      <div className="card shadow-none" style={{ width: "100%" }}>
        <WorkorderMasterListHeader
          getFilterListData={getFilterListData}
          fromDate={fromDate}
        />
        <div
          className="p-4 bg-white rounded-t-lg border-t-4 border-x-4"
          style={{
            borderWidth: "1px",
          }}
        >
          <TableHeaderFilter
            tableData={tableData}
            setTableData={setTableData}
            filterData={filterData}
            statusListCount={statusListCount}
            setResetStatus={setResetStatus}
            resetStatus={resetStatus}
            customRangeStatus={customRangeStatus}
            setFilters={setFilters}
            setFromDate={setFromDate}
            setToDate={setToDate}
            getFilterListData={getFilterListData}
            filterDropDownData={filterDropDownData}
            teamNameFilter={teamNameFilter}
            setTeamNameFilter={setTeamNameFilter}
            caseTypeFilter={caseTypeFilter}
            setCaseTypeFilter={setCaseTypeFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            reportedBy={reportedBy}
            setReportedBy={setReportedBy}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
            setCustomRangeStatus={setCustomRangeStatus}
            setSelectedCustome={setSelectedCustome}
            globalFilterValue={globalFilterValue}
            subStatusData={subStatusData}
            setSubStatusData={setSubStatusData}
            subStatusLabel={subStatusLabel}
            setSubStatusLabel={setSubStatusLabel}
            handlerFilter={handlerFilter}
            handleLocationFilter={handleLocationFilter}
            clearLocationFilter={clearLocationFilter}
            setStautusData={setStautusData}
            statusData={statusData}
            statusResponse={statusResponse}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            setCustomResetDate={setCustomResetDate}
            customResetDate={customResetDate}
            locationResetStatus={locationResetStatus}
            setLocationResetStatus={setLocationResetStatus}
            selectedCustomeDate={selectedCustomeDate}
            setGlobalFilterValue={setGlobalFilterValue}
            dateStatus={dateStatus}
            clearLocation={clearLocation}
            setClearLocation={setClearLocation}
            clear_status={clear_status}
            showEquipmentlist={showEquipmentlist}
            visibleEquipmentlist={visibleEquipmentlist}
            nodes={nodes}
            locationFilteredData={locationFilteredData}
            setLocationName={setLocationName}
            locationName={locationName}
            filterLocationData={filterLocationData}
            setFilterLocationData={setFilterLocationData}
            setLocationFilteredData={setLocationFilteredData}
            setNodes={setNodes}
            setValue={setValue}
            clear_location={clear_location}
            filtersToCheck={filtersToCheck}
            Data_Date={Data_Date}
            filters={filters}
            globalStatus={globalStatus}
            setWODate={setWODate}
            dateWO={dateWO}
          />
        </div>

        <TableComponent
          tableHeader={tableHeader}
          tableData={tableData}
          first={first}
          rows={rows}
          setFirst={setFirst}
          setRows={setRows}
          pageCount={pageCount}
          onPageChange={onPageChange}
          getFilterListData={getFilterListData}
          showLoader={showLoader}
          customRangeStatus={customRangeStatus}
        />
      </div>
    </>
  );
};

export default WorkOrderMasterInfra;
