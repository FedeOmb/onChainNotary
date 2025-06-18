import React, { useState, useEffect } from 'react';
import { useMetamask } from './WalletContext';
import { getMyDocumentsKeys, getMyImagesKeys, getDocumentByKey, getImageByKey, getMyFilesCount } from '../contract/contractInteraction';
import { Box, VStack, Heading, Text, Tabs, Card, Stack, Badge, Alert, Link, Flex, Table, Collapsible, Span } from '@chakra-ui/react';

export default function FilesHistory() {
  const { contract, account } = useMetamask();
  const [filesCount, setFilesCount] = useState({ documents: 0, images: 0 });
  const [openedList, setOpenedList] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //recupera i dettagli dei file per l'account connesso
  const fetchFiles = async () => {
    if (!contract || !account) return;

    setIsLoading(true);
    setError(null);
    try {
      fetchFilesCount();
      // Recupera le chiavi
      const docKeys = await getMyDocumentsKeys(contract);
      const imgKeys = await getMyImagesKeys(contract);

      // Prendi solo le ultime 10 chiavi per ogni tipo
      const lastDocKeys = docKeys.slice(-10);
      const lastImgKeys = imgKeys.slice(-10);

      // Recupera i dettagli per ogni documento
      const docsPromises = lastDocKeys.map(key => getDocumentByKey(contract, key));
      const imgsPromises = lastImgKeys.map(key => getImageByKey(contract, key));

      const docDetails = await Promise.all(docsPromises);
      const imgDetails = await Promise.all(imgsPromises);

      setDocuments(docDetails.reverse());
      setImages(imgDetails.reverse());
    } catch (err) {
      console.error('Errore nel recupero dei file:', err);
      setError(err.message || 'Errore nel recupero dei file');
    } finally {
      setIsLoading(false);
    }
  };

  //recupera il numero di immagini e documenti per l'account connesso
  const fetchFilesCount = async () => {
    if (!contract || !account) return;
    setIsLoading(true);
    setError(null);
    try {
      const filesCount = await getMyFilesCount(contract);
      setFilesCount({ documents: filesCount.documents, images: filesCount.images });
    } catch (err) {
      console.error('Errore nel recupero dei dati', err);
      setError('Errore nel recupero del conteggio dei dati');
    } finally {
      setIsLoading(false);
    }
  }

  //resetta la lista quando l'account connesso cambia
  useEffect(() => {
    setDocuments([]);
    setImages([]);
    setFilesCount({ documents: 0, images: 0 });
    fetchFilesCount();
    if (openedList) {
      fetchFiles();
    }
  }, [account, contract]);



  const FileRow = ({ file, type }) => (
    <Table.Row>
      <Table.Cell>
        <Badge >
          {type === 'document' ? file.hashAlgorithm : file.pixelHashAlgorithm}
        </Badge>
      </Table.Cell>
      <Table.Cell isTruncated>
        {type === 'document' ? file.docHash : file.pixelHash}
      </Table.Cell>
      {type === 'image' && (
        <Table.Cell>{file.fullHash}</Table.Cell>
      )}
      <Table.Cell>{file.extension || '-'}</Table.Cell>
      <Table.Cell>{file.readableDate}</Table.Cell>
    </Table.Row>
  );

  return (
    <Box
      bg="gray.50"
      width="100vw"
      alignItems="center" id="history-section">
      <VStack spacing={4} align="center" width="100%" p="4" mx="auto" maxW="8xl" >
        <Heading as="h2" color="orange.600">I tuoi File Notarizzati</Heading>
        <Text>Hai notarizzato in totale:  <Span fontWeight="bold">{filesCount.documents}</Span> documenti - <Span fontWeight="bold">{filesCount.images}</Span> immagini</Text>

        {account ? (
          <Collapsible.Root open={openedList} lazyMount="true" style={{ width: '100%' }} onOpenChange={function () {
            setOpenedList(!openedList)
            fetchFiles();
          }
          }>
            <Box width="100%" display="flex" justifyContent="center" alignItems="center" mb={4}>
              <Collapsible.Trigger
                as="button"
                padding={1}
                colorPalette="orange"
                layerStyle={"outline.solid"}
                borderRadius="md"
                _hover={{
                  backgroundColor: "orange.100"
                }}
              >
                Vedi gli ultimi file notarizzati
              </Collapsible.Trigger>
            </Box>
            <Collapsible.Content>
              {error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>Errore nel caricamento</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
              )}

              <Tabs.Root lazyMount="true" variant="outline" colorPalette="orange" fitted defaultValue="documents">
                <Tabs.List>
                  <Tabs.Trigger value='documents'>Documenti ({documents.length})</Tabs.Trigger>
                  <Tabs.Trigger value="images">Immagini ({images.length})</Tabs.Trigger>
                </Tabs.List>


                <Tabs.Content value="documents" bg="white">
                  {isLoading ? (
                    <Text color="gray.500">Caricamento dei dati in corso...</Text>
                  ) : documents.length > 0 ? (
                    <>
                      <Table.Root variant="line" striped="true">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Algoritmo</Table.ColumnHeader>
                            <Table.ColumnHeader>Hash</Table.ColumnHeader>
                            <Table.ColumnHeader>Estensione</Table.ColumnHeader>
                            <Table.ColumnHeader>Data di Upload</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {documents.map((doc, index) => (
                            <FileRow key={index} file={doc} type="document" />
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </>
                  ) : (
                    <Text color="gray.500">Nessun documento trovato</Text>
                  )}
                </Tabs.Content>

                <Tabs.Content value="images" bg="white">
                  {isLoading ? (
                    <Text color="gray.500">Caricamento dei dati in corso...</Text>
                  ) : images.length > 0 ? (
                    <>
                      <Table.ScrollArea maxWidth={"100%"}>
                        <Table.Root variant="line" striped="true">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader>Algoritmo</Table.ColumnHeader>
                              <Table.ColumnHeader>Hash Pixel</Table.ColumnHeader>
                              <Table.ColumnHeader>Hash file completo</Table.ColumnHeader>
                              <Table.ColumnHeader>Estensione</Table.ColumnHeader>
                              <Table.ColumnHeader>Data di Upload</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {images.map((img, index) => (
                              <FileRow key={index} file={img} type="image" />
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>
                    </>
                  ) : (
                    <Text color="gray.500">Nessuna immagine trovata</Text>
                  )}
                </Tabs.Content>

              </Tabs.Root>
            </Collapsible.Content>
          </Collapsible.Root>

        ) : (

          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Connetti il tuo wallet Metamask per vedere i tuoi file</Alert.Title>
          </Alert.Root>
        )}
      </VStack>
    </Box>
  );
}