# Thermal Calculations Demo project
(in progress)


🚀 Visual-first diffusion simulator (Thermo Calculations)
Diffusion profiles render instantly—smooth gradients, fixed axes, tooltips, and motion—so you feel the physics (hello Fick’s S-curve) instead of reading a table. Little things (responsive charts, subtle animations, clear units) make the science approachable.

What’s inside

📈 Interactive diffusion profiles (μm vs wt%) with tooltips & legend

🎬 Micro-animations to “see” atoms mix across the interface

🗂️ Projects & calculations saved to a DB—run, review, repeat

✅ End-to-end types keep client ↔ server perfectly in sync

Stack (viz-heavy bits bolded)
Frontend: React + Vite, TypeScript, Tailwind + shadcn/ui, lucide
Data viz: Recharts (custom gradients, fixed domains, responsive), Framer Motion (micro-interactions)
Forms/validation: React Hook Form + Zod (shared)
API: tRPC on Fastify
DB/ORM: Prisma + SQLite (JSON fields for results)

Next up: phase diagrams, progress streaming, exportable plots.

# some screen shots of ongoing developemnet

<img width="1763" height="910" alt="screen" src="https://github.com/user-attachments/assets/370b41f0-6f97-4da2-9bb2-92358be66bf4" />
<img width="1134" height="488" alt="DiffAnimation" src="https://github.com/user-attachments/assets/78994cb4-8c10-4c87-8cfe-c1342a3014dd" />
<img width="1763" height="910" alt="proj" src="https://github.com/user-attachments/assets/3661275d-8583-4fd0-a61e-ff18d32a4847" />
<img width="1763" height="910" alt="createPr" src="https://github.com/user-attachments/assets/710e4659-97ea-4e71-931e-3971d00aa2e5" />
<img width="1763" height="910" alt="EditProj" src="https://github.com/user-attachments/assets/3cb41c8d-5132-42a2-8eaa-b7191cedea83" />
<img width="1778" height="918" alt="PhaseD-1" src="https://github.com/user-attachments/assets/93bedec9-6f89-415c-aac5-5c3e86a83072" />
<img width="1012" height="904" alt="PhaseD2" src="https://github.com/user-attachments/assets/2d9e71cb-a296-41c0-b4ec-9791f17a7770" />
<img width="1780" height="904" alt="Equ" src="https://github.com/user-attachments/assets/5fee2426-9587-4024-80d8-fd868d137cda" />





## NOTE 
THERE ARE  THREE WORKSPACES
1. Server
2. Root folder as frontend
3. Packages / cntracts for Prisma Schema, Zod


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
