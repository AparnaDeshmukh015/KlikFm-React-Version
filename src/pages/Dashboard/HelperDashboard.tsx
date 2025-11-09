import { Card } from "primereact/card";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import ReactApexChart from "react-apexcharts";
import { handleDownloadExcel } from "../../utils/helper";
import { DataScroller } from "primereact/datascroller";
import { SelectButton } from "primereact/selectbutton";
export const StatusActionApexChart = ({
  header,
  DateDesc,
  optionsList,
  chartWidth,
}: {
  header: string;
  DateDesc: string;
  optionsList: any;
  chartWidth: number;
}) => {
  return (
    <Card className="h-full">
      <div>
        <label className="Title_Label Text_Primary">{header}</label>
        <p className="Helper_Text Text_Secondary">{DateDesc}</p>
      </div>
      <ReactApexChart
        options={optionsList?.options}
        series={optionsList?.series}
        type="donut"
        width={chartWidth}
      />
    </Card>
  );
};

export const EquipementData = ({
  header,
  data,
  totalCount,
  itemTemplate,
  tabdata,
  setList,
  oeEquipmentData,
  searchText,
  setSearchText,
  filename,
}: any) => {
  const handleSearch = (
    searchValue: string,
    filterlist: any[],
    originalList: any[],
    setFilteredList: any,
    searchtype: string
  ) => {
    setSearchText(searchValue);

    if (searchValue?.trim()?.length > 0) {
      if (searchtype === "Eqgroup") {
        const filtered = originalList?.filter((item) =>
          item?.ASSETGROUP_NAME?.toLowerCase().includes(
            searchValue.toLowerCase()
          )
        );

        setFilteredList(filtered);
      } else if (searchtype === "Eqtype") {
        const filtered = originalList?.filter((item) => {
          return (
            item?.ASSETTYPE_NAME?.toLowerCase().includes(
              searchValue.toLowerCase()
            ) ||
            item?.ASSETGROUP_NAME?.toLowerCase().includes(
              searchValue.toLowerCase()
            )
          );
        });
        console.log(originalList, "originalList");
        setFilteredList(filtered);
      } else if (searchtype === "issue") {
        const filtered = originalList?.filter((item) => {
          return (
            item?.ISSUE_DESCRIPTION?.toLowerCase().includes(
              searchValue.toLowerCase()
            ) ||
            item?.ASSETGROUP_NAME?.toLowerCase().includes(
              searchValue.toLowerCase()
            )
          );
        });

        setFilteredList(filtered);
      } else if (searchtype === "assignee") {
        const filtered = originalList?.filter((item) => {
          return item?.ASSIGNEE_NAME?.toLowerCase().includes(
            searchValue.toLowerCase()
          );
        });
        setFilteredList(filtered);
      } else if (searchtype === "reporter") {
        const filtered = originalList?.filter((item) =>
          item?.REPORTER_NAME?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredList(filtered);
      }
    } else {
      setFilteredList(originalList);
    }
  };
  const onSearchFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string
  ) => {
    const searchValue = e.target.value;

    if (tab === tabdata) {
      console.log(data, "data");
      handleSearch(searchValue, data, oeEquipmentData, setList, tabdata);
    }
  };
  return (
    <Card className="h-full">
      <div className="flex justify-between">
        <div>
          <label className="Title_Label Text_Primary">{header}</label>
        </div>
        <div className="equipment-group pt-[7px] pb-[1px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            onClick={() => {
              handleDownloadExcel(data, filename);
            }}
          >
            <path
              d="M14.1633 3H12.1633V9H9.16333L13.1633 14L17.1633 9H14.1633V3Z"
              fill="#929CA6"
            />
            <path
              d="M20.8333 18H4.83325V11H2.83325V18C2.83325 19.103 3.73025 20 4.83325 20H20.8333C21.9363 20 22.8333 19.103 22.8333 18V11H20.8333V18Z"
              fill="#929CA6"
            />
          </svg>
        </div>
      </div>
      <div className="divider"></div>
      <div className="equipment-searchbar-ro flex justify-between">
        <div className="">
          <InputText
            type="search"
            placeholder="Search"
            className=" mt-[13.5px]"
            onChange={(e) => onSearchFilter(e, tabdata)}
          />
        </div>
        <div className="flex flex-col items-end justify-end">
          <h5 className="Text_Primary mt-[10px]">{totalCount}</h5>
          <p className="hehe">Total WO</p>
        </div>
      </div>
      <div className="mt-[24px]">
        {data?.length > 0 ? (
          <DataScroller
            value={data}
            itemTemplate={itemTemplate}
            rows={8}
            inline
            scrollHeight="300px"
          />
        ) : (
          <div>No Data found</div>
        )}
      </div>
    </Card>
  );
};

