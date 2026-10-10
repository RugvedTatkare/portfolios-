# Rugved Tatkare — A Different Game

A cinematic, scroll-driven portfolio built with React, TypeScript, Vite, Three.js and React Three Fiber.

## The journey

**Lobby → About & Skills → Project Locker Room → Stadium Tunnel → Tennis Court**

The entry corridor opens into a wider gallery with individual floating lockers for each featured project. Warm linear lighting, concrete surfaces, metallic details, glass-like panels and a sunset-lit stadium create one continuous walkthrough.

## Featured work

- **SQLGuard** — ML-driven SQL injection detection and live database analytics.
- **SkillLens** — Skill-gap analysis and technology-role recommendations.
- **Legal Document Summarization** — A hybrid BERTSUM/BART NLP pipeline with Flask and React.

Profile and project content lives in `src/data/portfolio.ts`. The displayed education, academic details, experience and projects are based on the current CV.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Deployment

A GitHub Pages workflow is included in `.github/workflows/deploy.yml`. Pushes to `main` build and publish the Vite `dist` directory.
