import React from 'react'
import { Box, Flex, Heading, Button, Text, Span, Image, HStack, Link} from '@chakra-ui/react'
import { useMetamask } from './WalletContext.jsx'
import stamp from "../assets/icons/stamp.png"

export default function Navbar() {
  const { account, connectMetamask, disconnectMetamask, isConnecting, error} = useMetamask();

  const scrollToSection= (sectionID) => {
    const sectionElem = document.getElementById(sectionID);
    if (sectionElem) {
      sectionElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return(
    <Flex as="nav" minWidth="100vw" bg="white" px={6} py={4} shadow="sm" justify="space-between" align="center">
      <Box flexBasis="30%" display="flex" alignItems="center" gap={1}>
        
        <Image src={stamp} height="50px" objectFit={"contain"}/>
        <Heading size="2xl" color={'orange.600'}><Span color="cyan.700">onChain</Span>Notary</Heading>
        {/*ALTRI NOMI POSSIBILI
        HashProof
        EthProof
        AuthentiChain
        hashNotary*/ }
      </Box>

      <HStack spacing={0} flex={1} flexBasis="40%" justify="space-evenly" >
        <Link
          onClick={() => scrollToSection("upload-section")}
          color="gray.600"
          _hover={{ color: 'orange.500', textDecoration: 'none' }}
          cursor="pointer"
          colorPalette={"orange"}
          layerStyle={"indicator.bottom"}
        >
          Notarizza - Verifica
        </Link>
        <Link
          onClick={() => scrollToSection("history-section")}
          color="gray.600"
          _hover={{ color: 'orange.500', textDecoration: 'none' }}
          cursor="pointer"
          colorPalette={"orange"}
          layerStyle={"indicator.bottom"}
        >
          I tuoi file notarizzati
        </Link>
        <Link
          onClick={() => scrollToSection("faq-section")}
          color="gray.600"
          _hover={{ color: 'orange.500', textDecoration: 'none' }}
          cursor="pointer"
          colorPalette={"orange"}
          layerStyle={"indicator.bottom"}
        >
          FAQ
        </Link>
      </HStack>

      <Box flexBasis="30%" display="flex" flexDirection="column" justifyContent={"flex-end"}  alignItems="flex-end"gap={4}>
        <Button variant="subtle" colorPalette="orange" width={"fit-content"} rounded="full"
        onClick={account ? disconnectMetamask : connectMetamask}
        loading={isConnecting}
        loadingText="Connessione..."
        >
          {account ? "Disconnetti" : "Connetti Metamask"}
        </Button>
        <Text>
          {account ? `Account: ${account.slice(0, 10)} ... ${account.slice(-10)}` : 
           error ? error :"Non connesso"}</Text>
      </Box>
    </Flex>
  )

}