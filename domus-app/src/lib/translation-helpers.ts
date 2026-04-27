import { TranslationKey } from "@/lib/i18n";

type TranslateFn = (key: TranslationKey) => string;

// ─── Category ─────────────────────────────────────────────────────────────────

const CAT_KEYS: Record<string, TranslationKey> = {
  Rent:        "cat.rent",
  Utility:     "cat.utility",
  Tax:         "cat.tax",
  Maintenance: "cat.maintenance",
  Insurance:   "cat.insurance",
  Other:       "cat.other",
};

/** Returns the translated category label, or the raw string for user-created categories. */
export function categoryLabel(cat: string, t: TranslateFn): string {
  return CAT_KEYS[cat] ? t(CAT_KEYS[cat]) : cat;
}

// ─── Demo expense title ────────────────────────────────────────────────────────

const TITLE_KEYS: Record<string, TranslationKey> = {
  "Monthly Rent":       "demo.monthlyRent",
  "Electricity Bill":   "demo.electricityBill",
  "Water & Sewage":     "demo.waterSewage",
  "Internet Service":   "demo.internetService",
  "HVAC Maintenance":   "demo.hvacMaintenance",
  "Property Tax Q2":    "demo.propertyTax",
  "Building Insurance": "demo.buildingInsurance",
  "Landscaping":        "demo.landscaping",
  "Pest Control":       "demo.pestControl",
};

/** Returns the translated demo expense title, or the raw string for user-created expenses. */
export function expenseTitleLabel(title: string, t: TranslateFn): string {
  return TITLE_KEYS[title] ? t(TITLE_KEYS[title]) : title;
}

// ─── Property type ─────────────────────────────────────────────────────────────

const PROP_TYPE_KEYS: Record<string, TranslationKey> = {
  Apartment: "proptype.apartment",
  Villa:     "proptype.villa",
  Loft:      "proptype.loft",
  House:     "proptype.house",
  Studio:    "proptype.studio",
};

/** Returns the translated property type label, or the raw string for unknown types. */
export function propTypeLabel(type: string, t: TranslateFn): string {
  return PROP_TYPE_KEYS[type] ? t(PROP_TYPE_KEYS[type]) : type;
}
