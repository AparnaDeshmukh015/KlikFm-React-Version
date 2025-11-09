import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

import { priorityIconList } from "../../../utils/constants";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import "../../../components/MultiSelects/MultiSelects.css";
import "../../../components/Input/Input.css";
import { Dialog } from "primereact/dialog";
import LoaderShow from "../../../components/Loader/LoaderShow";
const TableComponent = ({
  tableHeader,
  tableData,
  first,
  rows,
  setFirst,
  setRows,
  pageCount,
  onPageChange,
  getFilterListData,
  showLoader,
  customRangeStatus
}: any) => {
  const topScrollRef = useRef<any | null>(null);
  const bottomScrollRef = useRef<any | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState("100%");
  const { pathname } = useLocation();
  const navigate: any = useNavigate();
  const location: any = useLocation();
  const [selectedFacility, menuList]: any = useOutletContext();

  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];

  const currentWorkOrderRights = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === "/workorderlist")[0];

  const FACILITY: any = localStorage.getItem("FACILITYID");
  const FACILITYID: any = JSON.parse(FACILITY || "{}");
  const facility_type: any = FACILITYID?.FACILITY_TYPE;

  const syncScroll = (source: any, targets: any) => {
    if (source.current) {
      const scrollLeft = source.current.scrollLeft;
      targets.forEach((target: any) => {
        if (target.current) {
          target.current.scrollLeft = scrollLeft;
        }
      });
    }
  };

  const GetWorkOrderFormWoId = (rowItem: any) => {
    if (pathname === "/workorderlist") {
      navigate(`/workorderlist?edit=`);
    } else {
      navigate(`/workorderlist?edit=`, { state: "service" });
    }
    localStorage.setItem("Id", JSON.stringify(rowItem));
    localStorage.setItem("WO_ID", JSON.stringify(rowItem?.WO_ID));
  };

  const statusBody = (params: any) => {
    return (
      <div
        style={{
          backgroundColor: params?.STATUS_COLOURS,
          borderRadius: "1rem",
          padding: "0.25rem",
          textAlign: "center",
        }}
      >
        {facility_type === "I" ? (
          <p>{params?.SUB_STATUS_DESC}</p>
        ) : (
          <p>{params?.STATUS_DESC}</p>
        )}
      </div>
    );
  };
  const getDescriptionBody = (rowData: any) => {
    const desc = rowData.DESCRIPTION || "";
    const truncated = desc.length > 50 ? desc.slice(0, 50) + "..." : desc;
    return (
      <div className="description-cell cursor-pointer" title={desc}>
        {truncated || "NA"}
      </div>
    );
  };
  const getPriorityBody = (rowData: any) => {
    const icon = priorityIconList?.find(
      (e: any) => e.ICON_ID === rowData.ICON_ID
    )?.ICON_NAME;
    return (
      <label>
        <i
          className={`mr-2 ${icon}`}
          style={{ color: rowData.PRIORITY_COLOURS }}
        ></i>
        {rowData.SEVERITY}
      </label>
    );
  };

  const getWorkOrderBody = (rowData: any) => {
    if (!tableHeader) return null;
    const isClickable =
      facility_type === "I" || currentWorkOrderRights !== undefined;
    return (
      <p
        className={`cursor-pointer mb-2 ${!isClickable ? "cursor-default" : ""
          }`}
        onClick={isClickable ? () => GetWorkOrderFormWoId(rowData) : undefined}
      >
        {rowData.WO_NO}
      </p>
    );
  };

  const getSerReqBody = (rowData: any) =>
    tableHeader && (
      <p
        className="cursor-pointer mb-2"
        onClick={() => {
          navigate(`/servicerequestlist?edit=`);
          localStorage.setItem("Id", JSON.stringify(rowData));
          localStorage.setItem("WO_ID", JSON.stringify(rowData.WO_ID));
        }}
      >
        {rowData.SER_REQ_NO}
      </p>
    );

  const columns = [
    {
      field: "WO_TYPE",
      header: "Type",
      style: { minWidth: "100px" },
      condition: pathname === "/servicerequestlist",
    },
    {
      field: "SER_REQ_NO",
      header: "Service Request Number",
      style: { minWidth: "180px" },
      condition: pathname === "/servicerequestlist",
      body: getSerReqBody,
    },
    {
      field: "WO_NO",
      header: "Work Order Number",
      style: { minWidth: "250px" },
      body: getWorkOrderBody,
    },
    {
      field: "LOCATION_DESCRIPTION",
      header: "Location",
      style: { minWidth: "200px" },
    },
    { field: "WO_GROUP_REQ", header: "Issue", style: { minWidth: "450px" } },
    {
      field: "DESCRIPTION",
      header: "Description",
      style: { minWidth: "200px" },
      body: getDescriptionBody,
    },
    {
      field: "STATUS_DESC",
      header: facility_type === "I" ? "Sub-Status" : "Status",
      style: { minWidth: "200px" },
      body: statusBody,
    },
    ...(facility_type === "I"
      ? [
        {
          field: "SEVERITY",
          header: "Priority",
          style: { minWidth: "130px" },
          body: getPriorityBody,
        },
      ]
      : [
        {
          field: "REPORTED_NAME",
          header: "Reporter",
          style: { minWidth: "200px" },
          body: (row: any) => (
            <label className="Table_Header Text_Primary">
              {row.REPORTED_NAME}
            </label>
          ),
        },
        {
          field: "ASSIGN_NAME",
          header: "Assignee",
          style: { minWidth: "200px" },
          body: (row: any) => (
            <>
              <label className="Table_Header Text_Primary">
                {row.ASSIGN_NAME}
              </label>
              <label className="Helper_Text Text_Secondary">
                {row.ASSIGN_TEAM_NAME}
              </label>
            </>
          ),
        },
      ]),
    { field: "WO_CREATED_TIME", header: "Date", style: { minWidth: "160px" } },
  ].filter((column) => column.condition === undefined || column.condition);

  // Sync scrollbars
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const tableWrapper = tableContainer.querySelector(".p-datatable-wrapper");
    if (!tableWrapper) {
      console.warn("Table wrapper not found!");
      return;
    }

    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;
    if (!topScroll || !bottomScroll) {
      console.warn("Scrollbars not found!");
      return;
    }

    const handleTopScroll = () =>
      syncScroll(topScrollRef, [bottomScrollRef, { current: tableWrapper }]);
    const handleBottomScroll = () =>
      syncScroll(bottomScrollRef, [topScrollRef, { current: tableWrapper }]);
    const handleTableScroll = () =>
      syncScroll({ current: tableWrapper }, [topScrollRef, bottomScrollRef]);

    topScroll.addEventListener("scroll", handleTopScroll);
    bottomScroll.addEventListener("scroll", handleBottomScroll);
    tableWrapper.addEventListener("scroll", handleTableScroll);

    return () => {
      topScroll.removeEventListener("scroll", handleTopScroll);
      bottomScroll.removeEventListener("scroll", handleBottomScroll);
      tableWrapper.removeEventListener("scroll", handleTableScroll);
    };
  }, [tableData]);

  // Set scrollbar width based on table content
  useEffect(() => {
    setTimeout(() => {
      const tableContainer = tableContainerRef.current;
      if (!tableContainer) return;

      const tableWrapper = tableContainer.querySelector(".p-datatable-wrapper");
      if (!tableWrapper) return;

      setScrollWidth(`${tableWrapper.scrollWidth}px`);
    }, 100);
  }, [tableData]);

  return (
    <>
      <div
        ref={topScrollRef}
        className="top-scrollbar border-x h-auto bg-white"
        style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
      >
        <div style={{ height: "1px", width: scrollWidth }} />
      </div>

      <div
        className="rounded-b-lg pb-2"
        ref={tableContainerRef}
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          borderWidth: "1px",
        }}
      >
        <DataTable
          value={tableData}
          showGridlines
          emptyMessage={"No Data found"}
          globalFilterFields={["SEVERITY"]}
          style={{ width: "100%" }}
          tableStyle={{ minWidth: "1200px" }}

          loading={showLoader} // Add loading state prop
        //         loadingIcon={
        //           <div className="flex align-items-center">
        //             <div className="w-6 h-6  animate-spin  size-6 border-[3px] border-current border-t-transparent text-[#8E724A] rounded-full " role="status" aria-label="loading">
        //               {/* <span className="sr-only">...</span> */}
        //             </div>
        //           </div>
        // }
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              style={col.style}
              body={col.body}
            />
          ))}
        </DataTable>
      </div>

      <div
        ref={bottomScrollRef}
        className="bottom-scrollbar"
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          height: "15px",
          marginTop: "5px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          display: "unset",
        }}
      >
        <div className="flex p-4 bg-white flex-row gap-3a justify-between">
          {tableData?.length > 0 && (
            <div className="mt-3 Text_Secondary Input_label">
              {`Showing ${first + 1} - ${tableData?.length + first
                }  of ${pageCount}`}
            </div>
          )}
          {tableData?.length > 0 ? (
            <Paginator
              first={tableData?.length > 0 ? first : 0}
              rows={tableData?.length > 0 ? rows : 0}
              totalRecords={pageCount}
              onPageChange={(event: any) =>
                onPageChange(event, getFilterListData, setFirst, setRows)
              }
              currentPageReportTemplate="Items per Page:-"
              rowsPerPageOptions={[15, 25, 50, 75]}
              alwaysShow={tableData?.length > 15 ? true : false}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            ></Paginator>
          ) : (
            ""
          )}
        </div>

        <Dialog
          className="loaderDialog"
          header=""
          visible={showLoader && customRangeStatus === true ? showLoader : false}
          closable={false}
          onHide={() => { }}
          modal
          draggable={false}
          resizable={false}
          maskStyle={{
            background: "rgba(0, 0, 0, 0)", // fully transparent background
            boxShadow: "none",
          }}
          contentStyle={{
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            overflow: "hidden",
            background: "transparent", // transparent dialog body
            boxShadow: "none", // remove default dialog shadow
          }}
          style={{
            overflow: "hidden",
            background: "transparent",
          }}
        >
          <LoaderShow />
        </Dialog>
      </div>
    </>
  );
};

export default TableComponent;
