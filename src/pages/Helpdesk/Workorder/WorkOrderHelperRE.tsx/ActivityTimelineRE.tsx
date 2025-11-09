
import NoItemToShow from '../InfraWorkrderHelper/NoItemToShow'
import { Card } from 'primereact/card'
import { Timeline } from 'primereact/timeline'
import { formateDate } from '../../../../utils/constants'
export const ActivityTimelineRE = ({ activityTimeLineData }: any) => {
    const customizedContent = (item: any) => {
        return (
            <div className="flex justify-between mb-3 gap-3">
                <div className="mb-2 w-full">
                    <p className=" Text_Primary Input_Label mb-2">
                        {item.title}
                        <label className="Menu_Active Input_Label  ml-2 ">
                            {item?.DOC_NO ?? ""}
                        </label>
                    </p>
                    <p className="  Text_Secondary Helper_Text ">{item?.subtitle}</p>
                    {item?.ISREMARKS === 1 ? (
                        <p className="  Text_Secondary Helper_Text whitespace-wrap max-w-[800px] ">
                            <b>Remarks: </b> {item?.TIMELINE_REMARKS}
                        </p>
                    ) : (
                        <></>
                    )}
                </div>
                <p className="Text_Secondary Helper_Text mt-4">
                    {formateDate(item.date)}
                </p>
            </div>
        );
    };

    return (
        activityTimeLineData?.length === 0 ? (
            <Card className="mt-2">
                <h6 className="Service_Header_Text">
                    Activity Timeline
                </h6>
                <NoItemToShow />
            </Card>

        ) : (
            <Card className="mt-2">
                <h6 className="mb-2 Service_Header_Text">
                    Activity Timeline
                </h6>
                <Timeline
                    value={activityTimeLineData}
                    className="customized-timeline"
                    content={customizedContent}
                />
            </Card>
        )
    )
}