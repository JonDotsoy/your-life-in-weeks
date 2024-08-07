// make-your-life-in-weeks-md.ts
interface Writer {
    write(chunk: string): void
    end(): Promise<any> | any
}

export const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEK_MS = 7 * DAY_MS;
export const MAX_YEARS = 90;

const birthIcons = [
    '🥳',
    '🎂',
    '🎉',
    '🎁',
    '🎊',
];

const birthIconsCursorState = { current: 0 }
const nextBirthIcon = () => {
    birthIconsCursorState.current += 1;
    return birthIcons[birthIconsCursorState.current % birthIcons.length];
}

type TextTransform = (t: string) => string
export class TitleElement {
    level = 2;
    active = false;
    withBirthIcon = false;

    constructor(public text: string) { }

    toString() {
        const pipeline: TextTransform[] = [
            t => this.withBirthIcon ? `${t} ${nextBirthIcon()}` : t,
            t => '#'.repeat(this.level) + ' ' + t,
            t => this.active ? t : `<!-- ${t} -->`,
            t => `${t}\n\n`
        ];

        return pipeline.reduce((acc, cur) => cur(acc), this.text);
    }
}

export async function makeYourLifeInWeeks(birth: Date, writer: Writer) {
    const currentTime = { current: new Date(birth) };

    const weeksIndexState = { current: 0 };
    const yearState = { current: 0 };

    while (yearState.current < MAX_YEARS) {
        const eventsText: string[] = []
        const birthPeriod = new Date(currentTime.current.getFullYear(), birth.getUTCMonth(), birth.getUTCDate());
        const startWeek = new Date(currentTime.current);
        const endWeek = new Date(currentTime.current.getTime() + WEEK_MS);
        const isWeekOfBirthday = birthPeriod >= startWeek && birthPeriod < endWeek;
        const line = new TitleElement(`Week ${weeksIndexState.current} - ${currentTime.current.toDateString()}`);
        if (isWeekOfBirthday) {
            line.withBirthIcon = true;
            line.active = true;
            const age = endWeek.getUTCFullYear() - birth.getUTCFullYear();
            if (age) { eventsText.push(`This week you turn ${age} years old.`) }
            if (age === 0) {
                eventsText.push(`This week you were born.`);
            }
        }
        currentTime.current = endWeek;
        weeksIndexState.current += 1;
        writer.write(line.toString());
        eventsText.forEach(t => writer.write(`${t}\n\n`));
        yearState.current = currentTime.current.getUTCFullYear() - birth.getUTCFullYear();
    }
}

