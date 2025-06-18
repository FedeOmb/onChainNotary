import { ethers } from "ethers";
import { Jimp } from "jimp";

export async function calculateFileHash(file) {
  try {
    // Legge i bytes dal file
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    //calcola l'hash sha256 con api crypto nativa
    const hash = await calcHashSHA256(fileBytes);
    return hash;
  } catch (error) {
    console.error("Errore calcolo hash", error);
    alert("Errore nel calcolo dell'hash:");
  }
}

export async function calculateImageHash(file, pixelAlgo = "sha256", fullAlgo = "sha256") {
  let image;
  let pixelData;
  let arrayBuffer;
  try {
    // Converti il file in ArrayBuffer per l'analisi
    arrayBuffer = await file.arrayBuffer();
    // estrai i pixel immagine usando jimp
    image = await Jimp.fromBuffer(arrayBuffer, { 'image/jpeg': { maxMemoryUsageInMB: 1024 } });
    pixelData = image.bitmap.data;
  } catch (error) {
    console.error("Errore durante l'estrazione dei dati dall'immagine", error);
    throw error;
  }
  try {
    //calcola l'hash del file immagine completo
    const fileBytes = new Uint8Array(arrayBuffer);
    const fullHash = await calcHashSHA256(fileBytes);
    // Calcola l'hash dei pixel con sha256 e phash
    const pixelHashSHA256 = await calcHashSHA256(pixelData);
    const phash = calcPHashJimp(image);
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

//calcola il phash usando Jimp
function calcPHashJimp(image) {
  const phash = image.hash(16);
  //converte l'hash in stringa esadecimale
  const hexString = '0x' + phash;
  const bytes32 = ethers.hexlify(hexString);

  return bytes32;
}

//calcola l'hash SHA256 dei dati passati usando l'api crypto nativa
async function calcHashSHA256(data) {

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  // conversione in stringa esadecimale con ethers
  const hash = ethers.hexlify(hashArray);

  return hash;
}