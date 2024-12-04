import { getUser } from "@/data/user";
import EmployeeRelationData from "@/models/employees/relations/model";
import dayjs from "dayjs";
import { calculateSalary } from "../_actions/calculateSalaries";
import { isPastMonth } from "../_actions/getSalaryData";
import EmpPayroll from "./payroll";
import CompanyModel from "@/models/companies/model";
import EmployeeModel from "@/models/employees/model";
import SalaryModel from "@/models/salaries/model";
import AttendanceModel from "@/models/attendances/model";
import ShiftModel from "@/models/shifts/model";
import SalaryIncrement from "@/models/salaryIncrements/model";
import PromotionRequestModel from "@/models/promotions/model";
import ContractModel from "@/models/contracts/model";
import AttendanceSetting from "@/app/api/attendanceSetting";
import ExchangeModel from "@/models/exchanges/model";

async function PayrollSalaryDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const company = await CompanyModel.findById(user.company);
  const { id } = params;
  const employee = await EmployeeModel.findById(id);
  if (!employee) return;

  const employeeRelations = await EmployeeRelationData.find({
    isPublic: true,
    employee: employee._id,
  }).populate({
    path: "id",
    populate: { path: "currency", select: "symbol" },
  });

  const allowances = employeeRelations.filter(
    (a) => a.fromModel === "Allowance"
  );
  const deductions = employeeRelations.filter(
    (a) => a.fromModel === "Deduction"
  );

  employee.allowances = allowances;
  employee.deductions = deductions;
  const date = (searchParams.date || dayjs().format("YYYY-MM-DD")) as string;
  const already = await SalaryModel.findOne({
    employee: id,
    month: dayjs(date).format("MMMM YYYY"),
    company: user.company,
  });

  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const toGetStartDate = new Date(year, month, 1);
  const toGetEndDate = new Date(year, month + 1, 0);

  const startDate = new Date(dayjs(toGetStartDate).format("YYYY-MM-DD"));
  const endDate = new Date(dayjs(toGetEndDate).format("YYYY-MM-DD"));

  const attendances = await AttendanceModel.find({
    employee: id,
    date: {
      $gte: startDate.toISOString(),
      $lte: isPastMonth(new Date(date))
        ? endDate.toISOString()
        : new Date().toISOString(),
    },
  })
    .select(
      "checkIn checkOut from to schedule employee fromModel status date leave overtime"
    )
    .populate("schedule", "-color")
    .populate("leave");

  const shiftQuery = {
    employee: id,
    date: {
      $gte: startDate.toISOString(),
      $lte: isPastMonth(new Date(date))
        ? endDate.toISOString()
        : new Date().toISOString(),
    },
  };

  const shifts = await ShiftModel.find(shiftQuery)
    .populate("schedule", "-color")
    .select("status date employee schedule");

  if (already) return already;

  const salaryIncrements = await SalaryIncrement.find({
    isPublic: true,
    employee: employee._id,
  });

  const promotions = await PromotionRequestModel.find({
    isPublic: true,
    employee: employee._id,
    status: "approved",
  });

  const contracts = await ContractModel.find({
    isPublic: true,
    employee: employee._id,
  });

  const attendanceSetting = await AttendanceSetting.findById(
    company?.attendanceSetting.setting
  ).populate("late earlyOut");

  const exchanges = await ExchangeModel.find({
    // isPublic: true,
    // company: user.company,
  });

  const salary = calculateSalary({
    employee,
    date: new Date(date),
    exchanges,
    attendances,
    shifts,
    company,
    attendanceSetting,
    salaryIncrements,
    promotions,
    contracts,
  });

  return <EmpPayroll salary={salary} date={date} company={company} />;
}

export default PayrollSalaryDetail;
