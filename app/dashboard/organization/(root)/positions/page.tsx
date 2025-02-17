import { PositionType } from "@/types";
import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Position",
  description: "Generated by create next app",
};

function OrganizationPositions({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild<PositionType>
      title="positions"
      searchParams={searchParams}
    />
  );
}

export default OrganizationPositions;
