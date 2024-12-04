import { usePopup } from "@/app/_context/dialog";
import { Footer } from "@/app/_context/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/constants/app/axios";
import { EvaluationType } from "@/types";
import { Dispatch, SetStateAction } from "react";

export function AddEvaluation({
  updateData,
  setOpen,
  open,
  form,
  setForm,
}: {
  updateData: (data: any) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  form: EvaluationType & { edit: boolean };
  setForm: Dispatch<SetStateAction<any>>;
}) {
  const setState = (name: keyof typeof form, value: any) => {
    setForm((prev: EvaluationType & { edit: boolean }) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { setPopup } = usePopup();

  async function onsubmit() {
    if (!form.name) return;
    try {
      if (form.edit) {
        const response = await axios.put(`/api/evaluations/${form._id}`, form);
        updateData({ ...response.data });
        setOpen(false);
        setForm({});
      } else {
        const response = await axios.post(`/api/evaluations`, form);
        updateData({ ...response.data, new: true });
        setOpen(false);
        setForm({});
      }
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  }

  // Make changes evaluations here. Click save when you're done.

  return (
    <>
      <Button
        onClick={() =>
          setPopup({
            title: "Add New Evaluation",
            children: (
              <>
                <div className="space-y-2 p-2">
                  <div className="">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      value={form.name}
                      id="name"
                      onChange={(e) => setState("name", e.target.value)}
                      placeholder="Enter name"
                      className="col-span-3 mt-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select
                      onValueChange={(value) => setState("skillType", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            form.skillType ? form.skillType : "Skill type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="people">People Skills</SelectItem>
                        <SelectItem value="job">Job Skills</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        setState("appraisalType", value)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            form.appraisalType
                              ? form.appraisalType
                              : "Appraisal type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="probation-end">
                          Probation End
                        </SelectItem>
                        <SelectItem value="year-end">Year End</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => setState("levelType", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            form.levelType ? form.levelType : "Level type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="manager">Manager level</SelectItem>
                        <SelectItem value="staff">For Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      value={form.description}
                      id="description"
                      onChange={(e) => setState("description", e.target.value)}
                      placeholder="Enter description for this name"
                      className="col-span-3 mt-2"
                    />
                  </div>
                </div>
                <Footer onConfirm={onsubmit} />{" "}
              </>
            ),
          })
        }
        className="w-full"
        variant="outline"
      >
        + Add Evaluation
      </Button>
    </>
  );
}
