import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';
import App from './App.jsx';
import {BrowserRouter} from "react-router";
import { UsuarioProvider } from './context/UsuarioProvider.jsx';
import { TemaProvider } from './context/TemaProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <UsuarioProvider>
          <App />
        </UsuarioProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
);
