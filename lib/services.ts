import type { Locale } from "@/i18n/routing";

export type ServiceId =
  | "cfo"
  | "planning"
  | "reporting"
  | "bookkeeping"
  | "cashflow"
  | "modeling"
  | "tax"
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
      id: "cfo",
      label: "Financial Management & virtual CFO services",
      desc: "Practical finance leadership without a full-time hire: priorities, performance, decisions and a clear financial rhythm for the business.",
    },
    {
      id: "planning",
      label: "Financial Planning, Budgeting & Forecasting",
      desc: "Budgets and rolling forecasts that connect your plans to revenue, costs, capacity and the decisions ahead.",
    },
    {
      id: "reporting",
      label: "Management Reporting & KPI dashboards",
      desc: "Decision-ready reporting with the right KPIs, clear variance analysis and no spreadsheet archaeology.",
    },
    {
      id: "bookkeeping",
      label: "Bookkeeping & Accounting (IFRS / US & local GAAP)",
      desc: "Reliable books, reconciliations and month-end close, structured around the reporting framework your business needs.",
    },
    {
      id: "cashflow",
      label: "Cash Flow Forecasting",
      desc: "Short- and medium-term cash visibility, including 13-week cash flow forecasting, so funding needs never arrive as a surprise.",
    },
    {
      id: "modeling",
      label: "Financial Modeling & Business Valuation",
      desc: "Clear models for scenarios, investment choices, funding conversations and understanding what the business may be worth.",
    },
    {
      id: "tax",
      label: "UK & EU Taxation (Personal, Corporate & VAT)",
      desc: "Practical support with tax planning, preparation and compliance across personal, corporate and VAT matters.",
    },
    {
      id: "unsure",
      label: "Not sure yet, help me figure it out",
      desc: "No problem. Describe what hurts and we will work out what you need on the intro call.",
    },
  ],
  cs: [
    {
      id: "cfo",
      label: "Finanční řízení a služby virtuálního CFO",
      desc: "Praktické finanční vedení bez potřeby zaměstnat CFO na plný úvazek: priority, výkonnost, rozhodování a jasný finanční rytmus firmy.",
    },
    {
      id: "planning",
      label: "Finanční plánování, rozpočty a prognózy",
      desc: "Rozpočty a průběžné prognózy, které propojí vaše plány s tržbami, náklady, kapacitou a dalšími rozhodnutími.",
    },
    {
      id: "reporting",
      label: "Manažerský reporting a KPI dashboardy",
      desc: "Reporting připravený pro rozhodování, se správnými KPI, srozumitelnou analýzou odchylek a bez pátrání v tabulkách.",
    },
    {
      id: "bookkeeping",
      label: "Účetnictví (IFRS / US a lokální GAAP)",
      desc: "Spolehlivé účetnictví, odsouhlasení a měsíční uzávěrky podle účetního rámce, který vaše firma potřebuje.",
    },
    {
      id: "cashflow",
      label: "Prognózování a řízení cash flow",
      desc: "Krátkodobý i střednědobý přehled o hotovosti včetně 13týdenního cash flow, aby vás potřeba financování nepřekvapila.",
    },
    {
      id: "modeling",
      label: "Finanční modelování a oceňování podniků",
      desc: "Srozumitelné modely pro scénáře, investiční rozhodnutí, jednání o financování a odhad hodnoty firmy.",
    },
    {
      id: "tax",
      label: "Daně ve Velké Británii a EU (fyzické osoby, firmy a DPH)",
      desc: "Praktická podpora při daňovém plánování, přípravě a plnění povinností u osobních, firemních a DPH záležitostí.",
    },
    {
      id: "unsure",
      label: "Ještě nevím, pomozte mi to zjistit",
      desc: "Žádný problém. Popište, co vás trápí, a při úvodním hovoru společně zjistíme, co potřebujete.",
    },
  ],
  sr: [
    {
      id: "cfo",
      label: "Finansijsko upravljanje i usluge virtuelnog CFO-a",
      desc: "Praktično finansijsko vođstvo bez zapošljavanja CFO-a sa punim radnim vremenom: prioriteti, učinak, odluke i jasan finansijski ritam.",
    },
    {
      id: "planning",
      label: "Finansijsko planiranje, budžetiranje i prognoziranje",
      desc: "Budžeti i tekuće prognoze koji povezuju planove sa prihodima, troškovima, kapacitetom i budućim odlukama.",
    },
    {
      id: "reporting",
      label: "Menadžersko izveštavanje i KPI kontrolne table",
      desc: "Izveštaji spremni za odlučivanje, sa pravim KPI pokazateljima, jasnom analizom odstupanja i bez kopanja po tabelama.",
    },
    {
      id: "bookkeeping",
      label: "Knjigovodstvo i računovodstvo (IFRS / US i lokalni GAAP)",
      desc: "Pouzdane knjige, usaglašavanja i mesečno zatvaranje prema računovodstvenom okviru koji je potreban vašem poslovanju.",
    },
    {
      id: "cashflow",
      label: "Prognoziranje i upravljanje novčanim tokom",
      desc: "Kratkoročna i srednjoročna preglednost gotovine, uključujući 13-nedeljnu prognozu, da potreba za finansiranjem ne bude iznenađenje.",
    },
    {
      id: "modeling",
      label: "Finansijsko modeliranje i procena vrednosti poslovanja",
      desc: "Jasni modeli za scenarije, investicione odluke, razgovore o finansiranju i razumevanje moguće vrednosti poslovanja.",
    },
    {
      id: "tax",
      label: "Porezi u Ujedinjenom Kraljevstvu i EU (lični, korporativni i PDV)",
      desc: "Praktična podrška za poresko planiranje, pripremu i usklađenost kod ličnih, korporativnih i PDV pitanja.",
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
