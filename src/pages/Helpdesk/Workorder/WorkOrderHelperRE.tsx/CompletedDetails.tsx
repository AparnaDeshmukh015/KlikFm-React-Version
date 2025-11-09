
import { formateDate } from '../../../../utils/constants';
import LoaderFileUpload from '../../../../components/Loader/LoaderFileUpload';
import { Card } from 'primereact/card';

export const CompletedDetails = ({ completionDetails, isloading, signatureDocImage, isCardView }: any) => {
    const Wrapper: any = isCardView ? Card : "div";
    console.log(signatureDocImage,'signatureDocImage');
    return (
        <Wrapper className="mt-2">
            {!isCardView && <hr className="w-full mb-2"></hr>}
            <div className="flex flex-wrap justify-between">
                <h6 className="Service_Header_Text">
                    Completion Details
                </h6>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div className=" flex flex-col gap-4">
                    {completionDetails?.COMPLETED_AT !== null && (
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Verified by
                            </label>
                            {completionDetails?.VERIFY_BY === null ||
                                completionDetails?.VERIFY_BY === "" ? (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Menu_Active Service_Alert_Title  ">
                                        {completionDetails?.VERIFY_BY}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                    {completionDetails?.COMPLETED_BY_NAME !==
                        null && (
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Completed by
                                </label>
                                {completionDetails?.COMPLETED_BY_NAME ===
                                    null ||
                                    completionDetails?.COMPLETED_BY_NAME ===
                                    "" ? (
                                    <>
                                        <p className="Text_Primary Service_Alert_Title  ">
                                            NA
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="Menu_Active Service_Alert_Title  ">
                                            {completionDetails?.COMPLETED_BY_NAME}
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    {completionDetails?.COMPLETED_AT !== null && (
                        <div>
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Verified Date & Time
                                </label>
                            </div>
                            <p className="Text_Primary Service_Alert_Title  ">

                                {formateDate(
                                    completionDetails?.COMPLETED_AT
                                )}
                            </p>
                        </div>
                    )}
                </div>
                <div className="col-span-2">
                    <div className=" flex flex-col gap-4">
                        {completionDetails?.COMPLETED_AT !== null && (
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Completed Remarks
                                </label>
                                {completionDetails?.COMPLETED_REMARKS ===
                                    null ||
                                    completionDetails?.COMPLETED_REMARKS ===
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
                                                completionDetails?.COMPLETED_REMARKS
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        <div
                            className="justify-center flex w-full h-[100px] p-4 border-2
                                                           border-gray-200 border rounded-lg "
                        >
                            {isloading === true ? (
                                <div className="imageContainer  flex justify-center items-center z-400">
                                    <>
                                        <LoaderFileUpload
                                            IsScannig={false}
                                        />
                                    </>
                                </div>
                            ) : (
                                signatureDocImage?.map((imgSource: any) => {
                                 
                                    return (
                                        <img
                                            src={ imgSource?.DOC_DATA}
                                            className="w-[102px] h-[65px] bg-contain "
                                        />
                                    );
                                })
                            )}
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
