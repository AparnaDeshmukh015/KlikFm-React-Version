
import "../../../../components/Button/Button.css";
import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import Select from "../../../../components/Dropdown/Dropdown";
import Radio from "../../../../components/Radio/Radio";
import InputField from "../../../../components/Input/Input";
import { selectedLocationTemplate } from "../../../AssetAndParts/ServiceMaster/utils/HelperComponent";
import { locationOptionTemplate } from "./HelperServiceRequestRealComponent";
import { InputTextarea } from "primereact/inputtextarea";
import LoaderShow from "../../../../components/Loader/LoaderShow";
import WoDocumentUpload from "../../../../components/pageComponents/DocumentUpload/WoDocumentUpload";
import Field from "../../../../components/Field";
interface RequestDetailsCardProps {
  t: (key: string) => string;
  control: any;
  register: any;
  setValue: any;
  resetField: any;
  watch: any;
  getValues: any;
  errors: any;
  assestTypeLabel: any[];
  options: any;
  selectedDetails: any;
  type: any[];
  assetList: any[];
  locationtypeOptions: any[];
  locationId: any;
  setLocationId: (id: any) => void;
  selectedLocationTemplate: any;
  locationOptionTemplate: any;
  workOrderOption: any[];
  Descriptionlength: number;
  handleInputChange: (e: any) => void;
  isloading: boolean;
  setIsSubmit: (val: boolean) => void;
  uploadError: boolean;
  uploadSupportMandatory: boolean;
  docCancel: boolean;
  setdocCancel: (val: boolean) => void;
  getWoOrderList: (id: any, type: any) => Promise<void>;
  ASSET_NONASSET: any;
  technicianList: any[];
}