export const UserSelector = ({
  header,
  data,
  itemTemplate,
  tabdata,
  setList,
  oeUserData,
  searchText,
  setSearchText,
  filename,
}: any) => {
  const handleSearch = (
    searchValue: string,
    filterlist: any[],
    originalList: any[],
    setFilteredList: any,
    searchtype: string
  ) => {
    setSearchText(searchValue);
    console.log(originalList, "originalList");
    if (searchValue?.trim()?.length > 0) {
      if (searchtype === "assignee") {
        const filtered = originalList?.filter((item) => {
          return item?.ASSIGNEE_NAME?.toLowerCase().includes(
            searchValue.toLowerCase()
          );
        });
        setFilteredList(filtered);
      } else if (searchtype === "reporter") {
        const filtered = originalList?.filter((item) =>
          item?.REPORTER_NAME?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredList(filtered);
      }
    } else {
      setFilteredList(originalList);
    }
  };
  const onSearchFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string
  ) => {
    const searchValue = e.target.value;
    console.log(searchValue, "searchValue", data, oeUserData, setList, tabdata);
    handleSearch(searchValue, data, oeUserData, setList, tabdata);
  };
  return (
    <Card className="h-full">
      <div className="flex justify-between">
        <div>
          <label className="Title_Label Text_Primary">
            {header}
            {/* <span className="assigneeNumber ml-[15px]">{assigneeCount}</span> */}
          </label>
        </div>
        <div className="equipment-group pt-[7px] pb-[1px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            onClick={() => {
              handleDownloadExcel(data, filename);
            }}
          >
            <path
              d="M14.1633 3H12.1633V9H9.16333L13.1633 14L17.1633 9H14.1633V3Z"
              fill="#929CA6"
            />
            <path
              d="M20.8333 18H4.83325V11H2.83325V18C2.83325 19.103 3.73025 20 4.83325 20H20.8333C21.9363 20 22.8333 19.103 22.8333 18V11H20.8333V18Z"
              fill="#929CA6"
            />
          </svg>
        </div>
      </div>
      <div className="divider"></div>
      <div className="equipment-searchbar-ro flex justify-between">
        <div className="">
          <InputText
            type="search"
            placeholder="Search"
            className="equipment-button mt-[13.5px] "
            onChange={(e) => onSearchFilter(e, tabdata)}
          />
        </div>
      </div>
      <div className="">
        <p className="hehe flex items-end justify-end ">Assigned WO</p>
        {data?.length > 0 ? (
          <DataScroller
            value={data}
            itemTemplate={itemTemplate}
            rows={8}
            inline
            scrollHeight="300px"
          />
        ) : (
          <div>No Data found</div>
        )}
      </div>
    </Card>
  );
};

