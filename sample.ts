import { makeYourLifeInWeeks } from "./make-your-life-in-weeks-md";

const w = Bun.file('sample.md').writer()

await makeYourLifeInWeeks(new Date(1991, 6, 13), w)

await w.end();
