import { Card } from "primereact/card";

export const ReporterDetails = ({ ReporterDetailsProps, salcedorecedetails, onClickFunction, salseforceAccount }: any) => {
    return (
        <Card className="mt-4">
            <div className="flex flex-wrap justify-between mb-3">
                <h6 className={salcedorecedetails === undefined ? "Header_Text" : "Service_Header_Text"}>
                    {("Reporter Details")}
                </h6>

                {ReporterDetailsProps?.SF_CASE_NO && ReporterDetailsProps?.SF_CASE_NO !== "" &&
                    salcedorecedetails?.CaseId === undefined && (
                        <div>
                            {" "}
                            <i
                                className="pi pi-eye
"
                                style={{
                                    fontSize: "24px",
                                    display: "flex",
                                    justifyContent: "end",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    onClickFunction();
                                }}
                            ></i>
                        </div>
                    )}
                {salcedorecedetails?.CaseId !== undefined && (
                    <div>
                        {" "}
                        <i
                            className="pi pi-eye-slash
"
                            style={{
                                fontSize: "24px",
                                display: "flex",
                                justifyContent: "end",
                                cursor: "pointer",
                            }}
                        ></i>
                    </div>
                )}
            </div>
            <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                <div>
                    <label className="Text_Secondary Helper_Text">
                        Reporter Name
                    </label>
                    {ReporterDetailsProps?.SF_CASE_NO && ReporterDetailsProps?.SF_CASE_NO !== "" ? (
                        <>
                            <>
                                <p className="Text_Primary Service_Alert_Title  ">
                                    {salcedorecedetails?.CaseId !== undefined
                                        ? salcedorecedetails?.ContactName
                                        : "XXXXX"}
                                </p>
                            </>
                        </>
                    ) : (
                        <>
                            {ReporterDetailsProps?.CONTACT_NAME === null ||
                                ReporterDetailsProps?.CONTACT_NAME === "" ? (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        {ReporterDetailsProps?.CONTACT_NAME}
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <label className="Text_Secondary Helper_Text">
                        Reporter Email
                    </label>
                    {ReporterDetailsProps?.SF_CASE_NO && ReporterDetailsProps?.SF_CASE_NO !== "" ? (
                        <>
                            <>
                                <p className="Text_Primary Service_Alert_Title  ">
                                    {salcedorecedetails?.CaseId !== undefined
                                        ? salcedorecedetails?.ContactEmail
                                        : "XXXXX"}
                                </p>
                            </>
                        </>
                    ) : (
                        <>
                            {ReporterDetailsProps?.CONTACT_EMAIL === null ||
                                ReporterDetailsProps?.CONTACT_EMAIL === "" ? (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        {ReporterDetailsProps?.CONTACT_EMAIL}
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <label className="Text_Secondary Helper_Text">
                        Reporter Mobile Number
                    </label>
                    {ReporterDetailsProps?.SF_CASE_NO && ReporterDetailsProps?.SF_CASE_NO !== "" ? (
                        <>
                            <>
                                <p className="Text_Primary Service_Alert_Title  ">
                                    {salcedorecedetails?.CaseId !== undefined
                                        ? salcedorecedetails?.ContactMobile
                                        : "XXXXX"}
                                </p>
                            </>
                        </>
                    ) : (
                        <>
                            {ReporterDetailsProps?.CONTACT_PHONE === null ||
                                ReporterDetailsProps?.CONTACT_PHONE === "" ? (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Service_Alert_Title  ">
                                        {ReporterDetailsProps?.CONTACT_PHONE}
                                    </p>
                                </>
                            )}
                        </>
                    )}


                </div>
                <div>
                    {salseforceAccount?.SALESFROCE_ACCOUNT && (
                        <div>
                            <label className="Text_Secondary Helper_Text">
                                Account
                            </label>
                            {salseforceAccount?.SALESFROCE_ACCOUNT === null ||
                                salseforceAccount?.SALESFROCE_ACCOUNT === "" ? (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        NA
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="Text_Primary Alert_Title  ">
                                        {salseforceAccount?.SALESFROCE_ACCOUNT}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
