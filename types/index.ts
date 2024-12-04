import { custommodels } from "@/data/models";
import { statusColors } from "@/data/status";
import { actions, roles } from "@/roles";
import { NextRequest } from "next/server";

export type Request = NextRequest & {
  user: any;
  session: any;
};

export type TitleType =
  | keyof typeof custommodels
  | "salaries"
  | "planner"
  | "adjustments"
  | "remotes"
  | "fingerprints";

interface RoleTypes {
  ADMIN: {
    name: "admin";
  };
  HOD: {
    name: "head_of_department";
  };
  EDITOR: {
    name: "editor";
  };
  FINANCE: {
    name: "finance";
  };
  GROUP_ADMIN: {
    name: "group_admin";
  };
  USER: {
    name: "user";
  };
}

export type RoleType = RoleTypes[keyof RoleTypes]["name"];
export type AdminRoleKeys = keyof (typeof roles)[0]; // For the first role (e.g., "admin")
export type ActionValue = (typeof actions)[keyof typeof actions];

export type StatusType = "pending" | "approved" | "rejected";
export type StateType = "published" | "draft" | "scheduled";
export type GenderType = "Male" | "Female" | "All";

export type ColorType = {
  back: string;
  text: string;
};

export type UpdatedType = {
  updatedBy: EmployeeType;
  updatedAt: Date;
  oldData: any;
};

export type OtherNameType = { name: string; language: LanguageType };

type RequirementType = {
  id: string;
  _id: string;
  profile: ProfileType;
  profileCollection: ImageCollectionType;
  createdAt: Date;
  updatedAt: Date;
  createdBy: EmployeeType;
  company: CompanyType;

  ref?: string;
  description?: string;
  remark?: string;
  color?: ColorType;
  isPublic: boolean;
  isUpdate?: UpdatedType[];
};

export type RouteType = {
  name: AdminRoleKeys;
  description?: string;
  path: string;
  realpath?: string;
  search?: any;
  icon?: React.ReactNode;
  children?: RouteType[];
  noti?: number;
};

export interface SocialLinkType {
  type: string;
  username: string;
}

export interface ClearanceType extends RequirementType {
  employee: EmployeeType;
  from: ResignationType | EndEmployeeContractType;
  fromModel: string;
  startingDate: Date;
  hrApprover: EmployeeType;
  hodApprover: EmployeeType;
  finalWorkingDay: Date;
  createdBy: EmployeeType;
  company: CompanyType;
  department: DepartmentType;
  startClearance: boolean;
  status: StatusType;
}

export interface AssetRelationDataType extends RequirementType {
  _id: string;
  quantity: number;
  employee: EmployeeType;
  createdDate: Date;
  asset: AssetType;
  status: "not returned" | "returned" | "value adjust";
  remark: string;
  valueAdjust: number;
  valueAdjustCurrency: CurrencyType;
  approvedBy: EmployeeType;
  approvedDate: Date;
  createdBy: EmployeeType;
  isPublic: boolean;
  createdAt: Date;
}

export interface EmployeeRelationDataType {
  createdDate: Date;
  _id: string;
  employee: EmployeeType;
  fromModel: string;
  id: AllowanceType | DeductionType;

  clearanceState: {
    isStartClearance: boolean;
    state: "not returned" | "returned" | "value adjust";
    remark: string;
    valueAdjustCurrency: CurrencyType;
    valueAdjust: number;
    approvedBy: EmployeeType;
    approvedDate: Date;
  };

  createdBy: EmployeeType;
  isPublic: boolean;
  createdAt: Date;
}

