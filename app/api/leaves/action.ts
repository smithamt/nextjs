import { AttendanceType, EmployeeType, LeaveType } from "@/types";
import dayjs from "dayjs";

function daysInYear(year: number) {
  return (
    (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

export const getTotalLeave = ({
  employee,
  leaveObj,
  allLeaves,
  excludedDays,
}: {
  employee: EmployeeType;
  leaveObj: LeaveType;
  allLeaves: AttendanceType[];
  excludedDays: AttendanceType[];
}) => {
  const startDateOfLeave = dayjs(leaveObj.startDate || employee.joinedDate);
  const endDateOfLeave = dayjs(leaveObj.endDate || new Date());

  const totalExcludedDays = excludedDays.filter((i) => {
    const attendanceDate = dayjs(i.date);

    const isValidDate =
      (attendanceDate.isAfter(startDateOfLeave) ||
        attendanceDate.isSame(startDateOfLeave)) &&
      (attendanceDate.isBefore(endDateOfLeave) ||
        attendanceDate.isSame(endDateOfLeave));

    return isValidDate && i.employee._id.toString() === employee._id.toString();
  });

  const totalExcludedDaysTime = totalExcludedDays.length * 1000 * 60 * 60 * 24;
  const employeeServiceTime =
    new Date(leaveObj.endDate || Date.now()).getTime() -
    new Date(leaveObj.startDate || employee.joinedDate).getTime();

  const needToServiceDays = employeeServiceTime / (1000 * 60 * 60 * 24);

  const employeeServiceDays =
    (employeeServiceTime - totalExcludedDaysTime) / (1000 * 60 * 60 * 24);

  const employeeServiceMonth =
    (employeeServiceTime - totalExcludedDaysTime) / (1000 * 60 * 60 * 24 * 30);

  const employeeServiceYear =
    (employeeServiceTime - totalExcludedDaysTime) /
    (1000 * 60 * 60 * 24 * daysInYear(new Date().getFullYear()));

  const availableLeaves =
    (leaveObj.countries.includes("All") ||
      leaveObj.countries.includes(employee.nationality)) &&
    (leaveObj.gender === "All" || leaveObj.gender === employee.gender) &&
    (leaveObj.maritalStatus.includes("All") ||
      leaveObj.maritalStatus.includes(employee.maritalStatus));

  const joinedDate = dayjs(leaveObj.startDate || employee.joinedDate);

  const additionalMonths = Math.round((leaveObj.carriableYears % 1) * 12);

  const carriableDate = joinedDate
    .add(employeeServiceYear - leaveObj.carriableYears, "year")
    .add(additionalMonths, "month")
    .startOf("month");

  const daysInYears = daysInYear(new Date().getFullYear());

  console.log(
    "employee service year",
    employeeServiceYear,
    leaveObj.leaveType,
    Math.floor(employeeServiceYear)
  );
  const totalAvailable = availableLeaves
    ? leaveObj.calculateWithServiceDays
      ? (leaveObj.allowDays / daysInYears) * employeeServiceDays
      : leaveObj.allowDays *
        (leaveObj.leaveType === "yearly"
          ? Math.floor(employeeServiceYear) || 1
          : 1)
    : 0;

  const taken = allLeaves.filter((attendance) => {
    const attendanceDate = dayjs(attendance.date);

    const isSameLeaveType =
      attendance.leave?.toString() === leaveObj._id.toString();

    const isCarriable =
      attendanceDate.isAfter(carriableDate) ||
      attendanceDate.isSame(carriableDate);

    return (
      isSameLeaveType && (leaveObj.calculateWithServiceDays || isCarriable)
    );
  }).length;
  const nowAvailable = totalAvailable - taken;

  return {
    employee,
    serviceDays: needToServiceDays,
    serviceMonths: employeeServiceMonth,
    serviceYears: employeeServiceYear,
    excludedDays: totalExcludedDays.length,
    employeeServiceDays: employeeServiceDays,
    available: totalAvailable,
    nowAvailable:
      nowAvailable > leaveObj.allowDays && !leaveObj.calculateWithServiceDays
        ? leaveObj.allowDays
        : nowAvailable,
    leave: leaveObj._id,
    taken,
  };
};
