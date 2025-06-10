import React, { useState } from "react";
import { ethers } from "ethers";
import { acceptedDocTypes, acceptedImageTypes} from "./supportedFilesConfig.js";
import {
  Box, Flex, Heading, Button, Text, SegmentGroup, Container, VStack, FileUpload, Image, Alert, NativeSelect
} from "@chakra-ui/react";
import { calculateFileHash, calculateImageHash } from "./hashing.js";
import NotarizeVerify from "./NotarizeVerify.jsx";

export default function Upload() {
  const [fileType, setFileType] = useState("document");
  const [docHashData, setDocHashData] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageHashData, setImageHashData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [hashError, setHashError] = useState(null)
  const handleFileChange = async (e) => {
    const file = e.files[0];
    console.log("File selected:", file);
    if (!file) return;
    // Verifica il tipo di file
    if (!acceptedDocTypes.includes(file.type)) {
      setUploadError(
        "Formato o dimensione non supportata."
      );
      return;
    }
    clearState();
    setFile(file);
    //handleFileHash(file);
  };

  const handleHash = async () => {
    if (fileType === "document" && file) {
      await handleFileHash(file);
    } else if (fileType === "image" && image) {
      await handleImageHash(image);
    }
  };  

  const handleFileHash = async (file) => {
    setIsProcessing(true);
    const result = await calculateFileHash(file);
    const extension = file.name.split(".").pop();
    setDocHashData({
      hash: result,
      extension: extension,

    })
    setIsProcessing(false);
  }

  const handleImageChange = (e) => {
    clearState();
    const file = e.files[0];
    if (!file) return;

    // Determina il tipo di file
    const isPNG = file.type === "image/png";
    const isJPEG = file.type === "image/jpeg";

    /*if (!isPNG && !isJPEG) {
      throw new Error(
        "Formato non supportato. Solo PNG e JPEG sono supportati."
      );
    }*/
    setImage(file);
    // Crea un'anteprima dell'immagine
    setImagePreview(URL.createObjectURL(file));

    //handleImageHash(file);
  };

  const handleImageReject = (e) => {
    console.error("File non accettato:", e);
    setUploadError(
      "Formato o dimensione dell'immagine non supportati."
    );
  }
  const handleFileReject = (e) => {
    console.error("File non accettato:", e);
    setUploadError(
      "Formato o dimensione del documento non supportati."
    );
  }

  const handleImageHash = async (file) => {
    setIsProcessing(true);
    try {
      const result = await calculateImageHash(file);
      const extension = file.name.split(".").pop();
      setImageHashData({
        pixelHashSHA256: result.pixelHashSHA256,
        phash: result.phash,
        fullHash: result.fullHash,
        extension: extension
      });
    } catch (error) {
      console.error("Errore:", error);
      setHashError(
        error.message ||
        "Si è verificato un errore durante l'elaborazione dell'immagine"
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function clearState() {
    setFile(null);
    setImage(null);
    setDocHashData(null);
    setImageHashData(null);
    URL.revokeObjectURL(imagePreview); // Rilascia l'URL dell'anteprima
    setImagePreview(null);
    setHashError(null);
    setUploadError(null);
  }

  const onOptionChange = (e) => {
    setFileType(e.value);
    clearState();
  };

  return (
    <VStack spacing={4} p={4} align="center">
      <Heading as="h2" size="xl" mb={4}>
        Carica un Documento o un'immagine
      </Heading>
      <Text>Seleziona il tipo di file da caricare:</Text>

      <SegmentGroup.Root value={fileType} onValueChange={onOptionChange}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={[
          { label: "Documento", value: "document" },
          { label: "Immagine", value: "image" },
        ]}>
        </SegmentGroup.Items>
      </SegmentGroup.Root>

      <Flex justify="center" width="90vw" p={4}>

      {fileType === "document" && (
        <Flex flexDirection="row" flexWrap="wrap" flexGrow="1" p={4} justifyContent={"center"} gap="10x">
          <FileUpload.Root maxW="xl" flexBasis="50%" flexGrow="1" alignItems="stretch" maxFiles={1} maxFileSize="10000000" onFileAccept={handleFileChange} onFileReject={handleFileReject}>
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
              <FileUpload.DropzoneContent>
              {file ? (
              <Flex direction="column" align="center" gap={2}>
                <Box>
                  <Heading as="h3" size="md" mt={4}>File caricato:</Heading>
              <Text>File: {file.name}</Text>
              <Text>Dimensione: {file.size} bytes</Text>
              <Text>Tipo: {file.type}</Text>
                </Box>
                <Button colorScheme="red" size="sm" onClick={clearState}>
                  Rimuovi file
                </Button>
              </Flex>
            ) : (
              <>
                <Box>Trascina qui un documento per calcolare il suo Hash</Box>
                <Box color="fg.muted">sono supportati i più comuni formati di documenti e testo fino a 100 MB</Box>
              <Box>
              {uploadError && (
                <Alert.Root status="error" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Title>
                      {uploadError}
                    </Alert.Title>
                </Alert.Root>
                )
              }</Box>
              </>
            )}
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.List />
          </FileUpload.Root>
        </Flex>
      )}

      {fileType === "image" && (
        <Flex flexDirection="row" flexWrap="wrap" flexGrow="1" flexShrink="1" p={4} justifyContent={"center"} gap={1}>
            <FileUpload.Root maxW="xl" flexBasis="50%" alignItems="stretch" maxFiles={1} accept="image/jpeg,image/png,image/gif,image/bmp" maxFileSize="20000000" onFileAccept={handleImageChange} onFileReject={handleImageReject}>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone>
                <FileUpload.DropzoneContent>
          {image ? (
              <Flex direction="column" align="center" gap={2}>
                <Box>
                  <Heading as="h3" size="md" mt={4}>Immagine caricata:</Heading>
                  <Text>File: {image.name}</Text>
                  <Text>Dimensione: {image.size} bytes</Text>
                  <Text>Tipo: {image.type}</Text>
                </Box>
                <Button colorScheme="red" size="sm" onClick={clearState}>
                  Rimuovi immagine
                </Button>
              </Flex>
            ) : (
              <>
                <Box>Trascina qui un'immagine per calcolare il suo Hash</Box>
                <Box color="fg.muted">
                  Sono supportati i formati .jpeg, .png, .gif, .bmp fino a 20 MB
                </Box>
                <Box>
              {uploadError && (
                <Alert.Root status="error" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Title>
                      {uploadError}
                    </Alert.Title>
                </Alert.Root>
                )
              }</Box>
              </>
            )}
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.Root>
            {imagePreview && (
              <Flex flexBasis="50%" align="center" alignItems="stretch">
                <Image maxHeight="300px" src={imagePreview} alt="Anteprima immagine" mt={4}>
                </Image>
              </Flex>
            )}
        </Flex>
      )}
      </Flex>

      <Button colorScheme="blue" size="sm" onClick={handleHash} loading={isProcessing}>
        CALCOLA HASH
      </Button>

      {isProcessing && <p>Calcolo dell'hash in corso...</p>}
      {hashError && (
      <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Title>
            {error}
          </Alert.Title>
      </Alert.Root>
      )}

      {fileType === "document" && docHashData && (
        <p>Hash SHA256 del documento: {docHashData.hash}</p>
      )}
      {fileType === "image" && imageHashData && (
        <div>
          <p>Hash SHA256 dei pixel dell'immagine: {imageHashData.pixelHashSHA256}</p>
          <p>Hash pHash dei pixel dell'immagine: {imageHashData.phash}</p>
          <p>Hash SHA256 del file immagine completo: {imageHashData.fullHash}</p>
        </div>
      )}
      {(docHashData || imageHashData) && (
        <NotarizeVerify docData={docHashData} imageData={imageHashData} />
      )}
    </VStack>
  );
}