export type EmployeeType = RequirementType & {
  name: string;
  nickname: string;
  position: PositionType;
  employeeId: string;

  fingerprintId: string;
  salary: number;
  salaryType: string;
  currency: CurrencyType;
  role: RoleType;
  department: DepartmentType;

  //planner helper
  schedule: {
    id: ScheduleType;
    createdBy: EmployeeType;
    createdAt: Date;
  };

  // contact and basic information
  email: string;
  contactNo: string;
  gender: string;
  height: string;
  weight: string;
  dateOfBirth: Date;
  passportNo: string;
  idCardNo: string;
  maritalStatus: string;
  socialLink: SocialLinkType;
  emergencyContact: string;
  emergencyCall: string;
  degreeOfVision: string;
  nationality: string;
  hearingLevel: string;
  channels: string;

  employeeType: string;
  levelOfEducation: string;
  ethnicGroup: string;
  computerSkill: string;
  joinedDate: Date;
  permanentAddress: string;
  currentAddress: string;
  languages: string;
  anyCriminalHistory: string;

  username: string;
  password: string;
  profile: ProfileType;
  profileCollection: ImageCollectionType;
  cover: ProfileType;

  branch: BranchType;
  company: CompanyType;
  serviceHourPerDay: number;
  ref: string;

  allowances: EmployeeRelationDataType[];
  deductions: EmployeeRelationDataType[];
  assets: AssetRelationDataType[];

  safeLate: boolean;
  safeEarlyOut: boolean;
  useFlexibleWorkingHour: boolean;
  language: string;

  state: "resign" | "terminated" | "endContract" | "normal";

  isActive: {
    isActive: boolean;
    activeAt: Date;
  };
};

//form

export type DepartmentType = RequirementType & {
  name: string;
  otherName: OtherNameType[];
  keyword: string;
  budget: number;
  profile: ProfileType;
  cover: ProfileType;
  branch: BranchType[];
  company: CompanyType;
  goals: string;
  rolesAndResponsibilities: string;
  allowHalfOff: boolean;
  policies: string;
  description?: string;
  isPublic: boolean;
  ref: string;
};

export type ExchangeType = RequestItemType & {
  from: CurrencyType;
  to: CurrencyType;
  company: CompanyType;
  rate: number;
  ref: string;
  lastUpdated: Date;
};

export interface ScheduleType extends RequirementType {
  _id: string;
  name: string;
  from: string;
  to: string;
  notes?: string;
  color: ColorType;
  date?: string;
  allDepartment: boolean;
  department: string[];
  company: CompanyType;
  status: StatusType;
  request: {
    requestBy: EmployeeType;
    requestDate: string;
    approvedBy: EmployeeType;
  };
}

export interface ShiftType extends RequirementType {
  shiftEnd: string;
  employee: EmployeeType;
  ref: string;
  date: Date;
  schedule: ScheduleType;
  status: string;
  leave: LeaveType;
  remark: string;
  remarkBy: EmployeeType;
}

export type LocationType = {
  type: string[];
  coordinates: number[];
};

export type CheckInType = {
  time: Date;
  late?: string;
  device?: string;
  method?: string;
  location?: LocationType;
  approvedBy: EmployeeType;
  remark?: string;
  status: StatusType;
  deleted?: { time: Date; value: string; deletedBy: EmployeeType };
};

export interface FingerprintType {
  _id: string;
  recordTime: Date;
  recordTimeString: string;
  isPublic: boolean;
  ip: string;
  deviceUserId: string;
  userSn: number;
  employee: EmployeeType;
  used: boolean;
}

export interface FingerprintMachineType {
  name: string;
  profile: ProfileType;
  company: CompanyType;
  ipAddress: string;
  port: number;

  isPublic: boolean;
  createdBy: EmployeeType;
}

export type AttendanceType = RequirementType & {
  remark: any;
  schedule: ScheduleType;
  leave?: LeaveType;
  employee: EmployeeType;
  overtimeRequest: OvertimeRequestType;
  date: Date;
  remarkBy: EmployeeType;
  halfOff: "Morning Day Off" | "Evening Day Off";
  checkIn?: CheckInType;
  checkOut?: CheckInType;
  late?: string;
  fromModel: string;
  earlyOut?: string;
  overtime: number;
  status: keyof typeof statusColors;
};

export interface PaidType {
  paidType: "Paid" | "Unpaid" | "HalfPaid";
}

