import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Ellipsis, Trash2 } from "lucide-react";

function PlannerMenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-10 h-10 p-0 rounded-full cart-bg border center">
        <Ellipsis className="w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-[220px]">
        <DropdownMenuItem className="p-2">
          <Check className="w-4" />
          <span className="px-2 whitespace-nowrap">Mark as read</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2">
          <Trash2 className="w-4" />
          <span className="px-2 whitespace-nowrap">
            Delete this notification
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PlannerMenuButton;
