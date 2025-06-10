import React, { useState, useEffect } from 'react';
import { useMetamask } from './WalletContext';
import { getMyDocumentsKeys, getMyImagesKeys, getDocumentByKey, getImageByKey, getMyFilesCount} from './contract/contractInteraction';
import {
  Box,
  VStack,
  Heading,
  Text,
  Tabs,
  Card,
  Stack,
  Badge,
  Alert,
  Link,
  Flex,
  Table,
  Collapsible
} from '@chakra-ui/react';

export default function FilesHistory() {
  const { contract, account } = useMetamask();
  const [filesCount, setFilesCount] = useState({ documents: 0, images: 0 });
  const [openedList, setOpenedList] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    if (!contract || !account) return;

    if (documents.length > 0 && images.length > 0) {
        console.log('Files already loaded');
    return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
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

      setDocuments(docDetails.reverse()); // Ultimi file prima
      setImages(imgDetails.reverse());
    } catch (err) {
      console.error('Errore nel recupero dei file:', err);
      setError(err.message || 'Errore nel recupero dei file');
    } finally {
      setIsLoading(false);
    }
  };

    const fetchFilesCount = async () => {
    if (!contract || !account) return;
    setIsLoading(true);
    setError(null);
    try {
      const filesCount = await getMyFilesCount(contract);
      console.log('Files count:', filesCount);
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


  if (!account) {
    return (
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Title>Connetti il tuo wallet per vedere i tuoi file</Alert.Title>
      </Alert.Root>
    );
  }

  const FileRow = ({ file, type }) => (
    <Table.Row>
      <Table.Cell>
        <Badge colorScheme={type === 'document' ? 'blue' : 'green'}>
          {type === 'document' ? file.hashAlgorithm : file.pixelHashAlgorithm}
        </Badge>
      </Table.Cell>
      <Table.Cell maxW="300px" isTruncated>
        {type === 'document' ? file.docHash : file.pixelHash}
      </Table.Cell>
      <Table.Cell>{file.extension || '-'}</Table.Cell>
      <Table.Cell>{file.readableDate}</Table.Cell>
      <Table.Cell>
        <Link
          color="blue.500"
          href={`https://sepolia.etherscan.io/address/${file.uploader}`}
          isExternal
          target='_blank'
        >
          {`${file.uploader.slice(0, 6)}...${file.uploader.slice(-4)}`}
        </Link>
      </Table.Cell>
    </Table.Row>    
  );

  return (
    <Box p={4} maxW="container.md" mx="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="lg">I tuoi File Notarizzati</Heading>
        <Text>Hai notarizzato in totale:</Text>
        <Text>{filesCount.documents} documenti</Text>
        <Text>{filesCount.images} immagini</Text>

        <Collapsible.Root open={openedList} lazyMount="true"onOpenChange={function(){
            setOpenedList(!openedList)
            fetchFiles();
            }
            }>
            <Collapsible.Trigger paddingY="3" fontWeight="bold">Vedi gli ultimi 10 files notarizzati</Collapsible.Trigger>
            <Collapsible.Content>
        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Errore nel caricamento</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}

        <Tabs.Root lazyMount="true" variant="outline" defaultValue="documents">
          <Tabs.List>
            <Tabs.Trigger value='documents'>Documenti ({documents.length})</Tabs.Trigger>
            <Tabs.Trigger value="images">Immagini ({images.length})</Tabs.Trigger>
          </Tabs.List>


            <Tabs.Content value="documents">
              {isLoading ? (
                <Text color="gray.500">Caricamento dei dati in corso...</Text>
              ) : documents.length > 0 ? (
                <>
                {/* documents.map((doc, index) => (
                  <FileCard key={index} file={doc} type="document" />
                )) */}
                <Table.Root variant="simple">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Algoritmo</Table.ColumnHeader>
                      <Table.ColumnHeader>Hash</Table.ColumnHeader>
                      <Table.ColumnHeader>Estensione</Table.ColumnHeader>
                      <Table.ColumnHeader>Data di Upload</Table.ColumnHeader>
                      <Table.ColumnHeader>Uploader</Table.ColumnHeader>
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

            <Tabs.Content value="images">
              {isLoading ? (
                <Text color="gray.500">Caricamento dei dati in corso...</Text>
              ) : images.length > 0 ? (
                <>
                    {/*images.map((img, index) => (
                  <FileCard key={index} file={img} type="image" />
                )) */}
                <Table.Root variant="simple">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Algoritmo</Table.ColumnHeader>
                      <Table.ColumnHeader>Hash</Table.ColumnHeader>
                      <Table.ColumnHeader>Estensione</Table.ColumnHeader>
                      <Table.ColumnHeader>Data di Upload</Table.ColumnHeader>
                      <Table.ColumnHeader>Uploader</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {images.map((img, index) => (
                      <FileRow key={index} file={img} type="image" />
                    ))}
                  </Table.Body>
                </Table.Root>
                </>
              ) : (
                <Text color="gray.500">Nessuna immagine trovata</Text>
              )}
            </Tabs.Content>

        </Tabs.Root>
            </Collapsible.Content>
        </Collapsible.Root>


      </VStack>
    </Box>
  );
}