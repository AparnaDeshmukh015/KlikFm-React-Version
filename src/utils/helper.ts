import * as xlsx from "xlsx";
import FileSaver from 'file-saver';
import moment from "moment";
import { LOCALSTORAGE } from "./constants";
import saveAs from "file-saver";
const parseDateString = (str: string): Date | null => {
  if (!str) return null;

  // Allowed formats (with and without time)
  const formats = [
    "DD-MM-YYYY HH:mm",
    "DD-MM-YYYY",
    "MM-DD-YYYY HH:mm",
    "MM-DD-YYYY",
    "DD-MMM-YYYY HH:mm",
    "DD-MMM-YYYY"
  ];

  const m = moment(str, formats, true); // strict parsing
  return m.isValid() ? m.toDate() : null;
};
export const ExportCSV = (csvData:any,fileName:any, roleName?:any) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
     const fileExtension = '.xlsx';
     const ws = xlsx.utils.json_to_sheet(csvData);
     const wb = { Sheets: { [roleName]: ws }, SheetNames: [roleName] };
     const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
     const data = new Blob([excelBuffer], { type: fileType });
     FileSaver.saveAs(data, fileName + fileExtension);
  }

  export const helperExportCSV = (csvData: any[], fileName: string) => {
  const facilityData = JSON.parse(((localStorage.getItem(LOCALSTORAGE.FACILITY)))!);
  const facilityDetails: any = facilityData?.length !== 0 ? JSON.parse(
    localStorage.getItem(LOCALSTORAGE.FACILITYID)!
  ) : "";
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  console.log("isclick")
  // 🔹 Detect date-like strings and convert to JS Date
  const convertedData = csvData.map((row) => {
    const newRow: any = {};
    Object.keys(row).forEach((key) => {
      const value = row[key];

      // Check if it's a string and looks like a date
      if (typeof value === "string") {
        const parsed = parseDateString(value);
        newRow[key] = parsed ? parsed : value;
      } else {
        newRow[key] = value;
      }
    });
    return newRow;
  });

  const ws = xlsx.utils.json_to_sheet(convertedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });

  FileSaver.saveAs(data, fileName + fileExtension);
}

  export const base64ToFile = async(base64:any) => {
    const res = await fetch(base64)
    const buf = await res.arrayBuffer()
    var blob = new Blob([buf], {type: 'image/bmp'});
   
    return blob;
  };

  export const handleDownloadExcel = (data: any, fileName: any) => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = xlsx.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

  