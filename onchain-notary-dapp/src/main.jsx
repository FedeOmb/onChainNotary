import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import { MetamaskProvider } from './components/WalletContext.jsx'
import Navbar from './components/Navbar.jsx'
import HomeCTA from './components/HomeCTA.jsx'
import Upload from './components/Upload.jsx'
import FilesHistory from './components/FilesHistory.jsx'
import FAQSection from './components/FAQSection'

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
