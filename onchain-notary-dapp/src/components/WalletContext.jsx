import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from "../contract/contractConfig.js";

const WalletContext = createContext();

export const MetamaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum) {
      setIsConnecting(true);
      setError(null);
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (accounts.length === 0) {
          setError('Nessun account autorizzato. Connetti un account Metamask.');
          throw new Error('Nessun account autorizzato');
        }
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const network = await _provider.getNetwork();
        if (!network) {
          setError("Impossibile connettersi alla rete Ethereum");
          throw new Error("Impossibile connettersi alla rete Ethereum");
        }
        setChainId(Number(network.chainId));
        if (Number(network.chainId) !== 11155111) { // Sepolia Testnet
          setError(`Rete Ethereum non supportata. Connettersi alla rete Sepolia Testnet`);
          throw new Error(`Rete Ethereum non supportata. Connettersi alla rete Sepolia Testnet`);
        }

        const signer = await _provider.getSigner();
        const address = await signer.getAddress();

        setProvider(_provider);
        setSigner(signer);
        setAccount(address);

      } catch (error) {
        if (error.code === -32002) {
          setError("RIchiesta di connessione già in corso. Controlla Metamask.");
        } else {
          console.error("Error connecting to Metamask:", error);
          setError("Errore durante la connessione a Metamask: riprova");
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError("Errore durante la connessione: Metamask non è installato");
      alert("Errore durante la connessione: Metamask non è installato.");
    }
  };

  const disconnectMetamask = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
  };

  // ricrea il contract quando cambia il signer
  useEffect(() => {
    if (signer && provider) {
      try {
        const _contract = new ethers.Contract(contractAddress, contractAbi, provider);
        const signedContract = _contract.connect(signer);
        setContract(signedContract);
      } catch (error) {
        console.error("Errore nell'inizializzazione del contratto:", error);
        setError("Errore nell'inizializzazione del contratto");
      }
    } else {
      setContract(null);
    }
  }, [signer, provider]);

  // gestione degli eventi di metamask
  useEffect(() => {
    if (!window.ethereum) return;

    if (window.ethereum.selectedAddress) {
      connectMetamask();
    } else {
      disconnectMetamask();
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        disconnectMetamask();
        connectMetamask();
      } else {
        disconnectMetamask();
      }
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      account,
      provider,
      signer,
      contract,
      isConnecting,
      error,
      connectMetamask,
      disconnectMetamask,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook per usare il wallet
export const useMetamask = () => useContext(WalletContext);