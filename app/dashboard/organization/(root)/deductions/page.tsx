import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function OrganizationDeductions({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <DefaultOrganizationChild title="deductions"  searchParams={searchParams} />;
}

export default OrganizationDeductions;
