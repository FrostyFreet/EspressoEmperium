import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import {BrowserRouter} from "react-router";
import {Auth0Provider} from "@auth0/auth0-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
              redirect_uri: window.location.origin
          }}
          useRefreshTokens={true}
          cacheLocation="localstorage"
      >
          <BrowserRouter>
              <MantineProvider>
                <App />
              </MantineProvider>;
          </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
)
