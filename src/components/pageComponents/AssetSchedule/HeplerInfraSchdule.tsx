import { useLocation, useNavigate } from "react-router-dom";
import Select from "../../Dropdown/Dropdown";
import Buttons from "../../../components/Button/Button";

export const inputElement = (
    labelName: any,
    registerName: any,
    lastLabel: any = null,
    validationType: any,
    optionlist: any = [],
    key: any,
    disabled: boolean,
    isReuired: boolean,
    Field:any, setValue:any,
    control:any, register:any, errors:any,
    selectedDetails:any,
    hasError:any
  ) => {
    const selectedStr = registerName?.split(".")[1];
    return (
      <div className=" mb-2">
        <div className="flex gap-2">
          <div className="">
            <Field
              controller={{
                name: registerName,
                control: control,
                render: ({ field }: any) => {
                  return (
                    <Select
                      disabled={disabled}
                      options={optionlist}
                      {...register(registerName, {
                        required: "Please fill the required fields",
                        validate: (value:any) => {
                          if (disabled) return true; // skip validation if disabled
                          if (
                            !value ||
                            (typeof value === "object" &&
                              Object.keys(value).length === 0)
                          ) {
                            return "Please fill the required fields";
                          }
                          return true;
                        },
                      })}
                      label={labelName}
                      optionLabel={"VIEW"}
                      findKey={key}
                      require={isReuired}
                      selectedData={selectedDetails[selectedStr]}
                      setValue={setValue}
                      {...field}
                      invalid={!!hasError(errors, registerName)}

                    />
                  );
                },
              }}
            />
          </div>
          {lastLabel && (
            <div className="flex items-end pb-2">
              <label className="Text_Secondary Input_Label">{lastLabel}</label>
            </div>
          )}
        </div>
      </div>
    );
  };

export const FormatHeader = ({Mode, assetTreeDetails, ASSET_FOLDER_DATA, selectedAssetFormData}:any) => {
    const location :any =useLocation();
   
    const navigate :any = useNavigate();
    const FACILITY: any = localStorage.getItem("FACILITYID");
    const FACILITYID: any = JSON.parse(FACILITY);
   
     if (FACILITYID) {
         var facility_type: any = FACILITYID?.FACILITY_TYPE;
       }
       let { pathname } = useLocation();
         const { search } = useLocation();
         let pageInfra = localStorage.getItem("schedulePage");
    return (
        <div className="flex justify-between">
                      <div>
                        {(search === "?edit=" || location?.state?.Mode === "edit") && (
                          <h6 className=" Text_Primary Main_Main_Header_Text mb-1">
                            Edit Scheduled Maintenance
                          </h6>
                        )}
                        {(search === "?add=" || location?.state?.Mode === "add") && (
                          <h6 className=" Text_Primary Main_Main_Header_Text mb-1">
                            Add Scheduled Maintenance
                          </h6>
                        )}
                        <p className="Helper_Text Menu_Active flex mb-1">
                          <p className="Helper_Text Menu_Active ">
                            {assetTreeDetails?.length > 0
                              ? `${ASSET_FOLDER_DATA?.ASSET_FOLDER_DESCRIPTION ?? ""} ${
                                  assetTreeDetails[0]?.ASSET_NAME
                                }`
                              : location?.state !== null &&
                                location?.state?.ASSET_FOLDER_DATA
                                  ?.ASSET_FOLDER_DESCRIPTION !== undefined
                              ? `${location?.state?.ASSET_FOLDER_DATA?.ASSET_FOLDER_DESCRIPTION} > ${selectedAssetFormData?.ASSET_NAME}`
                              : ""}
                          </p>
                          {/* )} */}
                        </p>
                      </div>
                      <div className="h-10 flex items-center">
                        {/* <Buttons className="Primary_Button w-20" label={"Schedule1"} onClick={routes} /> */}
                        <div className="p-2">
                          {pathname === "/assettaskschedulelist" &&
                          facility_type === "I" ? (
                            <Buttons
                              type="submit"
                              className="Primary_Button w-20"
                              label={"Save"}
                            />
                          ) : (
                            <Buttons
                              type="submit"
                              className="Primary_Button w-20"
                              label={"Submit"}
                            />
                          )}
                        </div>
                        <div>
                          {/* <Buttons type="submit" className="Primary_Button w-20" label={"Schedule"} /> */}
                          {pageInfra === "assetSchedule" ||
                          pageInfra === "infraPPM" ||
                          pathname === "/assettaskschedulelist" ? (
                            <Buttons
                              className="Secondary_Button w-20 me-2"
                              label={
                                pathname === "/assettaskschedulelist"
                                  ? "List"
                                  : "Cancel"
                              }
                              onClick={() => {
                                let pageInfra = localStorage.getItem("schedulePage");
                                if (pageInfra === "infraPPM") {
                                  navigate(`/ppmSchedule?`);
                                } else if (Mode !== "") {
                                  navigate(`/assetmasterlist?${Mode}=`, {
                                    state: { groupStatus: true },
                                  });
                                } else {
                                  navigate(`/assettaskschedulelist`);
                                }
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
    )
  }