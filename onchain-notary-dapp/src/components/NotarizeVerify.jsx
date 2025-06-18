import React, { useState } from 'react'
import { notarizeDocument, notarizeImage, verifyDocHash, verifyImageHash, imageExists, documentExists } from '../contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'
import { Box, Flex, Heading, Button, Text, Span, DataList, VStack, Stack, Alert, Card, Link, Collapsible } from "@chakra-ui/react";

export default function NotarizeVerify({ docData, imageData }) {
  const { contract, account, provider } = useMetamask();
  const [operation, setOperation] = useState(null)
  const [algorithm, setAlgorithm] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null)
  const [verificationResult, setVerificationResult] = useState([])
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [existingHashes, setExistingHashes] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  //avvia il processo di notarizzazione
  const handleInitNotarize = async () => {
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
      if (docData) {
        const result = await notarizeDocument(contract, docData.hash, "sha256", docData.extension);
        setTxReceipt(result);
        setIsProcessing(false);
      } else if (imageData) {
        // Verifica se l'immagine esiste già con altri algoritmi
        let hashSHA256Exists = await imageExists(contract, imageData.pixelHashSHA256, "sha256");
        let pHashExists = await imageExists(contract, imageData.phash, "phash");
        // se esiste già con un algoritmo diverso da quello scelto mostra un dialog all'utente
        if ((algorithm === "sha256" && pHashExists) || (algorithm === "phash" && hashSHA256Exists)) {
          setExistingHashes({
            sha256: hashSHA256Exists,
            phash: pHashExists
          });
          setShowConfirmDialog(true);
          setIsProcessing(false);
          console.error("Immagine già esistente con altri algoritmi di hashing");
          return;
        }

      } else {
        handleContinueNotarize()
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleContinueNotarize = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    try {
      //se l'immagine non esiste già procedi con la notarizzazione in base all'algoritmo scelto
      let hashToNotarize
      if (algorithm == "sha256") {
        hashToNotarize = imageData.pixelHashSHA256;
      } else if (algorithm == "phash") {
        hashToNotarize = imageData.phash;
      } else {
        setError("Seleziona un algoritmo di hashing per la notarizzazione dell'immagine");
        setIsProcessing(false);
        return;
      }
      const result = await notarizeImage(contract, hashToNotarize, imageData.fullHash, imageData.extension, algorithm, "sha256");
      setTxReceipt(result);
      setIsProcessing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  //avvia il processo di verifica
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
      if (docData) {
        const docExists = await documentExists(contract, docData.hash)

        if (docExists) {
          const result = await verifyDocHash(contract, docData.hash);
          setVerificationResult([result]);
          setIsProcessing(false);
        } else {
          setError("Documento non trovato");
          setIsProcessing(false);
          return;
        }

      } else if (imageData) {
        // Verifica se l'immagine esiste con entrambi gli algoritmi
        let hashSHA256Exists = await imageExists(contract, imageData.pixelHashSHA256, "sha256");
        let pHashExists = await imageExists(contract, imageData.phash, "phash");
        //memorizza in un array i risultati delle verifiche
        let results = [];
        if (hashSHA256Exists) {
          const sha256Result = await verifyImageHash(contract, imageData.pixelHashSHA256, "sha256");
          results.push(sha256Result);
        }
        if (pHashExists) {
          const phashResult = await verifyImageHash(contract, imageData.phash, "phash");
          results.push(phashResult);
        }
        if (!hashSHA256Exists && !pHashExists) {
          setError("Immagine non trovata");
          setIsProcessing(false);
          return;
        }
        //verifica per ogni imagehash verificato se anche il fullhash cosrrisponde
        results = results.map(res => ({
          ...res,
          fullHashVerification: res.fullHash === imageData.fullHash
        }));
        setVerificationResult(results);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("not found") || error?.reason?.includes("not found")) {
        setError("Documento non trovato");
      } else {
        setError("Si è verificato un errore durante la verifica: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <VStack>
      {(docData || imageData) && (
        <VStack spacing={4} p={6} bg="gray.50" borderRadius="md" w="100%" maxW="4xl">
          <Flex gap={4} w="100%" justifyContent="center" alignItems="center">
            <Button
              colorPalette="orange"
              variant={operation === "notarize" ? "solid" : "outline"}
              colorScheme="blue"
              size={"lg"}
              rounded={"full"}
              onClick={docData ? handleInitNotarize : () => {
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
              colorPalette="orange"
              variant={operation === "verify" ? "solid" : "outline"}
              colorScheme="blue"
              size={"lg"}
              rounded={"full"}
              onClick={handleVerify}
            >
              Verifica
            </Button>
          </Flex>

          {imageData && operation === "notarize" && (
            <Box w="100%" display="flex" flexDirection="column" align="center" alignItems={"center"}>
              <Text mb={4} fontWeight="bold">
                Seleziona l'algoritmo di hashing da usare: {algorithm === "sha256" && "SHA-256"}
                {algorithm === "phash" && "pHash (Perceptual Hashing)"}
              </Text>
              {imageData && operation === "notarize" && !isProcessing && !txReceipt && !verificationResult && (
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
                          Genera un'impronta digitale unica del contenuto visivo dell'immagine (esclusi i metadati).
                          Qualsiasi modifica all'immagine, anche minima come un nuovo salvataggio, modificherà l'hash.
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
                          Genera un hash del contenuto visivo dell'immagine usando un algoritmo di tipo percettivo.
                          L'hash non cambia nel caso di modifiche minime all'immagine ad esempio se è stata compressa o caricata sui social media.
                        </Text>
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                  <Text fontSize="sm" color="gray.600" p={4}>
                    In entrambi i casi insieme all'hash del contentuto visivo verrà salvato anche l'hash SHA256 del file immagine completo (inclusi i metadati).
                  </Text>
                </VStack>
              )}

              <Button
                bg={{ base: "orange.600", _hover: 'orange.700' }}
                rounded={'full'}
                px={6}
                onClick={handleInitNotarize}
                loading={isProcessing}
              >
                Avvia Notarizzazione
              </Button>
            </Box>
          )}
        </VStack>
      )}
      {showConfirmDialog && (
        <Alert.Root status="warning" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              Immagine già notarizzata con un altro algoritmo
            </Alert.Title>
            <Alert.Description>
              <VStack align="stretch" spacing={4}>
                <Text>
                  Questa immagine è già stata notarizzata utilizzando {existingHashes.sha256 ? "SHA-256" : "pHash"}.
                  Vuoi procedere con la notarizzazione usando {algorithm}?
                </Text>
                <Flex gap={4}>
                  <Button
                    colorScheme="orange"
                    onClick={handleContinueNotarize}
                  >
                    Procedi comunque
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Annulla
                  </Button>
                </Flex>
              </VStack>
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
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
                    <DataList.Root orientation={"horizontal"} size="md" variant={"bold"} gap="1">
                      <DataList.Item>
                        <DataList.ItemLabel>Hash della transazione: </DataList.ItemLabel>
                        <DataList.ItemValue>{txReceipt.hash}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>La transazione è stata minata nel blocco: </DataList.ItemLabel>
                        <DataList.ItemValue>{txReceipt.blockNumber}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Visualizza la transazione su: </DataList.ItemLabel>
                        <DataList.ItemValue><Link target="_blank" href={`https://sepolia.etherscan.io/tx/${txReceipt.hash}`} variant="underline">EtherScan.io</Link></DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
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
            <Box display={"flex"} flexDirection="column" gap={2}>
              {verificationResult.length > 1 && (
                <Alert.Root status="info" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Title>
                    La verifica ha restituito più risultati
                  </Alert.Title>
                  <Alert.Description>
                    La stessa immagine è stata notarizzata con più algoritmi di hashing diversi, controlla i dettagli di seguito
                  </Alert.Description>

                </Alert.Root>
              )}
              {verificationResult.map((res, index) => (
                <Alert.Root key={index} size="lg" status={(imageData && res.fullHashVerification) || docData ? "success" : "info"} variant="subtle">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>
                      {docData && "Documento verificato con successo!"}
                      {imageData && "Immagine verificata con successo!"}
                    </Alert.Title>
                    <Alert.Description>
                      <VStack align="stretch">
                        <DataList.Root orientation={"horizontal"} size="md" variant={"bold"} gap="1">
                          <DataList.Item>
                            <DataList.ItemLabel>Data di upload: </DataList.ItemLabel>
                            <DataList.ItemValue>{res.readableDate}</DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Uploader Account: </DataList.ItemLabel>
                            <DataList.ItemValue>{res.uploader}</DataList.ItemValue>
                          </DataList.Item>
                          {imageData && (
                            <>
                              <DataList.Item>
                                <DataList.ItemLabel>Hash verificato: </DataList.ItemLabel>
                                <DataList.ItemValue>{res.pixelHash}</DataList.ItemValue>
                              </DataList.Item>
                              <DataList.Item>
                                <DataList.ItemLabel>Algoritmo di hash: </DataList.ItemLabel>
                                <DataList.ItemValue>{res.pixelHashAlgorithm}</DataList.ItemValue>
                              </DataList.Item>
                            </>)}
                        </DataList.Root>
                        {imageData && (
                          <>
                            <Text fontWeight="bold" fontSize={"md"}>
                              {res.fullHashVerification ? ("Il file immagine corrisponde in modo completo a quella salvata in blockchain, non è stata alterata in nessun modo") :
                                "Il file immagine non corrisponde in modo completo a quello salvato in blockchain"}
                            </Text>
                            {!res.fullHashVerification && (
                              <Text>
                                {res.pixelHashAlgorithm === "sha256" &&
                                  ("Il contenuto visivo dell'immagine è stato verificato con l'algoritmo SHA-256 quindi non è stato alterato in nessun modo, tuttavia i metadati dell'immagine potrebbero essere stati modificati")}
                                {res.pixelHashAlgorithm === "phash" &&
                                  ("Il contenuto visivo dell'immagine è stato verificato con l'algoritmo pHash, quindi potrebbe essere stato modificato in modo minimo, inoltre i metadati dell'immagine potrebbero essere stati modificati")}
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
                          <Collapsible.Content bg="gray.50" color="gray.800">
                            <Box padding="4" borderWidth="1px">
                              {docData && (
                                <Box>
                                  <Text><strong>Hash verificato: </strong>{res.docHash}</Text>
                                  <Text><strong>Algoritmo di hash usato: </strong>{res.hashAlgorithm}</Text>
                                  <Text><strong>Uploader: </strong>{res.uploader}</Text>
                                  <Text><strong>Timestamp di upload: </strong>{res.timestamp}</Text>
                                  <Text><strong>Data di upload: </strong>{res.readableDate}</Text>

                                </Box>
                              )}
                              {imageData && (
                                <Box>
                                  <Text><strong>Hash dei pixel verificato: </strong>{res.pixelHash}</Text>
                                  <Text><strong>Algoritmo di hash pixel: </strong>{res.pixelHashAlgorithm}</Text>
                                  <Text><strong>Uploader: </strong>{res.uploader}</Text>
                                  <Text><strong>Timestamp di upload: </strong>{res.timestamp}</Text>
                                  <Text><strong>Data di upload: </strong>{res.readableDate}</Text>
                                  <Text><strong>Hash file completo: </strong>{res.fullHash}</Text>
                                  <Text><strong>Algoritmo di hash file completo: </strong>{res.fullHashAlgorithm}</Text>
                                  <Text><strong>Estensione immagine originale: </strong>{res.extension}</Text>
                                </Box>
                              )}
                            </Box>
                          </Collapsible.Content>
                        </Collapsible.Root>
                      </VStack>
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              ))}

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