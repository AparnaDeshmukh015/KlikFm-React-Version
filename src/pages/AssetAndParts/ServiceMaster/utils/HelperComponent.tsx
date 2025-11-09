import { useLocation } from "react-router-dom";
import Buttons from "../../../../components/Button/Button";
import { useTranslation } from "react-i18next";
import Select from "../../../../components/Dropdown/Dropdown";
import Field from "../../../../components/Field";
import Checkboxs from "../../../../components/Checkbox/Checkbox";
import Radio from "../../../../components/Radio/Radio";
import InputField from "../../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import {handlerShowService} from "./helper"
import DateCalendar from "../../../../components/Calendar/Calendar";
 export const selectedLocationTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.LOCATION_DESCRIPTION}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  export const locationOptionTemplate = (option: any) => {
    return (
      <div className="align-items-center">
        <div className="Text_Primary Input_Label">{option.LOCATION_NAME}</div>
        <div className=" Text_Secondary Helper_Text">
          {option.LOCATION_DESCRIPTION}
        </div>
      </div>
    );
  };

  export const FormHeader =({header, IsSubmit, props }:any)=>{
    const { search } = useLocation();
    const { t } = useTranslation();
    let location: any = useLocation();
    const navigate = useNavigate();
    return(
        <div className="flex justify-between mt-1">
                  <div>
                    <h6 className="Text_Primary">
                      {t(`${search === "?edit=" ? "Edit" : "Add"}`)}{" "}
                      {header}{" "}
                    </h6>
                  </div>
                  <div className="flex">
                    {location?.state !== null && (
                      <Buttons
                        type="submit"
                        className="Primary_Button   me-2"
                        label={"Show Service Request"}
                        onClick={() => handlerShowService(navigate, location)}
                      />
                    )}
                    <Buttons
                      type="submit"
                      className="Primary_Button  w-20 me-2"
                      disabled={IsSubmit}
                      label={"Save"}
                    />
                    <Buttons
                      className="Secondary_Button w-20 "
                      label={"List"}
                      onClick={props?.isClick}
                    />
                  </div>
                </div>
    )
  }



interface ServiceDetailsProps {
  register: any;
  control: any;
  errors: any;
  setValue: any;
  options: any;
  selectedDetails: any;
  MANINTENANCE: boolean;
}

