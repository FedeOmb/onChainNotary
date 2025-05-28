import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import {Provider} from './components/ui/provider'
import Home from './Home.jsx'
import Upload from './Upload.jsx'
import { MetamaskProvider } from './WalletContext.jsx'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <Provider>
      <MetamaskProvider>
        <Home />
        <Upload />
      </MetamaskProvider>
    </Provider>
  </StrictMode>
);
