"use client";
import { CompanyType, EmployeeType, RoleType } from "@/types";
import { ReactNode, createContext, useContext, useState } from "react";

type FormatDateType = "YYYY-MM-DD";

const HasUserContext = createContext<{
  role: RoleType;
  user: EmployeeType;
  formatDate: FormatDateType;
  company: CompanyType;
  //@ts-ignore
}>({ role: "user", user: {}, formatDate: "YYYY-MM-DD" });

export function useHasUser() {
  return useContext(HasUserContext);
}

export function HasUserProvider({
  children,
  user: u,
  company: c,
}: {
  children: ReactNode;
  user: string;
  company: string;
}) {
  const user = JSON.parse(u) as EmployeeType;
  const company = JSON.parse(c) as CompanyType;

  const [formatDate] = useState<FormatDateType>("YYYY-MM-DD");

  // useEffect(() => {
  //   socket.emit("register_user", user._id);
  // }, [user]);

  return (
    <HasUserContext.Provider
      value={{ user, role: user.role, formatDate, company }}
    >
      {children}
    </HasUserContext.Provider>
  );
}
