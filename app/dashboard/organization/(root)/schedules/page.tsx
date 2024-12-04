import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";

function OrganizationSchedules({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild title="schedules" searchParams={searchParams} />
  );
}

export default OrganizationSchedules;
