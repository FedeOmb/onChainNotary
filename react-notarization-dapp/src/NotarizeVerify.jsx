import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { notarizeDocument, notarizeImage, verifyDocHash, verifyImageHash, imageExists, documentExists} from './contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'
import {Box, Flex, Heading, Button, Text, DataList, SegmentGroup, Container, VStack, Stack, FileUpload, Image, Alert, NativeSelect, Card, Link, Collapsible} from "@chakra-ui/react";
import { PocketProvider } from 'ethers'

export default function NotarizeVerify({docData, imageData}) {
  const { contract, account, provider} = useMetamask();
  const [operation, setOperation] = useState(null)
  const [algorithm,setAlgorithm] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleNotarize = async () => {
    setOperation("notarize");
    setIsProcessing(true);
    setError(null);
    setTxReceipt(null);
    setVerificationResult(null);
    if (!contract || !account) {
      setError("Errore nell'accesso all'account. Assicurati di essere connesso a Metamask");
      setIsProcessing(false);
      return;
    }
  try {
      if(docData){
      const result = await notarizeDocument(contract, docData.hash, "sha256", docData.extension);
      setTxReceipt(result);
      setIsProcessing(false);
      }else if(imageData){
        console.log(imageData)
        let hashToNotarize 
        if(algorithm == "sha256" ) {
          hashToNotarize = imageData.pixelHashSHA256;
        } else if(algorithm == "phash") {
          hashToNotarize = imageData.phash;
        } else {
          setError("Seleziona un algoritmo di hashing per la notarizzazione dell'immagine"); 
          setIsProcessing(false);
          return;
        }
        const result = await notarizeImage(contract, hashToNotarize, imageData.fullHash, imageData.extension, algorithm, "sha256");
        console.log(result)
        setTxReceipt(result);
        setIsProcessing(false);
      }
    } catch (error) {
          setError(error.message);
    } finally{
      setIsProcessing(false);
    }
  }

  const handleVerify = async () => {
    setOperation("verify");
    setIsProcessing(true);
    setError(null);
    setTxReceipt(null);
    setVerificationResult(null);
    if (!contract || !account) {
      setError("Errore nell'accesso all'account. Assicurati di essere connesso a Metamask");
      setIsProcessing(false);
      return;
    }
    try {
      if(docData){
        const result = await verifyDocHash(contract, docData.hash);
        console.log("Document verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }else if(imageData){
        let hashSHA256Exists = await imageExists(contract, imageData.pixelHashSHA256);
        let pHashExists = await imageExists(contract, imageData.phash);
        if (!hashSHA256Exists && !pHashExists) {
          setError("Immagine non trovata");
        }
        let result;
        if(hashSHA256Exists) {
        result = await verifyImageHash(contract, imageData.pixelHashSHA256);
        }else if(pHashExists) {
        result = await verifyImageHash(contract, imageData.phash);
        } else {
          setError("Immagine non trovata");
          setIsProcessing(false);
          return;
        }
        let fullHashVerification = false;
        if (result.fullHash === imageData.fullHash) {
          fullHashVerification = true;
        }
        result.fullHashVerification = fullHashVerification;

        console.log("Image verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("not found") || error?.reason?.includes("not found")) {
          setError("Immagine non trovata");
      } else {
          setError("Si è verificato un errore durante la verifica: " + error.message);
      }
    } finally{
      setIsProcessing(false);
    }
  }

  return (
    <VStack>
{(docData || imageData) && (
  <VStack spacing={4} p={6} bg="gray.50" borderRadius="md" w="100%" maxW="600px">
    <Flex gap={4} w="100%">
      <Button 
        flex={1}
        variant={operation === "notarize" ? "solid" : "outline"} 
        colorScheme="blue" 
        onClick={docData ? handleNotarize : () => {
          setTxReceipt(null);
          setVerificationResult(null);
          setAlgorithm(null);
          setError(null);
          setOperation("notarize")
        }}
      >
        Notarizza
      </Button>
      <Button 
        flex={1}
        variant={operation === "verify" ? "solid" : "outline"} 
        colorScheme="blue" 
        onClick={handleVerify}
      >
        Verifica
      </Button>
    </Flex>

    {imageData && operation === "notarize" && (
      <Box w="100%">
        <Text mb={4} fontWeight="bold">
          Seleziona l'algoritmo di hashing: {algorithm === "sha256" && "SHA-256"}
          {algorithm === "phash" && "pHash (Perceptual Hashing)"}
        </Text>
       { !isProcessing && !txReceipt && !verificationResult && (
      <VStack spacing={4} align="stretch">
        <Card.Root 
          variant="outline"
          borderColor={algorithm === "sha256" ? "blue.500" : "gray.200"}
          cursor="pointer"
          onClick={() => setAlgorithm("sha256")}
          _hover={{ borderColor: "blue.300" }}
        >
          <Card.Body>
            <Stack spacing={4}>
              <Flex alignItems="center">
                <input 
                  type="radio" 
                  checked={algorithm === "sha256"} 
                  onChange={() => setAlgorithm("sha256")}
                />
                <Text ml={2} fontWeight="bold">SHA-256</Text>
              </Flex>
              <Text fontSize="sm" color="gray.600">
                Algoritmo di hashing standard che genera un'impronta digitale unica del file.
                Ideale per la verifica dell'integrità del documento.
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
          <Card.Root
            variant="outline"
            borderColor={algorithm === "phash" ? "blue.500" : "gray.200"}
            cursor="pointer"
            onClick={() => setAlgorithm("phash")}
            _hover={{ borderColor: "blue.300" }}
          >
            <Card.Body>
              <Stack spacing={4}>
                <Flex alignItems="center">
                  <input 
                    type="radio" 
                    checked={algorithm === "phash"} 
                    onChange={() => setAlgorithm("phash")}
                  />
                  <Text ml={2} fontWeight="bold">pHash (Perceptual Hashing)</Text>
                </Flex>
                <Text fontSize="sm" color="gray.600">
                  Genera un hash basato sul contenuto visivo dell'immagine.
                  Utile per identificare immagini simili anche se leggermente modificate.
                </Text>
              </Stack>
            </Card.Body>
          </Card.Root>
      </VStack>
    )}

        <Button 
          mt={4}
          w="100%"
          colorScheme="blue"
          onClick={handleNotarize}
          loading={isProcessing}
        >
          Avvia Notarizzazione
        </Button>
      </Box>
    )}
  </VStack>
)}
      {(docData || imageData) && operation === "notarize" && (
        <Box>
          {isProcessing && 
            (<Heading as="h3" size="md">
              {docData && "Notarizzazione del documento in corso..."}
              {imageData && "Notarizzazione dell'immagine in corso..."}</Heading>
          )}
          {txReceipt && (
            <Box>
        <Alert.Root status="success" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
            <Alert.Title>
              {docData && "Documento Notarizzato con successo!"}
              {imageData && "Immagine Notarizzata con successo!"}
            </Alert.Title>
              <Alert.Description>
              <Text>Hash della transazione: {txReceipt.hash}</Text>
              <Text>La transazione è stata minata nel blocco: {txReceipt.blockNumber}</Text>
              <Text>Visualizza la transazione su <Link target="_blank" href={`https://sepolia.etherscan.io/tx/${txReceipt.hash}`} variant="underline">EtherScan.io</Link></Text>
            </Alert.Description>
            </Alert.Content>
        </Alert.Root>
            </Box>
          )}
          {error && (
        <Alert.Root status="error" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
            <Alert.Title>
              {docData && "Errore nella Notarizzazione del documento"}
              {imageData && "Errore nella Notarizzazione dell'immagine"}
            </Alert.Title>
            <Alert.Description>
              {error}
            </Alert.Description>
            </Alert.Content>
        </Alert.Root>
          )}
        </Box>
      )}
      {(docData || imageData) && operation === "verify" && (
        <Box>
          {isProcessing && 
            (<Heading as="h3" size="md">
              {docData && "Verifica del documento in corso..."}
              {imageData && "Verifica dell'immagine in corso..."}</Heading>
          )}
          {verificationResult && (
            <Box>
          <Alert.Root status={(imageData && verificationResult.fullHashVerification) || docData ? "success": "info"} variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
            <Alert.Title>
              {docData && "Documento verificato con successo!"}
              {imageData && "Immagine verificata con successo!"}
            </Alert.Title>
              <Alert.Description>
                <VStack>
                <DataList.Root orientation={"horizontal"}>
                <DataList.Item>
                  <DataList.ItemLabel>Data di upload: </DataList.ItemLabel>
                  <DataList.ItemValue>{verificationResult.readableDate}</DataList.ItemValue>
                </DataList.Item>
                  <DataList.Item>
                  <DataList.ItemLabel>Uploader Account: </DataList.ItemLabel>
                  <DataList.ItemValue>{verificationResult.uploader}</DataList.ItemValue>
                </DataList.Item>
                </DataList.Root>
                {imageData && (
                <>
                  <Text fontWeight="bold" fontSize={"md"}>
                    {verificationResult.fullHashVerification ? ("Il file immagine corrisponde in modo completo a quella salvata in blockchain, non è stata alterata in nessun modo") :"Il file immagine non corrisponde in modo completo a quello salvato in blockchain"}
                    </Text>
                  { !verificationResult.fullHashVerification && (
                  <Text>
                  {verificationResult.pixelHashAlgorithm === "sha256" && ("Il contenuto visivo dell'immagine è stato verificato con l'algoritmo SHA-256 quindi non è stato alterato in nessun modo, tuttavia i metadati dell'immagine potrebbero essere stati modificati")}
                  {verificationResult.pixelHashAlgorithm === "phash" && ("Il contenuto visivo dell'immagine è stato verificato con l'algoritmo pHash, quindi potrebbe essere stato modificato in modo minimo, inoltre i metadati dell'immagine potrebbero essere stati modificati")}
                  </Text>
                    )}
                </>
                )}
                {docData && (
                <>
                  <Text fontWeight="bold" fontSize={"md"}>
                    Il documento corrisponde in modo completo a quello salvato in blockchain, non è stato alterato in alcun modo
                    </Text>
                </>
                )}
                <Collapsible.Root>
                  <Collapsible.Trigger paddingY="3" fontWeight="bold">Vedi tutti i dettagli</Collapsible.Trigger>
                  <Collapsible.Content>
                    <Box padding="4" borderWidth="1px">
                    { docData && (
                      <Box>
                      <Text>Dettagli del documento recuperati:</Text>
                      <Text>Hash verificato: {verificationResult.docHash}</Text>
                      <Text>Algoritmo di hash usato: {verificationResult.hashAlgorithm}</Text>
                      <Text>Uploader: {verificationResult.uploader}</Text>
                      <Text>Timestamp di upload: {verificationResult.timestamp}</Text>
                      <Text>Data di upload: {verificationResult.readableDate}</Text>

                    </Box>
                    )}
                    { imageData && (
                      <Box>
                      <Text>Dettagli dell'immagine recuperati:</Text>
                      <Text>Hash dei pixel verificato: {verificationResult.pixelHash}</Text>
                      <Text>Algoritmo di hash pixel: {verificationResult.pixelHashAlgorithm}</Text>
                      <Text>Uploader: {verificationResult.uploader}</Text>
                      <Text>Timestamp di upload: {verificationResult.timestamp}</Text>
                      <Text>Data di upload: {verificationResult.readableDate}</Text>
                      <Text>Hash file completo: {verificationResult.fullHash}</Text>
                      <Text>Algoritmo di hash file completo: {verificationResult.fullHashAlgorithm}</Text>
                      <Text>Estensione immagine originale: {verificationResult.extension}</Text>
                    </Box>
                    )}    
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
                </VStack>
            </Alert.Description>
            </Alert.Content>
        </Alert.Root>
        
            </Box>
          )}
          {error && (
        <Alert.Root status="error" variant="subtle">
            <Alert.Indicator />
            <Alert.Title>
              {docData && "Errore nella verifica del documento"}
              {imageData && "Errore nella verifica dell'immagine"}
            </Alert.Title>
            <Alert.Description>
              {error}
            </Alert.Description>
        </Alert.Root>
          )}
        </Box>
      )}

    </VStack>
  )
}