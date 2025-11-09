import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Dashboard.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ENDPOINTS } from "../../utils/APIEndpoints";
import { callPostAPI } from "../../services/apis";
import Buttons from "../../components/Button/Button";
import { Calendar } from "primereact/calendar";
import { toast } from "react-toastify";
import moment from "moment";
import { useLocation, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../components/MultiSelects/MultiSelects.css";
import { InputText } from "primereact/inputtext";
import LocationHierarchyDialog from "../../components/HierarchyDialog/LocationHierarchyDialog";
import LoaderShow from "../../components/Loader/LoaderShow";
import {
  StatusActionApexChart,
  EquipementData,
  UserSelector,
  itemTemplate,
  AssigneeTemplate,
  ReporterTemplate,
  ResponseTimeCard,
} from "./HelperDashboard";
import { getLocation } from "../Helpdesk/Workorder/HeplerWorkorder";
import {
  onToggleButtonChange,
  AvgDashboardDataRes,
  AvgDashboardDataRect,
  AvgTimeCalRes,
  AvgTimeCalRect,
  getDashboardMasterDetails,
  DashboardSeriesData,
  DashboardLabelData,
  createDonutConfig,
  statusMap,
  createChartConfig
} from "./HelperDash";
let fromDate: any;
let ToDate: any;
let totresvalue: any = 0;
let totretvalue: any = 0;
let IsCheckValueRes: any = "Hour";
let IsCheckValueRect: any = "Hour";
let IsResRectCheck: any = "All";

const Dashboard = () => {
  let { pathname } = useLocation();
  const [selectedFacility, menuList]: any = useOutletContext();
  const [visibleEquipmentlist, showEquipmentlist] = useState(false);
  const [dashboardConfigureList, setDashboardConfigureList] = useState<
    any | null
  >([]);
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [locationFilteredData, setLocationFilteredData] = useState<any[]>([]);
  const [loading, setLaoding] = useState<boolean>(false);
  const [locationResetStatus, setLocationResetStatus] = useState<any | null>(
    false
  );
  const [selectedlocationCount, setselectedlocationCount] = useState<any>();
  const [locationCheckData, setLocationCheckData] = useState<any | null>([]);
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];
  let OnloadFilterList: any = [];
  const FACILITY: any = localStorage.getItem("FACILITYID");
  const FACILITYID: any = JSON.parse(FACILITY);
  const isPrecondition = FACILITYID?.ISPRECONDITION === true;
  let OnloadResolveCaseList: any = [
    {
      Cancelled: 0,
      Completed: 0,
      Accepted: 0,
      ...(isPrecondition && { "Cancelled - Pre Conditional": 0 }),
    },
  ];

  let OnloadActiveCaseList: any = [
    {
      Open: 0,
      "In Progress": 0,
      "On Hold": 0,
      Rectified: 0,
      "Pending Action": 0,
      "Re Open": 0,
    },
  ];
  let OnloadCMWOList: any = [{ High: 0, Medium: 0, Low: 0 }];
  let OnloadPMWOList: any = [{ High: 0, Medium: 0, Low: 0 }];
  let OnloadPDWOList: any = [{ High: 0, Medium: 0, Low: 0 }];
  let OnloadAvgResList: any = [{ High: 0, Medium: 0, Low: 0 }];
  let OnloadAvgRetList: any = [{ High: 0, Medium: 0, Low: 0 }];
  const [location, setLocation] = useState<any | null>([]);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const op: any = useRef<OverlayPanel>(null);
  const options: string[] = ["Day", "Hour"];
  const [valueRes, setValueRes] = useState<string>(options[1]);
  const [valueRect, setValueRect] = useState<string>(options[1]);
  const [DateDesc, setDateDesc] = useState<string>("");
  const [FilterDesc, setFilterDesc] = useState<string>("");
  const [WoCount, setWoCount] = useState<string>("");
  const [WoRetCount, setWoRetCount] = useState<string>("");
  const [AvgTotResTime, setAvgTotResTime] = useState<any>("0d 0h 0m");
  const [AvgTotRetTime, setAvgTotRetTime] = useState<any>(0);
  const [DateFilterList, setDateFilterList] = useState<any | null>([]);
  const [totalCaseCount, setTotalCaseCount] = useState<any>(0);
  const [totalEquipmentGroupCount, settotalEquipmentGroupCount] =
    useState<any>(0);
  const [totalEquipmentTypeCount, settotalEquipmentTypeCount] =
    useState<any>(0);
  const [totalIssueCount, settotalIssueCount] = useState<any>(0);
  const [totalAsssigneeCount, settotalAsssigneeCount] = useState<any>(0);
  const [totalReporterCount, settotalReporterCount] = useState<any>(0);
  const [searchText, setSearchText] = useState<any>("");
  const [locationName, setLocationName] = useState<any>(null);
  const [ResolvedCaseList, setResolvedCaseList] = useState<
    any | null | undefined
  >([0, 0]);
  const [CMWoList, setCMWoList] = useState<any | null | undefined>([0, 0, 0]);
  var onActiveColors: any = [];

  const [selectedCustomeDate, setSelectedCustome] = useState<boolean>(false);
  const [dateWO, setWODate] = useState<any | null>([]);
  const [equipmentGroupList, setequipmentGroup] = useState<any | null>([]);
  const [ogequipmentGroupList, setogequipmentGroup] = useState<any | null>([]);
  const [equipmentTypeList, setequipmentTypeList] = useState<any | null>([]);
  const [ogequipmentTypeList, setogequipmentTypeList] = useState<any | null>(
    []
  );
  const [issueList, setissueList] = useState<any | null>([]);
  const [ogissueList, setogissueList] = useState<any | null>([]);
  const [assignee, setAssignee] = useState<any | null>([]);
  const [ogassignee, setogAssignee] = useState<any | null>([]);

  const [reporterList, setreporterList] = useState<any | null>([]);
  const [ogreporterList, setogreporterList] = useState<any | null>([]);

  const { setValue } = useForm({
    defaultValues: {
      LOCATIONID: "",
      EQUIPMENT_NAME: "",
    },
    mode: "all",
  });
  const [optionsList, setObjet] = useState<any>(
    createDonutConfig({
      series: DashboardSeriesData(OnloadActiveCaseList),
      labels: DashboardLabelData(OnloadActiveCaseList),
      title: "Active Cases",
      colors: ["#FF9089", "#7E7E7E", "#FFCE73", "#88C8FF", "#ffffff", "f1f1f1"],
    })
  );

  const [resolvedList, setResolved] = useState<any>(
    createDonutConfig({
      series: ResolvedCaseList,
      labels: DashboardLabelData(OnloadResolveCaseList),
      title: "Resolved Cases",
      colors: [], // will be updated dynamically later
    })
  );

  const [correctiveList, setCorrective] = useState<any>(
    createDonutConfig({
      series: CMWoList,
      labels: DashboardLabelData(OnloadCMWOList),
      halfDonut: true,
    })
  );

  const [preventiveList, setPreventive] = useState<any>(
    createDonutConfig({
      series: DashboardSeriesData(OnloadPMWOList),
      labels: DashboardLabelData(OnloadPMWOList),
      halfDonut: true,
    })
  );

  const [predictiveList, setPredictive] = useState<any>(
    createDonutConfig({
      series: DashboardSeriesData(OnloadPDWOList),
      labels: DashboardLabelData(OnloadPDWOList),
      halfDonut: true,
    })
  );
  
const [responseTimeList, setResponseTime] = useState<any>(
    createChartConfig(
      "Response Time",
      IsCheckValueRes,
      AvgDashboardDataRes(OnloadAvgResList[0], IsCheckValueRes),
      IsCheckValueRes
    )
  );

  const [rectificationTimeList, setRectificationTime] = useState<any>(
    createChartConfig(
      "Rectification Time",
      IsCheckValueRect,
      AvgDashboardDataRect(OnloadAvgRetList[0], IsCheckValueRect),
      IsCheckValueRect
    )
  );
  useEffect(() => {
    if (typeof locationName === "string" && locationName.trim() !== "") {
      const locationCount: string[] = locationName
        .split(",")
        .map((item) => item?.trim());
      setselectedlocationCount(locationCount);
    } else {
      setselectedlocationCount([]); // clear it when locationName is empty or invalid
    }
  }, [locationName]);

  useEffect(() => {
    let language: any = localStorage.getItem("language");
    i18n.changeLanguage(language);
    try {
      setLaoding(true);
      (async function () {
        setLocationName(null);
        setLocationResetStatus(true);
        await getDashboardMasterDetails(
          setDateFilterList,
          OnloadFilterList,
          filterDateHandeler
        );
        await getLocation(selectedFacility, setNodes);
      })();
      UpdateDashboardDetails();
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLaoding(false);
    }
  }, [selectedFacility, currentMenu]);

  const filterDateHandeler = async (items: any) => {
    IsResRectCheck = "All";
    op?.current?.hide();
    if (items.SEQ_NO == 7) {
      setSelectedCustome(true);
    } else {
      setWODate([]);
      setSelectedCustome(false);
      fromDate = items.FROM_DATE;
      ToDate = items.TO_DATE;
      setDateDesc(items.DATE_DESC);
      setFilterDesc(items.SUB_DATE_DESC);
      let locationStatus: any = false;
      await getDashboardDetails(locationStatus);
    }
  };

  const onSubmitCustomDate = () => {
    if (dateWO.length == 0) {
      toast?.error("Please Select From and To Date");
      return;
    }
    if (dateWO.length < 2) {
      toast?.error("Please Select From and To Date");
      return;
    }
    if (dateWO.length == 2) {
      if (dateWO[0] == undefined || dateWO[0] == null) {
        toast?.error("Please Select From Date");
        return;
      }
      if (dateWO[1] == undefined || dateWO[1] == null) {
        toast?.error("Please Select To Date");
        return;
      }
    }

    fromDate = moment(dateWO[0]).format("YYYY-MM-DD");
    ToDate = moment(dateWO[1]).format("YYYY-MM-DD");
    setDateDesc("Custom");
    setFilterDesc(
      moment(dateWO[0]).format("DD MMM, YYYY") +
        " - " +
        moment(dateWO[1]).format("DD MMM, YYYY")
    );
    setSelectedCustome(false);
    let locationStatus: any = false;
    (async function () {
      await getDashboardDetails(locationStatus);
    })();
  };
  const getDashboardDetails = async (
    locationStatus: any,
    uniqueLocation?: any
  ) => {
    try {
      let statusCode: any = localStorage.getItem("statusColorCode");
      const dataColor: any = JSON.parse(statusCode);
      const data = dataColor?.map((item: any) => {
        return {
          STATUS_DESC: item.STATUS_DESC,
          COLORS: item.COLORS,
        };
      });

      const labels = Object.keys(OnloadActiveCaseList[0]);
      const colorsActive: any = labels.map((label) => {
        const statusDesc = statusMap[label];
        const match = data.find((item: any) => item.STATUS_DESC === statusDesc);
        return match ? match.COLORS : "#ccc"; // fallback color
      });
      let preConditionalColor: any =
        FACILITYID?.ISPRECONDITION === true
          ? "Cancelled - Pre Conditional"
          : "";
      const statusResolvedMap: any = {
        Cancelled: "Cancelled",
        Completed: "Completed",
        Accepted: "Accepted",
        ...(isPrecondition && {
          "Cancelled - Pre Conditional": "Cancelled - Pre Conditional",
        }),
        preConditionalColor: preConditionalColor,
      };
      const labelsResolved = Object.keys(OnloadResolveCaseList[0]);
      const colorsResolved: any = labelsResolved.map((label) => {
        const statusDesc = statusResolvedMap[label];
        const match = data.find((item: any) => item.STATUS_DESC === statusDesc);
        return match ? match.COLORS : "#ccc"; // fallback color
      });

      let payload = {
        FROM_DATE: fromDate,
        TO_DATE: ToDate,
        LOCATION_LIST:
          locationStatus === true
            ? uniqueLocation
            : location?.length > 0
            ? location
            : [],
      };

      const res = await callPostAPI(
        ENDPOINTS.GET_DASHBOARD_DETAILS,
        payload,
        null
      );
      if (res && res?.FLAG === 1) {
        setequipmentGroup(res?.ASSETGROUPLIST);
        setogequipmentGroup(res?.ASSETGROUPLIST);

        if (res?.ASSETGROUPLIST?.length > 0) {
          const totalCountAssetGroup = res?.ASSETGROUPLIST?.reduce(
            (acc: number, item: any) => {
              return acc + item.COUNT;
            },
            0
          );
          if (totalCountAssetGroup) {
            settotalEquipmentGroupCount(totalCountAssetGroup);
          }
        } else {
          settotalEquipmentGroupCount(0);
        }

        if (res?.ASSETTYPELIST?.length > 0) {
          const totalCountAssetType = res?.ASSETTYPELIST?.reduce(
            (acc: number, item: any) => {
              return acc + item?.COUNT;
            },
            0
          );
          if (totalCountAssetType) {
            settotalEquipmentTypeCount(totalCountAssetType);
          }
        } else {
          settotalEquipmentTypeCount(0);
        }

        if (res?.ISSUELIST?.length > 0) {
          const totalCountIssue = res?.ISSUELIST?.reduce(
            (acc: number, item: any) => {
              return acc + item?.COUNT;
            },
            0
          );
          if (totalCountIssue) {
            settotalIssueCount(totalCountIssue);
          }
        } else {
          settotalIssueCount(0);
        }

        if (res?.ASSINEELIST?.length > 0) {
          const totalCountAssignee = res?.ASSINEELIST?.reduce(
            (acc: number, item: any) => {
              return acc + item?.COUNT;
            },
            0
          );
          if (totalCountAssignee) {
            settotalAsssigneeCount(totalCountAssignee);
          }
        } else {
          settotalAsssigneeCount(0);
        }

        if (res?.ASSINEELIST?.length > 0) {
          const totalCountReporter = res?.REPORTERLIST?.reduce(
            (acc: number, item: any) => {
              return acc + item?.COUNT;
            },
            0
          );
          if (totalCountReporter) {
            settotalReporterCount(totalCountReporter);
          }
        } else {
          settotalReporterCount(0);
        }
        setissueList(res?.ISSUELIST);
        setogissueList(res?.ISSUELIST);

        setAssignee(res?.ASSINEELIST);
        setogAssignee(res?.ASSINEELIST);
        setreporterList(res?.REPORTERLIST);
        setogreporterList(res?.REPORTERLIST);
        setequipmentTypeList(res?.ASSETTYPELIST);
        setogequipmentTypeList(res?.ASSETTYPELIST);
        OnloadActiveCaseList = res?.ACTIVECASELIST;
        OnloadResolveCaseList = res?.RESOLVECASELIST.map((item: any) => {
          const { Cancelled, Completed, Accepted } = item;
          return {
            Cancelled,
            Completed,
            Accepted,
            ...(isPrecondition && {
              "Cancelled - Pre Conditional":
                item["Cancelled - Pre Conditional"],
            }),
          };
        });
        OnloadCMWOList = res?.CMWOLIST;
        OnloadPMWOList = res?.PMWOLIST;
        OnloadPDWOList = res?.PDWOLIST;
        OnloadAvgResList = res?.AVGRESLIST;
        OnloadAvgRetList = res?.AVGRECLIST;
        totresvalue = res?.WOCOUNTLIST[0]?.AVG_RES_TOT_TIME;
        totretvalue = res?.WOCOUNTLIST[0]?.AVG_RET_TOT_TIME;

        const totalActiveCaseList: any = Object.values(
          res?.ACTIVECASELIST[0]
        ).reduce((sum: any, value: any) => sum + value, 0);
        const totalResolveCaseList: any = Object.values(
          res?.RESOLVECASELIST[0]
        ).reduce((sum: any, value: any) => sum + value, 0);
        setTotalCaseCount(totalActiveCaseList + totalResolveCaseList);
        setWoCount(res?.WOCOUNTLIST[0]?.WO_COUNT);
        setWoRetCount(res?.WOCOUNTLIST[0]?.WO_RET_COUNT);
        setResolvedCaseList(DashboardSeriesData(res?.RESOLVECASELIST));
        setCMWoList(DashboardSeriesData(res?.CMWOLIST));
        UpdateDashboardDetails();
        setObjet(
          createDonutConfig({
            series: DashboardSeriesData(OnloadActiveCaseList),
            labels: DashboardLabelData(OnloadActiveCaseList),
            title: "Active Cases",
            colors: colorsActive,
          })
        );

        setResolved(
          createDonutConfig({
            series: [
              res?.RESOLVECASELIST[0]?.Cancelled,
              res?.RESOLVECASELIST[0]?.Completed,
              res?.RESOLVECASELIST[0]?.Accepted,
              ...(isPrecondition
                ? [res?.RESOLVECASELIST[0]?.["Cancelled - Pre Conditional"]]
                : []),
            ],
            labels: DashboardLabelData(OnloadResolveCaseList),
            title: "Resolved Cases",
            colors: colorsResolved,
          })
        );
        setCorrective(
          createDonutConfig({
            series: DashboardSeriesData(res?.CMWOLIST),
            labels: DashboardLabelData(OnloadCMWOList),
            halfDonut: true,
          })
        );

        setPreventive(
          createDonutConfig({
            series: DashboardSeriesData(res?.PMWOLIST),
            labels: DashboardLabelData(OnloadPMWOList),
            halfDonut: true,
          })
        );

        setPredictive(
          createDonutConfig({
            series: DashboardSeriesData(res?.PDWOLIST),
            labels: DashboardLabelData(res?.PDWOLIST),
            halfDonut: true,
          })
        );

        setDashboardConfigureList(res?.DASHBOARDCONFIGLIST);
      }
    } catch (error: any) {
      setLaoding(false);
    } finally {
      setLaoding(false);
    }
  };

  const UpdateDashboardDetails = () => {
    setObjet({
      series: DashboardSeriesData(OnloadActiveCaseList),
    });
    setResolved({
      series: DashboardSeriesData(OnloadResolveCaseList),
    });
    setCorrective({
      series: DashboardSeriesData(OnloadCMWOList),
    });
    setPreventive({
      series: DashboardSeriesData(OnloadPMWOList),
    });
    setPredictive({
      series: DashboardSeriesData(OnloadPDWOList),
    });

    if (IsResRectCheck === "Res" || IsResRectCheck === "All") {
      setResponseTime({
        series: [
          {
            name: IsCheckValueRes,
            data: AvgDashboardDataRes(OnloadAvgResList[0], IsCheckValueRes),
          },
        ],
        options: {
          xaxis: {
            title: {
              text: IsCheckValueRes,
            },
          },
        },
      });
      let avgres = AvgTimeCalRes(totresvalue, IsCheckValueRes);
      setAvgTotResTime(avgres);
    }
    if (IsResRectCheck === "Rect" || IsResRectCheck === "All") {
      setRectificationTime({
        series: [
          {
            name: IsCheckValueRect,
            data: AvgDashboardDataRect(OnloadAvgRetList[0], IsCheckValueRect),
          },
        ],
        options: {
          xaxis: {
            title: {
              text: IsCheckValueRect,
            },
          },
        },
      });
      let avgret = AvgTimeCalRect(totretvalue, IsCheckValueRect);
      setAvgTotRetTime(avgret);
    }
  };

  const reporterCount = `${totalReporterCount}`;

  useEffect(() => {
    const data: any = dashboardConfigureList?.filter(
      (f: any) => f?.DASHBOARD_ID === f?.DASHBOARD_ID
    );
    setDashboardConfigureList(data);
  }, [correctiveList, preventiveList, predictiveList]);

  return (
    <>
      <div>
        <div>
          <h6>{t("Dashboard")}</h6>
        </div>

        <div className="mt-2 dashboardTab">
          <div>
            <div className=" flex justify-content-center flex-wrap gap-2">
              <div>
                <InputText
                  placeholder="Search Location"
                  value={
                    !selectedlocationCount ||
                    selectedlocationCount?.length === 0
                      ? ""
                      : selectedlocationCount?.length >= 2
                      ? `${selectedlocationCount?.length} items selected`
                      : locationName
                  }
                  onClick={(e: any) => showEquipmentlist(true)}
                  readOnly
                  className="width-1/5"
                />
                <LocationHierarchyDialog
                  showEquipmentlist={showEquipmentlist}
                  visibleEquipmentlist={visibleEquipmentlist}
                  selectedKey={selectedKey}
                  setSelectedKey={setSelectedKey}
                  nodes={nodes}
                  locationFilteredData={locationFilteredData}
                  setLocationFilteredData={setLocationFilteredData}
                  setNodes={setNodes}
                  setValue={setValue}
                  getDashboardDetails={getDashboardDetails}
                  setLocationName={setLocationName}
                  setLocationCheckData={setLocationCheckData}
                  locationCheckData={locationCheckData}
                />
              </div>
              <div className="date-select">
                <Button
                  type="button"
                  onClick={(e: any) => {
                    op?.current?.toggle(e);
                  }}
                  className="dateSelect"
                >
                  <div className="flex w-full items-baseline justify-between">
                    <div className="w-full flex items-baseline gap-2 date-select-group">
                      <i className="pi pi-calendar Text-Secondary"></i>
                      <p className="Text_Primary ml-2 mr-2">{DateDesc}</p>
                      <i className="pi pi-sort-down-fill Text-Secondary"></i>
                    </div>
                  </div>
                </Button>
              </div>
              <div className="mt-2 ml-2">
                <label className="Text_Primary Input_Text mb-3">
                  {FilterDesc}
                </label>
              </div>

              { <OverlayPanel
                  className="dateFilterOverlayPanel"
                  ref={op}
                  dismissable
                >
                  <ul>
                    <li className="px-4 py-2 mb-2 border-b-2">
                      <div className="text-center dateText">Date range</div>
                    </li>
                    {DateFilterList?.map((list: any) => {
                      return (
                        <>
                          <li
                            className={` px-4 py-2 ${
                              list.DATE_SEQNO === "CR"
                                ? "border-t-2"
                                : list.DATE_SEQNO === "CU"
                                ? "CustomDate border-t-2"
                                : ""
                            }`}
                            onClick={() => filterDateHandeler(list)}
                          >
                            <div className="flex flex-wrap justify-between">
                              <label className="Text_Primary Input_Text">
                                {list.DATE_DESC}
                              </label>
                              <p className="Text_Secondary Helper_Text">
                                {list.SUB_DATE_DESC}
                              </p>
                            </div>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </OverlayPanel>}

              {selectedCustomeDate && (
                <Card className="w-3/5 absolute z-10">
                  <div className="text-center">
                    <h6 className=" Text_Primary mb-0">Custom date range</h6>
                  </div>
                  <div>
                    <Calendar
                      value={dateWO}
                      onChange={(e: any) => setWODate(e.value)}
                      inline
                      numberOfMonths={2}
                      selectionMode="range"
                      readOnlyInput
                      hideOnRangeSelection
                    />
                  </div>
                  <div className="flex flex-wrap justify-end mt-2">
                    <Buttons
                      className="Secondary_Button me-2"
                      label={t("Cancel")}
                      onClick={() => setSelectedCustome(false)}
                    />
                    <Buttons
                      className="Primary_Button"
                      label={t("Select")}
                      onClick={() => onSubmitCustomDate()}
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>
          {loading ? (
            <>
              <LoaderShow />
            </>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 1 && d.ACTIVE
                ) && (
                  <>
                    <Card className="h-full">
                      <label className="Title_Label Text_Primary">
                        Total Cases
                      </label>

                      <h2 className="flex flex-col justify-center items-center text-center h-40 w-full">
                        {totalCaseCount}
                        <p className="text-sm text-gray-500">
                          Cases in building
                        </p>
                      </h2>
                    </Card>
                  </>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 2 && d.ACTIVE
                ) && (
                  <div>
                    <StatusActionApexChart
                      header={"Active Cases"}
                      DateDesc={DateDesc}
                      optionsList={optionsList}
                      chartWidth={380}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 3 && d.ACTIVE
                ) && (
                  <div>
                    <StatusActionApexChart
                      header={"Resolved Cases"}
                      DateDesc={DateDesc}
                      optionsList={resolvedList}
                      chartWidth={isPrecondition ? 450 : 360}
                    />
                  </div>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 4 && d.ACTIVE
                ) && (
                  <div>
                    <StatusActionApexChart
                      header={"Corrective Maintenance"}
                      DateDesc={DateDesc}
                      optionsList={correctiveList}
                      chartWidth={340}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 5 && d.ACTIVE
                ) && (
                  <div>
                    <StatusActionApexChart
                      header={"Preventive Maintenance"}
                      DateDesc={DateDesc}
                      optionsList={preventiveList}
                      chartWidth={340}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 6 && d.ACTIVE
                ) && (
                  <div>
                    <StatusActionApexChart
                      header={"Predictive Maintenance"}
                      DateDesc={DateDesc}
                      optionsList={predictiveList}
                      chartWidth={340}
                    />
                  </div>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 lg:grid-cols-2">
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 7 && d.ACTIVE
                ) && (
                  <div>
                    <ResponseTimeCard
                      dateDesc={DateDesc}
                      value={valueRes}
                      optionsList={options}
                      onToggle={onToggleButtonChange}
                      setValue={setValueRes}
                      getDashboardDetails={getDashboardDetails}
                      isRectCheck={IsResRectCheck}
                      checkValue={IsCheckValueRes}
                      avgResponseTime={AvgTotResTime}
                      woCount={WoCount}
                      chartData={responseTimeList}
                      responseData={"Rect"}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 8 && d.ACTIVE
                ) && (
                  <div>
                    <ResponseTimeCard
                      dateDesc={DateDesc}
                      value={valueRes}
                      optionsList={options}
                      onToggle={onToggleButtonChange}
                      setValue={setValueRect}
                      getDashboardDetails={getDashboardDetails}
                      isRectCheck={IsResRectCheck}
                      checkValue={IsCheckValueRes}
                      avgResponseTime={AvgTotRetTime}
                      woCount={WoRetCount}
                      chartData={rectificationTimeList}
                      responseData={"Rect"}
                    />
                  </div>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3 h-full">
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 9 && d.ACTIVE
                ) && (
                  <div className="without-upper-padding">
                    <EquipementData
                      header={"Equipment Group"}
                      data={equipmentGroupList}
                      totalCount={totalEquipmentGroupCount}
                      itemTemplate={itemTemplate}
                      tabdata="Eqgroup"
                      setList={setequipmentGroup}
                      oeEquipmentData={ogequipmentGroupList}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      filename={"EquipmentGroup"}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 10 && d.ACTIVE
                ) && (
                  <div className="without-upper-padding">
                    <EquipementData
                      header={"Equipment Type"}
                      data={equipmentTypeList}
                      totalCount={totalEquipmentTypeCount}
                      itemTemplate={itemTemplate}
                      tabdata="Eqtype"
                      setList={setequipmentTypeList}
                      oeEquipmentData={ogequipmentTypeList}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      filename={"EquipmentType"}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 11 && d.ACTIVE
                ) && (
                  <div className="without-upper-padding">
                    <EquipementData
                      header={"Issue"}
                      data={issueList}
                      totalCount={totalIssueCount}
                      itemTemplate={itemTemplate}
                      tabdata="issue"
                      setList={setissueList}
                      oeEquipmentData={ogissueList}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      filename={"Issue"}
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 lg:grid-cols-2">
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 12 && d.ACTIVE
                ) && (
                  <div className="without-upper-padding mb-1">
                    <UserSelector
                      header={"Assignee"}
                      data={assignee}
                      totalCount={totalIssueCount}
                      itemTemplate={AssigneeTemplate}
                      tabdata="assignee"
                      setList={setAssignee}
                      oeUserData={ogassignee}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      filename={"Assignee"}
                    />
                  </div>
                )}
                {dashboardConfigureList?.find(
                  (d: any) => d.DASHBOARD_ID === 13 && d.ACTIVE
                ) && (
                  <div className="without-upper-padding">
                    <UserSelector
                      header={"Reporter"}
                      data={reporterList}
                      totalCount={reporterCount}
                      itemTemplate={ReporterTemplate}
                      tabdata="reporter"
                      setList={setreporterList}
                      oeUserData={ogreporterList}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      filename={"Reporter"}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
