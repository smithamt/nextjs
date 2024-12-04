import { FingerprintUserType } from "@/types";
//@ts-ignore
import ZKJUBAER from "zk-jubaer";

export const createFingerprintUser = async ({
  link,
  uid,
  userId,
  password,
  role,
  name,
}: {
  link: string;
  uid: number;
  userId: string;
  password: number;
  role: number;
  name: string;
}) => {
  let obj = new ZKJUBAER(link, 3000, 5200, 5000);

  try {
    await obj.createSocket();
    await obj.setUser(uid, userId, name, password, role);
    console.log("set user to finger print");
  } catch (error) {
    console.log("setUser error");
  }
};

// createFingerprintUser({
//   link: "172.16.89.48",
//   uid: 394,
//   userId: "APIH852",
//   password: "",
//   role: 0,
//   name: "Su Su",
// });

// createFingerprintUser({
//   link: "172.16.89.30",
//   uid: 403,
//   userId: "APIH852",
//   password: "",
//   role: 0,
//   name: "Su Su",
// });

export const getFingerprintData = async (link: string, port: number) => {
  let obj = new ZKJUBAER(link, port, 1000, 5000);
  try {
    await obj.createSocket();
    const logs = await obj.getAttendances();
    console.log(link, logs.data.length);
    await obj.disconnect();
    return logs.data as FingerprintUserType[];
  } catch (e) {
    console.log(e);
  }
};
export const getFingerprintUsers = async (link: string, port: number) => {
  let obj = new ZKJUBAER(link, port, 1000, 5000);
  try {
    await obj.createSocket();
    const info = await obj.getUsers();
    await obj.disconnect();
    return info.data as FingerprintUserType[];
  } catch (e) {
    console.log(e);
  }
};
