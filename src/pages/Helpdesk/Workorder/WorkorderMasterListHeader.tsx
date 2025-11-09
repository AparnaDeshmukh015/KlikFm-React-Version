import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Buttons from "../../../components/Button/Button";
import {
  isOccupantValidityToday,
  LOCALSTORAGE,
  ROLETYPECODE,
} from "../../../utils/constants";

import { decryptData } from "../../../utils/encryption_decryption";
import { useTranslation } from "react-i18next";
const WorkorderMasterListHeader = ({ getFilterListData, fromDate }: any) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const is_Occupant_Validity = isOccupantValidityToday();
  const [selectedFacility, menuList]: any = useOutletContext();
  const currentMenu = menuList
    ?.flatMap((menu: any) => menu?.DETAIL)
    .filter((detail: any) => detail.URL === pathname)[0];


  const handlerServiceRequest = () => {
    navigate(`/servicerequestlist?add=`);
  };
  return (
    <div className="my-4 flex flex-wrap justify-between items-center">
      <div>
        <h6 className="Text_Primary mr-2">{t(currentMenu?.FUNCTION_DESC)}</h6>
      </div>
      <div>
        <Buttons
          className="Secondary_Button me-2"
          label={"Export"}
          onClick={async () => {
            await getFilterListData(
              { PAGE_NUMBER: 1, PAGE_SIZE: 15 },
              fromDate,
              "EXCEL"
            );
          }}
        />
        {currentMenu?.ADD_RIGHTS === "True" &&
          is_Occupant_Validity === true &&
          decryptData(localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)) ===
          ROLETYPECODE?.OCCUPANT && (
            <Buttons
              className="Primary_Button me-2"
              label={t("Add Service Request")}
              onClick={handlerServiceRequest}
            />
          )}
        {currentMenu?.ADD_RIGHTS === "True" &&
          decryptData(localStorage.getItem(LOCALSTORAGE?.ROLETYPECODE)) !==
          ROLETYPECODE?.OCCUPANT && (
            <Buttons
              className="Primary_Button me-2"
              label={t("Add Service Request")}
              onClick={handlerServiceRequest}
            />
          )}
      </div>
    </div>
  );
};

export default WorkorderMasterListHeader;
