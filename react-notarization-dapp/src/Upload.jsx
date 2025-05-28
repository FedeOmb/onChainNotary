import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Box, Flex, Heading, Button, Text, SegmentGroup, Container, VStack, FileUpload, Image
} from "@chakra-ui/react";
import { calculateFileHash, calculateImageHash } from "./hashing.js";
import NotarizeVerify from "./NotarizeVerify.jsx";

export default function Upload() {
  const [fileType, setFileType] = useState("document");
  const [docHash, setDocHash] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageHashData, setImageHashData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.files[0];
    console.log("File selected:", file);
    if (!file) return;
    clearState();
    setFile(file);
    setIsProcessing(true);
    const result = await calculateFileHash(file);
    setDocHash(result);
    setIsProcessing(false);
  };

  const handleImageChange = (e) => {
    clearState();
    const file = e.files[0];
    if (!file) return;

    // Determina il tipo di file
    const isPNG = file.type === "image/png";
    const isJPEG = file.type === "image/jpeg";

    if (!isPNG && !isJPEG) {
      throw new Error(
        "Formato non supportato. Solo PNG e JPEG sono supportati."
      );
    }
    setImage(file);
    // Crea un'anteprima dell'immagine
    setImagePreview(URL.createObjectURL(file));

    handleImageHash(file);
  };

  const handleImageHash = async (file) => {
    setIsProcessing(true);
    try {
      const result = await calculateImageHash(file);
      const extension = file.name.split(".").pop();
      setImageHashData({
        pixelHash: result.pixelHash,
        metadataHash: result.metadataHash,
        extension: extension,
      });
    } catch (error) {
      console.error("Errore:", error);
      setError(
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
    setDocHash(null);
    setImageHashData(null);
    URL.revokeObjectURL(imagePreview); // Rilascia l'URL dell'anteprima
    setImagePreview(null);
  }

  const onOptionChange = (e) => {
    setFileType(e.value);
    clearState();
  };

  return (
    <VStack w="100%"spacing={4} p={4} align="center">
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

      <Flex justify="center" w="100%" maxW="90vw" p={4}>

      {fileType === "document" && (
        <Flex flexDirection="row" flexWrap="wrap"w="100%" p={4} justifyContent={"center"} gap="20px">
          <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} onFileAccept={handleFileChange}>
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
              <FileUpload.DropzoneContent>
                <Box>Trascina qui un documento per calcolare il suo Hash</Box>
                <Box color="fg.muted">fino a 20 MB</Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.List />
          </FileUpload.Root>
          {file && (
            <Box>
              <Heading as="h3" size="md" mt={4}>Documento caricato:</Heading>
              <Text>File: {file.name}</Text>
              <Text>Dimensione: {file.size} bytes</Text>
              <Text>Tipo: {file.type}</Text>
            </Box>
          )}
        </Flex>
      )}

      {fileType === "image" && (
        <Flex flexDirection="row" flexWrap="wrap"w="100%" p={4} justifyContent={"center"} gap="20px">
          <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} accept="image/jpeg,image/png" onFileAccept={handleImageChange}>
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
              <FileUpload.DropzoneContent>
                <Box>Trascina qui un'immagine per calcolare il suo Hash</Box>
                <Box color="fg.muted">Sono supportati i formati .jpeg e .png fino a 20 MB</Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.List />
          </FileUpload.Root>
          {image && (
            <Box>
              <Heading as="h3" size="md" mt={4}>Immagine caricata:</Heading>
              <Text>File: {image.name}</Text>
              <Text>Dimensione: {image.size} bytes</Text>
              <Text>Tipo: {image.type}</Text>
            </Box>
          )}
          {imagePreview && (
            <Image maxHeight="300px" maxWidth="100%" src={imagePreview} alt="Anteprima immagine" mt={4}>
            </Image>
          )}

        </Flex>
      )}
      </Flex>
      {isProcessing && <p>Calcolo dell'hash in corso...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {fileType === "document" && docHash && (
        <p>Hash SHA256 del documento: {docHash}</p>
      )}
      {fileType === "image" && imageHashData && (
        <div>
          <p>Hash SHA256 dei pixel: {imageHashData.pixelHash}</p>
          <p>Hash SHA256 dei metadati: {imageHashData.metadataHash}</p>
        </div>
      )}
      {(docHash || imageHashData) && (
        <NotarizeVerify docData={docHash} imageData={imageHashData} />
      )}
    </VStack>
  );
}
