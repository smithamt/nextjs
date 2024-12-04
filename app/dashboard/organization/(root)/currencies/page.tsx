import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function Allowances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <DefaultOrganizationChild title="currencies"  searchParams={searchParams} />;
}

export default Allowances;
