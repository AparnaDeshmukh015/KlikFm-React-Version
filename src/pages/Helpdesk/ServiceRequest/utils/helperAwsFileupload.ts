import { toast } from "react-toastify";
import { ENDPOINTS } from "../../../../utils/APIEndpoints";
import { COOKIES, isAws } from "../../../../utils/constants";
import { decryptData } from "../../../../utils/encryption_decryption";
import { callPostAPI } from "../../../../services/apis";

export const helperAwsFileupload = async (DOC_LIST: any) => {
  const formData = new FormData();
  const refreshTok: any = decryptData((localStorage.getItem(COOKIES.ACCESS_TOKEN)));
  for (let i = 0; i < DOC_LIST.length; i++) {
    if(DOC_LIST[i]?.doc_file !== undefined){
    const original = DOC_LIST[i].DOC_DATA;
    const renamedFile = new File(
      [original],
      DOC_LIST[i].DOC_SYS_NAME, 
      { type: original.type }
    );
     console.log("renamedFile", renamedFile);
    formData.append("files", renamedFile);
  }
  }
  if (!DOC_LIST?.some((doc:any) => doc?.doc_file)) {
        return; 
  }
  const responseImage = await fetch(`${process.env.REACT_APP_BASE_URL}${ENDPOINTS?.Image__Upload}`, {
    method: "POST",
    body: formData,
  headers :{
      'Authorization': `Bearer ${refreshTok}`,
      }
  });

    if (responseImage.ok) {
      // toast.success("Files uploaded successfully!");
    } else {
      toast.error("Upload failed");
    }
}    


export const helperGetWorkOrderAwsDoclist = async (WO_ID: any, currentMenu: any) => {
 
      const res = await callPostAPI(
        ENDPOINTS.GET_DOCLIST,
        {
          WO_ID: WO_ID,
           ISAWS:isAws === true ?true:false
        },
        currentMenu?.FUNCTION_CODE
      );
      return res;

}

export const helperDeleteFileAws = async (WO_ID: any,WO_NO:any, docCancel:any  ) => {
  const deletePayload: any = {
              WO_ID: WO_ID,
              WO_NO: WO_NO,
              DOC_SYS_NAME_LIST: docCancel,
              ISAWS:isAws === true ?true:false
            };
            const resDelete = await callPostAPI(
              ENDPOINTS.Deleted_Image,
              deletePayload,
              "HD004"
            );
}