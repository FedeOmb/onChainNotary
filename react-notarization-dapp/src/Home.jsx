import React from 'react'
import { useMetamask } from './WalletContext.jsx'

export default function Home() {
  const { account, connectMetamask, disconnectMetamask } = useMetamask();

  return (
  <>
  <h1>Benvenuto nella dApp di Notarizzazione</h1>
  <p>Account: {account ? account : "Non connesso"}</p>
  <button onClick={account ? disconnectMetamask : connectMetamask}>
    {account ? "Disconnetti" : "Connetti Metamask"}
  </button>
  </>
  )
}