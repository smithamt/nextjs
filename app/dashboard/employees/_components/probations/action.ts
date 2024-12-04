
import { getEmployeeQuery } from "@/data/employees";
import AppraisalModel from "@/models/appraisals/model";
import ContractModel from "@/models/contracts/model";
import EmployeeModel from "@/models/employees/model";
import PositionModel from "@/models/positions/model";
import { ADMIN, ADMIN_HOD_EDITOR, ADMIN_HOD_EDITOR_GROUP_ADMIN } from "@/roles";
import { EmployeeType } from "@/types";
import dayjs from "dayjs";

export const getProbationEndEmployeeData = async ({
  user,
  searchParams,
  state = "month",
}: {
  user: EmployeeType;
  searchParams: { [key: string]: string | string[] | undefined };
  state: "week" | "month";
}) => {
  const { next = 0, date: d } = searchParams;
  const query: any = {
    isPublic: true,
    company: user.company,
    branch: user.branch,
  };

  const date = dayjs(d as string).format("YYYY-MM-DD");

  if (!ADMIN_HOD_EDITOR_GROUP_ADMIN.includes(user.role)) query._id = user._id;

  if (ADMIN !== user.role) query.department = user.department;

  const monthOfMay = new Date().getMonth() + 1;
  const matchQuery: any = {
    company: user.company,
    monthOfBirth: monthOfMay,
  };

  if (ADMIN !== user.role) matchQuery.department = user.department;

  //three month ago
  const startDate = dayjs(date).add(Number(next), state).startOf(state);
  const endDate = dayjs(date).add(Number(next), state).endOf(state);

  let employees = [];

  if (!ADMIN_HOD_EDITOR.includes(user.role)) {
    const userPosition = await PositionModel.findById(user.position);
    const validPosition = await PositionModel.find({
      company: user.company,
      level: { $gt: userPosition?.level },
    });
    const empQuery = await getEmployeeQuery({ searchParams: query });
    employees = await EmployeeModel.find({
      ...empQuery,
      position: { $in: validPosition.map((i) => i._id) },
    });
    query._id = { $in: employees.map((i) => i._id) };
  }

  const probationEndEmployee = await EmployeeModel.aggregate([
    {
      $addFields: {
        probationEndDate: {
          $dateAdd: {
            startDate: "$joinedDate",
            unit: "month",
            amount: "$probationMonth",
          },
        },
      },
    },
    {
      $match: {
        ...query,
        probationEndDate: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        employeeId: 1,
        joinedDate: 1,
        probationMonth: 1,
        probationEndDate: 1,
        nickname: 1,
        department: 1,
        profile: 1,
        position: 1,
      },
    },
  ]);

  await EmployeeModel.populate(probationEndEmployee, {
    path: "department position",
    select: "name",
  });

  //one year ago
  const firstDayOfOneYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(1, "year");
  const lastDayOfOneYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(1, "year");

  //two year ago
  const firstDayOfTwoYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(2, "year");
  const lastDayOfTwoYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(2, "year");

  //three year ago
  const firstDayOfThreeYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(3, "year");
  const lastDayOfThreeYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(3, "year");

  const oneYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfOneYearAgoMonth,
      $lte: lastDayOfOneYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const twoYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfTwoYearAgoMonth,
      $lte: lastDayOfTwoYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const threeYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfThreeYearAgoMonth,
      $lte: lastDayOfThreeYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const data = {
    total:
      probationEndEmployee.length +
      oneYearAgoEmployees.length +
      twoYearAgoEmployees.length +
      threeYearAgoEmployees.length,
    employees: [
      ...probationEndEmployee.map((employee) => ({
        ...employee,
        status: "probationEnd",
        refId: "probation-end",
      })),
      ...oneYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "oneYearEnd", refId: "one-year-end" };
      }),
      ...twoYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "twoYearEnd", refId: "two-year-end" };
      }),
      ...threeYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "twoYearEnd", refId: "two-year-end" };
      }),
    ],
  };

  let appraisals = [];
  let contracts = [];

  if (data.employees.length) {
    appraisals = await AppraisalModel.find({
      isPublic: true,
      $or: data.employees.map((i) => ({ employee: i._id, refId: i.refId })),
    }).select("_id employee status");

    contracts = await ContractModel.find({
      isPublic: true,
      $or: data.employees.map((i) => ({ employee: i._id, refId: i.refId })),
    });
  }

  const response = {
    ...data,
    employees: data.employees
      .map((i) => {
        const hasAppraisals = appraisals.find(
          (a) => a.employee?.toString() === i._id?.toString()
        );
        i.appraisal = hasAppraisals;

        const contract = contracts.find(
          (c) =>
            c.employee?.toString() === i._id?.toString() && i.refId === c.refId
        );
        i.contract = contract;

        return i;
      })
      .sort((a, b) => {
        if (!a.appraisal && b.appraisal) {
          return -1; // a comes before b
        } else if (a.appraisal && !b.appraisal) {
          return 1; // b comes before a
        }
        return 0; // No change in order
      }),
  };

  return response;
};

