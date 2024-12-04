"use client";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import pluralize from "pluralize";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import CheckboxForm from "./checkbox";
import DatePicker from "./date";
import AddMedia from "./image";
import RadioForm from "./radio";
import SelectForm from "./select";

const extractFormValues = (form: FormType) => {
  let result: any = {};
  Object.keys(form).forEach((key) => {
    if (form[key].hasOwnProperty("value")) {
      result[key] = form[key].value;
    }
  });
  return result;
};

export type FormField = {
  value?: any;
  type: string;
  data?: any[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
};

export type FormType = {
  [key: string]: FormField;
};

function CreateFormClient({
  title,
  formState: f,
  edit,
}: {
  title: string;
  formState: string;
  edit?: string;
}) {
  const formState = JSON.parse(f) as FormType;
  const [form, setForm] = useState<FormType>(formState);
  const [pending, setPending] = useState(false);

  const router = useRouter();

  const changeState = (name: keyof typeof form, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("asdfasdf", event.currentTarget);
    const formDataFromEvent = new FormData(event.currentTarget);
    const formDataObject: { [key: string]: any } = {};

    formDataFromEvent.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const combinedFormData = {
      ...extractFormValues(form),
      ...formDataObject,
    };

    await axios.post(`/api/${title}`, combinedFormData);
  };

  return (
    <div className="w-full h-full p-4">
      <form
        onSubmit={handleSubmit}
        className="cart-bg rounded-lg shadow-md h-full max-w-[800px] mx-auto relative"
      >
        <p className="font-bold text-lg capitalize p-4 border-b">
          {edit ? "Updating" : "Creating"}{" "}
          {title === "leaves" ? "leave" : pluralize.singular(title)}
        </p>
        <input
          type="text"
          name="title"
          className="hidden"
          onChange={(e) => console.log(e.target.value)}
          value={title}
        />

        <div className="grid grid-cols-2 gap-4 w-full max-h-[calc(100%-120px)] overflow-y-auto p-4">
          {Object.entries(form).map(([key, value], index) => {
            const placeholder = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, key[0]?.toUpperCase());

            return (
              <div key={index} className="">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={key}
                    className={cn(
                      "block text-xs uppercase",
                      value.value && "font-bold text-green-500"
                    )}
                  >
                    {key}
                  </label>
                  <span className="inactive-text">
                    {value.hint && (
                      <span className="text-xs">( {value.hint} )</span>
                    )}
                  </span>
                </div>
                {value.type === "image" ? (
                  <AddMedia
                    image={value.value}
                    setImage={(image) => changeState(key, image)}
                    title={title}
                  />
                ) : value.type === "date" ? (
                  <DatePicker
                    date={value.value}
                    setDate={(date) => changeState(key, date)}
                  />
                ) : value.type === "checkbox" ? (
                  <CheckboxForm
                    {...value}
                    value={value.value}
                    name={key}
                    placeholder={placeholder}
                    setForm={setForm}
                  />
                ) : value.type === "radio" ? (
                  <RadioForm {...value} name={key} placeholder={placeholder} />
                ) : value.type === "select" ? (
                  <SelectForm
                    changeState={(value) => changeState(key, value)}
                    {...value}
                    name={key}
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    value={
                      typeof value.value === "object"
                        ? value.value?.name
                        : value.value
                    }
                    onChange={(e) => changeState(key, e.target.value)}
                    type={value.type}
                    placeholder={value.placeholder || `Enter ${placeholder}`}
                    required={value.required}
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end space-x-2 mt-2 absolute bottom-0 left-0 right-0 mx-auto p-2 cart-bg border-t rounded-b-md">
          <Button
            onClick={() => router.back()}
            type="reset"
            variant={"outline"}
            className="border-none"
          >
            Cancel
          </Button>
          <Button
            type={pending ? "button" : "submit"}
            className="w-40"
            aria-disabled={pending}
          >
            Create
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span aria-live="polite" className="sr-only" role="status">
              {pending ? "Loading" : "Submit form"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateFormClient;

interface EditFormType {
  form: FormType;
  data: any;
  setForm: Dispatch<SetStateAction<FormType>>;
}

export const onClickEdit = ({ form, data, setForm }: EditFormType) => {
  const fields = Object.keys(form);
  const formData = (prevState: FormType) => {
    return fields.reduce(
      (form, field) => {
        form[field] =
          field === "amount"
            ? { ...prevState[field], value: data[field] }
            : {
                ...prevState[field],
                value:
                  field === "location"
                    ? {
                        latitude: data.location.coordinates?.latitude,
                        longitude: data.location.coordinates?.longitude,
                        radius: data.location.coordinates
                          ? data.location.coordinates.radius
                          : 50,
                      }
                    : field.toLowerCase().includes("date")
                      ? new Date(data[field])
                      : data[field],
              };
        return form;
      },
      { ...prevState }
    );
  };

  setForm(formData);
};
