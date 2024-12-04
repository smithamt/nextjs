import { RoleType } from "@/types";

const actions = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

export const SHOW_ATTENDANCE_EDITING = "SHOW_ATTENDANCE_EDITING";
export const LIMIT_LEAVE_CREATING = "LIMIT_LEAVE_CREATING";
export const ONLY_ALLOW_ONE_TIME = "ONLY_ALLOW_ONE_TIME";
export const LIMIT_ATTENDANCE_CREATING_ADVANCE =
  "LIMIT_ATTENDANCE_CREATING_ADVANCE";

export const pages = {
  employees: {},
  planner: {},
  relations: {},
  salaries: {},
  adjustments: {},
};

export const roles = [
  //admin
  {
    name: "admin",
    description: "",

    allRecord: ["leaveAdjustments", "holidayAdjustments"],

    //pages
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    app: true,
    role: true,
    companySetting: true,
    trashes: true,
    editors: true,
    ["text-editors"]: true,
    setting: true,
    photo: true,

    //application

    //employees
    appraisals: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //planner
    attendances: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    MAX_ATTENDANCE_UPDATE_COUNT: "unlimited",
    shifts: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //organizations
    departments: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    contracts: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    positions: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    schedules: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    holidays: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    leaves: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    allowances: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    deductions: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    assets: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    branches: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    currencies: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    languages: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    offAdjustments: [actions.READ],
    overview: true,
    off: true,

    //relations
    leaveRequests: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    remotes: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    terminations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    increments: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    ["salary-increments"]: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    resignations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    warnings: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    overtimes: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    scheduleRequests: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    clearances: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    trainings: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    promotions: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    transfers: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
  },
  //head_of_department
  {
    name: "head_of_department",
    description: "",

    //main route
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    app: true,
    trashes: true,
    setting: true,
    photo: true,

    //employees
    appraisals: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //planner
    attendances: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
      LIMIT_ATTENDANCE_CREATING_ADVANCE,
    ],
    MAX_ATTENDANCE_UPDATE_COUNT: 1,
    shifts: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    offAdjustments: [actions.READ],
    overview: true,
    off: true,

    //organizations
    departments: [actions.READ, actions.UPDATE, actions.DELETE],
    positions: [actions.READ, actions.UPDATE, actions.DELETE],
    schedules: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    holidays: [actions.READ, actions.UPDATE, actions.DELETE],
    leaves: [actions.READ, actions.UPDATE, actions.DELETE],
    allowances: [actions.READ, actions.UPDATE, actions.DELETE],
    deductions: [actions.READ, actions.UPDATE, actions.DELETE],
    assets: [actions.READ, actions.UPDATE, actions.DELETE],
    branches: [actions.READ, actions.UPDATE, actions.DELETE],

    //relations
    leaveRequests: [actions.CREATE, actions.READ, actions.UPDATE],
    increments: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    resignations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    terminations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    warnings: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    overtimes: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    scheduleRequests: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    clearances: [actions.READ, actions.UPDATE, actions.DELETE],
    trainings: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    promotions: [actions.CREATE, actions.READ, actions.UPDATE],
    transfers: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
  },
  //finance
  {
    name: "finance",
    description: "",
    allRecord: ["leaveAdjustments", "holidayAdjustments"],

    //main
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    app: true,
    trashes: true,
    setting: true,
    photo: true,

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    overview: true,
    off: true,

    //organizations
    departments: [actions.READ, actions.UPDATE],
    positions: [actions.READ, actions.UPDATE, actions.DELETE],
    schedules: [actions.READ, actions.UPDATE, actions.DELETE],
    terminations: [actions.READ, actions.UPDATE, actions.DELETE],
    holidays: [actions.READ, actions.UPDATE, actions.DELETE],
    leaves: [actions.READ, actions.UPDATE, actions.DELETE],
    allowances: [actions.READ, actions.UPDATE, actions.DELETE],
    deductions: [actions.READ, actions.UPDATE, actions.DELETE],
    assets: [actions.READ, actions.UPDATE, actions.DELETE],
    branches: [actions.READ, actions.UPDATE, actions.DELETE],

    //relations
    leaveRequests: ["create", "update", "read"],
    increments: [actions.READ, actions.UPDATE, actions.DELETE],
    promotions: [actions.READ],
    resignations: ["create", "update", "read", "delete"],
    ["salary-increments"]: [actions.READ],
  },
  {
    name: "editor",
    description: "",

    //main
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    trashes: true,
    setting: true,
    photo: true,

    //planner
    attendances: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      LIMIT_ATTENDANCE_CREATING_ADVANCE,
      SHOW_ATTENDANCE_EDITING,
      LIMIT_LEAVE_CREATING,
      ONLY_ALLOW_ONE_TIME,
    ],
    shifts: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    offAdjustments: [actions.READ],
    overview: true,
    off: true,

    //employees
    appraisals: [actions.READ],

    //organizations
    departments: [actions.READ, actions.UPDATE],
    positions: [actions.READ, actions.UPDATE],
    schedules: ["create", "update", "read", "delete"],
    terminations: [actions.READ, actions.UPDATE],
    holidays: [actions.READ, actions.UPDATE],
    leaves: [actions.READ, actions.UPDATE, actions.DELETE],
    allowances: [actions.READ, actions.UPDATE, actions.DELETE],
    deductions: [actions.READ, actions.UPDATE, actions.DELETE],
    assets: [actions.READ, actions.UPDATE, actions.DELETE],
    branches: [actions.READ, actions.UPDATE, actions.DELETE],

    //relations
    leaveRequests: [actions.CREATE, actions.READ, actions.UPDATE],
    resignations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    warnings: [actions.CREATE, actions.READ, actions.UPDATE, actions.DELETE],
    overtimes: ["create", "update", "read", "delete"],
    scheduleRequests: ["create", "update", "read", "delete"],
    clearances: [actions.READ, actions.UPDATE, actions.DELETE],
    trainings: ["create", "update", "read", "delete"],
    promotions: ["create", "update", "read"],
    transfers: ["create", "update", "read", "delete"],
  },
  {
    name: "group_admin",
    description: "",

    //main
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    trashes: true,
    setting: true,
    photo: true,

    //employees
    appraisals: [actions.READ],

    //organizations
    departments: [actions.READ, actions.UPDATE],
    positions: [actions.READ, actions.UPDATE],
    schedules: [actions.READ, actions.UPDATE],
    holidays: [actions.READ, actions.UPDATE],
    leaves: [actions.READ, actions.UPDATE],
    allowances: [actions.READ, actions.UPDATE],
    deductions: [actions.READ, actions.UPDATE],
    assets: [actions.READ, actions.UPDATE],
    branches: [actions.READ, actions.UPDATE],

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    offAdjustments: [actions.READ],
    overview: true,
    off: true,

    //planner
    attendances: [
      // actions.CREATE,
      actions.READ,
      // actions.UPDATE,
      LIMIT_ATTENDANCE_CREATING_ADVANCE,
      SHOW_ATTENDANCE_EDITING,
      LIMIT_LEAVE_CREATING,
    ],
    shifts: [actions.CREATE, actions.READ, actions.UPDATE],

    //relations
    leaveRequests: [actions.READ, actions.UPDATE],
    resignations: [actions.READ, actions.UPDATE, actions.DELETE],
    warnings: [actions.READ, actions.UPDATE, actions.DELETE],
    overtimes: [actions.READ, actions.UPDATE, actions.DELETE],
    scheduleRequests: [actions.READ, actions.UPDATE, actions.DELETE],
    clearances: [actions.READ, actions.UPDATE, actions.DELETE],
    trainings: [actions.READ, actions.UPDATE, actions.DELETE],
    promotions: [actions.READ, actions.UPDATE],
    transfers: [actions.READ, actions.UPDATE, actions.DELETE],
  },
  {
    name: "user",
    description: "",

    //main
    home: true,
    notifications: true,
    messages: true,
    organization: true,
    employees: true,
    cart: true,
    list: true,
    create: true,
    adjustments: true,
    planner: true,
    relations: true,
    payroll: true,
    trashes: true,
    setting: true,
    photo: true,

    //organizations
    departments: [actions.READ],
    positions: [actions.READ],
    schedules: [actions.READ],
    holidays: [actions.READ],
    leaves: [actions.READ],
    allowances: [actions.READ],
    deductions: [actions.READ],
    assets: [actions.READ],
    branches: [actions.READ],

    //adjustment
    leavesAdjustments: [actions.READ],
    holidayAdjustments: [actions.READ],
    offAdjustments: [actions.READ],
    overview: true,
    off: true,

    //relations
    leaveRequests: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    resignations: [
      actions.CREATE,
      actions.READ,
      actions.UPDATE,
      actions.DELETE,
    ],
    warnings: [actions.READ, actions.UPDATE],
  },
];

