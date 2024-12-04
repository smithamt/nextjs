import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function OrganizationAssets({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild title="assets" searchParams={searchParams} />
  );
}

export default OrganizationAssets;
