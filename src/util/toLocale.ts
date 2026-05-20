const DEFAULT_LANG = "en";
const DEFAULT_CURRENCY = "USD";

function getDocument(): Document | undefined {
  return typeof document === "undefined" ? undefined : document;
}

function getLang(): string {
  return (
    import.meta.env.WEBSITE_LANGUAGE ||
    getDocument()?.documentElement.lang ||
    DEFAULT_LANG
  );
}

function getCurrency(): string {
  return (
    import.meta.env.CURRENCY ||
    getDocument()?.documentElement.dataset.currency ||
    DEFAULT_CURRENCY
  );
}

function getLangCode(): string {
  const lang = getLang();

  if (lang === "en") return "en-US";
  if (lang.length === 2) return `${lang}-${lang.toUpperCase()}`;
  if (lang.length === 5) return lang;

  return "en-US";
}

export function formatTime(time: string): string {
  let startDate = new Date();
  const offset = startDate.getTimezoneOffset();
  const timeArr = time.split(":");
  const BaseTime = `${offset / 60 + parseInt(timeArr[0], 10) / 1}:${timeArr[1]}`;
  let newTime = new Date("1970-01-01T" + BaseTime + "Z").toLocaleTimeString(
    getLangCode(),
    {
      hour: "numeric",
      minute: "numeric",
    },
  );

  return newTime;
}

export function formatDate(date: Date): string {
  const newDate = date.toLocaleDateString(getLangCode(), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return newDate;
}

export function formatPrice(price: number): string {
  const formattedPrice = new Intl.NumberFormat(getLangCode(), {
    style: "currency",
    currency: getCurrency(),
  }).format(price);

  return formattedPrice.replaceAll(/\s/g, "");
}
