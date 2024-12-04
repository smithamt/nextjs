"use client";
import { CompanyType, LeaveRequestType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import { FC } from "react";

export const pageStyle = `
  @page {
    size: A4;
  }
  @media print {
    body {
      width: 210mm;
      height: 297mm;
    }
  }
  .a4-container {
    width: 210mm;
    height: 297mm;
  }
`;

type PrintPreview = {
  leaveRequest: LeaveRequestType;
  company: CompanyType;
  printRef: any;
};

const PrintPage: FC<PrintPreview> = ({ leaveRequest, company, printRef }) => {
  const formatDate = "YYYY-MM-DD";

  const src = leaveRequest.employee?.profile
    ? `/api/images/${leaveRequest.employee.profile?.image}/350/350`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const companyprofile = company?.profile
    ? `/api/images/${company.profile?.image}/350/350`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div
      ref={printRef}
      className="a4-container cart-bg border relative mx-auto overflow-y-auto"
    >
      <style>{pageStyle}</style>
      <div className="p-10">
        <div className="mb-4">
          <div className="absolute top-6 left-8">
            <Image
              width={100}
              height={50}
              src={companyprofile}
              alt={"profile"}
            />
          </div>
          <div>
            <p className="font-bold text-xl text-center mb-2">
              {company?.name}
            </p>
            {company?.otherName?.map((i, index) => (
              <p key={index} className="font-bold text-lg text-center">
                {i.name}
              </p>
            ))}
          </div>
        </div>
        <div className="text-center border py-2 my-2 font-bold">
          EMPLOYEE LEAVE FORM - 员工请假表格 - ဝန်ထမ်းခွင့်လျှောက်လွှာ
        </div>
        <div className="flex">
          <Image
            width={128}
            height={160}
            className="rounded-lg object-cover shadow-sm"
            src={src}
            alt={"profile"}
          />
          <div className="px-2 grid grid-cols-2 gap-1">
            <p title="Employee Name">{leaveRequest.employee.name}</p>
            <p title="Employee ID">{leaveRequest.employee.employeeId}</p>
            <p title="Position">{leaveRequest.employee.position?.name}</p>
            <p title="Department">{leaveRequest.employee.department?.name}</p>
            <p title="Joined Date">
              {dayjs(leaveRequest.employee.joinedDate).format(formatDate)}
            </p>
            <p title="Request Date">
              {dayjs(leaveRequest.createdAt).format(formatDate)}
            </p>
            <p title="Address">{leaveRequest.employee.currentAddress}</p>
          </div>
        </div>

        <div className="text-center border py-2 my-2 font-bold">
          Emergency Contact Information - 紧急联系信息
        </div>
        <p title="Name">{leaveRequest.emergencyContactName}</p>
        <p title="Contact Number">{leaveRequest.emergencyContactNumber}</p>
        <p title="Home Address">{leaveRequest.address}</p>

        <div className="bottom-4 text-center mt-8">
          Note: Management level can be taken annual leave after completing six
          (6) month of continued service and must be applied at least seven (7)
          days in advance.
        </div>
        <div className="text-xs font-semibold bottom-2 right-2 absolute">
          @apihr
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
