import { Timeline } from "primereact/timeline";
import { formateDate } from "../../../../utils/constants";
import { Card } from "primereact/card";

export const TimelineHeaderRE = ({ statusDetails, currentStatus }: any) => {

    const StatusEvents = [
        {
            id: 1,
            title: statusDetails?.IS_REOPEN == true ? "Re-open" : "Open",
            date:
                statusDetails?.IS_REOPEN == true
                    ? statusDetails?.REOPEN_AT === null
                        ? ""
                        : formateDate(statusDetails?.REOPEN_AT)
                    : statusDetails?.REPORTED_AT === null
                        ? ""
                        : formateDate(statusDetails?.REPORTED_AT),
            status: currentStatus === 1 ? true : false,
            progress: true,
        },
        {
            id: 3,
            title: "In Progress",
            date:
                currentStatus === 1
                    ? null
                    : statusDetails?.ATTEND_AT == null
                        ? ""
                        : formateDate(statusDetails?.ATTEND_AT),
            status: currentStatus === 3 ? true : false,
            progress: true,
        },
        {
            id: 5,
            title: "On Hold",
            date:
                currentStatus !== 5
                    ? null
                    : statusDetails?.ONHOLD_AT == null
                        ? ""
                        : formateDate(statusDetails?.ONHOLD_AT),
            status: currentStatus === 5 ? true : false,
            progress: true,
        },
        {
            id: 4,
            title: "Rectified",
            date:
                statusDetails?.RECTIFIED_AT == null
                    ? ""
                    : formateDate(statusDetails?.RECTIFIED_AT),
            status: currentStatus === 4 ? true : false,
            progress: true,
        },
        {
            id: 7,
            title: "Completed",
            date:
                statusDetails?.COMPLETED_AT === null
                    ? ""
                    : formateDate(statusDetails?.COMPLETED_AT),
            status: currentStatus === 7 ? true : false,
            progress: false,
        },
        {
            id: 6,
            title: "Cancelled",
            date:
                currentStatus >= 6
                    ? statusDetails?.CANCELLED_AT == null
                        ? ""
                        : formateDate(statusDetails?.CANCELLED_AT)
                    : "",
            status: currentStatus === 6 ? true : false,
            progress: false,
        },
    ];
    const customizedMarker = (item: any) => {
        return (
            <span
                className="flex w-2rem h-2rem align-items-center justify-content-center  border-circle z-1 shadow-1"
                style={{ color: item?.date && item?.id !== 5 ? "#55A629" : "#7E8083" }}
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
                        : item.status
                            ? "Text_Primary "
                            : "Text_Secondary"
                        } `}
                >
                    {item?.title}
                </h6>
                <p className="Text_Secondary service_helper_text">{item?.date}</p>
            </div>
        );
    };

    return (
        <Card className="mt-2">
            <Timeline
                value={StatusEvents}
                layout="horizontal"
                align="top"
                marker={customizedMarker}
                content={customizedStatusTimeline}
            />
        </Card>
    )
}
