import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function OrganizationLeaves({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild title="leaves" searchParams={searchParams} />
  );
}

export default OrganizationLeaves;
