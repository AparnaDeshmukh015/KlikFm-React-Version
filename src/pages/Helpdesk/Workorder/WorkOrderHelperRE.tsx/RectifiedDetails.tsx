
import ImageGalleryComponent from '../../ImageGallery/ImageGallaryComponent';
import LoaderFileUpload from '../../../../components/Loader/LoaderFileUpload';
import { formateDate } from '../../../../utils/constants';
import NoItemToShow from '../InfraWorkrderHelper/NoItemToShow';
import { Card } from 'primereact/card';

export const RectifiedDetails = ({ rectifiedDetails, imageDocList, isloading, isCardView }: any) => {
    const Wrapper: any = isCardView ? Card : "div";
    console.log(imageDocList, 'imageDocList')
    return (
        <Wrapper className="mt-2">
            {!isCardView && <hr className="w-full mb-2"></hr>}
            <div className="flex flex-wrap justify-between">
                <h6 className="Service_Header_Text">
                    Rectified Details
                </h6>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div className=" flex flex-col gap-4">
                    {rectifiedDetails?.RECTIFIED_AT !== null && (
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Rectified by
                            </label>
                            <p className="Text_Primary Service_Alert_Title  ">
                                {rectifiedDetails?.RECTIFIED_BY_NAME}
                            </p>
                        </div>
                    )}
                    {rectifiedDetails?.RECTIFIED_AT !== null && (
                        <div>
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Rectified Date & Time
                                </label>
                                {/* <i className="pi pi-pencil Text_Main ml-2"></i> */}
                            </div>
                            <p className="Text_Primary Service_Alert_Title  ">
                                {formateDate(
                                    rectifiedDetails?.RECTIFIED_AT
                                )}
                            </p>
                        </div>
                    )}
                </div>
                <div className="col-span-2">
                    <div className=" flex flex-col gap-4">
                        {rectifiedDetails?.RECTIFIED_AT !== null && (
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Rectification Comment
                                </label>
                                {rectifiedDetails?.RECTIFIED_REMARKS ===
                                    null ||
                                    rectifiedDetails?.RECTIFIED_REMARKS ===
                                    "" ? (
                                    <>
                                        <p className="Text_Primary Service_Alert_Title  ">
                                            NA
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="Text_Primary Service_Alert_Title  ">
                                            {
                                                rectifiedDetails?.RECTIFIED_REMARKS
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        <div>
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Before Files(
                                    {
                                        imageDocList?.filter(
                                            (e: any) => e.UPLOAD_TYPE === "B"
                                        ).length
                                    }
                                    )
                                </label>
                                {isloading === true ? (
                                    <div className="imageContainer  flex justify-center items-center z-400">
                                        <>
                                            <LoaderFileUpload
                                                IsScannig={false}
                                            />
                                        </>
                                    </div>
                                ) : imageDocList?.filter(
                                    (e: any) => e.UPLOAD_TYPE === "B"
                                ).length > 0 ? (
                                    <>
                                        <ImageGalleryComponent
                                            uploadType="B"
                                            docOption={imageDocList}
                                            Title={"Before"}
                                        />

                                    </>
                                ) : (
                                    <>
                                        <NoItemToShow />
                                    </>
                                )}


                            </div>
                            <div>
                                <label className="Text_Secondary Helper_Text  mt-4">
                                    After Files(
                                    {
                                        imageDocList?.filter(
                                            (e: any) => e.UPLOAD_TYPE === "A"
                                        ).length
                                    }
                                    )
                                </label>
                                {isloading === true ? (
                                    <div className="imageContainer  flex justify-center items-center z-400">
                                        <>
                                            <LoaderFileUpload
                                                IsScannig={false}
                                            />
                                        </>
                                    </div>
                                ) : imageDocList?.filter(
                                    (e: any) => e.UPLOAD_TYPE === "A"
                                ).length > 0 ? (
                                    <>
                                        <ImageGalleryComponent
                                            uploadType="A"
                                            docOption={imageDocList}
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
                    </div>
                </div>
            </div>
        </Wrapper>

    )
}


