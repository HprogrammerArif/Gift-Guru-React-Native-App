import { PACKAGE_TYPE } from "react-native-purchases";

export const PREMIUM_FEATURES = [
  "Unlimited AI gift suggestions",
  "Save unlimited gift lists",
  "Smart reminders & alerts",
  "Priority support",
];

export const FEATURES_BY_PLAN: Record<string, string[]> = {
  [PACKAGE_TYPE.MONTHLY]: [
    "Unlimited AI gift suggestions",
    "Save unlimited gift lists",
    "Smart reminders & alerts",
    "Priority support",
  ],
  [PACKAGE_TYPE.ANNUAL]: [
    "Unlimited AI gift suggestions",
    "Save unlimited gift lists",
    "Smart reminders & alerts",
    "Priority support",
    "Early access to new features",
  ],
  [PACKAGE_TYPE.LIFETIME]: [
    "Everything in Annual",
    "Unlimited AI gift suggestions",
    "Save unlimited gift lists",
    "Smart reminders & alerts",
    "Lifetime priority support",
    "Never pay again",
  ]
};
