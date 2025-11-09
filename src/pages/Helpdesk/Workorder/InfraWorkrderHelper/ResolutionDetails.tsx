
import { formateDate, onlyDateFormat } from '../../../../utils/constants';
import NoItemToShow from './NoItemToShow';
import ImageGalleryComponent from '../../ImageGallery/ImageGallaryComponent';
import LoaderFileUpload from '../../../../components/Loader/LoaderFileUpload';
import { Dialog } from 'primereact/dialog';

export const ResolutionDetails = ({ resolutionDetails, ImageDocList, isloading }: any) => {
    return (
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
            <div className=" flex flex-col  gap-[16px]">
                <div>
                    <label className="Text_Secondary Helper_Text  ">
                        Last Updated By
                    </label>
                    <p className="Text_Primary Alert_Title  ">
                        {resolutionDetails?.LAST_MODIFIED_BY}
                    </p>
                </div>
                <div>
                    <div>
                        <label className="Text_Secondary Helper_Text  ">
                            Last Updated Date
                        </label>
                        <p className="Text_Primary Alert_Title  ">
                            {formateDate(
                                resolutionDetails?.LAST_MODIFIED_ON
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <div className=" flex flex-col gap-2">
                    <div>
                        <label className="Text_Secondary Helper_Text  ">
                            Resolution Description
                        </label>
                        <p className="Text_Primary Alert_Title  ">
                            {
                                resolutionDetails?.COMPLETED_DESCRIPTION
                            }
                        </p>
                    </div>


                    <div>
                        <div className="my-[24px]">
                            <div className="mb-[8px]">
                                <label className="Text_Secondary Helper_Text  ">
                                    #Before(
                                    {
                                        ImageDocList?.filter(
                                            (e: any) =>
                                                e.UPLOAD_TYPE === "B"
                                        ).length
                                    }
                                    )
                                </label>
                            </div>
                            {isloading === true ? (
                                <div className="imageContainer  flex justify-center items-center z-400">
                                    <>
                                        <LoaderFileUpload
                                            IsScannig={false}
                                        />
                                    </>
                                </div>
                            ) : ImageDocList?.filter(
                                (e: any) =>
                                    e.UPLOAD_TYPE === "B"
                            ).length > 0 ? (
                                <>
                                    <ImageGalleryComponent
                                        uploadType="B"
                                        docOption={ImageDocList}
                                        Title={"Before"}
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
                                <img
                                    src={showImage}
                                    alt=""
                                    className="w-full bg-cover"
                                />
                            </Dialog> */}
                        </div>
                        <div>
                            <div className="mb-[8px]">
                                <label className="Text_Secondary Helper_Text ">
                                    #After(
                                    {
                                        ImageDocList?.filter(
                                            (e: any) =>
                                                e.UPLOAD_TYPE === "A"
                                        ).length
                                    }
                                    )
                                </label>
                            </div>
                            {isloading === true ? (
                                <div className="imageContainer  flex justify-center items-center z-400">
                                    <>
                                        <LoaderFileUpload
                                            IsScannig={false}
                                        />
                                    </>
                                </div>
                            ) : ImageDocList?.filter(
                                (e: any) =>
                                    e.UPLOAD_TYPE === "A"
                            ).length > 0 ? (
                                <>
                                    <ImageGalleryComponent
                                        uploadType="A"
                                        docOption={ImageDocList}
                                        Title={"After"}
                                    />

                                </>
                            ) : (
                                <>
                                    <NoItemToShow />
                                </>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-wrap justify-between gap-3 mt-[8px]">
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Actual Start Date
                            </label>
                            {resolutionDetails?.ACTUAL_START_DATE ===
                                null ||
                                resolutionDetails?.ACTUAL_START_DATE ===
                                "" ||
                                resolutionDetails?.ACTUAL_START_DATE ===
                                "1900-01-01T00:00:00" ? (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        -
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        {" "}
                                        {onlyDateFormat(
                                            resolutionDetails?.ACTUAL_START_DATE
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Actual End Date
                            </label>

                            {resolutionDetails?.ACTUAL_END_DATE ===
                                null ||
                                resolutionDetails?.ACTUAL_END_DATE ===
                                "" ||
                                resolutionDetails?.ACTUAL_END_DATE ===
                                "1900-01-01T00:00:00" ? (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        -
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        {" "}
                                        {onlyDateFormat(
                                            resolutionDetails?.ACTUAL_END_DATE
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
