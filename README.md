# Starbuckd ☕️

**Starbuckd** predicts how an English-speaking barista will inevitably butcher your name on a coffee cup and provide a safe alias

## Features

- ✅ **The Name Butcher**: Advanced AI simulation of barista misspelling logic.
- ✅ **Acoustic Difficulty Meter**: See just how much of a struggle your name is to hear over a milk frother.
- ✅ **The Safe Alias**: Get a 100% barista-safe name to use for a stress-free experience.
- ✅ **3D Cup Visualization**: Realistic, tapered coffee cup UI with 3D effects and animated steam.
- ✅ **History Queue**: Keep track of your previous "orders" and identity crises.
- ✅ **Dark Mode Support**: Sleek UI that looks great in any lighting.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables in `.env.local`:

```env
BACKEND_API_URL=https://your-inference-api.example/v2/chat/completions
CLIENT_API_KEY=your_client_key
CLIENT_ID=starbuckd
# Optional provider preference; v2 falls back to other available providers.
PROVIDER=
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/predict/route.ts      # AI Prediction logic
├── components/               # UI components (Header, Footer, Cup)
├── layout.tsx                # Root layout & Metadata
└── page.tsx                  # Main Starbuckd experience
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **NVIDIA / Gemini APIs** - LLM-powered Name Butchery logic

## Deployment

Deploy this to Vercel or any Next.js compatible host. Remember to configure your environment variables.

## Disclaimer

Not affiliated with any actual coffee chains. Built for entertainment and naming-related chaos.