export const AddServiceRequestReal = ({t,
  control,
  register,
  setValue,
  resetField,
  watch,
  getValues,
  errors,
  assestTypeLabel,
  options,
  selectedDetails,
  type,
  assetList,
  locationtypeOptions,
  locationId,
  setLocationId,
  selectedLocationTemplate,
  locationOptionTemplate,
  workOrderOption,
  Descriptionlength,
  handleInputChange,
  isloading,
  setIsSubmit,
  uploadError,
  uploadSupportMandatory,
  docCancel,
  setdocCancel,
  getWoOrderList,
  ASSET_NONASSET,
  technicianList,setType,
  setAssetList,
  setWorkOrderOption}:any)=>{
    console.log("docCancel", docCancel);
    return (
    <>
    <Card>
                        <div className="flex flex-wrap justify-between mb-3">
                          <h6 className="Service_Header_Text">
                            {t("Request Details")}
                          </h6>
                        </div>
                        <div className=" grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                          <div className="col-span-2">
                            <Field
                              controller={{
                                name: "ASSET_NONASSET",
                                control: control,
                                render: ({ field }: any) => {
                                  return (
                                    <>
                                      <Radio
                                        {...register("ASSET_NONASSET", {
                                          onChange: () => {
                                            let data: any = {};
                                            setValue("GROUP", data);
                                            setValue("TYPE", "");
                                            resetField("GROUP");
                                            setType([]);
                                            setAssetList([]);
                                            setWorkOrderOption([]);
                                          },
                                        })}
                                        labelHead="Work Order Category"
                                        options={assestTypeLabel}
                                        selectedData={
                                          selectedDetails?.ASSET_NONASSET || "A"
                                        }
                                        setValue={setValue}
                                        {...field}
                                      />
                                    </>
                                  );
                                },
                              }}
                            />
                          </div>
    
                          <Field
                            controller={{
                              name: "LOCATION_ID",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={locationtypeOptions}
                                    {...register("LOCATION_ID", {
                                      required: "Please fill the required fields",
                                      onChange: (e:any) => {
                                        let location: any = JSON.stringify(
                                          e?.target?.value
                                        );
                                        setLocationId(e?.target?.value);
                                        localStorage.setItem(
                                          "LOCATIONNAME",
                                          location
                                        );
                                      },
                                    })}
                                    label="Location"
                                    require={true}
                                    optionLabel={
                                      field?.value?.LOCATION_DESCRIPTION !== null
                                        ? "LOCATION_DESCRIPTION"
                                        : "LOCATION_NAME"
                                    }
                                    filter={true}
                                    valueTemplate={selectedLocationTemplate}
                                    itemTemplate={locationOptionTemplate}
                                    findKey={"LOCATION_ID"}
                                    setValue={setValue}
                                    invalid={errors?.LOCATION_ID}
                                    className="locationDropdown w-full"
                                    value={locationId}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
    
                          <Field
                            controller={{
                              name: "GROUP",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={
                                      ASSET_NONASSET?.key === "A" ||
                                        ASSET_NONASSET === "A"
                                        ? options?.assetGroup
                                        : options?.serviceGroup
                                    }
                                    {...register("GROUP", {
                                      required: "Please fill the required fields",
                                      onChange: async (e: any) => {
                                        await getWoOrderList(
                                          e?.target?.value?.ASSETGROUP_ID,
                                          e?.target?.value?.ASSETGROUP_TYPE
                                        );
    
                                        setValue("WO_REMARKS", "");
                                      },
                                    })}
                                    label={
                                      ASSET_NONASSET?.key === "A" ||
                                        ASSET_NONASSET === "A"
                                        ? "Equipment Group"
                                        : "Service Group"
                                    }
                                    require={true}
                                    filter={true}
                                    optionLabel="ASSETGROUP_NAME"
                                    findKey={"ASSETGROUP_ID"}
                                    selectedData={selectedDetails?.ASSETGROUP_ID}
                                    setValue={setValue}
                                    invalid={errors.GROUP}
                                    disabled={technicianList?.length > 0}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                          <Field
                            controller={{
                              name: "TYPE",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={type}
                                    {...register("TYPE", {})}
                                    label={
                                      ASSET_NONASSET?.key === "A" ||
                                        ASSET_NONASSET === "A"
                                        ? "Equipment Type"
                                        : "Service Type"
                                    }
                                    optionLabel="ASSETTYPE_NAME"
                                    filter={true}
                                    findKey={"ASSETTYPE_ID"}
                                    selectedData={selectedDetails?.ASSETTYPE_ID}
                                    setValue={setValue}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                          <Field
                            controller={{
                              name: "ASSET_ID",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={assetList}
                                    {...register("ASSET_ID", {})}
                                    label={
                                      ASSET_NONASSET?.key === "A" ||
                                        ASSET_NONASSET === "A"
                                        ? "Equipment"
                                        : "Soft Service"
                                    }
                                    optionLabel="ASSET_NAME"
                                    filter={true}
                                    findKey={"ASSET_ID"}
                                    selectedData={selectedDetails?.ASSET_ID}
                                    setValue={setValue}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                          <Field
                            controller={{
                              name: "REQ_ID",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={workOrderOption}
                                    {...register("REQ_ID", {
                                      required: "Please fill the required fields",
                                    })}
                                    label={"Issue"}
                                    optionLabel="REQ_DESC"
                                    findKey={"REQ_ID"}
                                    require={true}
                                    filter={true}
                                    setValue={setValue}
                                    invalid={errors?.REQ_ID}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
    
                          <Field
                            controller={{
                              name: "SEVERITY_CODE",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <Select
                                    options={options?.severityLIST}
                                    {...register("SEVERITY_CODE", {
                                      required: "Please fill the required fields",
                                    })}
                                    label={"Priority"}
                                    optionLabel="SEVERITY"
                                    findKey="SEVERITY_ID"
                                    require={true}
                                    filter={true}
                                    selectedData={selectedDetails?.SEVERITY_CODE}
                                    setValue={setValue}
                                    invalid={errors?.SEVERITY_CODE}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
    
                          <div className="col-span-2">
                            <label className="Text_Secondary Input_Label">
                              {t("Description (max 400 characters)")}
                            </label>
    
                            <Field
                              controller={{
                                name: "WO_REMARKS",
                                control: control,
                                render: ({ field }: any) => {
                                  return (
                                    <InputTextarea
                                      {...register("WO_REMARKS", {
                                        onChange: (e: any) => {
                                          handleInputChange(e);
                                        },
                                      })}
                                      rows={5}
                                      maxLength={400}
                                      invalid={errors?.WO_REMARKS}
                                      setValue={setValue}
                                      {...field}
                                    />
                                  );
                                },
                              }}
                            />
                            <label
                              className={` ${Descriptionlength === 400
                                ? "text-red-600"
                                : "Text_Secondary"
                                } Helper_Text`}
                            >
                              {t(`${Descriptionlength}/400 characters`)}
                            </label>
                          </div>
    
                          <div className={"col-span-2"}>
                            {isloading ? (
                              <LoaderShow />
                            ) : (
                              <WoDocumentUpload
                                register={register}
                                control={control}
                                setValue={setValue}
                                watch={watch}
                                getValues={getValues}
                                errors={errors}
                                uploadtype="W"
                                uploadLabel="Upload Supporting files"
                                setIsSubmit={setIsSubmit}
                                uploadError={uploadError}
                                uploadSupportMandatory={uploadSupportMandatory}
                                docCancel={docCancel}
                                setdocCancel={setdocCancel}
                              />
                            )}
                          </div>
                        </div>
                      </Card>
                      <Card className="mt-4">
                        <div className="flex flex-wrap justify-between mb-3">
                          <h6 className="Service_Header_Text">
                            {t("Reporter Details")}
                          </h6>
                        </div>
                        <div className=" grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
                          <Field
                            controller={{
                              name: "REPORTER_NAME",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <InputField
                                    {...register("REPORTER_NAME", {})}
                                    label="Reporter Name"
                                    disabled={true}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                          <Field
                            controller={{
                              name: "REPORTER_EMAIL",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <InputField
                                    {...register("REPORTER_EMAIL", {})}
                                    label="Reporter Email"
                                    disabled={true}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                          <Field
                            controller={{
                              name: "REPORTER_MOBILE",
                              control: control,
                              render: ({ field }: any) => {
                                return (
                                  <InputField
                                    {...register("REPORTER_MOBILE", {})}
                                    label="Reporter Mobile Number"
                                    disabled={true}
                                    {...field}
                                  />
                                );
                              },
                            }}
                          />
                        </div>
                      </Card> 
                      </> 
  )
}