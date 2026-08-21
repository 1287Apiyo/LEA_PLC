This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## LEA AI Learning Coach

The learner portal now includes `/learner/coach`, a course-aware AI Learning Coach. Learners can select an enrolled course and lesson, ask for concept explanations, request hints, practise debugging, and receive a next-step study prompt. The server endpoint is `/api/v1/learner/ai-coach` and enforces learner authentication plus enrolment access before sending course context to the model.

To enable live model responses locally, add the provider credentials to `.env.local` on the server. Never expose these values through `NEXT_PUBLIC_*` variables:

```env
OPENAI_API_BASE=https://api.openai.com
OPENAI_API_KEY=replace-with-a-server-only-key
LEA_AI_MODEL=gpt-5-mini
```

The endpoint also supports an OpenAI-compatible built-in provider by setting `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`; those variables take precedence over the `OPENAI_*` pair. If no provider is configured, the interface remains usable and returns a guided fallback message rather than failing silently. The coach is designed to explain and scaffold learning, not complete assessed work, submit assignments, or reveal private learner records.
