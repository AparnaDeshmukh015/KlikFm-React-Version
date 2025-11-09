import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import NoItemToShow from "./NoItemToShow";
export const ActivityTimelinetable = ({ ActivityTimelineData }: any) => {
    const [selectedRowData, setSelectedRowData] = useState<any | null>();
    const sidebarcustomHeader: any = (
        <div className=" gap-2">
            <p className="Helper_Text Menu_Active">Work Order /</p>
            {selectedRowData?.ACTION_ID === 121 ? (
                <>
                    <h6 className="sidebarHeaderText mb-2">Resume Approval Request</h6>
                </>
            ) : selectedRowData?.ACTION_ID === 113 ? (
                <>
                    <h6 className="sidebarHeaderText mb-2">PTW Approval Request</h6>
                </>
            ) : (
                <>
                    <h6 className="sidebarHeaderText mb-2">
                        {" "}
                        {selectedRowData?.ACTION_DESC}
                    </h6>
                </>
            )}
        </div>
    );
    const actionBodyTemplate = (rowdata: any) => {
        return (
            <>
                <div className="flex flex-col gap-1">
                    <span>{rowdata?.ACTION_DESC}</span>
                    {rowdata?.REMARKS !== "" || rowdata?.REASON_DESCRIPTION !== null ? (
                        <>
                            <label
                                className="Text_Secondary Helper_Text cursor-pointer"
                                onClick={() => openDialogbox(rowdata)}
                            >
                                View Details
                            </label>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </>
        );
    };

    const [visibleRight, setVisibleRight] = useState(false);
    const openDialogbox = (rowData: any) => {
        setSelectedRowData(rowData);
        setVisibleRight(true);
    };
    return (

        ActivityTimelineData?.length === 0 ? (
            <Card className="mt-2">
                <h6 className="Header_Text">Activity Timeline</h6>
                {/* <div className="flex items-center mt-2 justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-52 border-2
                                    border-gray-200 border rounded-lg  "
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <img
                                src={noDataIcon}
                                alt=""
                                className="w-12"
                            />
                            <p className="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="Text_Primary Alert_Title  ">
                                    {("No items to show")}{" "}
                                </span>
                            </p>
                        </div>
                    </label>
                </div> */}
                <NoItemToShow />
            </Card>
        ) : (
            <Card className="mt-2">
                <div className="flex flex-wrap justify-between">
                    <h6 className="mb-2 Header_Text">
                        Activity Timeline
                    </h6>
                </div>



                <Sidebar
                    className="w-[600px]"
                    header={sidebarcustomHeader}
                    visible={visibleRight}
                    position="right"
                    onHide={() => setVisibleRight(false)}
                >

                    {/* <h6>View Details</h6> */}
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <div className="col-span-2">
                            <label className="Text_Secondary Helper_Text  ">
                                Status
                            </label>

                            <p
                                className={`Helper_Text ${selectedRowData?.STATUS_DESC ===
                                    "Decline" ||
                                    selectedRowData?.STATUS_DESC ===
                                    "Declined"
                                    ? "Open"
                                    : selectedRowData?.STATUS_DESC?.includes(
                                        "Approved"
                                    )
                                        ? "Completed"
                                        : selectedRowData?.STATUS_DESC?.includes(
                                            "Pending"
                                        )
                                            ? "Rectified"
                                            : selectedRowData?.STATUS_DESC?.includes(
                                                "Fail"
                                            )
                                                ? "Open"
                                                : selectedRowData?.STATUS_DESC?.includes(
                                                    "Return"
                                                )
                                                    ? "Rectified"
                                                    : ""
                                    }`}
                            >
                                {selectedRowData?.STATUS_DESC}
                            </p>
                            {/* <p className="Menu_Active Helper_Text">
                                  {selectedRowData?.STATUS_DESC ?? ""}
                                </p> */}
                        </div>
                        <div>
                            <label className="Text_Secondary Helper_Text">
                                Requestor
                            </label>
                            <p className="Text_Primary Alert_Title">
                                {selectedRowData?.LOGIN_NAME ?? ""}
                            </p>
                        </div>
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Request Date & Time
                            </label>
                            <p className="Text_Primary Alert_Title">
                                {selectedRowData?.CREATEDON ?? ""}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <label className="Text_Secondary Helper_Text  ">
                                {selectedRowData?.ACTION_ID === 105
                                    ? "Reason"
                                    : "Remarks"}
                            </label>
                            <p className="Text_Primary Alert_Title">
                                <b>
                                    {selectedRowData?.REASON_DESCRIPTION ??
                                        ""}
                                </b>
                            </p>
                            <p className="Text_Primary Alert_Title">
                                {selectedRowData?.REMARKS ?? ""}
                            </p>
                        </div>
                    </div>
                </Sidebar>
                <DataTable
                    value={ActivityTimelineData}
                    scrollable
                    showGridlines
                    scrollHeight="400px"
                >
                    <Column
                        field="CREATEDON"
                        header="Date & Time"
                        sortable
                    ></Column>
                    <Column
                        field="LOGIN_NAME"
                        header="User"
                        body={(rowData: any) => {
                            return (
                                <>
                                    <p className="user_name  mb-2">
                                        {rowData.LOGIN_NAME}
                                    </p>
                                </>
                            );
                        }}
                    ></Column>
                    <Column
                        field="ACTION_DESC"
                        header="Action"
                        body={actionBodyTemplate}
                    ></Column>
                    <Column
                        field="STATUS_DESC"
                        header="Status"
                    ></Column>
                </DataTable>
            </Card>
        )
    )
}