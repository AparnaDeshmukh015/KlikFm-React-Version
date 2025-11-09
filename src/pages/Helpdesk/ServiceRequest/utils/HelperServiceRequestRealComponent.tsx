 export const locationOptionTemplate = (option: any) => {
    return (
      <div className="align-items-center">
        <div className="Text_Primary Table_Header">{option?.LOCATION_NAME}</div>
        <div className=" Text_Secondary Helper_Text">
          {option?.LOCATION_DESCRIPTION !== null
            ? option?.LOCATION_DESCRIPTION
            : ""}
        </div>
      </div>
    );
  };

  export  const selectedLocationTemplate = (option: any, props: any) => {
      if (option) {
        return (
          <div className="flex align-items-center">
            <div>
              {option?.LOCATION_DESCRIPTION !== null
                ? option?.LOCATION_DESCRIPTION
                : ""}
            </div>
          </div>
        );
      }
  
      return <span>{props?.placeholder}</span>;
    };