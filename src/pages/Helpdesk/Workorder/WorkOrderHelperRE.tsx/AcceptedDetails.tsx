
import { Card } from 'primereact/card';
import { formateDate } from '../../../../utils/constants'

export const AcceptedDetails = ({ acceptedDetails, isCardView }: any) => {
    const Wrapper: any = isCardView ? Card : "div";
    return (
        <Wrapper className="mt-2">
            {!isCardView && <hr className="w-full mb-2"></hr>}
            <div className="flex flex-wrap justify-between">
                <h6 className="Service_Header_Text">
                    Acceptance Details
                </h6>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div className=" flex gap-8">
                    {acceptedDetails?.ACCEPTED_BY !== null && (
                        <div>
                            <label className="Text_Secondary Helper_Text  ">
                                Accepted by
                            </label>
                            {acceptedDetails?.ACCEPTED_BY === null ||
                                acceptedDetails?.ACCEPTED_BY === "" ? (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Menu_Active Service_Alert_Title  ">
                                        {acceptedDetails?.ACCEPTED_BY}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                    {acceptedDetails?.ACCEPTED_ON !== null && (
                        <div>
                            <div>
                                <label className="Text_Secondary Helper_Text  ">
                                    Accepted Date & Time
                                </label>
                            </div>
                            <p className="Text_Primary Service_Alert_Title  ">
                                {formateDate(acceptedDetails?.ACCEPTED_ON)}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </Wrapper>
    )
}
