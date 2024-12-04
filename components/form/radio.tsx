import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FormField } from "./client";

function RadioForm(props: FormField & { name: string; placeholder: string }) {
  return (
    <RadioGroup
      name={props.name}
      defaultValue="comfortable"
      className="flex mt-1"
    >
      {props.data?.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem
            value={typeof item === "object" ? item._id || item.name : item}
            id={typeof item === "object" ? item._id || item.name : item}
          />
          <Label htmlFor="r1">
            {typeof item === "object" ? item.name : item}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default RadioForm;
