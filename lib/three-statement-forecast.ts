export type ForecastFrequency = "monthly" | "annual";

export type ForecastInputs = {
  frequency: ForecastFrequency;
  periods: number;
  revenue: number;
  directCosts: number;
  operatingExpenses: number;
  cash: number;
  receivables: number;
  otherCurrentAssets: number;
  fixedAssets: number;
  payables: number;
  otherCurrentLiabilities: number;
  debt: number;
  annualRevenueGrowth: number;
  annualOpexGrowth: number;
  grossMargin: number;
  dso: number;
  dpo: number;
  capexPercent: number;
  annualDepreciationRate: number;
  annualInterestRate: number;
  monthlyDebtRepayment: number;
  taxRate: number;
};

export type ForecastPeriod = {
  label: string;
  revenue: number;
  directCosts: number;
  grossProfit: number;
  operatingExpenses: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  profitBeforeTax: number;
  tax: number;
  netIncome: number;
  cash: number;
  receivables: number;
  otherCurrentAssets: number;
  fixedAssets: number;
  totalAssets: number;
  payables: number;
  otherCurrentLiabilities: number;
  debt: number;
  equity: number;
  totalLiabilitiesAndEquity: number;
  balanceCheck: number;
  changeReceivables: number;
  changePayables: number;
  cashFromOperations: number;
  capex: number;
  cashFromInvesting: number;
  debtRepayment: number;
  cashFromFinancing: number;
  netCashChange: number;
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function periodLabel(index: number, frequency: ForecastFrequency) {
  if (frequency === "annual") return `Y${index + 1}`;
  const year = Math.floor(index / 12) + 1;
  return `${MONTH_NAMES[index % 12]} Y${year}`;
}

export function calculateThreeStatementForecast(
  inputs: ForecastInputs,
): ForecastPeriod[] {
  const periods: ForecastPeriod[] = [];
  const monthsInPeriod = inputs.frequency === "annual" ? 12 : 1;
  const daysInPeriod = inputs.frequency === "annual" ? 365 : 30;
  const periodFraction = monthsInPeriod / 12;
  const revenueGrowth =
    inputs.frequency === "annual"
      ? inputs.annualRevenueGrowth
      : (1 + inputs.annualRevenueGrowth) ** (1 / 12) - 1;
  const opexGrowth =
    inputs.frequency === "annual"
      ? inputs.annualOpexGrowth
      : (1 + inputs.annualOpexGrowth) ** (1 / 12) - 1;
  const baseRevenue =
    inputs.frequency === "annual" ? inputs.revenue : inputs.revenue / 12;
  const baseOpex =
    inputs.frequency === "annual"
      ? inputs.operatingExpenses
      : inputs.operatingExpenses / 12;
  const openingEquity =
    inputs.cash +
    inputs.receivables +
    inputs.otherCurrentAssets +
    inputs.fixedAssets -
    inputs.payables -
    inputs.otherCurrentLiabilities -
    inputs.debt;

  let previousCash = inputs.cash;
  let previousReceivables = inputs.receivables;
  let previousPayables = inputs.payables;
  let previousFixedAssets = inputs.fixedAssets;
  let previousDebt = inputs.debt;
  let previousEquity = openingEquity;

  for (let index = 0; index < inputs.periods; index++) {
    const revenue = baseRevenue * (1 + revenueGrowth) ** (index + 1);
    const directCosts = revenue * (1 - inputs.grossMargin);
    const grossProfit = revenue - directCosts;
    const operatingExpenses = baseOpex * (1 + opexGrowth) ** (index + 1);
    const ebitda = grossProfit - operatingExpenses;
    const capex = revenue * inputs.capexPercent;
    const depreciation = Math.min(
      previousFixedAssets + capex,
      (previousFixedAssets + capex / 2) *
        inputs.annualDepreciationRate *
        periodFraction,
    );
    const ebit = ebitda - depreciation;
    const interestExpense =
      previousDebt * inputs.annualInterestRate * periodFraction;
    const profitBeforeTax = ebit - interestExpense;
    const tax = Math.max(0, profitBeforeTax * inputs.taxRate);
    const netIncome = profitBeforeTax - tax;

    const receivables = revenue * (inputs.dso / daysInPeriod);
    const payables = directCosts * (inputs.dpo / daysInPeriod);
    const changeReceivables = receivables - previousReceivables;
    const changePayables = payables - previousPayables;
    const cashFromOperations =
      netIncome + depreciation - changeReceivables + changePayables;
    const cashFromInvesting = -capex;
    const debtRepayment = Math.min(
      previousDebt,
      inputs.monthlyDebtRepayment * monthsInPeriod,
    );
    const cashFromFinancing = -debtRepayment;
    const netCashChange =
      cashFromOperations + cashFromInvesting + cashFromFinancing;

    const cash = previousCash + netCashChange;
    const fixedAssets = previousFixedAssets + capex - depreciation;
    const debt = previousDebt - debtRepayment;
    const equity = previousEquity + netIncome;
    const totalAssets =
      cash + receivables + inputs.otherCurrentAssets + fixedAssets;
    const totalLiabilitiesAndEquity =
      payables + inputs.otherCurrentLiabilities + debt + equity;

    periods.push({
      label: periodLabel(index, inputs.frequency),
      revenue,
      directCosts,
      grossProfit,
      operatingExpenses,
      ebitda,
      depreciation,
      ebit,
      interestExpense,
      profitBeforeTax,
      tax,
      netIncome,
      cash,
      receivables,
      otherCurrentAssets: inputs.otherCurrentAssets,
      fixedAssets,
      totalAssets,
      payables,
      otherCurrentLiabilities: inputs.otherCurrentLiabilities,
      debt,
      equity,
      totalLiabilitiesAndEquity,
      balanceCheck: totalAssets - totalLiabilitiesAndEquity,
      changeReceivables,
      changePayables,
      cashFromOperations,
      capex,
      cashFromInvesting,
      debtRepayment,
      cashFromFinancing,
      netCashChange,
    });

    previousCash = cash;
    previousReceivables = receivables;
    previousPayables = payables;
    previousFixedAssets = fixedAssets;
    previousDebt = debt;
    previousEquity = equity;
  }

  return periods;
}