export interface LeaveType extends PaidType, RequirementType {
  carryLeave: LeaveType;
  leaveType: string;
  calculateWithServiceDays: boolean;
  otherLanguageSpecificNames: any;
  _id: string;
  name: string;
  countries: string[];
  allDepartment: boolean;
  department: DepartmentType[];
  branch: BranchType[];
  ref: string;
  keyword?: string;
  allowDays: number;
  minimumDays: number;
  saveMinimumDay: DepartmentType[];
  carriableYears: number;
  carriableMonths: number;
  excludeDays: LeaveType[];
  employeeType: string;
  company: CompanyType;

  gender: GenderType;
  employeeServiceMonths: number;
  maritalStatus: string[];
  resettingDate?: Date;
  country: string[];
  color: ColorType;
  type?: string;

  startDate: Date;
  endDate: Date;
}

export interface NotificationProps {
  from: any;
  _id?: string;
  user: EmployeeType;
  notification: {
    content: string;
    route: string;
  };
  read: boolean;
  createdAt: string;
}

export type AttendedFileType = { _id: string; images: ImageType[] };

export type RequestItemType = {
  _id: string;
  leave: LeaveType | HolidayType;
  fromModel: "Leave" | "Holiday";
  from: Date;
  to: Date;
  status: StatusType;
  rejectReason: string;
  approvedBy: EmployeeType;
  attendedFiles: AttendedFileType;
};

export interface LeaveRequestType extends RequirementType {
  leaveAdj: LeaveAdjustmentType;
  employee: EmployeeType;
  company: CompanyType;
  department: DepartmentType;
  leaves: RequestItemType[];
  status: StatusType;
  rejectReason: string;
  approvedBy: EmployeeType;
  reason: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
}

export type ConversationType = RequirementType & {
  name: string;
  profile: ProfileType;
  group: string;
  type: "group" | "telegram";
  telegram: TelegramUserType;
  isTelegramBot: boolean;

  users: EmployeeType[];
  fromUser: "Employee" | "Telegram";

  lastMessage: string;
  lastMessageRead: EmployeeType[];
  lastMessageAt: Date;
  company: CompanyType;
  isPublic: boolean;
};

export type MessageType = RequirementType & {
  message_id: number;
  chat: TelegramUserType;
  date: Date;
  text: string;
  conversation: ConversationType;

  react: string;
  from: EmployeeType;
  fromModel: "Telegram" | "Employee";
  read: EmployeeType[];
  reply: EmployeeType;
  fromBot: boolean;
  seen: EmployeeType[];
};

export interface NotificationType extends RequirementType {
  search: any;
  schedule: Date | null;
  noted: { notedBy: string; time: Date }[];
  images: string[];
  read: { readAt: string; readBy: string }[];
  content?: string;
  contentModel?: string;
  user: EmployeeType;
  toAll: boolean;
  toUser: EmployeeType[];
  fromModel: "Employee" | "Company";
  ref: string;
  route: string;
  message: string;
  title: string;
  from: EmployeeType;
  contentType: string;
  preview: boolean;
}

export interface PositionType extends RequirementType {
  profile: ProfileType;
  name: string;
  keyword: string;
  company: CompanyType;
  level: number;
  allDepartment: boolean;
  department: string[];
  workPeriods: string;
  employeeClassification: string;
  wageInformation: string;
  insuranceType: string;
  isHeadOfDepartment: boolean;
  budgetCode: string;
  contractType: string;
  compensationRegion: string;
  color: ColorType;
  ref: string;
  description: string;
  isPublic: boolean;
  createdBy: EmployeeType;
  employees: number;
}

