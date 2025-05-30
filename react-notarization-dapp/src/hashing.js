import { ethers } from "ethers";
import {Image} from "image-js";
import {Jimp} from "jimp";
import exifr from "exifr";

export async function calculateFileHash(file){
    try{
    console.log("File selected:", file);
    // Legge il file come ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Converte l'ArrayBuffer in Uint8Array
    const fileBytes = new Uint8Array(arrayBuffer);
    // Calcola l'hash SHA256 usando ethers.js
    //const hash = ethers.sha256(fileBytes);
    //calcolo hash con crypto nativa
    const hash = await calcHashSHA256(fileBytes);
    console.log("Hash calcolato:", hash);
    return hash;
    } catch (error) {
        console.error("Errore calcolo hash",error);
        alert("Errore nel calcolo dell'hash:");
    }
}

export async function calculateImageHash(file, pixelAlgo = "sha256", fullAlgo = "sha256") {
  try {
    // Converti il file in ArrayBuffer per l'analisi
    console.log("calculating hash of image", file);
    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer length:", arrayBuffer.byteLength);
    /*
    const startTime1 = performance.now();
    // estrai i pixel immagine usando image-js
    console.log("Estrazione dei pixel dall'immagine usando image-js...");
    const image = await Image.load(arrayBuffer);
    const pixelData = image.data;    
    console.log("Pixel estratti usando image-js:", pixelData.length);
    const endTime1 = performance.now();
    console.log("Tempo di estrazione pixel usando image-js:", endTime1 - startTime1, "ms");
*/
    // estrai i pixel immagine usando jimp

    const startTime2 = performance.now();
    console.log("Estrazione dei pixel dall'immagine usando jimp...");
    const image2 = await Jimp.fromBuffer(arrayBuffer);
    const pixelData2 = image2.bitmap.data;    
    console.log("Pixel estratti usando jimp:", pixelData2.length);
    const endTime2 = performance.now();
    console.log("Tempo di estrazione pixel usando jimp:", endTime2 - startTime2, "ms");  

    // Calcola l'hash dei pixel
    //const pixelHash1 = await calcHashSHA256(pixelData);
    //console.log("Hash dei pixel con image-js:", pixelHash1);
    const pixelHash2 = await calcHashSHA256(pixelData2);
    console.log("Hash dei pixel con jimp:", pixelHash2);

    // Calcolo hash dell'intero file immagine
    const fileBytes = new Uint8Array(arrayBuffer);
    // Calcola l'hash SHA256 usando ethers.js
    //const fullHash = ethers.sha256(fileBytes);
    console.log("Calcolo perceptual hash usando jimp...");
    const phash = calcPHashJimp(image2); 
    console.log("Perceptual hash calcolato:", phash);

    const fullHash = await calcHashSHA256(fileBytes);
    return {
      pixelHash: pixelHash2,
      fullHash: fullHash,
    };
  } catch (error) {
    console.error("Errore durante il calcolo degli hash:", error);
    throw error;
  }
}

function calcPHashJimp(image){
  const phash = image.hash(16);
  console.log("Perceptual hash base 16:", phash);
  const paddedPhash = phash.padEnd(64, '0'); // ora è una stringa esadecimale da 64 char
  console.log("Perceptual hash padded:", paddedPhash);
  const hexString = '0x' + paddedPhash;
  console.log("Perceptual hash in formato esadecimale:", hexString)
  const bytes32 = ethers.hexlify(hexString); // restituisce un esadecimale tipo '0x...'
  console.log("Perceptual hash in formato bytes32:", bytes32);
  return bytes32;
}

// Funzione principale per calcolare gli hash
/*export async function calculateImageHash(file, pixelAlgo = "sha256", metadataAlgo = "sha256") {
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
}*/




async function calcHashSHA256(data) {

    // calcolo hash usando api crypto nativa
    console.log("Data length:", data.length);
    const startTime1 = performance.now();
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    console.log("Hash dei dati con crypto:", hashBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    //console.log("Hash dei dati convertito in array:", hashArray);
    // conversione in stringa esadecimale con ethers
    const hash = ethers.hexlify(hashArray);
    const endTime1 = performance.now();

    console.log("Hash dei dati con crypto convertito con ethers:", hash);
    console.log("Tempo di calcolo hash:", endTime1 - startTime1, "ms");
  
  return hash;
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