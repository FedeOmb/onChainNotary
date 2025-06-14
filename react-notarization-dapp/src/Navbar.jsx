import React from 'react'
import { Box, Flex, Heading, Button, Text, Span, Image } from '@chakra-ui/react'
import { useMetamask } from './WalletContext.jsx'

export default function Navbar() {
  const { account, connectMetamask, disconnectMetamask, isConnecting, error} = useMetamask();

  return(
    <Flex as="nav" minWidth="100vw" bg="white" px={6} py={4} shadow="sm" justify="space-between" align="center">
      <Box flexBasis="60%" display="flex" alignItems="center" gap={1}>
        
        <Image src="./icons/stamp.png" height="50px" objectFit={"contain"}/>
        <Heading size="2xl" color={'orange.600'}><Span color="cyan.700">onChain</Span>Notary</Heading>
        {/*ALTRI NOMI POSSIBILI
        HashProof
        EthProof
        AuthentiChain
        hashNotary*/ }
      </Box>
      <Box flexBasis="40%" display="flex" flexDirection="column" justifyContent={"flex-end"}  alignItems="flex-end"gap={4}>
        <Button variant="subtle" colorPalette="orange" width={"fit-content"}
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