import { AllowanceType } from "@/types";
import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function Allowances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild<AllowanceType>
      columns={[{ name: "name" }]}
      title="allowances"
      searchParams={searchParams}
    />
  );
}

export default Allowances;
