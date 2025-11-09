import { useEffect, useState } from "react";
import { callPostAPI } from "../../../services/apis";
import { ENDPOINTS } from "../../../utils/APIEndpoints";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "reactstrap";
import { Paginator } from "primereact/paginator";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import DialogBox from "../../../components/DialogBox/DialogBox";
import HierarchyDialog from "../../../components/HierarchyDialog/HierarchyDialog";
import { useForm } from "react-hook-form";
import Field from "../../../components/Field";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/Input/Input";
import SplitButton from "../../../components/SplitButton/SplitButton";
import { downloadInfraScheduleData } from "../../../utils/constants";
import {
  readUploadFile,
  TemplateDownload,
} from "../../../components/TemplateDownload/TemplateDownload";
import { FileUpload } from "primereact/fileupload";
import { PATH } from "../../../utils/pagePath";


const NewInfraScheduleMaster = () => {
  const { t } = useTranslation();
  let { pathname } = useLocation();
  const [selectedFacility, menuList]: any = useOutletContext();
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];
  const filterDefaultValues: any = {
    SCHEDULE_NAME: { value: null, matchMode: FilterMatchMode.CONTAINS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let [tableData, setTableData] = useState<any>();
  const navigate: any = useNavigate();
  const [originalTableData, setOriginalTableData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(filterDefaultValues);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [visibleEquipmentlist, showEquipmentlist] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any | null>([]);
  const [filteredData, setFilteredData] = useState<any | null>(nodes);
  const [assetTreeDetails, setAssetTreeDetails] = useState<any | null>([]);
  const [loading, setLoading] = useState<any | null>(false);
  const [selectedAssetsnodes, setSelectedAssetsnodes] = useState<
    { label: string; asset_id: number }[]
  >([]);
  const [hasAsset, setHasAsset] = useState<any | null>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isfunctionCode, setIsfunctionCode] = useState<boolean>(false);
  const [finalEquipment, setFinalEquipment] = useState<any | null>([]);
  const setDialogVisible = () => {
    setVisible(!visible);
    setIsfunctionCode(false);
  };
  const isUploadData = () => {
    setVisible(true);
    setIsfunctionCode(false);
  };

  const isUploadData_Eqlink = (functioncode: any) => {
    setIsfunctionCode(true);
    setVisible(true);
  };

  const handelDelete = async (selectedData: any) => {
    let payload = {
      SCHEDULE_ID: selectedData?.SCHEDULE_ID,
      PARA: {
        para1: currentMenu?.FUNCTION_DESC,
        para2: "Deleted",
      },
    };

    // return
    try {
      const res = await callPostAPI(
        ENDPOINTS?.DELETE_ASSETTASKANDSCHEDULE,
        payload
      );
      if (res?.FLAG === true) {
        toast.success(res?.MSG);
        setGlobalFilterValue("");
        getAPI();
      } else {
        toast.error(res?.MSG);
        // setGlobalFilterValue("");
        // getAPI();
      }
    } catch (error: any) {
      toast?.error(error);
    }
  };

  const {
    register,
    control,
    setValue,
    formState: { },
  } = useForm({
    defaultValues: {
      REMARKS: "",
      EQUIPMENT_NAME: "",
    },
    mode: "onSubmit",
  });


  const Actionitems = [
    {
      label: "Upload Data",
      icon: "pi pi-upload",
      visible: true,
      command: () => {
        isUploadData();
      },
    },
    {
      label: "Download Template",
      icon: "pi pi-download",
      command: async () => {
        await getExcelTemplate();
      },
    },
    {
      label: "Download Data",
      icon: "pi pi-download",
      visible: true,
      command: () => {
        downloadInfraScheduleData("AS0012", currentMenu?.FUNCTION_DESC);
      },
    },
    {
      label: "Upload Data -Schedule Equipment Link",
      icon: "pi pi-upload",
      visible: true,
      command: () => {
        isUploadData_Eqlink("");
      },
    },


    {
      label: "Download Template-Schedule Equipment Link",
      icon: "pi pi-download",
      command: async () => {
        await getExcelTemplate("AS0012_L");
      },
    },
    {
      label: "Download Data - Schedule Equipment Link",
      icon: "pi pi-download",
      visible: true,
      command: () => {
        downloadInfraScheduleData("AS0012_L", "Schedule Equipment Link");
      },
    },

  ];


  const handleScheduleClick = (rowData: any) => {
    localStorage.setItem("scheduleId", rowData?.SCHEDULE_ID);
    navigate(PATH?.INFRA_SCHEDULE_EDIT, {
      state: {
        scheduleId: rowData.SCHEDULE_ID,
      },
    });
  };
  const handleEquipmentClick = (rowData: any, hasAssets: boolean) => {
    setHasAsset(hasAssets);
    if (
      rowData?.ASSETS !== "" &&
      rowData?.ASSETS !== null &&
      rowData?.ASSETS !== undefined &&
      rowData?.ASSETS?.length > 0
    ) {
      setSelectedAssetsnodes(
        rowData?.ASSETS?.map((asset: any) => ({
          label: asset?.ASSET_NAME,
          asset_id: asset?.ASSET_ID,
        }))
      );
    } else {
      setSelectedAssetsnodes([]);
    }

    setSelectedSchedule(rowData); // optional
    setShowEquipmentDialog(true); // optional
  };
  const removeSelectedItem = (assetId: any) => {
    setSelectedAssetsnodes((prev) =>
      prev.filter((item) => item.asset_id !== assetId)
    );
    setSelectedKey((prev) => prev.filter((id: any) => id !== assetId));
  };

  const visibleEquipment = () => {
    showEquipmentlist(true)
    if (selectedAssetsnodes?.length) {
      setSelectedKey(selectedAssetsnodes?.map((item: any) => item?.asset_id));
    }
  };

  const getExcelTemplate = async (function_code?: any) => {
    try {
      const res = await callPostAPI(
        ENDPOINTS.GETEXCELTEMPLATECOMMON,
        null,
        function_code ?? currentMenu?.FUNCTION_CODE
      );
      if (res) {
      }
      TemplateDownload(
        res?.DATALIST,
        res?.JDATALIST,
        function_code !== "AS0012_L"
          ? currentMenu?.FUNCTION_DESC
          : "Schedule Equipment Link",
        2000
      );
    } catch (error: any) {
      toast.error(error);
    }
  };

  const getAPI = async () => {
    try {
      const res = await callPostAPI(
        ENDPOINTS.GET_ASSET_MASTER_LIST,
        null,
        currentMenu?.FUNCTION_CODE
      );
      localStorage.setItem("currentMenu", JSON.stringify(currentMenu));
      if (res?.FLAG) {
        const parsedData: any = (res?.ASSESTMASTERSLIST || []).map(
          (item: any) => ({
            ...item,
            ASSETS: JSON.parse(item?.ASSETS || "[]"), // parse to array
          })
        );

        if (parsedData) {
          setOriginalTableData(parsedData);
          setTableData(parsedData);
        } else {
          setOriginalTableData([]);
          setTableData([]);
        }
      } else {
        setOriginalTableData([]);
        setTableData([]);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  useEffect(() => {
    if (tableData) {
      setTableData(tableData);
    }
  }, [filters, tableData, globalFilterValue]);
  useEffect(() => {
    if (currentMenu?.FUNCTION_CODE) {
      (async function () {
        await getAPI();
      })();
    }
  }, [selectedFacility, currentMenu]);


  const handleNodeSelection = (node: any) => {
    const newItem = {
      label: node?.label,
      asset_id: node?.asset_id,
    };

    // Check if already selected (prevent duplicates)
    const exists =
      selectedAssetsnodes &&
      selectedAssetsnodes?.some((item) => item?.asset_id === newItem?.asset_id);

    if (!exists) {
      // setSelectedKey(selectedAssetsnodes.map(item => (item.asset_id)));
      setSelectedAssetsnodes((prev) => [...prev, newItem]);
    }
  };

  // new search filter added by anand date 19-08-2025
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    setGlobalFilterValue(value);

    if (!value) {
      setTableData(originalTableData);
      return;
    }

    // Split comma separated values into array
    const searchTerms = value
      ?.split(",")
      ?.map((term: string) => term?.trim().toLowerCase())
      ?.filter((term: string) => term?.length > 0);

    const filteredData = originalTableData?.filter((item: any) => {
      // Match schedule name
      const matchesSchedule = searchTerms?.some((term: any) =>
        item.SCHEDULE_NAME?.toLowerCase()?.includes(term)
      );

      // Match assets
      const matchesAssets = item?.ASSETS?.some((asset: any) =>
        searchTerms?.some(
          (term: any) =>
            asset?.ASSET_NAME?.toLowerCase()?.includes(term) ||
            asset?.ASSET_ID?.toString()?.includes(term)
        )
      );

      return matchesSchedule || matchesAssets;
    });

    setTableData(filteredData);
  };

  const handleSaveEquipment = async () => {
    const payload = {
      MODE: hasAsset ? "E" : "A",
      ASSET_LIST: selectedAssetsnodes?.map((item) => ({
        ASSET_ID: item.asset_id ?? 0,
      })),
      SCHEDULE_ID: selectedSchedule?.SCHEDULE_ID,
      PARA: hasAsset
        ? { para1: `Equipment has been`, para2: t("Updated") }
        : { para1: `Equipment has been`, para2: t("Added") },
    };

    // return
    try {
      const res = await callPostAPI(
        ENDPOINTS?.INFRA_SAVE_SCHEDULE_LIST,
        payload
      );

      if (res?.FLAG === true) {
        setShowEquipmentDialog(false);
        toast.success(res?.MSG);
        setSelectedKey([]);

        getAPI();
      } else {
        toast.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error);
    }
  };

  const handleCancelEquipment = () => {
    setShowEquipmentDialog(false);
    setSelectedAssetsnodes([]);
    setSelectedKey([]);
  };

  return (
    <>
      <Dialog
        // header="Equipment Details"
        visible={showEquipmentDialog}
        onHide={() => handleCancelEquipment()}
        style={{ width: "40vw" }}
        modal
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={handleCancelEquipment}
              style={{
                height: "40px",
                border: "1px solid #E5E4E2",
                padding: "14px 20px",
              }}
            />
            <Button
              label="Save"
              onClick={handleSaveEquipment}
              style={{
                height: "40px",
                border: "1px solid #E5E4E2",
                backgroundColor: "#8e724a",
                color: "white",
                padding: "14px 20px",
              }}
            />
          </div>
        }
      >
        <div className="flex flex-col align-items-center p-2">
          <div className=" pb-6">
            <h6>Equipment Details</h6>
          </div>
          <p className=" pb-6">
            {" "}
            Schedule Name : {selectedSchedule?.SCHEDULE_NAME}
          </p>
          <Field
            controller={{
              name: "EQUIPMENT_NAME",
              control: control,
              render: ({ field }: any) => {
                return (
                  <InputField
                    {...register("EQUIPMENT_NAME", {})}
                    // require={true}
                    label="Equipment"
                    // invalid={errors.EQUIPMENT_NAME}
                    readOnly={true}
                    placeholder={true}
                    setValue={setValue}
                    onClick={visibleEquipment}
                    {...field}
                  />
                );
              },
            }}
          />
        </div>
        <HierarchyDialog
          showEquipmentlist={showEquipmentlist}
          visibleEquipmentlist={visibleEquipmentlist}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          setValue={setValue}
          nodes={nodes}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          setNodes={setNodes}
          assetTreeDetails={assetTreeDetails}
          setAssetTreeDetails={setAssetTreeDetails}
          setSelectedAssetsnodes={setSelectedAssetsnodes}
          selectedAssetsnodes={selectedAssetsnodes}
          handleNodeSelection={handleNodeSelection}
          isCheckbox={true}
          loading={loading}
          setFinalEquipment={setFinalEquipment}
          finalEquipment={finalEquipment}
        />
        {selectedAssetsnodes && selectedAssetsnodes?.length > 0 ? (
          <ul className="p-0 m-0 list-none">
            {selectedAssetsnodes?.map((item, index) => (
              <li
                key={item?.asset_id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>
                  <strong>{index + 1}.</strong> {item?.label}
                </span>
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-text"
                  onClick={() => removeSelectedItem(item?.asset_id)}
                  tooltipOptions={{ position: "left" }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#a08b6dff", paddingLeft: "10px" }}>
            Please select the equipment from the dropdown above to proceed.
          </p>
        )}
      </Dialog>
      <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h6>{currentMenu?.FUNCTION_DESC}</h6>
          <div className="flex flex-wrap gap-2">
            <IconField iconPosition="left" className="w-64">
              <InputText
                type="search"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search"
                className="w-64"
              />
            </IconField>
            <Button
              type="button"
              className="Primary_Button w-20 me-2"
              label={"Add New"}
              icon="pi pi-plus"
              onClick={() => {
                localStorage?.removeItem("schedulePage");
                navigate(PATH.INFRA_SCHEDULE_ADD);
              }}
            />
            <SplitButton
              label={t("Action")}
              className="Primary_SplitButton mr-2"
              model={Actionitems}
            />
          </div>
        </div>
      </Card>

      <DataTable
        value={tableData?.slice(first, first + rows)}
        showGridlines
        emptyMessage={"No Data found."}
        globalFilterFields={["SCHEDULE_NAME", "ASSETS"]}
      >
        <Column
          header="Schedule Name"
          body={(rowData) => (
            <span
              className="text-[#8e724a] cursor-pointer hover:underline"
              onClick={() => handleScheduleClick(rowData)}
            >
              {rowData?.SCHEDULE_NAME}
            </span>
          )}
        />

        <Column
          header="Equipment"
          body={(rowData) => {
            const hasAssets = rowData.ASSETS?.length > 0;
            const assetNames = rowData.ASSETS?.map(
              (asset: any) => asset.ASSET_NAME
            ).join(", ");
            return (
              <div className="flex justify-between items-start">
                <span className="w-4/5">{assetNames ?? "NA"}</span>

                <Button
                  icon={hasAssets ? "pi pi-pencil" : "pi pi-plus"}
                  className="p-button-sm p-button-text ml-2 mt-1 w-1/5"
                  label={hasAssets ? "Edit Equipment" : "Add Equipment"} // optional: remove if you want icons only
                  onClick={() => handleEquipmentClick(rowData, hasAssets)}
                />
              </div>
            );
          }}
        />

        <Column
          key={""}
          className="w-28"
          field={""}
          header={"Action"}
          body={(rowData: any, rowDetails: any) => {
            const rowItem: any = { ...rowData };

            return (
              <>
                <DialogBox
                  data={rowData}
                  handelDelete={async () => {
                    await handelDelete(
                      { ...rowItem },

                    );
                  }}
                />
              </>
            );
          }}
        ></Column>
      </DataTable>
      {tableData?.length > 0 && (
        <div className="mt-3 Text_Secondary Input_label">
          {tableData?.length > 0 && (
            <div className="mt-3 Text_Secondary Input_label">
              {`Showing ${first + 1} - ${tableData?.slice(first, first + rows).length + first
                } of ${tableData?.length}`}
            </div>
          )}
        </div>
      )}
      {tableData?.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={tableData?.length}
          onPageChange={onPageChange}
          currentPageReportTemplate="Items per Page:-"
          rowsPerPageOptions={[15, 25, 50]}
          alwaysShow={true}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        ></Paginator>
      )}

      <Dialog
        header="Bulk Upload"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => setDialogVisible()}
      >
        <div className="bg-regal-red">
          <FileUpload
            mode="basic"
            name="demo[]"
            accept="xlsx/*"
            maxFileSize={1000000}
            className="ml-2 bg-regal-red"
            onSelect={async (e: any) => {
              try {
                const response: any = await readUploadFile(
                  e,
                  isfunctionCode ? "AS0012_L" : currentMenu?.FUNCTION_CODE,
                  setVisible
                );
                if (response?.flag || response?.FLAG) {
                  toast?.success(response?.MSG);
                  await getAPI();
                } else {
                  toast?.error(response?.MSG);
                }
              } catch (error: any) {
                toast?.error(error);
              }
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default NewInfraScheduleMaster;
