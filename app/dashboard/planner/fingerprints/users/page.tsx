import { getUser } from "@/data/user";
import { getFingerprintUsers } from "@/fingerprint";
import FingerprintMachineModel from "@/models/fingerprintmachines/model";
import { FingerprintUserType } from "@/types";
import FingerprintsUserHeader from "./header";
import { Types } from "mongoose";
import LastElement from "@/components/lastelement";
import { Skeleton } from "@/components/ui/skeleton";

async function FingerprintsUsers({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return null;

  const query: any = {
    company: user?.company,
  };

  if (Types.ObjectId.isValid(searchParams.fingerprint as string)) {
    query._id = searchParams.fingerprint;
  }

  const fingerprints = await FingerprintMachineModel.find(query);

  const users = (await Promise.all(
    fingerprints.map(async (i) => {
      const u = (await getFingerprintUsers(i.ipAddress, i.port)) || [];
      return u.map((b) => ({ ...b, fingerprint: i.name, ip: i.ipAddress }));
    })
  )) as FingerprintUserType[][];

  const search = searchParams.search as string;
  const data = (
    search
      ? users
          .flat()
          .filter(
            (u) =>
              u.uid.toString().toLowerCase().includes(search.toLowerCase()) ||
              u.userId
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              u.name.toString().toLowerCase().includes(search.toLowerCase())
          )
      : users.flat()
  ) as FingerprintUserType[];

  const count = data.length;
  const page = Number((searchParams.page || "1") as string);
  const limit = Number(page * 30);
  const response = data.slice(0, limit);

  return (
    <div className="h-screen w-full">
      <FingerprintsUserHeader />
      <div className="flex gap-2 h-[calc(100%-50px)] flex-wrap p-2 overflow-y-auto">
        {response.map((user, index) => {
          return (
            <div
              key={index}
              className="cart-bg min-w-40 flex-1 p-2 shadow-sm rounded-lg"
            >
              <p>
                <strong className="w-20">uid :</strong>
                {user.uid}{" "}
              </p>
              <p>
                <strong className="w-20">role :</strong>
                {user.role}{" "}
              </p>
              <p>
                <strong className="w-20">password :</strong>
                {user.password}
              </p>
              <p>
                <strong className="w-20">name :</strong>
                {user.name}
              </p>
              <p>
                <strong className="w-20">cartno :</strong>
                {user.cardno}
              </p>
              <p>
                <strong className="w-20">userId :</strong>
                {user.userId}
              </p>
              <p>
                <strong className="w-20">name :</strong>
                {user.fingerprint}
              </p>
              <p>
                <strong className="w-20">ip :</strong>
                {user.ip}
              </p>
            </div>
          );
        })}
        {count > response.length && (
          <LastElement
            custom={
              <div className="cart-bg min-w-40 flex-1 p-2 shadow-sm rounded-lg">
                <Skeleton className="w-20 h-6" />
              </div>
            }
            count={count}
            data={response.length}
          />
        )}
      </div>
    </div>
  );
}

export default FingerprintsUsers;
