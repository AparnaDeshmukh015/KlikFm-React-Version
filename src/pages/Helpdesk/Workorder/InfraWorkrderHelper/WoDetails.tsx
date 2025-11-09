
import { formateDate } from "../../../../utils/constants";
import ImageGalleryComponent from "../../ImageGallery/ImageGallaryComponent";
import NoItemToShow from "./NoItemToShow";

export const WoDetails = ({ woDetails, imageDocList, selectedPriorityIconName, isloading, isInfraSerReq }: any) => {
    return (
        <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
            <div className=" flex flex-col gap-4">
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Priority
                    </label>
                    <p className="Text_Primary Alert_Title gap-1 flex items-center">
                        <i
                            className={selectedPriorityIconName}
                            style={{
                                color: woDetails?.PRIORITY_COLOUR,
                            }}
                        ></i>
                        {woDetails?.SEVERITY}
                    </p>
                </div>
                {isInfraSerReq && (<div className=" flex flex-col gap-1">
                    <label className="Text_Secondary Helper_Text">
                        Type
                    </label>

                    {woDetails?.ASSET_NONASSET === "A" ? (
                        <>
                            <p className="Text_Primary Alert_Title  ">
                                Equipment{" "}
                            </p>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>)}
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Reporter
                    </label>
                    <p className="Text_Primary Alert_Title">
                        {woDetails?.RAISED_BY_NAME}
                    </p>
                </div>
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Reported Date
                    </label>
                    <p className="Text_Primary Alert_Title  ">
                        {woDetails?.REPORTED_AT
                            ? formateDate(woDetails?.REPORTED_AT)
                            : "NA"}
                    </p>
                </div>
                {woDetails?.ISSERVICEREQ === false && (
                    isInfraSerReq == true && (<div>
                        <div className=" flex flex-col gap-1">
                            <label className="Text_Secondary Helper_Text">
                                Work Order ID
                            </label>
                            {woDetails?.WO_NO === null ||
                                woDetails?.WO_NO === "" ? (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Alert_Title">
                                        {woDetails?.WO_NO}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>)

                )}

            </div>
            <div className="col-span-2">
                <div className=" flex flex-col gap-4">
                    <div>
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Location
                            </label>
                        </div>

                        <p className="Text_Primary Alert_Title  ">
                            {woDetails?.LOCATION_DESCRIPTION}
                        </p>
                    </div>
                    {isInfraSerReq && (
                        <div className=" flex flex-col gap-1">
                            <label className="Text_Secondary Helper_Text">
                                Issue
                            </label>
                            {woDetails?.ISSUE_DESCRIPTION ===
                                null ||
                                woDetails?.ISSUE_DESCRIPTION ===
                                "" ? (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        {woDetails?.ISSUE_DESCRIPTION}
                                    </p>
                                </>
                            )}
                        </div>)
                    }

                    <div>
                        <label className="Text_Secondary Helper_Text  ">
                            Description
                        </label>
                        {woDetails?.DESCRIPTION === null ||
                            woDetails?.DESCRIPTION === "" ? (
                            <>
                                <p className="Text_Primary Alert_Title  ">
                                    NA
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="Text_Primary Alert_Title  ">
                                    {woDetails?.DESCRIPTION}
                                </p>
                            </>
                        )}
                    </div>
                    <div>
                        <label className="Text_Secondary Helper_Text  ">
                            Supporting Files(
                            {
                                imageDocList?.filter(
                                    (e: any) => e.UPLOAD_TYPE === "W"
                                ).length
                            }
                            )
                        </label>
                        {isloading === true ? (
                            <div className="imageContainer  flex justify-center items-center z-400">
                                <>
                                    {/* <LoaderFileUpload IsScannig={false} /> */}
                                </>
                            </div>
                        ) : imageDocList?.filter(
                            (e: any) => e.UPLOAD_TYPE === "W"
                        ).length > 0 ? (
                            <>
                                <ImageGalleryComponent
                                    uploadType="W"
                                    docOption={imageDocList}
                                    Title={"Work Order"}
                                />
                            </>
                        ) : (
                            <>
                                <NoItemToShow />
                            </>
                        )}
                        {/* <Dialog
                                    visible={visibleImage}
                                    style={{ width: "50vw" }}
                                    onHide={() => {
                                      setVisibleImage(false);
                                    }}
                                  >
                                    <a
                                      href={showImage}
                                      download={docName}
                                      className="flex flex-col"
                                      title={`Download ${docName}`}
                                    >
                                      <i
                                        className="pi pi-download"
                                        style={{
                                          fontSize: "24px",
                                          marginBottom: "8px",
                                          display: "flex",
                                          justifyContent: "end",
                                        }}
                                      ></i>
                                    </a>
                                    <img
                                      src={showImage}
                                      alt=""
                                      className="w-full bg-cover"
                                    />
                                    <h5>{docName}</h5>
                                    <h6>{DocTitle}</h6>
                                  </Dialog> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
