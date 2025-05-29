import React from 'react'
import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react'
import { useMetamask } from './WalletContext.jsx'

export default function Home() {
  const { account, connectMetamask, disconnectMetamask } = useMetamask();

/*   return (
  <>
  <h1>Benvenuto nella dApp di Notarizzazione</h1>
  <p>Account: {account ? account : "Non connesso"}</p>
  <button onClick={account ? disconnectMetamask : connectMetamask}>
    {account ? "Disconnetti" : "Connetti Metamask"}
  </button>
  </>
  ) */

  return(
    <Flex as="nav" minWidth="100vw" bg="white" px={6} py={4} shadow="sm" justify="space-between" align="center">
      <Box flexBasis="60%">
        <Heading size="xl" >ETHProof</Heading>
      </Box>
      <Box flexBasis="40%">
        <Button variant="solid" colorPalette="blue" onClick={account ? disconnectMetamask : connectMetamask}>
          {account ? "Disconnetti" : "Connetti Metamask"}
        </Button>
        <Text>{account ? `Account: ${account}` : "Non connesso"}</Text>
      </Box>
    </Flex>
  )

}