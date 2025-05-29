import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { notarizeDocument, notarizeImage, verifyDocHash, verifyImageHash} from './contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'
import {Box, Flex, Heading, Button, Text, SegmentGroup, Container, VStack, FileUpload, Image, Alert} from "@chakra-ui/react";

export default function NotarizeVerify({docData, imageData}) {
  const { contract, account } = useMetamask();
  const [operation, setOperation] = useState(null)
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
      const result = await notarizeDocument(contract, docData.hash, "SHA256", docData.extension);
      setTxReceipt(result);
      setIsProcessing(false);
      }else if(imageData){
        const result = await notarizeImage(contract, imageData.pixelHash, imageData.fullHash, imageData.extension, "SHA256", "SHA256");
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
        const result = await verifyDocHash(contract, docData);
        console.log("Document verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }else if(imageData){
        const result = await verifyImageHash(contract, imageData.pixelHash);
        console.log("Image verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("not found") || error?.reason?.includes("not found")) {
          setError("Documento non trovato");
      } else {
          setError("Si è verificato un errore durante la verifica: " + error.message);
      }
    } finally{
      setIsProcessing(false);
    }
  }

  return (
    <VStack>
      {(docData || imageData)  && (
        <Flex mt="20px" gap={4} justify="center">
          <Button variant="solid" colorPalette="blue" onClick={handleNotarize}>
            Notarizza
          </Button>
          <Button variant="solid" colorPalette="blue" onClick={handleVerify}>
            Verifica
          </Button>
        </Flex>
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