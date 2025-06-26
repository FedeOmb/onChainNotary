# onChainNotary DApp

La Web Dapp (Decentralized Application) **onChainNotary** permette ad un utente di **notarizzare** documenti e immagini cioè **garantirne l’esistenza, l’integrità e l’autenticità** in una determinata data, in modo semplice, economico e senza intermediari, sfruttando tecnologie innovative come la Blockchain e gli Smart Contract.

## Caratteristiche Principali
- **Elaborazione dei file completamente in locale** mantenendo la privacy dei dati dell’utente, soltanto gli hash dei file infatti sono salvati in Blockchain. 
- I files notarizzati sono verificabili in modo da chiunque sia in possesso del file originale, risalendo alla data di notarizzazione e all’account Ethereum che ha effettuato l’operazione.

La Dapp offre anche delle **funzionalità avanzate** per la **notarizzazione delle
immagini** quali:
- la possibilità di verificare se un’immagine è stata alterata soltanto
nei suoi metadati ma non nel contenuto visivo;
- la possibilità di usare due tipologie di algoritmi di hash: 
    - **hash crittografico SHA-256** che genera hash crittografici del file, garantendone l'integrità.
    - **hash percettivo (pHash)**, che genera hash resistenti anche modifiche minime del contenuto dell’immagine come la compressione o il ridimensionamento.

## Tecnologie Utilizzate

- **Frontend**: React, Vite, Chakra UI
- **Librerie Web3**: ethers.js
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Altre librerie**: Jimp (per elaborazione immagini e calcolo pHash)

## Utilizzo della Dapp
Una **versione di test** della Dapp onChainNotary eseguita sulla testnet pubblica **Ethereum Sepolia** è disponibile al seguente link [https://fedeomb.github.io/onChainNotary/](https://fedeomb.github.io/onChainNotary/)

### Requisiti
- **Wallet Metamask** installato nel browser e connesso alla Testnet Ethereum Sepolia
- **Sepolia ETH** disponibili nel Wallet

## Esecuzione della Dapp in locale
### Requisiti
- **Node.js** installato nel sistema
- **Wallet Metamask** installato nel browser e connesso alla Testnet Ethereum Sepolia
- **Sepolia ETH** disponibili nel Wallet

### Workflow
1. Eseguire il download del repository github
2. Spostarsi nella directory: _/onchain-notary-dapp_
```
cd onchain-notary-dapp
```
3. Eseguire il download di tutte le dipendenze del progetto con il comando:
```
npm install
```
4. avviare il server locale di sviluppo Vite con il comando:
```
npm run dev
```
5. aprire il browser al link indicato da Vite (ad es. http://localhost:5173/onChainNotary/)