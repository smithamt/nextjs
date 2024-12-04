import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "./client";
import { useState } from "react";
import { Input } from "../ui/input";

function SelectForm(
  props: FormField & { name: string; changeState: (value: any) => void }
) {
  const [query, setQuery] = useState("");
  const filterData =
    query && props.data
      ? props.data.filter((d) =>
          typeof d === "object"
            ? d.name.toLowerCase().includes(query.toLowerCase())
            : d.toLowerCase().includes(query.toLowerCase())
        )
      : props.data;

  return (
    <Select
      name={props.name}
      required={props.required}
      onValueChange={(value) => props.changeState(value)}
    >
      <SelectTrigger className="w-full mt-1 capitalize">
        <SelectValue
          placeholder={props.value || `Select a ${props.placeholder}`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.placeholder}</SelectLabel>
          {props.data && props.data.length > 10 && (
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="my-2"
            />
          )}
          {filterData?.map((data, index) => (
            <SelectItem
              className="py-2 capitalize"
              key={index}
              value={typeof data === "object" ? data._id || data.name : data}
            >
              {typeof data === "object" ? data.name : data}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectForm;
