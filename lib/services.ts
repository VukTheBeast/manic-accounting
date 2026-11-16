import type { Locale } from "@/i18n/routing";

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

const servicesByLocale: Record<Locale, Service[]> = {
  en: [
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
  ],
  cs: [
    {
      id: "bookkeeping",
      label: "Vedení účetnictví a měsíční uzávěrka",
      desc: "Hlavní kniha, časové rozlišení, odsouhlasení a správná uzávěrka. Každý účet vysvětlený, každý měsíc.",
    },
    {
      id: "budgets",
      label: "Rozpočty a výhledy",
      desc: "Roční rozpočet, měsíční výhled a analýza odchylek, kterou skutečně dočtete do konce.",
    },
    {
      id: "cashflow",
      label: "13týdenní cash flow",
      desc: "Krátkodobý přehled o hotovosti, aby vás výplaty ani daně nikdy nezaskočily.",
    },
    {
      id: "tax",
      label: "Příprava DPH a daně z příjmů",
      desc: "Podpora s přípravou a podáním. Zkušenosti z Česka, Bulharska a Rumunska.",
    },
    {
      id: "reporting",
      label: "Manažerský reporting",
      desc: "Analýza výsledovky a rozvahy, transparentní náklady a KPI vysvětlené srozumitelně.",
    },
    {
      id: "leasebuy",
      label: "Leasing, koupě a business case",
      desc: "Analýza nákladů a přínosů před podpisem smlouvy na nové auto, stroj nebo kancelář.",
    },
    {
      id: "unsure",
      label: "Ještě nevím, pomozte mi to zjistit",
      desc: "Žádný problém. Popište, co vás trápí, a při úvodním hovoru společně zjistíme, co potřebujete.",
    },
  ],
  sr: [
    {
      id: "bookkeeping",
      label: "Knjigovodstvo i mesečno zatvaranje",
      desc: "Glavna knjiga, razgraničenja, usaglašavanja i uredno zatvaranje. Svaki račun objašnjen, svakog meseca.",
    },
    {
      id: "budgets",
      label: "Budžeti i prognoze",
      desc: "Godišnji budžet, mesečna prognoza i izveštaji o odstupanjima koje ćete zaista pročitati do kraja.",
    },
    {
      id: "cashflow",
      label: "13-nedeljni tok gotovine",
      desc: "Kratkoročna preglednost gotovine, da vas dan za plate ili porez nikada ne iznenadi.",
    },
    {
      id: "tax",
      label: "Priprema PDV-a i poreza na dobit",
      desc: "Podrška u pripremi i podnošenju. Iskustvo u Češkoj, Bugarskoj i Rumuniji.",
    },
    {
      id: "reporting",
      label: "Menadžersko izveštavanje",
      desc: "Analiza bilansa uspeha i stanja, transparentni troškovi i KPI pokazatelji objašnjeni jednostavno.",
    },
    {
      id: "leasebuy",
      label: "Lizing, kupovina i poslovni slučajevi",
      desc: "Analiza troškova i koristi pre nego što potpišete ugovor za automobil, mašinu ili kancelariju.",
    },
    {
      id: "unsure",
      label: "Nisam siguran, pomozite mi da odlučim",
      desc: "Nema problema. Opišite šta vas muči i na uvodnom razgovoru ćemo utvrditi šta vam je potrebno.",
    },
  ],
};

export const getServices = (locale: Locale): Service[] => servicesByLocale[locale];

export const serviceById = (id: string, locale: Locale): Service => {
  const services = getServices(locale);
  return services.find((service) => service.id === id) ?? services[0];
};
