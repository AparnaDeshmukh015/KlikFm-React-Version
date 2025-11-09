import React from "react";
import Select from "../../../../components/Dropdown/Dropdown";
import Field from "../../../../components/Field";
import Checkboxs from "../../../../components/Checkbox/Checkbox";
import Radio from "../../../../components/Radio/Radio";
import InputField from "../../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import {handlerShowService} from "./helper"
import DateCalendar from "../../../../components/Calendar/Calendar";
import { InputTextarea } from "primereact/inputtextarea";

interface ServiceDetailsProps {
  control: any;
  register: any;
  setValue: any;
  errors: any;
  options: any;
  selectedDetails: any;
  MANINTENANCE: boolean;
  props: any;
  t: (key: string) => string;
  getRequestList: (id: string, type: string) => Promise<void>;
  typeList: any[];
  setAssetTypeState: (val: boolean) => void;
  selectedLocationTemplate?: any;
  locationOptionTemplate?: any;
  Descriptionlength: number;
  handleInputChange: (e: any) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  control,
  register,
  setValue,
  errors,
  options,
  selectedDetails,
  MANINTENANCE,
  props,
  t,
  getRequestList,
  typeList,
  setAssetTypeState,
  selectedLocationTemplate,
  locationOptionTemplate,
  Descriptionlength,
  handleInputChange,
}) => {
  const baseFields = [
    {
      name: "LOCATION",
      label: "Location",
      component: Select,
      props: {
        options: options?.location,
        require: true,
        optionLabel: "LOCATION_NAME",
        valueTemplate: selectedLocationTemplate,
        itemTemplate: locationOptionTemplate,
        invalid: errors.LOCATION,
        filter: true,
        findKey: "LOCATION_ID",
        selectedData: selectedDetails?.LOCATION_ID,
        setValue,
      },
      rules: { required: t("Please fill the required fields.") },
    },
    {
      name: "ASSET_CODE",
      label: "Code",
      component: InputField,
      props: {
        disabled: props.selectedData ? true : false,
      },
    },
    {
      name: "ASSET_NAME",
      label: "Name",
      component: InputField,
      props: {
        require: true,
        invalid: errors.ASSET_NAME,
      },
      rules: { required: t("Please fill the required fields.") },
      error: errors?.ASSET_NAME?.message,
    },
    {
      name: "GROUP",
      label: "Group",
      component: Select,
      props: {
        options: options?.assetGroup,
        require: true,
        optionLabel: "ASSETGROUP_NAME",
        invalid: errors.GROUP,
        findKey: "ASSETGROUP_ID",
        selectedData: selectedDetails?.ASSETGROUP_ID,
        setValue,
      },
      rules: {
        required: t("Please fill the required fields."),
        onChange: async (e: any) => {
          await getRequestList(
            e?.target?.value?.ASSETGROUP_ID,
            e?.target?.value?.ASSETGROUP_TYPE
          );
        },
      },
      error: errors?.GROUP?.message,
    },
    {
      name: "TYPE",
      label: "Type",
      component: Select,
      props: {
        options: typeList,
        optionLabel: "ASSETTYPE_NAME",
        require: true,
        invalid: errors.TYPE,
        findKey: "ASSETTYPE_ID",
        selectedData: selectedDetails?.ASSETTYPE_ID,
        setValue,
      },
      rules: {
        required: t("Please fill the required fields."),
        onChange: () => setAssetTypeState(true),
      },
    },
  ];

  return (
    <Card className="mt-2">
      <div className="headingConainer">
        <p>{t("Service Details")}</p>
      </div>

      <div className="mt-1 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
        {/* Base fields */}
        {baseFields.map(({ name, label, component: Comp, props = {}, rules, error }) => (
          <Field
            key={name}
            controller={{
              name,
              control,
              render: ({ field }: any) => (
                <Comp
                  {...register(name, rules || {})}
                  label={label}
                  {...props}
                  {...field}
                />
              ),
            }}
            error={error}
          />
        ))}

        {/* Description */}
        <div className="col-span-1">
          <label className="Text_Secondary Input_Label">{t("Description")}</label>
          <Field
            controller={{
              name: "ASSET_DESC",
              control,
              render: ({ field }: any) => (
                <InputTextarea
                  {...register("ASSET_DESC", { onChange: handleInputChange })}
                  maxLength={400}
                  setValue={setValue}
                  {...field}
                />
              ),
            }}
          />
          <label
            className={` ${
              Descriptionlength === 400 ? "text-red-600" : "Text_Secondary"
            } Helper_Text`}
          >
            {t(`Up to ${Descriptionlength}/400 characters.`)}
          </label>
        </div>

        {/* Checkboxes */}
        <div className="flex align-items-center gap-4">
          <Field
            controller={{
              name: "UNDERAMC",
              control,
              render: ({ field }: any) => (
                <Checkboxs
                  {...register("UNDERAMC")}
                  checked={selectedDetails?.UNDERAMC === true}
                  className={`${MANINTENANCE && "md:mt-7"}`}
                  label="Maintenance"
                  setValue={setValue}
                  {...field}
                />
              ),
            }}
            error={errors?.UNDERAMC?.message}
          />
          <Field
            controller={{
              name: "ACTIVE",
              control,
              render: ({ field }: any) => (
                <Checkboxs
                  {...register("ACTIVE")}
                  checked={props?.selectedData?.ACTIVE || false}
                  className={`${MANINTENANCE && "md:mt-7"}`}
                  label="Active"
                  setValue={setValue}
                  {...field}
                />
              ),
            }}
            error={errors?.ACTIVE?.message}
          />
        </div>

        {/* Conditional Maintenance fields */}
        {MANINTENANCE && (
          <>
            <Field
              controller={{
                name: "AMC_EXPIRY_DATE",
                control,
                render: ({ field }: any) => (
                  <DateCalendar
                    {...register("AMC_EXPIRY_DATE", {
                      required: MANINTENANCE
                        ? t("Please Fill the Required Fields.")
                        : "",
                    })}
                    label="AMC Expiry Date"
                    require={MANINTENANCE}
                    showIcon
                    setValue={setValue}
                    invalid={MANINTENANCE ? errors?.AMC_EXPIRY_DATE : ""}
                    {...field}
                  />
                ),
              }}
              error={errors?.AMC_EXPIRY_DATE?.message}
            />
            <Field
              controller={{
                name: "AMC_VENDOR",
                control,
                render: ({ field }: any) => (
                  <Select
                    options={options?.vendorList}
                    {...register("AMC_VENDOR", {
                      required: MANINTENANCE
                        ? t("Please fill the required fields.")
                        : "",
                    })}
                    label="AMC Vendor"
                    optionLabel="VENDOR_NAME"
                    invalid={MANINTENANCE ? errors.AMC_VENDOR : ""}
                    findKey="VENDOR_ID"
                    require={MANINTENANCE}
                    selectedData={selectedDetails?.AMC_VENDOR}
                    setValue={setValue}
                    {...field}
                  />
                ),
              }}
              error={errors?.AMC_VENDOR?.message}
            />
          </>
        )}
      </div>
    </Card>
  );
};

export default ServiceDetails;
