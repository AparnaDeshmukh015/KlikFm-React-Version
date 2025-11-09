import React from 'react'
import { onlyDateFormat } from '../../../../utils/constants'

export const EquipmentSummaryDetails = ({ equipmentDetails, equipmentType, isServiceReq }: any) => {
    return (
        <>
            {equipmentType === "A" && <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Equipment Group
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSETGROUP_NAME}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Ownership Status
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.OWN_LEASE === null ||
                            equipmentDetails?.OWN_LEASE === "" ||
                            equipmentDetails?.OWN_LEASE === undefined
                            ? "NA"
                            : equipmentDetails?.OWN_LEASE === "O"
                                ? "Owned"
                                : equipmentDetails?.OWN_LEASE === "L"
                                    ? "Leased"
                                    : "NA"}
                        {/* {ownLeasedStatus} */}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Last Maintenance Date
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.LAST_MAINTANCE_DATE ==
                            null ||
                            equipmentDetails?.LAST_MAINTANCE_DATE === ""
                            ? "NA"
                            : // moment(
                            //   selectedDetails?.LAST_MAINTANCE_DATE
                            // ).format(dateFormat())}
                            onlyDateFormat(
                                equipmentDetails?.LAST_MAINTANCE_DATE
                            )}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Equipment Type
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSETTYPE_NAME === null
                            ? "NA"
                            : equipmentDetails?.ASSETTYPE_NAME}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Warranty End Date
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.WARRANTY_END_DATE ==
                            null ||
                            equipmentDetails?.WARRANTY_END_DATE === ""
                            ? "NA"
                            : onlyDateFormat(
                                equipmentDetails?.WARRANTY_END_DATE
                            )}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Upcoming Schedule
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.UPCOMING_SCHEDULE_DATE
                            ?
                            onlyDateFormat(
                                equipmentDetails?.UPCOMING_SCHEDULE_DATE
                            )
                            : "NA"}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Equipment Name
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSET_NAME === "" ||
                            equipmentDetails?.ASSET_NAME === null ||
                            equipmentDetails?.ASSET_NAME === undefined
                            ? "NA"
                            : equipmentDetails?.ASSET_NAME}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Vendor Name
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.VENDOR_NAME === "" ||
                            equipmentDetails?.VENDOR_NAME === null ||
                            equipmentDetails?.VENDOR_NAME === undefined
                            ? "NA"
                            : equipmentDetails?.VENDOR_NAME}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Issue
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.REQ_DESC === "" ||
                            equipmentDetails?.REQ_DESC === null ||
                            equipmentDetails?.REQ_DESC === undefined
                            ? "NA"
                            : equipmentDetails?.REQ_DESC}
                    </p>
                </div>
            </div>}

            {equipmentType === "N" && <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Service Group
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSETGROUP_NAME}
                    </p>
                </div>

                {!isServiceReq && <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Last Maintenance Date
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.LAST_MAINTANCE_DATE ==
                            null ||
                            equipmentDetails?.LAST_MAINTANCE_DATE === ""
                            ? "NA"
                            : // moment(
                            //   selectedDetails?.LAST_MAINTANCE_DATE
                            // ).format(dateFormat())
                            onlyDateFormat(
                                equipmentDetails?.LAST_MAINTANCE_DATE
                            )}
                    </p>
                </div>}

                {!isServiceReq && <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Upcoming Schedule
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.UPCOMING_SCHEDULE_DATE
                            ? onlyDateFormat(
                                equipmentDetails?.UPCOMING_SCHEDULE_DATE
                            )
                            : "NA"}
                    </p>
                </div>}

                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Service Type
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSETTYPE_NAME === null
                            ? "NA"
                            : equipmentDetails?.ASSETTYPE_NAME}
                        {/* {selectedDetails?.ASSETTYPE_NAME} */}
                    </p>
                </div>

                {!isServiceReq && <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Vendor Name
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.VENDOR_NAME === "" ||
                            equipmentDetails?.VENDOR_NAME === null ||
                            equipmentDetails?.VENDOR_NAME === undefined
                            ? "NA"
                            : equipmentDetails?.VENDOR_NAME}
                    </p>
                </div>}

                {!isServiceReq && <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Issue
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.REQ_DESC === "" ||
                            equipmentDetails?.REQ_DESC === null ||
                            equipmentDetails?.REQ_DESC === undefined
                            ? "NA"
                            : equipmentDetails?.REQ_DESC}
                    </p>
                </div>}

                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Service Name
                    </label>
                    <p className="Text_Primary Service_Alert_Title  ">
                        {equipmentDetails?.ASSET_NAME === null
                            ? "NA"
                            : equipmentDetails?.ASSET_NAME}
                        {/* {selectedDetails?.ASSET_NAME} */}
                    </p>
                </div>
            </div>
            }

        </>
    )
}