export interface BranchType extends RequirementType {
  name: string;
  keyword: string;
  location: {
    type: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
  company: CompanyType;
}

export type OffPolicyType = {
  name: string;
  company: CompanyType;
  allowDaysInAYear: number;
  allowDaysInAMonth: number;
  allowDaysInAWeek: number;

  excludeLeaves: LeaveType[];
  baseOnSunday: boolean;
  allDepartment: boolean;
  department: DepartmentType[];
  createdBy: EmployeeType;
};

export type WarningPolicyType = RequirementType & {};

export type CompanyType = RequirementType & {
  name: string;
  otherName: OtherNameType[];
  cover: { url: string };
  payslip: string;
  profile: ProfileType;
  profileCollection: ImageCollectionType;
  coverCollection: ImageCollectionType;
  phone: string;
  nameHistory: Date;
  logo: string;
  keyword: string;
  description: string;
  address: string;
  database: string;
  startingDate: Date;
  overtimeRate: number;
  overtimeRequestAllowHours: number;
  attendanceSetting: {
    setting: AttendanceSettingType;
    usedBy: EmployeeType;
  };
  currency: CurrencyType;
  offDayRate: number;
  holidayRate: number;
  employees: number;
  contactInformation: {
    emails: string;
    phone: string;
  };
  warningPolicy: {
    policy: WarningPolicyType;
    usedBy: EmployeeType;
  };
  offPolicy: {
    policy: OffPolicyType;
    usedBy: EmployeeType;
  };
  formatDate: string;
};

export type HolidayType = RequirementType & {
  name: string;
  keyword: string;
  profile: ProfileType;
  description: string;
  date: Date;
  countries: string[];
  company: CompanyType;
  departments: string[];
  icon: string;
  isPublic: boolean;
  paidType: "Paid" | "Unpaid" | "HalfPaid";
  excludeCountries: string[];
  excludeDays: string[];
  department: string[];
};

export type AllowanceType = RequirementType & {
  name: string;
  keyword: string;
  description: string;
  currency: CurrencyType;
  isTaxable: boolean;
  ref: string;
  minimumWorkingDaysPerMonth: number;
  frequency: "Monthly" | "Yearly" | "Once";
  amount: number;
  company: CompanyType;
};

export interface DeductionType extends RequirementType {
  name: string;
  keyword: string;
  currency: CurrencyType;
  description: string;
  deductBySalary: number;
  company: CompanyType;
  frequency: "Monthly" | "Yearly" | "Once";
  ref: string;
  amount: number;
  icon: string;
}

export interface CurrencyType extends RequirementType {
  symbol: string;
  name: string;
  keyword: string;
  lastUpdated: Date;
  company: CompanyType;
  isPublic: boolean;
}

export interface ProfileType {
  state: "profile" | "cover" | "leaveRequest";
  image: ImageType;
  extension: string;
}

export interface AssetType extends RequirementType {
  name: string;
  keyword: string;
  type: string;
  company: CompanyType;
  profile: ProfileType;

  department: DepartmentType;
  forAll: boolean;
  forDepartment: DeductionType[];
  amount: number;
  currency: CurrencyType;
  ref: string;
  location: string;
  condition: string;
  lifecycle: string;
  purchaseDate: Date;
  depreciation: number;
  maintenanceSchedule: string;
  assetPerformance: string;
  auditInformation: string;
  isPublic: boolean;
  createdBy: EmployeeType;
}

export type GroupType = RequirementType & {
  name: string;
  department: DepartmentType;
  username: string;
  admins: string[];
  managers: string[];
  members: string[];
  messages: MessageType[];
};

export type ImageType = RequirementType & {
  state: "profiles" | "covers" | "leaveRequests";
  folder: "profiles" | "covers" | "leaveRequests";
  image: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  };
};

export type LanguageType = RequirementType & {
  name: string;
  key: string;
  jsonData: any;
  ref: string;
};

export type OvertimeRequestType = RequirementType & {
  employee: EmployeeType;
  overtimeHours: number;
  reason: string;
  requestedBy: EmployeeType;
  status: StatusType;
  approvedBy: EmployeeType;
  comments: string;
  attendance: AttendanceType;
  department: DepartmentType;
  shift: ShiftType;
};

