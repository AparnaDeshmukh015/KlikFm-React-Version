import { Card } from "primereact/card";

export const ShowEquipmentDetails = ({ assetTreeDetails, isServiceRequest, isCardView }: any) => {
    const Wrapper: any = isCardView ? Card : "div";
    return (

        <Wrapper className="mt-4">
            <label className="Header_Text Text_Primary">
                Equipment Summary
            </label>

            <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3  ">

                <div className="col-span-3">
                    <label className="Text_Secondary Helper_Text">
                        Equipment Name
                    </label>
                    <p className="Text_Primary Helper_Text  ">

                        {assetTreeDetails[0]?.ASSET_NAME}
                    </p>
                </div>
                <div className="col-span-3">
                    <label className="Text_Secondary Helper_Text">
                        Equipment Type
                    </label>
                    <p className="Text_Primary Helper_Text  ">
                        {assetTreeDetails[0]?.ASSETTYPE_NAME}
                    </p>
                </div>
                {isServiceRequest &&
                    <>
                        <div className="col-span-3">
                            <label className="Text_Secondary Helper_Text">
                                Equipment Group
                            </label>
                            <p className="Text_Primary Helper_Text  ">

                                {assetTreeDetails[0]?.ASSETGROUP_NAME}
                            </p>
                        </div>
                        <div className="col-span-3">
                            <label className="Text_Secondary Helper_Text">
                                Location
                            </label>
                            <p className="Text_Primary Helper_Text  ">

                                {assetTreeDetails[0]?.LOCATION_DESCRIPTION}
                            </p>
                        </div>
                    </>

                }



            </div>
        </Wrapper>


    );
}
