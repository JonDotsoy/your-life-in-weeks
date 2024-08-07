const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const birth = new Date(1992, 7, 28);
const currentTime = { current: new Date(1992, 7, 28) };

const weeksIndexState = { current: 0 };
const yearState = { current: 0 };

const weekMdDraft = Bun.file("WEEKS_DRAFT.md");
const weekMdDraftWriter = weekMdDraft.writer();

while (yearState.current < 90) {
    currentTime.current = new Date(currentTime.current.getTime() + WEEK_MS);
    weeksIndexState.current += 1;
    weekMdDraftWriter.write(`<!-- ## Week ${weeksIndexState.current} - ${currentTime.current.toDateString()} -->\n\n`);
    yearState.current = currentTime.current.getUTCFullYear() - birth.getUTCFullYear();
}

await weekMdDraftWriter.end()
