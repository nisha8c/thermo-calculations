import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {TRPCProvider} from "./lib/trpc.tsx";
import {Provider} from "react-redux";
import {store} from "./store.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <TRPCProvider>
              <App />
          </TRPCProvider>
      </Provider>
  </StrictMode>,
)