export type SalaryType = RequirementType & {
  date: Date;
  useFlexibleWorkingHour: number;
  employeeDeductions: DeductionType[];
  serviceHours: number;
  absences: number;
  month: String;
  overtimeAmount: number;
  leaves: number;
  employee: EmployeeType;
  perDay: number;
  perHour: number;
  totalServiceHours: number;
  totalWorkingHours: number;
  department: { name: string; color: { back: string; text: string } };
  position: { name: string; _id: string };
  salary: number;
  serviceDays: number;
  offDays: number;
  empCurrency: {
    _id: any;
    symbol: string;
  };
  leaveDays: {
    name: string;
    value: number;
    isPublicHoliday: boolean;
    type: string;
    rate: number;
    amount: number;
  }[];
  lateMinutes: number;
  earlyOutMinutes: number;
  lateAmount: number;
  earlyOutAmount: number;
  overtime: number;
  allowances: number;
  deductions: number;
  totalAllowances: any[];
  earning: number;
  totalDeductions: any[];
  netSalary: number;
  paid: boolean;
  paidStatus: "Pending" | "Paid" | "Unpaid";
  attendances: number;
  shifts: number;
  safeLate: boolean;
  safeEarlyOut: boolean;
  checked: boolean;
  paidBy: EmployeeType;
};

export function capitalizeFirstLetter(string: string) {
  return string.replace(/^\w/, (c) => c.toUpperCase());
}

export type MinuteType = {
  _id: string;
  title: "late" | "earlyOut";
  allowMinutesPerMonth: number;
  allowMinutesPerDay: number;
  allowTimePerMonth: number;
  minuteCutRate: number;
  customCut: {
    rate: number;
    currency: CurrencyType;
  }; // Per Minute
};

export type AttendanceSettingType = RequirementType & {
  title: string;
  department: DepartmentType[];
  allDepartment: boolean;
  company: CompanyType;
  late: MinuteType;
  earlyOut: MinuteType;
};

export type ErrorResponse = {
  response: { data: { error: string } };
};

export type ResignationType = RequirementType & {
  approvedBy: EmployeeType;
  approvedByHR: EmployeeType;
  employee: EmployeeType;
  resignationDate: Date;
  reason: string;
  comments: CommentType[];
  isEmergency: boolean;
  forwardingAddress: string;
  status: StatusType;
  hrStatus: StatusType;
  exitInterviewDate: Date;
  finalWorkingDay: Date;
  isPublic: boolean;
  autoBanned: boolean;
  why: string[];
  state: "published" | "draft" | "scheduled";
  company: CompanyType;
  department: DepartmentType;
};

export type WarningStateType = RequirementType & {
  name: string;
  durationMonth: number;
};

export type WarningType = RequirementType & {
  title: string;
  employee: EmployeeType;
  approvedBy: EmployeeType;
  issuedDate: Date;
  informTo: EmployeeType[];
  durationByMonth: number;
  detailsOfIncident: string;
  correctiveAction: string;
  employeeComments: string;
  createdBy: EmployeeType;
  department: DepartmentType;
  witnessedBy: EmployeeType[];
  issuedBy: EmployeeType[];
  state: StateType;
  status: StatusType;
  warningState: WarningStateType;
  scheduled: Date;
  company: CompanyType;
  branch: BranchType;
};

export type TerminationType = RequirementType & {
  employee: EmployeeType;
  employees: EmployeeType[];
  terminationDate: Date;
  reason: string;
  status: StatusType;
  why: string[];
  comments: CommentType[];
  department: DepartmentType;
  company: CompanyType;
};

export type CommentType = RequirementType & {
  employee: EmployeeType;
  comment: string;
  edited: boolean;
  oldComments: { comment: string; editedAt: Date }[];
};

export type PostType = RequirementType & {
  title: string;
  ref: string;
  content: string;
  images: ImageType;
  company: CompanyType;
  postBy: EmployeeType;
  fromModel: "Employee" | "Company";
  forUser: string[];
  forAll: boolean;
  noted: {
    notedBy: EmployeeType;
    notedAt: Date;
    readNotedBy: EmployeeType[];
  }[];
  schedule: Date;
  status: string;
  updated: {
    updatedBy: EmployeeType;
    updatedData: any;
    updatedAt: Date;
  };
  createdBy: EmployeeType;
};