const roleObj = {
  ADMIN: "admin",
  HOD: "head_of_department",
  EDITOR: "editor",
  FINANCE: "finance",
  GROUP_ADMIN: "group_admin",
  USER: "user",
};

export const valid_role = (
  title: keyof (typeof roles)[0],
  role: RoleType,
  action: string
) => {
  const foundRole = roles.find((r) => r.name === role);
  const f = foundRole && foundRole[title];
  const isArray = f && Array.isArray(f);
  return isArray ? f?.includes(action) : false;
};

export const ADMIN_HOD_EDITOR_GROUP_ADMIN = [
  roleObj.ADMIN,
  roleObj.EDITOR,
  roleObj.HOD,
  roleObj.GROUP_ADMIN,
];

export const ADMIN_HOD = [roleObj.ADMIN, roleObj.HOD];
export const ADMIN_HOD_EDITOR = [roleObj.ADMIN, roleObj.EDITOR, roleObj.HOD];

export const ADMIN_FINANCE_EDITOR_GROUP_ADMIN = [
  roleObj.ADMIN,
  roleObj.EDITOR,
  roleObj.GROUP_ADMIN,
  roleObj.FINANCE,
];
export const ADMIN_HOD_FINANCE_EDITOR_GROUP_ADMIN = [
  roleObj.ADMIN,
  roleObj.HOD,
  roleObj.EDITOR,
  roleObj.GROUP_ADMIN,
  roleObj.FINANCE,
];

export const ADMIN_HOD_EDITOR_FINANCE = [
  roleObj.ADMIN,
  roleObj.EDITOR,
  roleObj.FINANCE,
];

export const ADMIN_FINANCE = [roleObj.ADMIN, roleObj.FINANCE];
export const ADMIN_EDITOR = [roleObj.ADMIN, roleObj.EDITOR];
export const ADMIN = roleObj.ADMIN;
export const HOD = roleObj.HOD;
export const FINANCE = roleObj.FINANCE;
export const EDITOR = roleObj.EDITOR;
export const USER = roleObj.USER;

export const INFORM_TO = [
  roleObj.ADMIN,
  roleObj.HOD,
  roleObj.FINANCE,
  roleObj.EDITOR,
];

export { actions, roleObj };