export const ServiceDetails = ({
  register,
  control,
  errors,
  setValue,
  options,
  selectedDetails,
  MANINTENANCE,
}: ServiceDetailsProps) => {
  const { t } = useTranslation();
     console.log(options,"optionsoptionsoptionsoptions")
  return (
  
       
         <div className="mt-1 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
          <Field
            label={t("Location")}
            controller={{
              name: "LOCATION",
              control,
              rules: { required: t("Please fill required") },
              render: ({ field }: any) => (
                <Select
                  id="LOCATION"
                  options={options?.LOCATION || []}
                  value={field.value}
                  onChange={(e: any) => {
                    field.onChange(e.value);
                    setValue("GROUP", null);
                    setValue("TYPE", null);
                  }}
                  placeholder={t("Select Location")}
                />
              ),
            }}
            error={errors?.LOCATION?.message}
          />
     

       
          <Field
            label={t("Asset Code")}
            controller={{
              name: "ASSET_CODE",
              control,
              render: ({ field }: any) => (
                <InputField
                  {...field}
                  id="ASSET_CODE"
                  placeholder={t("Enter Asset Code")}
                />
              ),
            }}
            error={errors?.ASSET_CODE?.message}
          />
    

        {/* Group */}
     
          <Field
            label={t("Group")}
            controller={{
              name: "GROUP",
              control,
              rules: { required: t("Please fill required") },
              render: ({ field }: any) => (
                <Select
                  id="GROUP"
                  options={options?.GROUP || []}
                  value={field.value}
                  onChange={(e: any) => {
                    field.onChange(e.value);
                    setValue("TYPE", null);
                  }}
                  placeholder={t("Select Group")}
                />
              ),
            }}
            error={errors?.GROUP?.message}
          />
        

        
          <Field
            label={t("Type")}
            controller={{
              name: "TYPE",
              control,
              rules: { required: t("Please fill required") },
              render: ({ field }: any) => (
                <Select
                  id="TYPE"
                  options={options?.TYPE || []}
                  value={field.value}
                  onChange={(e: any) => field.onChange(e.value)}
                  placeholder={t("Select Type")}
                />
              ),
            }}
            error={errors?.TYPE?.message}
          />
        

       
          <Field
            label={t("Under AMC")}
            controller={{
              name: "UNDERAMC",
              control,
              render: ({ field }: any) => (
                <div className="flex gap-3">
                  <Radio
                    inputId="AMCYes"
                    name="UNDERAMC"
                    value={true}
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    label={t("Yes")}
                  />
                  <Radio
                    inputId="AMCNo"
                    name="UNDERAMC"
                    value={false}
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    label={t("No")}
                  />
                </div>
              ),
            }}
          />
       

        {/* AMC Vendor (only if AMC = Yes) */}
        {MANINTENANCE && (
          <div className="field col-12 md:col-3">
            <Field
              label={t("AMC Vendor")}
              controller={{
                name: "AMC_VENDOR",
                control,
                rules: MANINTENANCE
                  ? { required: t("Please fill required") }
                  : {},
                render: ({ field }: any) => (
                  <InputField
                    {...field}
                    id="AMC_VENDOR"
                    placeholder={t("Enter Vendor Name")}
                  />
                ),
              }}
              error={errors?.AMC_VENDOR?.message}
            />
          </div>
        )}
    </div>
  );
};

interface OtherDetailsProps {
  control: any;
  register: any;
  setValue: any;
  options: any;
  selectedDetails: any;
  fields: any[];
  t: (key: string) => string;
}

export const OtherDetails: React.FC<OtherDetailsProps> = ({
  control,
  register,
  setValue,
  options,
  selectedDetails,
  fields,
  t,
}) => {
  const baseFields = [
    {
      name: "ASSET_COST",
      label: "Approximate Cost",
      component: InputField,
      validate: (fieldValue: any) => {
        const sanitizedValue = fieldValue?.toString()?.replace(/[^0-9]/g, "");
        setValue("BENCHMARK_VALUE", sanitizedValue);
        return true;
      },
    },
    {
      name: "VENDOR_NAME",
      label: "Vendor Name",
      component: Select,
      props: {
        options: options?.vendorList,
        optionLabel: "VENDOR_NAME",
        findKey: "VENDOR_ID",
        selectedData: selectedDetails?.VENDOR_ID,
        setValue,
      },
    },
    {
      name: "COMMISSIONING_DATE",
      label: t("Commissioning Date"),
      component: DateCalendar,
      props: { showIcon: true, setValue },
    },
  ];

  return (
    <Card>
      <div className="headingConainer">
        <p>Other Details</p>
      </div>
      <div className="mt-1 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3">
        {baseFields.map(({ name, label, component: Comp, validate, props = {} }) => (
          <Field
            key={name}
            controller={{
              name,
              control,
              render: ({ field }: any) => (
                <Comp
                  {...register(name, validate ? { validate } : {})}
                  label={label}
                  {...props}
                  {...field}
                />
              ),
            }}
          />
        ))}

        {/* EXTRA_COL_LIST dynamic fields */}
        {fields.map((arrayField: any, index: number) => (
          <Field
            key={arrayField?.FIELDNAME}
            controller={{
              name: `EXTRA_COL_LIST.${index}.VALUE`,
              control,
              render: ({ field }: any) => (
                <InputField
                  {...register(`EXTRA_COL_LIST.${index}`, {})}
                  label={arrayField?.LABEL}
                  placeholder="Please Enter"
                  {...field}
                />
              ),
            }}
          />
        ))}
      </div>
    </Card>
  );
};

