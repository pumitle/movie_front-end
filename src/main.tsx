
import ReactDOM from 'react-dom/client';
import "./styles/globals.css";
import App from './App.tsx'
import { StoreProvider } from './shared/hooks/useStore.ts';
import { rootStore } from './stores/RootStore.ts';
import { ToastProvider } from './shared/hooks/useToast.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider value={rootStore}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StoreProvider>,
)
