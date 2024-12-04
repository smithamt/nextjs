import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import ShowNoText from "../app/nodata";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormField, FormType } from "./client";

function CheckboxForm(
  props: FormField & {
    name: string;
    setForm: Dispatch<SetStateAction<FormType>>;
  }
) {
  const [query, setQuery] = useState("");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = event.target;
    props.setForm((prevState: any) => {
      const exist = prevState[name]?.value || [];
      console.log("checkd", name, checked, value, exist);

      const updatedCheckboxes = checked
        ? [...exist, value]
        : exist.filter(
            (r: any) => (typeof r === "object" ? r._id || r.name : r) !== value
          );

      return {
        ...prevState,
        [name]: { ...prevState[name], value: updatedCheckboxes },
      };
    });
  };

  const filterData = query
    ? (props.data ? props.data : []).filter((item) =>
        (typeof item === "object" ? item.name : item)
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : props.data
      ? props.data
      : [];

  return (
    <Popover onOpenChange={(open) => !open && setQuery("")}>
      <PopoverTrigger className="flex mt-1 w-full items-center justify-between p-2 rounded-lg cart-bg border hover">
        {props.placeholder}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="p-1 max-h-[400px] overflow-y-auto min-w-full">
        <p className="p-2 font-semibold">Choose {props.placeholder}</p>
        <Input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${props.placeholder}`}
        />
        <div className="hover flex items-center p-2 px-4 cursor-pointer">
          <input
            className="rounded-full w-[18px] h-[18px]"
            onChange={handleCheckboxChange}
            type="checkbox"
            checked={props.value?.includes("All")}
            value={"All"}
            id={"All"}
            name={props.name}
          />
          <Label className="px-4 w-full py-2 font-semibold" htmlFor={"All"}>
            All
          </Label>
        </div>
        {filterData.length <= 0 && <ShowNoText>No Data Found</ShowNoText>}
        {filterData?.map((item, index) => (
          <div
            key={index}
            className="hover flex items-center p-2 px-4 cursor-pointer"
          >
            <input
              onChange={handleCheckboxChange}
              className="rounded-full w-[18px] h-[18px]"
              type="checkbox"
              checked={
                props.value?.includes("All") ||
                props.value?.includes(
                  typeof item === "object" ? item._id || item.name : item
                )
              }
              value={typeof item === "object" ? item._id || item.name : item}
              id={typeof item === "object" ? item._id || item.name : item}
              name={props.name}
            />
            <Label
              className="py-2 w-full px-4"
              htmlFor={typeof item === "object" ? item._id || item.name : item}
            >
              {typeof item === "object" ? item.name : item}
            </Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default CheckboxForm;
