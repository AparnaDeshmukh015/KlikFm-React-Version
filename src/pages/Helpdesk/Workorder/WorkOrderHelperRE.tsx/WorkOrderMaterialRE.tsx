import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { TabPanel, TabPanelHeaderTemplateOptions } from "primereact/tabview";
import Buttons from "../../../../components/Button/Button";

import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { LOCALSTORAGE } from "../../../../utils/constants";
import SidebarVisibal from "../SidebarVisibal";
import { decryptData } from "../../../../utils/encryption_decryption";
import noDataIcon from "../../../../assest/images/nodatafound.png";
import reviewIcon from "../../../../assest/images/IconContainer.png";

export const WorkOrderMaterialRE = ({
    materialDetails,
    currentStatus,
    partMatOptions,
    materiallist,
    getOptions,
    reassignVisible,
    IsVisibleMaterialReqSideBar,
    setVisibleMaterialReqSideBar,
    subStatus,
    GetVisibleSiderBar
}: any) => {
    const navigate: any = useNavigate();
    const MaterialHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div
                className="flex justify-center gap-2"
                style={{ cursor: "pointer" }}
                onClick={options.onClick}
            >
                <span className="white-space-nowrap">Material</span>
                <Tooltip target=".custom-target-icon1" />
                {
                    // FACILITY["MATREQ_APPROVAL"] === true
                    materialDetails?.ISMATAPPROVALCNC === false &&
                        materialDetails?.ISMATAPPROVED === false &&
                        materialDetails?.CURRENT_STATUS === 5 &&
                        materialDetails?.SUB_STATUS === "6" ? (
                        <Badge
                            value="i"
                            className="custom-target-icon1"
                            data-pr-position="top"
                            data-pr-tooltip="Material Request Approval"
                        />
                    ) : (
                        <></>
                    )
                }
            </div>
        );
    };

    return (
        <div>
            {currentStatus !== 1 && (
                <TabPanel headerTemplate={MaterialHeaderTemplate}>
                    {partMatOptions.length === 0 && (
                        <Card className="mt-2">
                            <h6 className="Service_Header_Text">
                                Material Details
                            </h6>
                            <div className="flex items-center mt-2 justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-52 border-2
                                  border-gray-200 border rounded-lg  "
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {partMatOptions.length === 0 ? (
                                            <>
                                                <img
                                                    src={noDataIcon}
                                                    alt=""
                                                    className="w-12"
                                                />
                                                <p className="mb-2 mt-2 text-sm text-gray-500  dark:text-gray-400">
                                                    <span className="Text_Primary Service_Alert_Title ">
                                                        {("No items to show")}{" "}
                                                    </span>
                                                </p>
                                                <label className="Text_Secondary Helper_Text mb-4">
                                                    {(
                                                        "No materials added to this work order."
                                                    )}
                                                </label>
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        {(currentStatus !== 4 &&
                                            currentStatus !== 6 &&
                                            currentStatus !== 1 &&
                                            currentStatus === 7) ||
                                            status === "Rectified" ||
                                            currentStatus === 5 ||
                                            currentStatus === 6 ? (
                                            <></>
                                        ) : (
                                            <Buttons
                                                className="Secondary_Button"
                                                icon="pi pi-plus"
                                                label={"Add Material Requisition"}
                                                onClick={() => {
                                                    navigate(
                                                        `/materialrequestlist?add=`,
                                                        {
                                                            state: {
                                                                wo_ID: materialDetails?.WO_ID,
                                                                remark:
                                                                    materialDetails?.WO_REMARKS,
                                                                MATREQ_ID:
                                                                    materialDetails?.MATREQ_ID,
                                                            },
                                                        }
                                                    );
                                                }}
                                            />
                                        )}
                                    </div>
                                </label>
                            </div>
                        </Card>
                    )}
                    {partMatOptions.length > 0 && (
                        <Card className="mt-2">
                            <div>
                                {materialDetails?.ISMATAPPROVALCNC === false &&
                                    materialDetails?.ISMATAPPROVED === false &&
                                    materialDetails?.CURRENT_STATUS === 5 &&
                                    materialDetails?.SUB_STATUS === "6" ? (
                                    <>
                                        <div className="reviewContainer">
                                            <div className="flex justify-between">
                                                <div className="flex flex-wrap">
                                                    <div className="flex flex-wrap">
                                                        <img
                                                            src={reviewIcon}
                                                            alt=""
                                                            className="w-10 h-10"
                                                        />
                                                        <div className="ml-3">
                                                            <label className="Text_Primary mb-2 review_Service_Header_Text">
                                                                Material Requisition
                                                            </label>

                                                            {materialDetails?.SUB_STATUS ===
                                                                "6" &&
                                                                decryptData(
                                                                    localStorage.getItem(
                                                                        LOCALSTORAGE?.ROLETYPECODE
                                                                    )
                                                                ) === "T" ? (
                                                                <>
                                                                    {materiallist[0]?.REMARKS !==
                                                                        null ||
                                                                        materiallist[0]?.REMARKS !==
                                                                        "" ||
                                                                        materiallist[0]?.REMARKS !==
                                                                        undefined ? (
                                                                        <>
                                                                            <p>
                                                                                {
                                                                                    materiallist[0]
                                                                                        ?.REMARKS
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    ) : (
                                                                        <>{""}</>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            {(materiallist[0]?.REMARKS ===
                                                                "" ||
                                                                materiallist[0]?.REMARKS ===
                                                                null) &&
                                                                decryptData(
                                                                    localStorage.getItem(
                                                                        LOCALSTORAGE?.ROLETYPECODE
                                                                    )
                                                                ) === "T" ? (
                                                                "No remarks Added"
                                                            ) : (
                                                                <></>
                                                            )}
                                                            {materialDetails?.SUB_STATUS ===
                                                                "6" &&
                                                                (decryptData(
                                                                    localStorage.getItem(
                                                                        LOCALSTORAGE?.ROLETYPECODE
                                                                    )
                                                                ) === "S" ||
                                                                    decryptData(
                                                                        localStorage.getItem(
                                                                            LOCALSTORAGE?.ROLETYPECODE
                                                                        )
                                                                    ) === "SA") && (
                                                                    <>
                                                                        <p className="Text_Primary Helper_Text">
                                                                            Review and approve the
                                                                            material requisition for
                                                                            this work order.
                                                                        </p>
                                                                    </>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <SidebarVisibal
                                                    reassignVisible={reassignVisible}
                                                    headerTemplate={
                                                        materialDetails?.STATUS_DESC
                                                    }
                                                    // selectedParts={selectedParts}
                                                    MATERIAL_LIST={materiallist}
                                                    PART_LIST={partMatOptions}
                                                    subStatus={subStatus}
                                                    selectedDetails={materialDetails}
                                                    getOptions={getOptions}
                                                    IsVisibleMaterialReqSideBar={
                                                        IsVisibleMaterialReqSideBar
                                                    }
                                                    setVisibleMaterialReqSideBar={
                                                        setVisibleMaterialReqSideBar
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-between">
                                <h6 className="Service_Header_Text">
                                    Material Details
                                </h6>
                                {currentStatus !== 4 &&
                                    currentStatus !== 6 &&
                                    currentStatus !== 1 &&
                                    currentStatus !== 7 &&
                                    currentStatus !== 5 ? (
                                    <Buttons
                                        className="Secondary_Button"
                                        icon="pi pi-plus"
                                        label={"Add Material Requisition"}
                                        onClick={() => {
                                            navigate(
                                                `/materialrequestlist?add=`,
                                                {
                                                    state: {
                                                        wo_ID: materialDetails?.WO_ID,
                                                        remark: materialDetails?.WO_REMARKS,
                                                    },
                                                }
                                            );
                                        }}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="mt-2">
                                <DataTable
                                    value={partMatOptions}
                                    showGridlines
                                    emptyMessage={("No Data found.")}
                                    footer={<></>}
                                >
                                    <Column
                                        field="PART_NAME"
                                        header="Material Name"
                                        className="w-30"
                                        body={(rowData: any) => {
                                            return (
                                                <>
                                                    <div>
                                                        <label className="Text_Primary Service_Alert_Title">
                                                            {rowData?.PART_NAME}
                                                        </label>
                                                        <p className="  Text_Secondary Helper_Text">
                                                            {rowData?.PART_CODE}
                                                        </p>
                                                    </div>
                                                </>
                                            );
                                        }}
                                    ></Column>

                                    <Column
                                        field="MATREQ_NO"
                                        header={("Mat Req No")}
                                        className="w-30"
                                        body={(rowData: any) => {
                                            return (
                                                <>
                                                    <p
                                                        className={`${materialDetails?.ISMATAPPROVALCNC ===
                                                            false &&
                                                            materialDetails?.ISMATAPPROVED ===
                                                            false &&
                                                            materialDetails?.CURRENT_STATUS ===
                                                            5 &&
                                                            materialDetails?.SUB_STATUS ===
                                                            "6"
                                                            ? "cursor-pointer"
                                                            : ""
                                                            } `}
                                                        onClick={() => {
                                                            GetVisibleSiderBar(0);
                                                        }}
                                                    >
                                                        {rowData.MATREQ_NO}
                                                    </p>
                                                </>
                                            );
                                        }}
                                    ></Column>
                                    <Column
                                        field="ISSUED_QTY"
                                        header="Quantity"
                                    ></Column>

                                    <Column
                                        field="STATUS_DESC"
                                        header="Status"
                                    ></Column>
                                </DataTable>
                            </div>
                        </Card>
                    )}
                </TabPanel>
            )}
        </div>
    )
}
