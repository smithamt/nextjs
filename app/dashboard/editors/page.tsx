import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/data/user";
import { cn } from "@/lib/utils";
import TextEditorModel from "@/models/editors/model";
import Image from "next/image";
import Link from "next/link";

async function Editors() {
  const user = await getUser();
  if (!user) return;
  const editors = await TextEditorModel.find({
    isPublic: true,
    company: user.company,
  }).populate("createdBy", "name profile");

  return (
    <div className="h-screen w-full">
      <div className="flex items-center justify-between p-2">
        <p>Editors</p>
        <Link
          href={"/dashboard/editors/create"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Create
        </Link>
      </div>
      <div className="max-h-full w-full overflow-y-auto grid grid-cols-3 gap-2 p-2">
        {editors.map((editor, index) => {
          return (
            <div
              className="p-2 mb-2 cart-bg rounded-lg shadow-md hover"
              key={index}
            >
              <Link
                className="font-bold"
                href={`/dashboard/editors/${editor._id}`}
              >
                {editor.name}
              </Link>
              <p>{editor.module}</p>
              <Badge>{editor.state}</Badge>
              <div className="flex mt-2">
                <Image
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={
                    editor.createdBy?.profile?.image
                      ? `/api/images/${editor.createdBy.profile?.image}/100/100`
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="@profile"
                />
                <p className="px-2">Created By {editor.createdBy?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Editors;
