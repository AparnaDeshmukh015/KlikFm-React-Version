import { Card } from "primereact/card";
import NoItemToShow from "./NoItemToShow";
export const ShowAssigneeList = ({ assigneeList, TeamName, isInfraAssignee }: any) => {
    return (
        <>
            {isInfraAssignee === true && <div className="">
                <div>
                    <label
                        className="Text_Secondary Helper_Text"
                        style={{ fontSize: "12px" }}
                    >
                        Team
                    </label>
                    <p className="Text_Primary Team-Alert text-[14px] ">
                        {TeamName}
                    </p>
                </div>

                {assigneeList?.length < 0 && (
                    <NoItemToShow />
                )}
                <div className="ScrollViewAssigneeTab mt-4">
                    {assigneeList?.map((tech: any, index: any) => {
                        const nameWithoutBrackets = tech?.LOGIN_NAME.replace(
                            /\s*\(.*?\)\s*/g,
                            ""
                        ).trim();
                        const data = nameWithoutBrackets.split(" ");
                        const firstLetter = data[0]?.charAt(0) || " ";
                        const secondLetter = data[1]?.charAt(0) || " ";
                        const initials = firstLetter + secondLetter;

                        return (
                            <div className="mt-3" key={index}>
                                <div className="flex flex-wrap justify-between gap-3">
                                    <div className="flex flex-wrap gap-3" style={{ flex: "1" }}>
                                        {/* Avatar initials */}
                                        <div className="AvtarInitials">{initials}</div>
                                        <div className="flex-1" style={{ overflow: 'hidden' }}>
                                            <label
                                                className="Text_Primary Input_Text"
                                                style={{
                                                    wordWrap: 'break-word', // Allow text to break between words
                                                    wordBreak: 'break-word', // Break words if necessary
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'normal', // Allow wrapping within the available width
                                                }}
                                            >
                                                {tech?.LOGIN_NAME}
                                            </label>
                                            <p className="Secondary_Primary Helper_Text" style={{ whiteSpace: 'nowrap' }}>
                                                {tech?.ROLE_NAME}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {tech?.ASSING_ROLE === "P" ? (
                                            <span
                                                style={{
                                                    display: "block",
                                                    backgroundColor: "#E8F7FD",
                                                    borderRadius: "1rem",
                                                    padding: "0.25rem",
                                                    textAlign: "center",
                                                    width: "120px",
                                                    color: "#272B30",
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                    height: "25px",
                                                }}
                                            >
                                                PTW Holder
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    display: "block",
                                                    backgroundColor: "#E8F7FD",
                                                    borderRadius: "1rem",
                                                    padding: "0.25rem",
                                                    textAlign: "center",
                                                    width: "120px",
                                                    color: "#272B30",
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                    height: "25px",
                                                }}
                                            >
                                                Assignee
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>}
            {isInfraAssignee === false && <Card className=" mt-2">
                <h6 className="Service_Header_Text ">
                    {("Assignees")} ({assigneeList?.length})
                </h6>
                <div
                    className="ScrollViewAssigneeTab"
                    style={{
                        overflow: "auto",
                        maxHeight: "calc(100vh - 370px)",
                        height: "100%",
                    }}
                >
                    {assigneeList?.map((tech: any, index: any) => {
                        const nameParts = tech?.USER_NAME?.split(" ");
                        const initials =
                            nameParts.length > 1
                                ? `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(
                                    0
                                )}`
                                : `${nameParts[0]?.charAt(0)}`;
                        return (
                            <div className="flex justify-start mt-2" key={index}>
                                <div className="w-10 h-10 flex items-center justify-center bg-[#F7ECFA] rounded-full text-[#272B30] font-bold">
                                    {initials.toUpperCase()}
                                </div>
                                {/* <div>
                                          <img src={userIcon} alt="" className="w-10" />
                                        </div> */}
                                <div className="ml-2">
                                    <label className="Text_Primary Input_Text ">
                                        {tech?.USER_NAME}
                                    </label>
                                    <p className="Text_Secondary  Helper_Text">
                                        {tech?.TEAM_NAME}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>}

        </>

    )
}
