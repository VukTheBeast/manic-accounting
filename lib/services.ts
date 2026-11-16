export type ServiceId =
  | "bookkeeping"
  | "budgets"
  | "cashflow"
  | "tax"
  | "reporting"
  | "leasebuy"
  | "unsure";

export type Service = {
  id: ServiceId;
  label: string;
  /** shown on the services card and in the contact form */
  desc: string;
};

export const SERVICES: Service[] = [
  {
    id: "bookkeeping",
    label: "Bookkeeping & month-end close",
    desc: "General ledger, accruals, reconciliations and a proper close. Every account explained, every month.",
  },
  {
    id: "budgets",
    label: "Budgets & forecasts",
    desc: "An annual budget, a monthly forecast and variance reports you will actually read to the end.",
  },
  {
    id: "cashflow",
    label: "13-week cash flow",
    desc: "Short-term cash visibility, so payday and tax day never ambush you.",
  },
  {
    id: "tax",
    label: "VAT & corporate tax prep",
    desc: "Preparation and filing support. Experience across Czechia, Bulgaria and Romania.",
  },
  {
    id: "reporting",
    label: "Management reporting",
    desc: "P&L and balance sheet analysis, cost transparency and KPIs, explained in plain language.",
  },
  {
    id: "leasebuy",
    label: "Lease vs. buy & business cases",
    desc: "Cost-benefit analysis before you sign anything: a new car, machine or office.",
  },
  {
    id: "unsure",
    label: "Not sure yet, help me figure it out",
    desc: "No problem. Describe what hurts and we will work out what you need on the intro call.",
  },
];

export const serviceById = (id: string): Service =>
  SERVICES.find((s) => s.id === id) ?? SERVICES[0];
