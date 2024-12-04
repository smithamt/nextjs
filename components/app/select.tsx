import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo({
  placeholder,
  title,
  setData,
  data,
  value,
}: {
  data: { _id: string; name: string }[];
  title: string;
  setData: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const selected = data.find((d) => d._id === value);
  return (
    <Select value={value} onValueChange={setData}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={selected?.name || placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {data.map((i, k) => (
            <SelectItem value={i._id} key={k}>
              {i.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
