build-static:
	bun build make-your-life-in-weeks-md.ts --outfile static/make-your-life-in-weeks-md.js

fmt-static:
	bunx prettier -w static
