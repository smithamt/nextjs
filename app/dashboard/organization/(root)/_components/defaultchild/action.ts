import { toSkip } from "@/components/table/page";
import * as XLSX from "xlsx";

function removeProperties(data: any[]) {
  return data.map((item) => {
    const newItem = { ...item };
    toSkip.forEach((key) => {
      delete newItem[key];
    });
    return newItem;
  });
}

export async function exportData(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(removeProperties(data));
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "mysheet");
  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return buf;
}
