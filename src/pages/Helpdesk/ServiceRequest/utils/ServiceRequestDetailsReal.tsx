import React from "react";
import { Card } from "primereact/card";
import Buttons from "../../../../components/Button/Button";
import Field from "../../../../components/Field";
import Select from "../../../../components/Dropdown/Dropdown";
import LoaderFileUpload from "../../../../components/Loader/LoaderFileUpload";
import ImageGalleryComponent from "../../ImageGallery/ImageGallaryComponent";
import NoItemToShow from "../../Workorder/InfraWorkrderHelper/NoItemToShow";

interface ServiceRequestDetailsProps {
  t: (key: string) => string;
  selectedDetails: any;
  PriorityEditStatus: boolean;
  iseditDetails: boolean;
  control: any;
  register: any;
  setValue: any;
  errors: any;
  severity: any[];
  isloading: boolean;
  docOption: any[];
  currentMenu: any;
  currentWorkOrderRights: any;
  formateDate: (date: string) => string;
  onClickEditButton: () => void;
}

const ServiceRequestDetailsCard: React.FC<ServiceRequestDetailsProps> = ({
  t,
  selectedDetails,
  PriorityEditStatus,
  iseditDetails,
  control,
  register,
  setValue,
  errors,
  severity,
  isloading,
  docOption,
  currentMenu,
  currentWorkOrderRights,
  formateDate,
  onClickEditButton,
}) => {
  return (
    <Card className="mt-3">
      <div className="flex flex-wrap justify-between mb-3">
        <h6 className="Service_Header_Text">{t("Service Request Details")}</h6>
        {selectedDetails?.ISSERVICEREQ &&
          selectedDetails?.ISEDITSRQ === 1 &&
          currentMenu?.UPDATE_RIGHTS === "True" &&
          selectedDetails?.CURRENT_STATUS !== 6 && (
            <Buttons
              className="Secondary_Button w-20 me-2"
              label={iseditDetails ? "Cancel" : "Edit Details"}
              icon="pi pi-pencil"
              onClick={onClickEditButton}
            />
          )}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          {/* Priority */}
          <div>
            <label className="Text_Secondary Helper_Text">
              {t("Priority")}
              {PriorityEditStatus && (
                <span className="text-red-600"> *</span>
              )}
            </label>

            {!PriorityEditStatus ? (
              <p className="Text_Primary Service_Alert_Title">
                {selectedDetails?.SEVERITY_DESC}
              </p>
            ) : (
              <Field
                controller={{
                  name: "SEVERITY_CODE",
                  control,
                  render: ({ field }: any) => (
                    <Select
                      options={severity ?? []}
                      {...register("SEVERITY_CODE", {
                        required: "Please fill the required fields",
                      })}
                      optionLabel="SEVERITY"
                      findKey={"SEVERITY_ID"}
                      filter={true}
                      selectedData={selectedDetails?.SEVERITY_CODE}
                      setValue={setValue}
                      invalid={errors?.SEVERITY_CODE}
                      {...field}
                    />
                  ),
                }}
              />
            )}
          </div>

          {/* Type */}
          <div>
            <label className="Text_Secondary Helper_Text">Type</label>
            <p className="Text_Primary Service_Alert_Title">
              {selectedDetails?.ASSET_NONASSET === "A"
                ? "Equipment"
                : "Soft Services"}
            </p>
          </div>

          {/* Reporter */}
          <div>
            <label className="Text_Secondary Helper_Text">Reporter</label>
            <p className="Text_Main Service_Alert_Title">
              {selectedDetails?.USER_NAME || "NA"}
            </p>
          </div>

          {/* Reported Date */}
          <div>
            <label className="Text_Secondary Helper_Text">
              Reported Date & Time
            </label>
            <p className="Text_Primary Service_Alert_Title">
              {selectedDetails?.REPORTED_AT
                ? formateDate(selectedDetails?.REPORTED_AT)
                : "NA"}
            </p>
          </div>

          {/* Work Order */}
          {selectedDetails?.ISSERVICEREQ === false && (
            <div className="flex flex-col gap-1">
              <label className="Text_Secondary Helper_Text">
                Work Order ID
              </label>
              {selectedDetails?.WO_NO ? (
                currentWorkOrderRights?.VIEW_RIGHTS === "True" ? (
                  <p className="Menu_Active Alert_Title">
                    <a
                      href={`${window?.location?.origin}${process.env.REACT_APP_CUSTOM_VARIABLE}/workorderlist?edit=`}
                      target="_blank"
                      onClick={() => {
                        localStorage.setItem(
                          "WO_ID",
                          JSON.stringify(selectedDetails?.WO_ID)
                        );
                      }}
                    >
                      {selectedDetails?.WO_NO}
                    </a>
                  </p>
                ) : (
                  <p className="Menu_Active Alert_Title">
                    {selectedDetails?.WO_NO}
                  </p>
                )
              ) : (
                <p className="Text_Primary Alert_Title">NA</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Location */}
          <div>
            <label className="Text_Secondary Helper_Text">Location</label>
            <p className="Text_Primary Service_Alert_Title">
              {selectedDetails?.LOCATION_DESCRIPTION || "NA"}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="Text_Secondary Helper_Text">Description</label>
            <p className="Text_Primary Service_Alert_Title">
              {selectedDetails?.WO_REMARKS || "NA"}
            </p>
          </div>

          {/* Supporting Files */}
          <div>
            <label className="Text_Secondary Helper_Text">
              Supporting Files (
              {
                docOption?.filter((e: any) => e?.UPLOAD_TYPE === "W")?.length
              }
              )
            </label>

            {isloading ? (
              <div className="imageContainer flex justify-center items-center">
                <LoaderFileUpload IsScannig={false} />
              </div>
            ) : docOption?.filter((e: any) => e?.UPLOAD_TYPE === "W")?.length >
              0 ? (
              <ImageGalleryComponent
                uploadType="W"
                docOption={docOption}
                Title="Service Request"
              />
            ) : (
              <NoItemToShow />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceRequestDetailsCard;
