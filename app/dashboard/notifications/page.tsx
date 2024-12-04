import NotificationsClient from "./client";

function Notifications({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <NotificationsClient searchParams={searchParams} />;
}

export default Notifications;
