import { useI18n } from "vue-i18n";

export const COMPENSATION = 40000000;

export const VEHICLE_TYPES = [
  {
    label: "constants.vehicleTypes.passenger",
    coefficient: 0.1,
  },
  {
    label: "constants.vehicleTypes.cargo",
    coefficient: 0.12,
  },
  {
    label: "constants.vehicleTypes.bus",
    coefficient: 0.12,
  },
  {
    label: "constants.vehicleTypes.other",
    coefficient: 0.04,
  },
];

export const PERIODS = [
  {
    label: "constants.periods.oneYear",
    coefficient: 1,
  },
  {
    label: "constants.periods.sixMonths",
    coefficient: 0.7,
  },
  {
    label: "constants.periods.registration",
    coefficient: 0.2,
  },
];

export const REGIONS = [
  {
    label: "constants.regions.tashkent",
    coefficient: 1.4,
  },
  {
    label: "constants.regions.other",
    coefficient: 1,
  },
];

export const LIMITS = [
  {
    label: "constants.limits.unlimited",
    coefficient: 3,
  },
  {
    label: "constants.limits.limited",
    coefficient: 1,
  },
];

export const INCIDENTS = [
  {
    label: "constants.incidents.first",
    coefficient: 1,
    type: "GENERAL",
  },
  {
    label: "constants.incidents.oneCase",
    coefficient: 2,
    type: "LIMITED",
  },
  {
    label: "constants.incidents.twoCases",
    coefficient: 2.5,
    type: "LIMITED",
  },
  {
    label: "constants.incidents.threeOrMore",
    coefficient: 3,
    type: "LIMITED",
  },
];

export const POLICY_SERIES = {
  ecclivo: ["ETSL", "ETSU"],
  osgop: ["ETST"],
  osgor: ["ETSI"],
  others: ["ETSD"],
};

export default {
  COMPENSATION,
  INCIDENTS,
  LIMITS,
  PERIODS,
  POLICY_SERIES,
  REGIONS,
  VEHICLE_TYPES,
};
