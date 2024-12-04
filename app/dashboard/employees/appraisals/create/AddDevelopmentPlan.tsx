import { usePopup } from "@/app/_context/dialog";
import { Footer } from "@/app/_context/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/constants/app/axios";
import { Dispatch, SetStateAction } from "react";

export function AddDevelopmentPlan({
  updateData,
  setOpen,
  open,
  form,
  setForm,
}: {
  updateData: (data: any) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
}) {
  const setState = (name: keyof typeof form, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const { setPopup } = usePopup();

  async function onsubmit() {
    if (!form.question) return;
    try {
      if (form.edit) {
        const response = await axios.put(
          `/api/developmentplans/${form._id}`,
          form
        );
        updateData({ ...response.data });
        setOpen(false);
        setForm({});
      } else {
        const response = await axios.post(`/api/developmentplans`, form);
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
    <Button
      onClick={() =>
        setPopup({
          title: "Add New Development plan question",
          children: (
            <>
              <div className="space-y-2 p-2">
                <div>
                  <Label htmlFor="question" className="text-right">
                    question
                  </Label>
                  <Input
                    value={form.question}
                    id="question"
                    onChange={(e) => setState("question", e.target.value)}
                    placeholder="Enter question"
                    className="col-span-3 mt-2"
                  />
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
              <Footer onConfirm={onsubmit} />
            </>
          ),
        })
      }
      className="w-full"
      variant="outline"
    >
      + Add Question
    </Button>
  );
}