export type PromotionRequestType = RequirementType & {
  employee: EmployeeType;
  reviewedBy: EmployeeType;
  reviewedDate: Date;
  oldPosition: PositionType;
  newPosition: PositionType;
  newSalary: number;
  oldSalary: number;
  amount: number;

  date: Date;
  managerComment: string;
  comments: CommentType[];
  reason: string;
  state: "draft" | "published" | "scheduled";
  qualifications: string[];

  status: StatusType;
  hrStatus: StatusType;
  approvedBy: EmployeeType;
  approvedByHR: EmployeeType;

  department: DepartmentType;
  rejectReason: string;
};

export type TelegramUserType = {
  id: string;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  promptTokens: number;
  completionTokens: number;
  employee: EmployeeType;
  company: CompanyType;
  department: DepartmentType;
  isPublic: boolean;
  isEmployee: boolean;
};

export type RefIDType =
  | "probation-end"
  | "one-year-end"
  | "two-year-end"
  | "three-year-end";

export type EvaluationType = RequirementType & {
  name: string;
  otherName: OtherNameType[];
  skillType: "people" | "job";
  levelType: "manager" | "staff" | "all";
  appraisalType: "probation-end" | "year-end";
  description: string;
};

export type DevelopmentplanType = RequirementType & {
  question: string;
};

export type DevelopmentplanAppraisalType = {
  developmentplan: DevelopmentplanType;
  plan: string;
};

export type EvaluationAppraisalType = {
  evaluation: EvaluationType;
  rating: number;
  comment: string;
  comments: CommentType[];
  plan: string;
};

export type AppraisalType = RequirementType & {
  status: StatusType;
  state: StateType;
  employee: EmployeeType;
  approvedBy: EmployeeType;
  reviewedBy: EmployeeType;
  evaluations: EvaluationAppraisalType[];
  developmentplans: DevelopmentplanAppraisalType[];
  employeeComments: string;
  department: DepartmentType;
  refId: RefIDType;
};

export type EndEmployeeContractType = RequirementType & {
  employee: EmployeeType;
  reason: string;
  endDate: Date;
  refId: RefIDType;
  startClearanceNow: boolean;
  textEditor: TextEditorType;

  status: StatusType;
  approvedBy: EmployeeType;
};

export type EmployeeContractType = RequirementType & {
  employee: EmployeeType;
  reason: string;
  newSalary: number;
  startDate: Date;
  endDate: Date;
  refId: RefIDType;
  // textEditor: TextEditorType;
  contract: any;
  company: CommentType;
};

export type TextEditorModuleType = "endcontract" | "contract";

export type TextEditorType = RequirementType & {
  name: string;
  content: string;
  module: TextEditorModuleType;
  ref: string;
  state: StateType;
};

export type SalaryIncrementType = RequirementType & {
  title: string;
  date: Date;
  amount: number;
  employee: EmployeeType;
  informTo: EmployeeType;
  ref: string;
  reason: string;
  schedule: Date;
  status: StatusType;
  state: StateType;
  createdBy: EmployeeType;

  department: DepartmentType;
};

export type LeaveAdjustmentType = {
  employee: EmployeeType;
  serviceDays: number;
  serviceMonths: number;
  serviceYears: number;
  excludedDays: number;
  employeeServiceDays: number;
  available: number;
  nowAvailable: number;
  leave: string;
  taken: number;
  carryLeave?: number;
};

export type ImageCollectionType = RequirementType & {
  author: EmployeeType;
  fromModel: string;
  images: ImageType[];
  status: StateType;
  ref: string;
  description: string;
};

export type CompanyContractType = RequirementType & {
  name: string;
  textEditor: TextEditorType[];
  company: CompanyType;
  leaves: LeaveType;
  serviceHourPerDay: number;
  holidays: number;
};

export type FingerprintUserType = {
  uid: number;
  role: number;
  name: string;
  password: number;
  cardno: number;
  userId: string;
  ip: string;
  fingerprint: string;
};

export type RatingType = {
  comment: string;
  evaluation: EvaluationType;
  rating: number;
};

export type PlannerResponseType = {
  shift?: ShiftType;
  attendance?: AttendanceType;
};

export type UpdateDataType =
  | ({ title: "attendances" | "shifts" } & AttendanceType)
  | ({ title: "attendances" | "shifts" } & ShiftType);
