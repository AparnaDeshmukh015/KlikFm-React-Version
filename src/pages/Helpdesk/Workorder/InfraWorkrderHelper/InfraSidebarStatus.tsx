import { Sidebar } from "primereact/sidebar";
import { formateDate } from "../../../../utils/constants";

export const InfraSidebarStatus = ({ visible, setSidebarVisible, sidebarDetails }: any) => {
    const CloseSidebarVisible = () => {
        setSidebarVisible(!visible);
    };
    const customHeader = (
        <>
            <div className=" gap-2">
                <p className="Helper_Text Menu_Active">Work Order / </p>
                <h6 className="sidebarHeaderText mb-2">PTW Approval Request</h6>
            </div>
        </>
    );
    return (
        <Sidebar
            className="w-full md:w-1/3"
            position="right"
            header={customHeader}
            visible={visible}
            onHide={() => {
                CloseSidebarVisible();
            }}
        >
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                    <label className="Text_Secondary Helper_Text  ">
                        Status
                    </label>
                    <p
                        className={`Helper_Text ${sidebarDetails?.SUB_STATUS_DESC === "Decline" ||
                            sidebarDetails?.SUB_STATUS_DESC === "Decline"
                            ? "Open"
                            : sidebarDetails?.SUB_STATUS_DESC?.includes(
                                "Approved"
                            )
                                ? "Completed"
                                : sidebarDetails?.SUB_STATUS_DESC?.includes(
                                    "Pending"
                                )
                                    ? "Rectified"
                                    : sidebarDetails?.SUB_STATUS_DESC?.includes("Fail")
                                        ? "Open"
                                        : sidebarDetails?.SUB_STATUS_DESC?.includes("Return")
                                            ? "Rectified"
                                            : ""
                            }`}
                    >
                        {sidebarDetails?.SUB_STATUS_DESC}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  "> Requestor</label>
                    <p className="Text_Primary Alert_Title">{sidebarDetails?.LAST_MODIFIED_BY} </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">Request Date & Time</label>
                    <p className="Text_Primary Alert_Title"> {formateDate(sidebarDetails?.LAST_MODIFIED_ON)}</p>
                </div>
                {(sidebarDetails?.PREVIOUS_ACTION === 114 || sidebarDetails?.PREVIOUS_ACTION === 115) ? (
                    <>
                        <div>
                            <label className="Text_Secondary Helper_Text  "> Approve by </label>
                            <p className="Text_Primary Alert_Title">{sidebarDetails?.REQUESTED_BY} </p>
                        </div>
                        <div>
                            <label className="Text_Secondary Helper_Text  "> {" "}Approve Date & Time </label>
                            <p className="Text_Primary Alert_Title"> {formateDate(sidebarDetails?.REQUESTED_ON)}</p>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </Sidebar>
    )
}