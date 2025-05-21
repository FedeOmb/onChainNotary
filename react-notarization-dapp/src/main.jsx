import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Home from './Home.jsx'
import Notarize from './Notarize.jsx'
import Verify from './Verify.jsx'
import Upload from './Upload.jsx'
import { MetamaskProvider } from './WalletContext.jsx'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <MetamaskProvider>
      <Home />
      <Upload />
    </MetamaskProvider>
  </StrictMode>
);
