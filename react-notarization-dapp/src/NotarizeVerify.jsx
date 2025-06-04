import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { notarizeDocument, notarizeImage, verifyDocHash, verifyImageHash, imageExists, documentExists} from './contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'
import {Box, Flex, Heading, Button, Text, SegmentGroup, Container, VStack, Stack, FileUpload, Image, Alert, NativeSelect, Card, CardHeader, CardBody} from "@chakra-ui/react";

export default function NotarizeVerify({docData, imageData}) {
  const { contract, account } = useMetamask();
  const [operation, setOperation] = useState(null)
  const [algorithm,setAlgorithm] = useState("sha256");
  const [txReceipt, setTxReceipt] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleNotarize = async () => {
    setOperation("notarize");
    setIsProcessing(true);
    setTxReceipt(null);
    setVerificationResult(null);
    setError(null);
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
        let hashToNotarize 
        if(algorithm == "sha256" ) {
          hashToNotarize = imageData.pixelHashSHA256;
        } else if(algorithm == "phash") {
          hashToNotarize = imageData.phash;
        }
        const result = await notarizeImage(contract, hashToNotarize, imageData.fullHash, imageData.extension, algorithm, "sha256");
        setTxReceipt(result);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("hash already stored") || error?.reason?.includes("hash already stored")) {
          setError("Transazione annullata: questo hash è già stato memorizzato sulla blockchain.");
      } else {
          setError("Si è verificato un errore durante la notarizzazione: " + error.message);
      }
    } finally{
      setIsProcessing(false);
    }
  }

  const handleVerify = async () => {
    setOperation("verify");
    setIsProcessing(true);
    setTxReceipt(null);
    setVerificationResult(null);
    setError(null);
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
        }

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
        onClick={() => setOperation("notarize")}
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
          Seleziona l'algoritmo di hashing:
        </Text>
        
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

        <Button 
          mt={4}
          w="100%"
          colorScheme="blue"
          onClick={handleNotarize}
          isLoading={isProcessing}
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
            <Alert.Title>
              {docData && "Documento Notarizzato con successo!"}
              {imageData && "Immagine Notarizzata con successo!"}
            </Alert.Title>
        </Alert.Root>
            <Text>Hash della transazione: {txReceipt.hash}</Text>
            <Text>La transazione è stata minata nel blocco: {txReceipt.blockNumber}</Text>
            <Text>Visualizza la transazione su <a href={`https://sepolia.etherscan.io/tx/${txReceipt.hash}`} target="_blank">Etherscan.io</a></Text>
            </Box>
          )}
          {error && (
        <Alert.Root status="error" variant="subtle">
            <Alert.Indicator />
            <Alert.Title>
              {docData && "Errore nella Notarizzazione del documento"}
              {imageData && "Errore nella Notarizzazione dell'immagine"}
            </Alert.Title>
            <Alert.Description>
              {error}
            </Alert.Description>
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
          <Alert.Root status="success" variant="subtle">
            <Alert.Indicator />
            <Alert.Title>
              {docData && "Documento verificato con successo!"}
              {imageData && "Immagine verificata con successo!"}
            </Alert.Title>
        </Alert.Root>
            { docData && (
              <Box>
              <Text>Dettagli del documento recuperati:</Text>
              <Text>Uploader: {verificationResult.uploader}</Text>
              <Text>Timestamp di upload: {verificationResult.timestamp}</Text>
              <Text>Data di upload: {verificationResult.readableDate}</Text>
              <Text>Algoritmo di hash usato: {verificationResult.hashAlgorithm}</Text>
            </Box>
            )}
            { imageData && (
              <Box>
              <Text>Dettagli dell'immagine recuperati:</Text>
              <Text>Uploader: {verificationResult.uploader}</Text>
              <Text>Timestamp di upload: {verificationResult.timestamp}</Text>
              <Text>Data di upload: {verificationResult.readableDate}</Text>
              <Text>Hash file completo: {verificationResult.fullHash}</Text>
              <Text>Estensione immagine originale: {verificationResult.extension}</Text>
              <Text>Algoritmo di hash pixel: {verificationResult.pixelHashAlgorithm}</Text>
              <Text>Algoritmo di hash file completo: {verificationResult.fullHashAlgorithm}</Text>
            </Box>
            )}            
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