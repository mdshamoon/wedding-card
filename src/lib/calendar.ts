// Calendar helpers. Event times in config are local IST (UTC+05:30).
const IST = "+05:30";

export type CalEvent = {
  title: string;
  venue: string;
  address: string;
  start: string; // local ISO, assumed IST
  end: string;
};

/** Local-IST ISO → UTC stamp "YYYYMMDDTHHMMSSZ" for calendars. */
function stamp(localISO: string): string {
  const d = new Date(localISO + IST);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Google Calendar "add event" URL. */
export function gcalUrl(e: CalEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    location: `${e.venue}, ${e.address}`,
    details: `${e.title} — we would love to have you there.`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build a .ics file and trigger a download (works for Apple/Outlook). */
export function downloadIcs(e: CalEvent): void {
  const uid = `${stamp(e.start)}-${e.title.replace(/\s+/g, "")}@wedding`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shamoon & Alina//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(e.start)}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${e.title}`,
    `LOCATION:${e.venue}\\, ${e.address}`,
    `DESCRIPTION:${e.title} — we would love to have you there.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Google Maps directions URL for a place query. */
export function directionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
