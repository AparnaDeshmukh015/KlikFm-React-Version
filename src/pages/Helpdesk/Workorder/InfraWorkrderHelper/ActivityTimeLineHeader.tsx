import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";
import { formateDate } from "../../../../utils/constants";

export const ActivityTimeLineHeader = ({ statustimeLineDetails, currentStatus }: any) => {
    const customizedMarker = (item: any) => {
        return (
            <span
                className="flex w-2rem h-2rem align-items-center justify-content-center  border-circle z-1 shadow-1"
                style={{ color: item?.date ? "#55A629" : "#7E8083" }}
            >
                <i
                    className={`pi ${item?.status ? "pi-circle-fill" : "pi-circle"} `}
                ></i>
            </span>
        );
    };
    const customizedStatusTimeline = (item: any) => {
        return (
            <div className="">
                <h6
                    className={`font-medium Sub_Service_Header_Text mb-1 ${item?.date
                        ? "Text_Primary "
                        : item?.status
                            ? "Text_Primary "
                            : "Text_Secondary"
                        } `}
                >
                    {item?.title}
                </h6>
                <p className="Sub_Service_Header_Text">{item?.subtitle}</p>
                <p className="Text_Secondary service_helper_text">{item?.date}</p>
            </div>
        );
    };
    const StatusEvents = [
        {
            id: 1,
            title: "Assignment",
            date:
                statustimeLineDetails?.ASSIENTMENT_AT === null
                    ? ""
                    : formateDate(statustimeLineDetails?.ASSIENTMENT_AT),
            status: currentStatus === 1 ? true : false,
            progress: true,
            subtitle: currentStatus === 1 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
        },
        // Only add "Cancelled" if selectedDetails?.CANCELLED_AT exists
        ...(statustimeLineDetails?.CANCELLED_AT
            ? [
                {
                    id: 6,
                    title: "Cancelled",
                    date:
                        statustimeLineDetails?.CANCELLED_AT === null
                            ? ""
                            : formateDate(statustimeLineDetails?.CANCELLED_AT),
                    status: currentStatus === 5 ? true : false,
                    progress: true,
                    subtitle:
                        currentStatus === 5 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
                },
            ]
            : []),
        // Only add "Suspension" if selectedDetails?.SUSPENTION_AT exists
        ...(statustimeLineDetails?.SUSPENTION_AT
            ? [
                {
                    id: 2,
                    title: "Suspension",
                    date:
                        statustimeLineDetails?.SUSPENTION_AT === null
                            ? ""
                            : formateDate(statustimeLineDetails?.SUSPENTION_AT),
                    status: currentStatus === 3 ? true : false,
                    progress: true,
                    subtitle:
                        currentStatus === 3 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
                },
            ]
            : []),

        {
            id: 3,
            title: "In Progress",
            date:
                statustimeLineDetails?.ATTEND_AT === null
                    ? ""
                    : formateDate(statustimeLineDetails?.ATTEND_AT),
            status: currentStatus === 2 ? true : false,
            progress: true,
            subtitle: currentStatus === 2 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
        },

        {
            id: 4,
            title: "Completed",
            date:
                statustimeLineDetails?.COMPLETED_AT === null
                    ? ""
                    : formateDate(statustimeLineDetails?.COMPLETED_AT),
            status: currentStatus === 4 ? true : false,
            progress: true,
            subtitle: currentStatus === 4 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
        },

        {
            id: 5,
            title: "Closure",
            date:
                statustimeLineDetails?.CLOSURE_AT === null
                    ? ""
                    : formateDate(statustimeLineDetails?.CLOSURE_AT),
            status: currentStatus === 6 ? true : false,
            progress: true,
            subtitle: currentStatus === 6 ? statustimeLineDetails?.SUB_STATUS_DESC : "",
        },

        // Only add "Cancelled" if selectedDetails?.CANCELLED_AT exists
    ];
    return (
        <Card className="mt-2">

            < Timeline
                value={StatusEvents}
                layout="horizontal"
                align="top"
                marker={customizedMarker}
                content={customizedStatusTimeline}
            />

        </Card>

    )
}