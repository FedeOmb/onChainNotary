import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import {Provider} from './components/ui/provider'
import Navbar from './Navbar.jsx'
import HomeCTA from './HomeCTA.jsx'
import Upload from './Upload.jsx'
import FilesHistory from './FilesHistory.jsx'
import { MetamaskProvider } from './WalletContext.jsx'
import FAQSection from './FAQSection'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <MetamaskProvider>
        <Navbar />
        <HomeCTA />
        <Upload />
        <FilesHistory />
        <FAQSection />
      </MetamaskProvider>

    </ChakraProvider>
  </StrictMode>
);
