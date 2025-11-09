import TimeCalendar from "../../Calendar/TimeCalendar";
import InputField from "../../Input/Input";
import Radio from "../../Radio/Radio";
export const timeInputField = (labelName: any, registerName: any, Field:any, control:any,register:any, setValue:any) => {
    return (
      <div className="flex justify-start mb-2">
        <div className="w-36">
          <label className="Text_Secondary Input_Label mr-2">{labelName}</label>
        </div>
        <div className="w-36">
          <Field
            controller={{
              name: registerName,
              control: control,
              render: ({ field }: any) => {
                return (
                  <TimeCalendar
                    {...register(registerName, {
                      required: "AMC expiry date is Required.",
                    })}
                    setValue={setValue}
                    {...field}
                  />
                );
              },
            }}
          />
        </div>
      </div>
    );
  };

  export const inputElement = (
    labelName: any,
    registerName: any,
    lastLabel: any = null,
    validationType: any,
    Field:any, control:any,register:any, setValue:any, validation:any, errors:any
  ) => {
    return (
      <div className="flex justify-start mb-2">
        <div className="w-36">
          <label className="Text_Secondary Input_Label mr-2">{labelName}</label>
        </div>
        <div className="w-36 mr-2">
          <Field
            controller={{
              name: registerName,
              control: control,
              render: ({ field }: any) => {
                return (
                  <InputField
                    {...register(registerName, {
                      validate: (fieldValue: any) => {
                        return validation[validationType](
                          fieldValue,
                          registerName,
                          setValue
                        );
                      },
                    })}
                    require={true}
                    invalid={errors?.registerName}
                    setValue={setValue}
                    {...field}
                  />
                );
              },
            }}
          />
        </div>
        {lastLabel && (
          <div className="w-36">
            <label className="Text_Secondary Input_Label mr-2">
              {lastLabel}
            </label>
          </div>
        )}
      </div>
    );
  };

  export const radioElement = (
    labelHead: any,
    registerName: any,
    options: any,
    selectedData: any,
      Field:any, control:any,register:any, setValue:any
  ) => {
    return (
      <div className="flex justify-start mb-2">
        <div className="w-36">
          <label className="Text_Secondary Input_Label mr-2">{labelHead}</label>
        </div>
        <div className="w-80">
          <Field
            controller={{
              name: registerName,
              control: control,
              render: ({ field }: any) => {
                return (
                  <>
                    <Radio
                      {...register(registerName, {
                        required: ("Please fill the required fields.."),
                      })}
                      options={options}
                      selectedData={selectedData}
                      setValue={setValue}
                      {...field}
                    />
                  </>
                );
              },
            }}
          />
        </div>
      </div>
    );
  };
