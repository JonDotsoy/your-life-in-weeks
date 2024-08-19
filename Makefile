build-static:
	bun build src/make-your-life-in-weeks-md.ts --outfile static/make-your-life-in-weeks-md.js

fmt-static:
	bunx prettier -w static
