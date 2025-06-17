import { ethers } from "ethers";
import {Jimp} from "jimp";

export async function calculateFileHash(file){
    try{
    console.log("File selected:", file);
    // Legge il file come ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Converte l'ArrayBuffer in Uint8Array
    const fileBytes = new Uint8Array(arrayBuffer);
    //calcolo hash sha256 con crypto nativa
    const hash = await calcHashSHA256(fileBytes);
    console.log("Hash calcolato:", hash);
    return hash;
    } catch (error) {
        console.error("Errore calcolo hash",error);
        alert("Errore nel calcolo dell'hash:");
    }
}

export async function calculateImageHash(file, pixelAlgo = "sha256", fullAlgo = "sha256") {
  let image;
  let pixelData;
  let arrayBuffer;
  try {
    // Converti il file in ArrayBuffer per l'analisi
    console.log("calculating hash of image", file);
    arrayBuffer = await file.arrayBuffer();
    // estrai i pixel immagine usando jimp
    console.log("Estrazione dei pixel dall'immagine usando jimp...");
    image = await Jimp.fromBuffer(arrayBuffer, { 'image/jpeg': { maxMemoryUsageInMB: 1024 } });
    pixelData = image.bitmap.data;    
  } catch (error) {
    console.error("Errore durante l'estrazione dei dati dall'immagine", error);
    throw error;
  }
  try{
      const fileBytes = new Uint8Array(arrayBuffer);
      const fullHash = await calcHashSHA256(fileBytes);
    // Calcola l'hash dei pixel
      console.log("Calcolo hash dei pixel usando SHA256 e jimp...");
      const pixelHashSHA256 = await calcHashSHA256(pixelData);
      console.log("Hash dei pixel con jimp:", pixelHashSHA256);
      console.log("Calcolo perceptual hash usando jimp...");
      const phash = calcPHashJimp(image); 
      console.log("Perceptual hash calcolato:", phash);
    return {
      pixelHashSHA256: pixelHashSHA256,
      phash: phash,
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
  const hexString = '0x' + phash;
  const bytes32 = ethers.hexlify(hexString);
  console.log("Perceptual hash in formato bytes32:", bytes32);
  return bytes32;
}

async function calcHashSHA256(data) {

    // calcolo hash usando api crypto nativa
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    console.log("Hash dei dati con crypto:", hashBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    // conversione in stringa esadecimale con ethers
    const hash = ethers.hexlify(hashArray);

    console.log("Hash dei dati con crypto convertito con ethers:", hash);
  
  return hash;
}