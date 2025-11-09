import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearFilters, updateFilter } from "../../../../store/filterstore";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

import Buttons from "../../../../components/Button/Button";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import moment from "moment";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Checkbox } from "primereact/checkbox";
import { t } from "i18next";
import LocationHierarchyDialog from "../../../../components/HierarchyDialog/LocationHierarchyDialog";
import "../../../../components/MultiSelects/MultiSelects.css";

import "../../../../components/Checkbox/Checkbox.css";
import {
  clearFilterKeys,
  clearFilterState,
  clearSubStatus,
  clearSelection,
  onStatusChange,
  getLabel,
} from "../HeplerWorkorder";

export const TableHeaderFilter: any = ({
  tableData,
  setTableData,
  filterData,
  statusListCount,
  setResetStatus,
  resetStatus,
  customRangeStatus,
  setFilters,
  setFromDate,
  setToDate,
  getFilterListData,
  filterDropDownData,
  teamNameFilter,
  setTeamNameFilter,
  caseTypeFilter,
  setCaseTypeFilter,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  reportedBy,
  setReportedBy,
  assigneeFilter,
  setAssigneeFilter,
  setCustomRangeStatus,
  setSelectedCustome,
  globalFilterValue,
  subStatusData,
  setSubStatusData,
  subStatusLabel,
  setSubStatusLabel,
  handlerFilter,
  handleLocationFilter,
  clearLocationFilter,
  setStautusData,
  statusData,
  statusResponse,
  setSelectedDate,
  selectedDate,
  setCustomResetDate,
  customResetDate,
  locationResetStatus,
  setLocationResetStatus,
  selectedCustomeDate,
  setGlobalFilterValue,
  dateStatus,
  clearLocation,
  setClearLocation,
  clear_status,
  showEquipmentlist,
  visibleEquipmentlist,
  nodes,
  locationFilteredData,
  setLocationName,
  locationName,
  filterLocationData,
  setFilterLocationData,
  setLocationFilteredData,
  setNodes,
  setValue,
  clear_location,
  filtersToCheck,
  Data_Date,
  filters,
  globalStatus,
  setWODate,
  dateWO,
}: any) => {
  //------------Date Custome Range Eve nt-------------------
  const FACILITY: any = localStorage.getItem("FACILITYID");
  const FACILITYID: any = JSON.parse(FACILITY);
  const op = useRef<any | null>(null);
  const navigate = useNavigate();
  if (FACILITYID) {
    var facility_type: any = FACILITYID?.FACILITY_TYPE;
  }
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [minDate, setMinDate] = useState<any | null>(null);

  const [firstDateSelected, setFirstDateSelected] = useState<boolean>(false);
  const panelFooterTemplate = (handleValue: any) => {
    return (
      <div className="py-2 px-3">
        <label
          onClick={() => {
            handleValue([]);
            if (tableData?.length === 0) {
              setTableData(filterData);
            }
          }}
        >
          Clear Selection
        </label>
      </div>
    );
  };

  const statusCountMap: { [key: string]: number } = {};

  statusListCount.forEach((item: any) => {
    const key = (item.STATUS_DESC ?? "Unknown").trim();
    if (statusCountMap[key]) {
      statusCountMap[key] += item.COUNT;
    } else {
      statusCountMap[key] = item.COUNT;
    }
  });

  const handlerCustomDateRange = async () => {
    setResetStatus(false);

    setFromDate(null);
    setToDate(null);
    dateStatus = false;
    if (dateWO !== null) {
      if (dateWO[0] !== null && dateWO[1] !== null) {
        setFromDate(moment(dateWO[0]).format("YYYY-MM-DD"));
        setToDate(moment(dateWO[1]).format("YYYY-MM-DD"));
        setSelectedCustome(false);
        let value = moment(dateWO[0]).format("YYYY-MM-DD");
        setFilters((prev: any) => {
          return {
            ...prev,
            WO_START: { value, matchMode: FilterMatchMode.IN },
          };
        });
        value = moment(dateWO[1]).format("YYYY-MM-DD");
        setFilters((prev: any) => {
          return {
            ...prev,
            WO_END: { value, matchMode: FilterMatchMode.IN },
          };
        });
        dispatch(
          updateFilter({
            key: "WO_START",
            value: moment(dateWO[0]).format("YYYY-MM-DD"),
          })
        );
        dispatch(
          updateFilter({
            key: "WO_END",
            value: moment(dateWO[1]).format("YYYY-MM-DD"),
          })
        );
        getFilterListData(
          { PAGE_NUMBER: 1, PAGE_SIZE: 15 },
          undefined,
          undefined,
          undefined,
          dateWO
        );
        setSelectedCustome(false);
      } else {
        toast.error("Please select date range");
      }
    } else {
      toast.error("Please select date range");
    }
  };

  const getCalendarRangeDate = (e: any) => {
    const selectedDates = e.value;
    if (e.value[0] !== null && minDate === null) {
      setMinDate(selectedDates[0]);
      setWODate(selectedDates);
      setFirstDateSelected(true);
    } else if (e.value[0] !== null && e.value[1] !== null) {
      setFirstDateSelected(false);
      setWODate(selectedDates);
      setMinDate(null);
      setSelectedCustome(true);
    }
  };
  const getListFilter = async () => {
    dispatch(updateFilter({ key: "SUB_STATUS_DESC", value: subStatusData }));
    dispatch(updateFilter({ key: "STATUSLABEL", value: subStatusLabel }));
    getFilterListData({ PAGE_NUMBER: 1, PAGE_SIZE: 15 });
  };

  const multiSelectConfigs = [
    {
      condition: "I",
      value: teamNameFilter,
      setValue: setTeamNameFilter,
      field: "TEAM_ID",
      labelField: "TEAM_NAME",
      descriptionField: "TEAM_ID",
      options: filterDropDownData?.TEAMLIST,
      placeholder: "Team",
    },
    {
      condition: true,
      value: caseTypeFilter,
      setValue: setCaseTypeFilter,
      field: "WO_TYPE_CODE",
      labelField: "WO_TYPE_NAME",
      descriptionField: "WO_TYPE",
      options: filterDropDownData?.WOTYPELIST,
      placeholder: "Case Type",
      itemTemplate: (option: any) =>
        `${option.WO_TYPE_NAME} (${option.WO_TYPE_CODE})`,
    },
    {
      condition: facility_type === "R",
      value: locationFilter,
      setValue: setLocationFilter,
      field: "LOCATION_ID",
      labelField: "LOCATION_DESCRIPTION",
      descriptionField: "LOCATION_DESCRIPTION",
      options: filterDropDownData?.LOCATIONLIST,
      placeholder: "Location",
    },
    {
      condition: facility_type === "R",
      value: statusFilter,
      setValue: setStatusFilter,
      field: "STATUS_CODE",
      labelField: "STATUS_DESC",
      descriptionField: "STATUS_DESC",
      options:
        pathname === "/workorderlist"
          ? filterDropDownData?.WOSTATUSLIST
          : filterDropDownData?.WOSTATUSLIST,
      placeholder: "Status",
    },
    {
      condition: facility_type === "I",
      value: priorityFilter,
      setValue: setPriorityFilter,
      field: "SEVERITY_ID",
      labelField: "SEVERITY",
      descriptionField: "SEVERITY",
      options: filterDropDownData?.PRIORITYLIST,
      placeholder: "Priority",
    },
    {
      condition: facility_type === "R",
      value: reportedBy,
      setValue: setReportedBy,
      field: "USER_ID",
      labelField: "LOGIN_NAME",
      descriptionField: "REPORTED_NAME",
      options: filterDropDownData?.REPORTERLIST,
      placeholder: "Reporter",
    },
    {
      condition: facility_type === "R",
      value: assigneeFilter,
      setValue: setAssigneeFilter,
      field: "USER_ID",
      labelField: "LOGIN_NAME",
      descriptionField: "ASSIGN_NAME",
      options: filterDropDownData?.ASSIGNEELIST,
      placeholder: "Assignee",
    },
  ];

  const resetFilters = async () => {
    dispatch(clearFilters());

    setReportedBy([]);
    setClearLocation(true);
    setCaseTypeFilter([]);
    setLocationFilter([]);
    setStatusFilter([]);
    setPriorityFilter([]);
    setTeamNameFilter([]);
    setSubStatusData([]);
    setSelectedCustome(false);
    setAssigneeFilter([]);
    setLocationResetStatus(true);
    setSelectedDate(null);
    setLocationName(null);
    setCustomRangeStatus(false);
    setWODate(null);
    setGlobalFilterValue("");
    setSubStatusLabel([]);
    setSelectedCustome(false);
    setClearLocation(true);
    setCustomResetDate(false);
    setLocationResetStatus(true);
    setSelectedDate(null);
    setLocationName(null);
    setCustomRangeStatus(false);
    setWODate(null);
    setGlobalFilterValue("");
    clearFilterState(setFilters);
    setFromDate(null);
    setToDate(null);
    setFilters({ ...filters });
    clearFilterKeys(dispatch, updateFilter);
    const updatedStatusData: any = clearSubStatus(statusData);
    setStautusData(updatedStatusData);
    getFilterListData(
      { PAGE_NUMBER: 1, PAGE_SIZE: 15 },
      null,
      "FILTER",
      "clear"
    );

    if (pathname === "/servicerequestlist") {
      navigate("/servicerequestlist", { state: null });
    }
    dateStatus = true;
    globalStatus = true;

    setResetStatus(true);
  };
  console.log(customRangeStatus, "rrr");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div>
          <IconField iconPosition="right" className="w-64 h-full">
            <InputText
              type="search"
              value={globalFilterValue}
              //  onChange={onGlobalFilterChange}
              onChange={(e) =>
                handlerFilter(
                  e,
                  setGlobalFilterValue,
                  "global",
                  "global",
                  "Global Search"
                )
              }
              placeholder="Search"
              className="w-80 Search-Input h-full"
            />
          </IconField>
        </div>
        <Dropdown
          value={selectedDate}
          onChange={async (e: any) => {
            e.preventDefault();
            setResetStatus(false);
            dateStatus = false;
            let date_filter: any = e.target.value?.DATE_DESC;
            let value = e.target.value;
            dispatch(updateFilter({ key: "WO_DATE", value }));
            setSelectedDate(e.target.value);
            if (date_filter === "Custom") {
              const isNotEmpty = filtersToCheck.some((f: any) =>
                Array.isArray(f) ? f.length > 0 : f !== "" && f != null
              );
              if (isNotEmpty) {
                setCustomRangeStatus(true);
              } else {
                setCustomRangeStatus(false);
                setCustomResetDate(true);
              }
              setSelectedCustome(true);
            } else {
              setCustomRangeStatus(true);
              setWODate(null);
              setSelectedCustome(false);
              let startDate = moment(e?.target?.value?.FROM_DATE).format(
                "YYYY-MM-DD"
              );
              let endDate = moment(e.target.value?.TO_DATE).format(
                "YYYY-MM-DD"
              );
              setFromDate(startDate);
              setToDate(endDate);
              let value: any = startDate;
              setFilters((prev: any) => {
                return {
                  ...prev,
                  WO_START: { value, matchMode: FilterMatchMode.IN },
                };
              });
              value = endDate;
              setFilters((prev: any) => {
                return {
                  ...prev,
                  WO_END: { value, matchMode: FilterMatchMode.IN },
                };
              });
              dispatch(updateFilter({ key: "WO_START", value: startDate }));
              dispatch(updateFilter({ key: "WO_END", value: endDate }));
            }
          }}
          options={Data_Date}
          optionLabel={"DATE_DESC"}
          itemTemplate={(option) => (
            <div className="flex justify-between">
              {option.value !== "Custom" ? (
                <>
                  <div>{option.DATE_DESC}</div>{" "}
                  <div className="ml-7" style={{ color: "#7E8083" }}>
                    {option.SUB_DATE_DESC}
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setSelectedCustome(true)}
                    style={{ display: "flex", width: "100%" }}
                  >
                    {option.DATE_DESC}
                    <div
                      className="ml-7"
                      style={{ color: "#7E8083", marginLeft: 140 }}
                      onClick={() => setSelectedCustome(true)}
                    >
                      {">"}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          placeholder="Date"
          className="w-42"
        />

        {multiSelectConfigs.map((config, index) =>
          config.condition ? (
            <MultiSelect
              key={index}
              value={config.value}
              onChange={(e: any) =>
                handlerFilter(
                  e,
                  config.setValue,
                  config.field,
                  config.field,
                  config.descriptionField
                )
              }
              options={config.options}
              filter
              maxSelectedLabels={1}
              optionLabel={config.labelField}
              placeholder={config.placeholder}
              className="w-40"
              panelFooterTemplate={panelFooterTemplate(handlerFilter)}
              itemTemplate={config.itemTemplate}
            />
          ) : null
        )}

        {facility_type === "I" && (
          <div>
            <div className="relative w-40 h-full">
              <InputText
                placeholder="Location"
                value={
                  clearLocation === true
                    ? ""
                    : clear_location === true
                      ? ""
                      : locationFilter?.length > 0
                        ? getLabel(locationFilter, "Location", locationName)
                        : ""
                }
                onClick={(e: any) => {
                  clear_location = false;
                  showEquipmentlist(true);
                  setClearLocation(false);
                }}
                readOnly
                className="width-1/5 pr-8 placeholder-[#6b7280] h-full"
              />
              <i
                className="pi pi-angle-down absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
                style={{ pointerEvents: "none" }} // Ensures clicks pass through to InputText
              />
            </div>
            <LocationHierarchyDialog
              showEquipmentlist={showEquipmentlist}
              visibleEquipmentlist={visibleEquipmentlist}
              nodes={nodes}
              locationFilteredData={locationFilteredData}
              setLocationFilteredData={setLocationFilteredData}
              setNodes={setNodes}
              setValue={setValue}
              setLocationName={setLocationName}
              handleLocationFilter={handleLocationFilter}
              locationResetStatus={locationResetStatus}
              setLocationResetStatus={setLocationResetStatus}
              clearLocationFilter={clearLocationFilter}
              clearLocation={clearLocation}
              filterLocationData={filterLocationData}
              setFilterLocationData={setFilterLocationData}
            />
          </div>
        )}

        {facility_type === "I" && (
          <div>
            <div className="relative w-40 h-full">
              <InputText
                placeholder="Status"
                value={getLabel(
                  subStatusLabel,
                  "Status",
                  subStatusLabel ? subStatusLabel[0]?.SUB_STATUS_DESC : ""
                )}
                onClick={(e) => {
                  op.current.toggle(e);
                  clear_status = false;
                }}
                className="width-1/5 pr-8 h-full .p-placeholder !text-[#6b7280]" // pr-8 = padding-right for icon space
                readOnly
              />
              <i
                className="pi pi-angle-down absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
                style={{ pointerEvents: "none" }} // Ensures clicks pass through to InputText
              />
            </div>
            <OverlayPanel className="custom-overlay" ref={op}>
              <div className="flex flex-row flex-wrap gap-5 bg-white">
                {statusData?.map((option: any, index: any) => (
                  <div key={index} className="w-[300px] bg-white">
                    <div className="status-header">{option.label}</div>
                    {option?.items?.map((optionItem: any, idx: any) => {
                      const countData = statusListCount.find(
                        (item: any) => item.STATUS_DESC === optionItem.label
                      );
                      const isChecked = subStatusData?.some(
                        (selectedItem: any) =>
                          selectedItem.STATUS_CODE?.toString() ===
                          optionItem.STATUS_CODE?.toString()
                      );
                      return (
                        <div
                          key={idx}
                          className="flex flex-wrap justify-between mt-2 bg-white"
                        >
                          <div className="flex">
                            <Checkbox
                              value={optionItem.STATUS_CODE}
                              onChange={(e: any) =>
                                onStatusChange(
                                  e,
                                  optionItem,
                                  setCustomRangeStatus,
                                  statusResponse,
                                  setSubStatusLabel,
                                  setSubStatusData,
                                  setFilters,
                                  setResetStatus,
                                  setStautusData,
                                  subStatusData,
                                  subStatusLabel
                                )
                              }
                              checked={isChecked}
                            />
                            <label
                              htmlFor={optionItem.label}
                              className="ml-2 status-subheading"
                            >
                              {optionItem.label}
                            </label>
                          </div>
                          <label className="status-subheading">
                            ({countData ? countData.COUNT : 0}){" "}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-4 px-[24px] py-[12px] border-t border-gray-200">
                <a
                  className="status-subheading"
                  onClick={(e: any) =>
                    clearSelection(
                      e,
                      clear_status,
                      setStautusData,
                      statusData,
                      setSubStatusLabel,
                      setSubStatusData
                    )
                  }
                >
                  Clear Selection
                </a>
              </div>
            </OverlayPanel>
          </div>
        )}
        {!resetStatus && customRangeStatus === true && (
          <Button
            type="button"
            className="Primary_Button w-40"
            label="Apply"
            onClick={getListFilter}
          />
        )}

        {!resetStatus && customRangeStatus === true && (
          <Button
            type="button"
            className="Secondary_Button w-40"
            label="Clear Filter"
            onClick={() => {
              resetFilters();
            }}
          />
        )}
        {customRangeStatus === false && customResetDate === true && (
          <Button
            type="button"
            className="Secondary_Button"
            label="Clear Filter"
            onClick={() => resetFilters()}
          />
        )}
      </div>

      {selectedCustomeDate && (
        <Card className="w-3/5 absolute z-10">
          <div>
            <Calendar
              value={dateWO}
              onChange={(e: any) => {
                getCalendarRangeDate(e);
              }}
              inline
              numberOfMonths={1}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              minDate={firstDateSelected ? minDate : null}
            />
          </div>
          <div className="flex flex-wrap justify-end mt-2">
            <Buttons
              className="Secondary_Button me-2"
              label={t("Cancel")}
              onClick={() => {
                setSelectedCustome(false);
              }}
            />
            <Buttons
              className="Primary_Button"
              label={t("Select")}
              onClick={async () => {
                await handlerCustomDateRange();
              }}
            />
          </div>
        </Card>
      )}
    </>
  );
};
