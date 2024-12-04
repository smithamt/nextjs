import { roles } from "@/roles";
import { countries } from "./countries";
import { FormType } from "@/components/form/client";

export const ethnicGroups = [
  "Burmese",
  "Shan",
  "Karen",
  "Rakhine",
  "Mon",
  "Kachin",
  "Kayah",
  "Kayin",
  "Chin",
  "Rohingya",
  "Zomi",
  "Han Chinese",
  "Bengali",
  "Russian",
  "Japanese",
  "Punjabi",
  "German",
  "Javanese",
  "Vietnamese",
  "Turkish",
  "Italian",
  "Mexican",
  "Filipino",
  "English",
  "Marathi",
  "Tamil",
  "French",
];

export const bodyHeight = [
  "150cm",
  "155cm",
  "160cm",
  "165cm",
  "170cm",
  "175cm",
  "180cm",
  "185cm",
  "190cm",
  "195cm",
  "200cm",
];

export const bodyWeight = [
  "100lb",
  "110lb",
  "120lb",
  "130lb",
  "140lb",
  "150lb",
  "160lb",
  "170lb",
  "180lb",
  "190lb",
  "200lb",
];

export const channels = [
  "E-Recruit",
  "Advertising",
  "Internal Recommend",
  "Job Intermediary",
  "Others",
];

export const languages = [
  "English",
  "Burmese",
  "Español",
  "Français",
  "Deutsch",
  "Italiano",
  "Português",
  "Polski",
  "Русский",
  "中文",
  "日本語",
  "한국어",
  "العربية",
  "हिन्दी",
  "Türkçe",
];

export const maritalstatus = [
  { name: "Single" },
  { name: "Married" },
  { name: "Divorced" },
  { name: "Widowed" },
  { name: "Separated" },
];

export const degreeOfvision = [
  "20/20",
  "20/40",
  "20/60",
  "20/80",
  "20/100",
  "20/200",
  "20/400",
  "20/800",
];

export const levelOfEducation = [
  "No formal education",
  "Primary education",
  "Secondary education",
  "Vocational/Technical education",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate degree",
];

export const skillLevels = ["Basic", "Intermediate", "Advanced"];

export const employeeTypes = [
  "fullTime",
  "partTime",
  "probation",
  "contract",
  "intern",
  "temporary",
];

export const salaryType = [
  "Hourly",
  "Salary",
  "Commission",
  "Bonus",
  "Overtime",
];

export const hearingLevels = [
  "Normal Hearing",
  "Slight Hearing Loss",
  "Mild Hearing Loss",
  "Moderate Hearing Loss",
  "Moderately Severe Hearing Loss",
  "Severe Hearing Loss",
  "Profound Hearing Loss",
];

export const initialForm: FormType = {
  profile: { type: "image" },
  name: { value: "", type: "text" },
  nickname: { value: "", type: "text" },
  employeeId: { value: "", type: "text" },
  fingerprintId: { value: "", type: "text" },
  position: { value: "", type: "select" },
  nationality: {
    value: "",
    type: "select",
    data: countries,
  },
  email: { value: "", type: "email" },
  salary: { value: "", type: "number" },
  salaryType: { value: "", type: "select", data: salaryType },
  currency: { value: "", type: "select" },
  role: { value: "user", type: "select", data: roles },
  department: { value: "", type: "select" },
  branch: { value: "", type: "select" },
  gender: {
    value: "",
    type: "select",
    data: ["Male", "Female"],
  },
  maritalStatus: {
    value: "",
    type: "select",
    data: maritalstatus,
  },
  employeeType: {
    value: "",
    type: "select",
    data: employeeTypes,
  },
  levelOfEducation: {
    value: "",
    type: "select",
    data: levelOfEducation,
  },
  ethnicGroup: {
    value: "",
    type: "select",
    data: ethnicGroups,
  },
  height: {
    value: "",
    type: "select",
    data: bodyHeight,
  },
  weight: {
    value: "",
    type: "select",
    data: bodyWeight,
  },
  computerSkill: {
    value: "",
    type: "select",
    data: skillLevels,
  },
  //@ts-ignore
  joinedDate: { value: new Date(), type: "date" },
  //@ts-ignore
  probationMonth: { value: 3, type: "number" },
  //@ts-ignore
  dateOfBirth: { value: new Date(), type: "date" },
  contactNo: { value: "", type: "text" },
  passportNo: { value: "", type: "text" },
  idCardNo: { value: "", type: "text" },
  emergencyContact: { value: "", type: "text" },
  emergencyCall: { value: "", type: "text" },
  channels: { value: "", type: "text" },
  language: { value: "", type: "select" },
  languages: {
    value: "",
    type: "select",
    data: languages,
  },
  degreeOfVision: { value: "", type: "text", data: degreeOfvision },
  hearingLevel: {
    value: "",
    type: "select",
    data: hearingLevels,
  },
  anyCriminalHistory: { value: "", type: "text" },
  permanentAddress: { value: "", type: "textarea" },
  currentAddress: { value: "", type: "textarea" },
};

export const leavePaid = [
  { name: "Paid" },
  { name: "Unpaid" },
  { name: "Half Paid" },
];

export const gender = [{ name: "All" }, { name: "Male" }, { name: "Female" }];