export const itemTemplate = (item: any): ReactNode => {
  const AssetGroupheader = item.ASSETGROUP_NAME ? (
    <div className="equipment-scrollbar-text">{item?.ASSETGROUP_NAME}</div>
  ) : (
    ""
  );
  const AssetTypeHeader = item.ASSETTYPE_NAME ? (
    <>
      <div className="equipment-scrollbar-text1">{item.ASSETTYPE_NAME}</div>
      <div className="equipment-scrollbar-secondaryText">
        {item?.ASSETGROUP_NAME}{" "}
      </div>
    </>
  ) : (
    ""
  );
  const IssueHeader =
    item.ISSUE_DESCRIPTION && item?.ASSETGROUP_NAME ? (
      <>
        <div className="equipment-scrollbar-text1">
          {item.ISSUE_DESCRIPTION}
        </div>
        <div className="equipment-scrollbar-secondaryText">
          {item?.ASSETGROUP_NAME}
        </div>
      </>
    ) : (
      ""
    );
  return (
    <div className="flex justify-between">
      <div className="flex justify-start mb-[8px]">
        {/* <div className={item.type === 'grp' ? "equipment-color" : "equipment-color mt-2"} style={{ background: item.color }}></div> */}
        {AssetTypeHeader !== "" ? (
          <div className="">{AssetTypeHeader}</div>
        ) : IssueHeader !== "" ? (
          <div className="">{IssueHeader}</div>
        ) : AssetGroupheader !== "" ? (
          <div className="">{AssetGroupheader}</div>
        ) : (
          ""
        )}
      </div>
      <div className="">
        <span className="equipment-scrollbar-quantity">{item.COUNT}</span>
      </div>
    </div>
  );
};
export const AssigneeTemplate = (item: any): ReactNode => {
  const initials = item?.ASSIGNEE_NAME?.split(" ")
    .map((name: string) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="flex justify-between">
      <div className="flex justify-start mb-[18px]">
        {/* <div className="flex items-center justify-center w-6 h-6 bg-rose-300 rounded-full"> */}
        <div className="initials">
          <span className="text-white text-xs font-semibold">{initials}</span>
        </div>
        <div>
          <div className="assignee-primaryText">{item.ASSIGNEE_NAME}</div>
          {/* <div className="assignee-secondaryText" >{item.subHeader}</div> */}
        </div>
      </div>
      <div className="">
        <span className="equipment-scrollbar-quantity">{item.COUNT}</span>
      </div>
    </div>
  );
};

export const ReporterTemplate = (item: any): ReactNode => {
  const initials = item?.REPORTER_NAME?.split(" ")
    .map((name: string) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="flex justify-between">
      <div className="flex justify-start mb-[18px]">
        {/* <div className="flex items-center justify-center w-6 h-6 bg-rose-300 rounded-full"> */}
        <div className="report-initials">
          <span className="text-white text-xs font-semibold">{initials}</span>
        </div>
        <div>
          <div className="assignee-primaryText">{item?.REPORTER_NAME}</div>
        </div>
      </div>
      <div className="">
        <span className="equipment-scrollbar-quantity">{item?.COUNT}</span>
      </div>
    </div>
  );
};

interface ResponseTimeCardProps {
  title?: string;
  dateDesc: string;
  value: any;
  optionsList: any[];
  onToggle: (
    e: any,
    key: string,
    setter: React.Dispatch<React.SetStateAction<any>>,
    getDashboardDetails: Function,
    isRectCheck: any,
    checkValue: any
  ) => Promise<void>;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  getDashboardDetails: Function;
  isRectCheck: any;
  checkValue: any;
  avgResponseTime: string | number;
  woCount: string | number;
  chartData: {
    options: any;
    series: any;
  };
  responseData: string;
}

export const ResponseTimeCard: React.FC<ResponseTimeCardProps> = ({
  title = "Response Time",
  dateDesc,
  value,
  optionsList,
  onToggle,
  setValue,
  getDashboardDetails,
  isRectCheck,
  checkValue,
  avgResponseTime,
  woCount,
  chartData,
  responseData,
}) => {
  return (
    <Card>
      <div className="flex justify-between">
        <div>
          <label className="Title_Label Text_Primary">{title}</label>
          <p className="Helper_Text Text_Secondary">{dateDesc}</p>
        </div>

        <div>
          <SelectButton
            value={value}
            onChange={async (e: any) => {
              await onToggle(
                e,
                "Res",
                setValue,
                getDashboardDetails,
                isRectCheck,
                checkValue
              );
            }}
            options={optionsList}
          />
        </div>
      </div>

      <div className="flex mt-3">
        <div className="w-1/2">
          <p className="Helper_Text Text_Secondary">Average Response Time</p>
          <h4 className="Text_Primary">{avgResponseTime}</h4>
        </div>
        <div>
          <p className="Helper_Text Text_Secondary">Total Work Orders</p>
          <h4 className="Text_Primary">{woCount}</h4>
        </div>
      </div>

      <ReactApexChart
        options={chartData?.options}
        series={chartData?.series}
        type="bar"
        height={250}
      />
    </Card>
  );
};