export const getProbationEndEmployeeDataDashboard = async ({
  user,
  searchParams,
  state = "month",
}: {
  user: EmployeeType;
  searchParams: { [key: string]: string | string[] | undefined };
  state: "week" | "month";
}) => {
  const { next = 0, date: d } = searchParams;
  const date = dayjs(d as string).format("YYYY-MM-DD");

  const query: any = {
    isPublic: true,
    company: user.company,
    branch: user.branch,
  };

  if (!ADMIN_HOD_EDITOR_GROUP_ADMIN.includes(user.role)) query._id = user._id;

  if (ADMIN !== user.role) query.department = user.department;

  const monthOfMay = new Date().getMonth() + 1;
  const matchQuery: any = {
    company: user.company,
    monthOfBirth: monthOfMay,
  };

  if (ADMIN !== user.role) matchQuery.department = user.department;

  //three month ago
  const startDate = dayjs(date).add(Number(next), state).startOf(state);
  const endDate = dayjs(date).add(Number(next), state).endOf(state);

  let employees = [];

  if (!ADMIN_HOD_EDITOR.includes(user.role)) {
    const userPosition = await PositionModel.findById(user.position);
    const validPosition = await PositionModel.find({
      company: user.company,
      level: { $gt: userPosition?.level },
    });
    const empQuery = await getEmployeeQuery({ searchParams: query });
    employees = await EmployeeModel.find({
      ...empQuery,
      position: { $in: validPosition.map((i) => i._id) },
    });
    query._id = { $in: employees.map((i) => i._id) };
  }

  const probationEndEmployee = await EmployeeModel.aggregate([
    {
      $addFields: {
        probationEndDate: {
          $dateAdd: {
            startDate: "$joinedDate",
            unit: "month",
            amount: "$probationMonth",
          },
        },
      },
    },
    {
      $match: {
        ...query,
        probationEndDate: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        employeeId: 1,
        joinedDate: 1,
        probationMonth: 1,
        probationEndDate: 1,
        nickname: 1,
        department: 1,
        profile: 1,
        position: 1,
      },
    },
  ]);

  await EmployeeModel.populate(probationEndEmployee, {
    path: "department position",
    select: "name",
  });

  //one year ago
  const firstDayOfOneYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(1, "year");

  const lastDayOfOneYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(1, "year");

  //two year ago
  const firstDayOfTwoYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(2, "year");

  const lastDayOfTwoYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(2, "year");

  //three year ago
  const firstDayOfThreeYearAgoMonth = dayjs(date)
    .startOf(state)
    .add(Number(next), state)
    .subtract(3, "year");
  const lastDayOfThreeYearAgoMonth = dayjs(date)
    .endOf(state)
    .add(Number(next), state)
    .subtract(3, "year");

  const oneYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfOneYearAgoMonth,
      $lte: lastDayOfOneYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const twoYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfTwoYearAgoMonth,
      $lte: lastDayOfTwoYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const threeYearAgoEmployees = await EmployeeModel.find({
    ...query,
    joinedDate: {
      $gte: firstDayOfThreeYearAgoMonth,
      $lte: lastDayOfThreeYearAgoMonth,
    },
  })
    .select("name nickname joinedDate department employeeId profile position")
    .populate("department position", "name")
    .sort({ joinedDate: -1 });

  const data = {
    total:
      probationEndEmployee.length +
      oneYearAgoEmployees.length +
      twoYearAgoEmployees.length +
      threeYearAgoEmployees.length,
    employees: [
      ...probationEndEmployee.map((employee) => ({
        ...employee,
        status: "probationEnd",
        refId: "probation-end",
      })),
      ...oneYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "oneYearEnd", refId: "one-year-end" };
      }),
      ...twoYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "twoYearEnd", refId: "two-year-end" };
      }),
      ...threeYearAgoEmployees.map((employee) => {
        const empObj = employee.toObject();
        return { ...empObj, status: "twoYearEnd", refId: "two-year-end" };
      }),
    ],
  };

  const appraisals = await AppraisalModel.find({
    isPublic: true,
    $or: data.employees.map((i) => ({ employee: i._id, refId: i.refId })),
  }).select("_id employee status");

  const contracts = await ContractModel.find({
    isPublic: true,
    $or: data.employees.map((i) => ({ employee: i._id, refId: i.refId })),
  });

  const response = {
    ...data,
    employees: data.employees
      .map((i) => {
        const hasAppraisals = appraisals.find(
          (a) => a.employee?.toString() === i._id?.toString()
        );
        i.appraisal = hasAppraisals;

        const contract = contracts.find(
          (c) =>
            c.employee?.toString() === i._id?.toString() && i.refId === c.refId
        );
        i.contract = contract;

        return i;
      })
      .sort((a, b) => {
        if (!a.appraisal && b.appraisal) {
          return -1; // a comes before b
        } else if (a.appraisal && !b.appraisal) {
          return 1; // b comes before a
        }
        return 0; // No change in order
      }),
  };

  return { total: response.total, employees: response.employees.slice(0, 6) };
};
