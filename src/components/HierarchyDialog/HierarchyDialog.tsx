import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callPostAPI } from "../../services/apis";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../utils/APIEndpoints";
import "./HierarchyDialog.css";
import LoaderFileUpload from "../Loader/LoaderFileUpload";
import { useLocation, useOutletContext } from "react-router-dom";
import LocationHierarchyDialog from "./LocationHierarchyDialog";
import { LOCALSTORAGE } from "../../utils/constants";
import LoaderShow from "../Loader/LoaderShow";
import { Checkbox } from "primereact/checkbox";
import { node } from "@sentry/core";
import { set } from "date-fns";

const folder = (
  <>
    <i className="pi pi-angle-down tree-icon tree-arrow-icon" />
    <i className="pi pi-folder folder-image tree-icon" />
  </>
);

const openFolder = (
  <>
    <i className="pi pi-angle-right tree-icon tree-arrow-icon" />
    <i className="pi pi-folder-open folder-image tree-icon" />
  </>
);
const openFolderarrowDown = (
  <>
    <i className="pi pi-angle-down tree-icon tree-arrow-icon" />
    <i className="pi pi-folder-open folder-image tree-icon" />
  </>
);

const equipment = <i className="pi pi-wrench folder-image tree-icon" />;

const TreeNode = ({
  node,
  level = 0,
  onNodeClick,
  selectedKey,
  expandedKeys,
  toggleExpand,
  setSelectedEquipment,
  setSelectedKey,
  setSelectedAssetsnodes,
  isCheckbox,
  seselectedassetid,
  selectedAssetsnodes,
  setselectedapplynoodes,

}: any) => {
  const isExpanded = expandedKeys[node.key];
  const hasChildren = node.children && node.children.length > 0;

  const isChecked = useMemo(() => {
    return Array.isArray(selectedKey)
      ? selectedKey.includes(node?.asset_id)
      : false;
  }, [selectedKey, node?.asset_id]);

  const handleCheckboxChange = useCallback(
    (e: any, node: any) => {
      e?.preventDefault();
      const isChecked = e?.checked;
      if (isChecked) {
        setSelectedKey((prev: any) => [...prev, node?.asset_id]);

      } else {
        setSelectedKey((prev: any) =>
          prev?.filter((id: any) => id !== node?.asset_id)
        );



      }
    },
    []
  );

  // const handleCheckboxChange = useCallback((e: any, node: any) => {
  //   const isChecked = e.checked;

  //   setSelectedKey((prev: any[]) => {
  //     if (isChecked) {
  //       return [...prev, node.asset_id]; // duplicates? depends if you care
  //     } else {
  //       return prev.filter((id) => id !== node.asset_id);
  //     }
  //   });
  // }, [node, selectedKey]);
  return (
    <div className="tree-node">
      <div
        className={`tree-node-header ${selectedKey === node.key ? "node-tree-node-header-default" : ""
          }`}
        onClick={() => {
          if (node.isAsset === 1) {
            onNodeClick(node);
          } else {
            toggleExpand(node.key);
          }
        }}
      >
        {hasChildren ? (
          isExpanded ? (
            <>{openFolderarrowDown}</>
          ) : (
            <>{openFolder}</>
          )
        ) : (
          <>{node.isAsset === 1 ? <>{equipment}</> : <>{openFolder}</>}</>
        )}
        <div className="hierarchy-label">
          {node.isAsset === 1 && isCheckbox && (
            // <Checkbox
            //   inputId={node?.asset_id}
            //   checked={isChecked}
            //   onChange={handleCheckboxChange}
            //   className="tree-checkbox"
            // />
            <Checkbox
              inputId={node?.asset_id}
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e, node)} // 👈 pass node
              className="tree-checkbox"
            />
          )}{" "}
          {node.label}{" "}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {node.children.map((child: any) => (
            <TreeNode
              key={child.key}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              selectedKey={selectedKey}
              expandedKeys={expandedKeys}
              toggleExpand={toggleExpand}
              setSelectedEquipment={setSelectedEquipment}
              setSelectedKey={setSelectedKey}
              seselectedassetid={seselectedassetid}
              selectedAssetsnodes={selectedAssetsnodes}
              setSelectedAssetsnodes={setSelectedAssetsnodes}

              isCheckbox={isCheckbox}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyDialog = ({
  visibleEquipmentlist,
  showEquipmentlist,
  selectedKey,
  setSelectedKey,
  setValue,
  nodes,
  filteredData,
  setFilteredData,
  setNodes,
  assetTreeDetails,
  setAssetTreeDetails,
  onNodeClick,
  hierachyFirstDate,
  hierachyLastDate,
  setselectedNodeKey,
  handleNodeSelection,
  isCheckbox,
  seselectedassetid,
  setSelectedAssetsnodes,
  selectedAssetsnodes,
  setFinalEquipment,
  finalEquipment,

}: any) => {
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState("");
  const [nodecollapse, setnodecollapse] = useState<boolean>(false);
  const [expandLoader, setExpandLoader] = useState<boolean>(false);
  const [filterText, setFilterText] = useState("");
  const [locationName, setLocationName] = useState<any | null>(null);
  const [selectedFacility, menuList]: any = useOutletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [locationNode, setLocationNode] = useState<any | null>([]);
  const [locationDialog, setLocationDialog] = useState<boolean>(false);
  // const [assetTreeDetails, setAssetTreeDetails] = useState<any | null>([]);
  const [locationFilteredData, setLocationFilteredData] = useState<any[]>([]);
  const [locationResetStatus, setLocationResetStatus] = useState<any>(false);
  const [locNodes, setLocNodes] = useState<any[]>([]);
  const [filterLocData, setFilterLocData] = useState<any[]>([]);
  const [selectedapplynoodes, setselectedapplynoodes] =
    useState<any[]>(selectedAssetsnodes);
  const [expandedKeys, setExpandedKeys] = useState<any | null>({
    "0": true,
    "0-0": true,
  });

  const [LOCATIONID, setLOCATIONID] = useState<any | null>([]);
  const [selectedlocationCount, setselectedlocationCount] = useState<any>();
  const toggleSwitch = [
    { id: 1, label: "By Equipment", isEqp: true },
    { id: 2, label: "By Location", isLcn: true }
  ];
  const [active, setActive] = useState(toggleSwitch[0].id);
  const filterNodes = (nodes: any, query: any) => {
    return nodes
      .map((node: any) => {
        if (node.label.toLowerCase().includes(query.toLowerCase())) {
          return node;
        }
        if (node.children) {
          const filteredChildren = filterNodes(node.children, query);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
        }
        return null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (selectedAssetsnodes?.length) {
      setselectedapplynoodes(selectedAssetsnodes);
    }
  }, [selectedAssetsnodes]);

  const findKey = (data: any, targetKey: any) => {
    if (data.key === targetKey) {
      return data;
    }

    if (data.children) {
      for (let child of data.children) {
        const result: any = findKey(child, targetKey);
        if (result) {
          return result;
        }
      }
    }

    return;
  };

  const setSelectedEquipment = (e: any, value: any, nodeData?: any) => {
    const targetKey = value;
    const nodeFromFilteredData: any = findRootNode(filteredData, targetKey);
    const result = findKey(nodeFromFilteredData, targetKey);
    if (result) {
      setSelectedEquipmentKey(""); // Reset first to trigger change
      setTimeout(() => {
        setSelectedEquipmentKey(result?.label);
        setValue("EQUIPMENT_NAME", result?.label);
        if (result?.isAsset === 1) {
          getAssetDetailsList(result?.asset_id);
          showEquipmentlist(false);
        }
      }, 0);
    }
  };
  const findNodeByKey = (nodes: any, key: any) => {
    for (let node of nodes) {
      if (node.key === key) {
        return node;
      }
      // Recursively check the children
      if (node.children && node.children.length > 0) {
        const foundNode: any = findNodeByKey(node.children, key);
        if (foundNode) return foundNode;
      }
    }
    return null; // If no node is found
  };

  const findParent: any = (nodes: any, key: any) => {
    for (let node of nodes) {
      if (
        node.children &&
        node.children.some((child: any) => child.key === key)
      ) {
        return node;
      }

      if (node.children && node.children.length > 0) {
        const parentNode = findParent(node.children, key);
        if (parentNode) return parentNode;
      }
    }
    return null; // If no parent is found
  };

  const findRootNode = (nodes: any, key: any) => {
    let currentNode: any = findNodeByKey(nodes, key);
    while (currentNode) {
      const parent: any = findParent(nodes, currentNode.key);
      if (!parent) {
        return currentNode;
      }
      currentNode = parent;
    }
    return null;
  };
  // const expandAll = () => {
  //   debugger;
  //   console.log("Expanding all nodes");
  //   setExpandLoader(true);
  //   // setTimeout(() => {
  //   const keys: Record<string, boolean> = {};
  //   const stack = [...filteredData]; // Start with top-level nodes

  //   while (stack.length > 0) {
  //     const node = stack.pop();
  //     if (!node) continue;

  //     keys[node.key] = true; // Mark as expanded

  //     if (node.children) {
  //       stack.push(...node.children); // Process children iteratively
  //     }
  //   }

  //   setExpandedKeys(keys);
  //   setnodecollapse(true);
  //   setExpandLoader(false);
  //   // }, 1);
  // };
  const expandAll = () => {

    setExpandLoader(true);

    const keys: Record<string, boolean> = {};
    // use full dataset instead of filteredData
    const stack = [...(filteredData?.length > 0 ? filteredData : nodes)];

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node) continue;

      keys[node.key] = true; // expand this node

      if (node.children) {
        stack.push(...node.children);
      }
    }

    setExpandedKeys(keys);
    setnodecollapse(true);
    setExpandLoader(false);
  };
  const collapseAll = () => {
    setExpandedKeys({});
    setnodecollapse(false);
  };

  const applySelectedNodes = () => {
    const selectedNodes =
      selectedapplynoodes?.filter((node: any) =>
        selectedKey?.includes(node?.asset_id)
      ) ?? [];

    setSelectedAssetsnodes(
      (prev: any[]) =>
        // Keep only items that are still selected
        selectedNodes
    );
    setFinalEquipment(
      (prev: any[]) =>
        // Keep only items that are still selected
        selectedNodes
    );
    setFilterText("");
    showEquipmentlist(false);
  };

  const getAssetDetailsList = async (assetid: any) => {
    try {
      const payload = {
        ASSET_ID: assetid ?? 0,
      };
      const res = await callPostAPI(ENDPOINTS.GET_INFRA_ASSET_DETAILS, payload);
      if (res?.FLAG === 1) {
        setFilterText("");
        setActive(toggleSwitch[0].id);
        setAssetTreeDetails(res?.ASSETDETAILSLIST);

      } else {
        toast?.error(res?.MSG);
      }
    } catch (error: any) {
      toast?.error(error.message);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNodeClickCombined = async (node: any) => {
    if (node?.isAsset === 1) {
      if (seselectedassetid) {
        seselectedassetid(node?.asset_id);
      }

      if (handleNodeSelection) {
        setselectedapplynoodes((prev) => {
          if (!Array.isArray(prev)) prev = [];

          const alreadySelected = prev?.some(
            (item) => item?.asset_id === node?.asset_id
          );

          if (!alreadySelected) {
            return [...prev, node];
          }
          return prev;
        });
        setValue("EQUIPMENT_NAME", "");
      } else {
        setValue("EQUIPMENT_NAME", node.label);
        showEquipmentlist(false);
      }

      setSelectedEquipmentKey(node.label);
      if (!isCheckbox) {
        await getAssetDetailsList(node.asset_id);
      }

    } else {
      toast.error("Please select an equipment item, not a folder.");
    }

    // 2. Then, call the parent's handler (if provided)
    if (onNodeClick) {
      onNodeClick({ node });
    }
  };


  const filterTree = useCallback(
    (nodeList: any[], PATHs?: any) => {

      return nodeList
        ?.map((node: any) => {
          const currentPath = PATHs ? `${PATHs} > ${node.label}` : node.label;

          const children: any = node?.children
            ? filterTree(node.children, currentPath)
            : [];

          const normalizedPath = currentPath
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

          const normalizedFilter = filterText
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

          const isMatch = normalizedPath.includes(normalizedFilter);

          // debugger
          if (children?.length > 0) {

            setnodecollapse(true)
            return {
              ...node,
              children,
              expanded: true,
            };

          } else {
            if (isMatch) {

              return {
                ...node,
                children: [],
                expanded: true,
              };
            }
          }
          return null;
        })
        .filter(Boolean);
    },
    [filterText]
  ); // Only recreate when filterText changes

  useEffect(() => {
    // if (!nodes) return;

    if (filterText?.trim()) {

      const filtered = filterTree(nodes, "");
      setFilteredData(filtered);
      expandAll();
    } else {
      setFilteredData(nodes);
      setExpandedKeys({});
      setnodecollapse(false);

    }
  }, [filterText, nodes, setFilteredData, filterTree]);

  const { pathname } = useLocation();

  // const getEquimentHierarchy = useCallback(
  //   async (locationData?: any) => {
  //     debugger
  //     try {
  //       const payload = {
  //         LOCATION_LIST: locationData ?? [],
  //         ASSET_EQUIPMENT_ID: 0,
  //         START_DATE: pathname === "/ppmSchedule" ? hierachyFirstDate : "",
  //         END_DATE: pathname === "/ppmSchedule" ? hierachyLastDate : "",
  //         FUNCTION_CODE:
  //           pathname === "/ppmSchedule"
  //             ? "MS002"
  //             : pathname === "/servicerequestlist"
  //               ? "HD004"
  //               : "AS0012",
  //       };
  //       setLoading(true);

  //       const res = await callPostAPI(
  //         ENDPOINTS.Location_Hierarchy_List,
  //         payload
  //       );
  //       const res1 = await callPostAPI(
  //         ENDPOINTS.LOCATION_EQUIPMENT_HIERARCHY_LIST,
  //         {}
  //       );
  //       if (res1?.FLAG === 1) {
  //         console.log(res1?.LOCATIONHIERARCHYLIST, "res1111")
  //         setLocNodes(res1?.LOCATIONHIERARCHYLIST);
  //         setFilterLocData(res1?.LOCATIONHIERARCHYLIST);
  //       } else {
  //         toast?.error(res1?.MSG);
  //       }
  //       // console.log(res1?.LOCATIONHIERARCHYLIST, "res1")
  //       setLoading(false);
  //       if (res?.FLAG === 1) {
  //         console.log(res, "2222222")
  //         setNodes(res?.EQUIPMENTHIERARCHYLIST);
  //         setFilteredData(res?.EQUIPMENTHIERARCHYLIST);
  //       } else {
  //         toast?.error(res?.MSG);
  //         setFilteredData([]);
  //       }
  //     } catch (error: any) {
  //       toast?.error(error.message);
  //       setLoading(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [setNodes, setFilteredData, hierachyFirstDate, hierachyLastDate]
  // );

  //new api calling added by anand 25/08/2025

  const getEquimentHierarchy = useCallback(
    async (locationData?: any) => {
      setExpandLoader(true);
      try {
        // --- First API ---
        const payload = {
          LOCATION_LIST: locationData ?? [],
          ASSET_EQUIPMENT_ID: 0,
          START_DATE: pathname === "/ppmSchedule" ? hierachyFirstDate : "",
          END_DATE: pathname === "/ppmSchedule" ? hierachyLastDate : "",
          FUNCTION_CODE:
            pathname === "/ppmSchedule"
              ? "MS002"
              : pathname === "/servicerequestlist"
                ? "HD004"
                : "AS0012",
        };

        const res = await callPostAPI(ENDPOINTS.Location_Hierarchy_List, payload);

        if (res?.FLAG === 1) {
          setNodes(res?.EQUIPMENTHIERARCHYLIST);
          setFilteredData(res?.EQUIPMENTHIERARCHYLIST);
        } else {
          toast?.error(res?.MSG);
          setFilteredData([]);
        }

        // --- Second API (independent try-catch) ---

      } catch (error: any) {
        toast?.error(error.message);
        setFilteredData([]);
      } finally {
        setExpandLoader(false)
      }
    },
    [setNodes, setFilteredData, hierachyFirstDate, hierachyLastDate]
  );

  const ByLocationEquipment = async () => {
    // setActive()
    setExpandLoader(true)
    try {
      const res1 = await callPostAPI(
        ENDPOINTS.LOCATION_EQUIPMENT_HIERARCHY_LIST,
        {}
      );
      if (res1?.FLAG === 1) {
        setNodes(res1?.LOCATIONHIERARCHYLIST);
        setFilteredData(res1?.LOCATIONHIERARCHYLIST);
      } else {
        setFilteredData([]);
        setExpandLoader(false)
        toast?.error(res1?.MSG);
      }
    } catch (err: any) {
      toast?.error(err.message);
    } finally {
      setExpandLoader(false)
    }
  }

  const getLocation = async () => {
    let Currentfacility = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.FACILITY)!
    );
    let filterFacility: any = Currentfacility.filter(
      (f: any) => f?.FACILITY_ID === selectedFacility?.FACILITY_ID
    );
    const payload: any = {
      LOCATION_ID: filterFacility[0]?.LOCATION_ID,
      ISLOCATIONFILTERFLAG: 1,
    };

    const res = await callPostAPI(ENDPOINTS?.GETHIRARCHY_LIST, payload);
    if (res?.FLAG === 1) {
      setLocationNode(res?.LOCATIONHIERARCHYLIST);
    }
  };

  useEffect(() => {
    if (typeof locationName === "string" && locationName.trim() !== "") {
      const locationCount: string[] = locationName
        .split(",")
        .map((item) => item?.trim());
      setselectedlocationCount(locationCount);
    } else {
      setselectedlocationCount([]); // clear it when locationName is empty or invalid
    }
  }, [locationName]);

  const handleLocationFilter = (locationData: any, locationList?: any) => {
    setLOCATIONID(locationList);
    getEquimentHierarchy(locationData);
  };


  useEffect(() => {
    setLocationDialog(false);
    if (visibleEquipmentlist === true) {
      if (locationName === null) {
        getLocation();
        getEquimentHierarchy();
      }
      if (isCheckbox === true) {
        // finalEquipment
      }

      // getLocation();
    }
  }, [
    visibleEquipmentlist,
    getEquimentHierarchy,
    hierachyFirstDate,
    hierachyLastDate,
  ]);

  return (
    <>
      {" "}
      {loading ? (
        <LoaderShow />
      ) : (
        <Dialog
          visible={visibleEquipmentlist}
          style={{ width: "60vw", height: "720px" }}
          // style={{ width: "50vw", height: "80vh" }}
          className="dialogBoxTreeStyle bg-white"
          dismissableMask
          closable={false}
          onHide={() => {
            if (Array.isArray(selectedKey)) {
              setSelectedKey([]);
            }
          }}
          draggable={false}
          resizable={false}
          contentStyle={{
            overflow: "hidden",
            padding: "0", // Remove default padding if needed
          }}
        >
          <div
            className="serviceEquipment bg-white p-4"
            style={{ maxHeight: "750px" }}
          >
            <div
              className={pathname !== "/servicerequestlist" ? `px-2 pb-4 flex w-full gap-3 justify-end` : 'px-2 pb-4 flex w-full gap-3 justify-between'}
            >
              {pathname === "/servicerequestlist" && (
                <div>
                  <div className="flex w-fit rounded-[32px] bg-[#EFF1F5]  border border-gray-300 overflow-hidden">
                    {toggleSwitch.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActive(item.id)
                          if (item.id === 1) {
                            getEquimentHierarchy();
                          } else {
                            ByLocationEquipment();
                          }
                        }}
                        className={`px-4 py-2 text-sm font-medium transition-all  rounded-[32px]
            ${active === item.id
                            ? "bg-[#8e724a] text-white"
                            : "bg-[#EFF1F5] text-gray-700 rounded-[32px]"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}

                  </div>
                  {/* <InputText
                    placeholder="Search Location"
                    value={
                      !selectedlocationCount ||
                        selectedlocationCount?.length === 0
                        ? ""
                        : selectedlocationCount?.length >= 2
                          ? `${selectedlocationCount?.length} items selected`
                          : locationName
                    }
                    onClick={(e: any) => setLocationDialog(true)}
                    readOnly
                    className="width-1/5"
                  /> */}
                  {/* <LocationHierarchyDialog
                    showEquipmentlist={setLocationDialog}
                    visibleEquipmentlist={locationDialog}
                    selectedKey={selectedKey}
                    setSelectedKey={setSelectedKey}
                    nodes={locationNode}
                    locationFilteredData={locationFilteredData}
                    setLocationFilteredData={setLocationFilteredData}
                    setNodes={setLocationNode}
                    setValue={setValue}
                    // getDashboardDetails={getDashboardDetails}
                    setLocationName={setLocationName}
                    handleLocationFilter={handleLocationFilter}
                    locationResetStatus={locationResetStatus}
                    setLocationResetStatus={setLocationResetStatus}
                    LOCATIONID={LOCATIONID}
                    locationUrl={"/servicerequestlist?add="}
                    setLOCATIONID={setLOCATIONID}
                  /> */}
                </div>

              )}
              {
                <div>
                  <Button
                    onClick={() => {
                      showEquipmentlist(false);
                      setSelectedKey([])
                      setselectedapplynoodes([])
                      setFilterText("")
                      setActive(toggleSwitch[0].id)
                    }}
                  >
                    <i className="pi pi-times x-button"></i>
                  </Button>
                </div>
              }
            </div>
            <div className="px-2 pb-4 flex w-full gap-3 justify-between">
              <div className="w-4/5">
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText
                    type="search"
                    value={filterText}
                    onChange={(e) =>
                      setFilterText(e?.target?.value?.trimStart())
                    }
                    placeholder="Search Equipment"
                  />
                </IconField>
              </div>

              <div className="gap-3 flex hehe">
                <Button
                  type="button"
                  className="Secondary_Button hierarchy-button"
                  label={nodecollapse ? "Collapse All" : "Expand All"}
                  onClick={nodecollapse ? collapseAll : expandAll}
                />

              </div>
            </div>

            {expandLoader ? (
              <>
                <LoaderShow />
              </>
            ) : (
              <div
                className="serviceHeirarchy relative"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {(filteredData?.length > 0) ? (
                  <>
                    {(filteredData)?.map((node: any) => (
                      <TreeNode
                        key={node.key}
                        node={node}
                        onNodeClick={handleNodeClickCombined}
                        selectedKey={selectedKey}
                        expandedKeys={expandedKeys}
                        toggleExpand={toggleExpand}
                        setSelectedEquipment={setSelectedEquipment}
                        setSelectedKey={setSelectedKey}
                        isCheckbox={isCheckbox}
                        setSelectedAssetsnodes={setSelectedAssetsnodes}
                        selectedAssetsnodes={selectedAssetsnodes}

                      />
                    ))}
                  </>
                ) : (
                  <p>No Data Found</p>
                )}
              </div>
            )}
            {/* {isCheckbox && selectedKey?.length > 0 && (
              <div className="flex justify-end pr-[77px]  pt-[59px] ">
                <div className="">
                  <a
                    className="status-subheading cursor-pointer"
                    // onClick={() => clearSelection()}
                  >
                    Clear Selection
                  </a>
                </div>
                <Button
                  type="button"
                  className="Primary_Button"
                  label="Apply"
                  onClick={applySelectedNodes}
                />
              </div>
            )} */}
            {isCheckbox && (
              <div className="absolute bottom-0 left-0 right-0 bg-white py-4 px-4 border-t border-gray-200 rounded-b-lg flex justify-between items-center">
                <div className="pl-4">
                  {" "}
                  {/* Left-aligned Clear Selection */}
                  <a
                    className="status-subheading cursor-pointer text-[#8e724a] "
                    onClick={() => {
                      setSelectedKey([]);
                    }}
                  >
                    Clear Selection
                  </a>
                </div>
                <div className="pr-4">
                  {" "}
                  {/* Right-aligned Apply button */}
                  <Button
                    type="button"
                    className="Primary_Button"
                    label="Apply"
                    onClick={applySelectedNodes}
                  />
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
};

export default HierarchyDialog;
