// make-your-life-in-weeks-md.ts
function makeYourLifeInWeeks(birth, writer) {
  const currentTime = { current: new Date(birth) };
  const weeksIndexState = { current: 0 };
  const yearState = { current: 0 };
  while (yearState.current < MAX_YEARS) {
    const eventsText = [];
    const birthPeriod = new Date(
      currentTime.current.getFullYear(),
      birth.getUTCMonth(),
      birth.getUTCDate(),
    );
    const startWeek = new Date(currentTime.current);
    const endWeek = new Date(currentTime.current.getTime() + WEEK_MS);
    const isWeekOfBirthday = birthPeriod >= startWeek && birthPeriod < endWeek;
    const line = new TitleElement(
      `Week ${weeksIndexState.current} - ${currentTime.current.toDateString()}`,
    );
    if (isWeekOfBirthday) {
      line.withBirthIcon = true;
      line.active = true;
      const age = endWeek.getUTCFullYear() - birth.getUTCFullYear();
      if (age) {
        eventsText.push(`This week you turn ${age} years old.`);
      }
      if (age === 0) {
        eventsText.push(`This week you were born.`);
      }
    }
    currentTime.current = endWeek;
    weeksIndexState.current += 1;
    writer.write(line.toString());
    eventsText.forEach((t) => writer.write(`${t}\n\n`));
    yearState.current =
      currentTime.current.getUTCFullYear() - birth.getUTCFullYear();
  }
}
var DAY_MS = 86400000;
var WEEK_MS = 7 * DAY_MS;
var MAX_YEARS = 90;
var birthIcons = [
  "\uD83E\uDD73",
  "\uD83C\uDF82",
  "\uD83C\uDF89",
  "\uD83C\uDF81",
  "\uD83C\uDF8A",
];
var birthIconsCursorState = { current: 0 };
var nextBirthIcon = () => {
  birthIconsCursorState.current += 1;
  return birthIcons[birthIconsCursorState.current % birthIcons.length];
};

class TitleElement {
  text;
  level = 2;
  active = false;
  withBirthIcon = false;
  constructor(text) {
    this.text = text;
  }
  toString() {
    const pipeline = [
      (t) => (this.withBirthIcon ? `${t} ${nextBirthIcon()}` : t),
      (t) => "#".repeat(this.level) + " " + t,
      (t) => (this.active ? t : `<!-- ${t} -->`),
      (t) => `${t}\n\n`,
    ];
    return pipeline.reduce((acc, cur) => cur(acc), this.text);
  }
}
export { makeYourLifeInWeeks, WEEK_MS, TitleElement, MAX_YEARS, DAY_MS };
