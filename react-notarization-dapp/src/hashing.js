import { ethers } from "ethers";
import {Image} from "image-js";
import exifr from "exifr";

export async function calculateFileHash(file){
    try{
    console.log("File selected:", file);
    // Legge il file come ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Converte l'ArrayBuffer in Uint8Array
    const fileBytes = new Uint8Array(arrayBuffer);
    // Calcola l'hash SHA256 usando ethers.js
    const hash = ethers.sha256(fileBytes);
    console.log("Hash calcolato:", hash);
    return hash;
    } catch (error) {
        console.error("Errore calcolo hash",error);
        alert("Errore nel calcolo dell'hash:");
    }
}

// Funzione principale per calcolare gli hash
export async function calculateImageHash(file, pixelAlgo = "sha256", metadataAlgo = "sha256") {
  try {
    // Converti il file in ArrayBuffer per l'analisi
    console.log("calculating hash of image", file);
    const buffer = await file.arrayBuffer();

    // estrai i pixel immagine usando image-js
    const image = await Image.load(buffer);
    const pixelData = image.data;    

    // Calcola l'hash dei pixel
    const pixelHash = await calcPixelHashSHA256(pixelData);

    const metadata = await extractMetadata(file);
    console.log("Metadata estratti:", metadata);
    const metadataHash = await calcMetadataHash(metadata);
    console.log("Hash dei metadati:", metadataHash);

    return {
      pixelHash: pixelHash,
      metadataHash: metadataHash,
    };
  } catch (error) {
    console.error("Errore durante il calcolo degli hash:", error);
    throw error;
  }
}


async function calcPixelHashSHA256(pixelData) {

    // calcolo hash usando crypto nativa
    console.log("Pixel data length:", pixelData.length);
    const startTime1 = performance.now();
    const hashBuffer = await crypto.subtle.digest('SHA-256', pixelData);
    console.log("Hash dei pixel con crypto:", hashBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    console.log("Hash dei pixel convertito in array:", hashArray);
    // conversione in stringa esadecimale con ethers
    const pixelHash = ethers.hexlify(hashArray);
    const endTime1 = performance.now();

    console.log("Hash dei pixel con crypto convertito con ethers:", pixelHash);
    console.log("Tempo di calcolo hash dei pixel:", endTime1 - startTime1, "ms");
  
  return pixelHash;
}

async function extractMetadata(file){
    // Estrai i metadati usando exifr
    const metadata = await exifr.parse(file, {
        // Opzioni per exifr
        mergeOutput: false,
        tiff: false,
        xmp: true,
        icc: false,
        iptc: true,
        jfif: false,
        ihdr: true,
        exif: true,
        gps: true,
        ifd0: true,
    });
    return metadata;
}
async function calcMetadataHash(metadata) {
    // Calcola l'hash dei metadati

    const metadataString = JSON.stringify(metadata);
    console.log("Stringa dei metadati:", metadataString);
    const encoder = new TextEncoder();
    const data = encoder.encode(metadataString);
    console.log("Dati dei metadati:", data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const metadataHash = ethers.hexlify(hashArray);
    return metadataHash;
}