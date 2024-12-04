import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function Allowances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild title="branches" searchParams={searchParams} />
  );
}

export default Allowances;
