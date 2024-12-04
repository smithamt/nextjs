"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpFromDot } from "lucide-react";
import { exportData } from "../app/dashboard/organization/(root)/_components/defaultchild/action";
import { toSkip } from "./table/page";

const skipKeys = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    console.log(key, !toSkip.find((t) => key.includes(t)));
    if (!toSkip.some((t) => key.includes(t))) {
      result[key] = obj[key];
    }
  }
  return result;
};

const flattenObject = (obj: any) => {
  const result: any = {};

  const recurse = (current: any, prop: string) => {
    if (Object(current) !== current) {
      result[prop] = current;
    } else if (Array.isArray(current)) {
      for (let i = 0, len = current.length; i < len; i++) {
        recurse(current[i], `${prop}[${i}]`);
      }
      if (current.length === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (const p in current) {
        isEmpty = false;
        recurse(current[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  };

  recurse(obj, "");
  return result;
};

function ExportBtn({ data, title }: { data: string; title: string }) {
  return (
    <Button
      variant={"outline"}
      onClick={async () => {
        const jsonData = JSON.parse(data) as any[];
        const destureData = jsonData.map((item) => {
          const normaldata = flattenObject(item);
          const filterdata = skipKeys(normaldata);
          return filterdata;
        });

        const buf = await exportData(destureData);
        const blob = new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = title + ".xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }}
      className="w-28"
    >
      Export <ArrowUpFromDot className="w-4 mx-2" />
    </Button>
  );
}

export default ExportBtn;
