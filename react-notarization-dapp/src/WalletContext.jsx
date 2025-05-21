import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from "./contract/contractConfig.js";

const WalletContext = createContext();

export const MetamaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum) {
        try {
            const _provider = new ethers.BrowserProvider(window.ethereum);
            console.log("Provider", _provider);
            const signer = await _provider.getSigner();
            const address = await signer.getAddress();
            setProvider(_provider);
            setSigner(signer);
            setAccount(address);
            
        } catch (error) {
            console.error("Error connecting to Metamask:", error);
        }
    } else {
      alert("Installa Metamask");
    }
  };

  const disconnectMetamask = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
  };
  // ricrea contract quando cambia il signer
  useEffect(() => {
    if (signer) {
        console.log("Contract address", contractAddress);
      console.log("ABI", contractAbi);
      const _contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const signedContract = _contract.connect(signer);
      setContract(signedContract);
      console.log("Contract created", signedContract);
    } else {
      setContract(null);
    }
  }, [signer]);

  // Auto-connessione su refresh
  useEffect(() => {
    if(!window.ethereum) return;
    
    if (window.ethereum.selectedAddress) {
      connectMetamask();
    }else {
      disconnectMetamask();
    }
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = _provider.getSigner();
      setProvider(_provider);
      setSigner(_signer);
      setAccount(accounts[0]);
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
      connectMetamask,
      disconnectMetamask,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook per usare il wallet
export const useMetamask = () => useContext(WalletContext);