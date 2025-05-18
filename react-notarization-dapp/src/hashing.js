import { ethers } from "ethers";
import ExifReader from "exifreader";
import {Image} from "image-js";

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
export async function calculateImageHash(file) {
  try {
    // Converti il file in ArrayBuffer per l'analisi
    console.log("calculating hash of image", file);
    const buffer = await file.arrayBuffer();
    const image = await Image.load(buffer);
    
    // Determina il formato dell'immagine dai primi byte
    //const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    //const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
    
    /*if (!isPNG && !isJPEG) {
      throw new Error("Formato immagine non supportato. Solo PNG e JPEG sono supportati.");
    }*/

    const pixelData = image.data;    
    /*
    if (isPNG) {
      //const result = await extractPNGData(buffer);
      //pixelData = result.pixelData;
      //metadataData = result.metadataData;
    } else if(isJPEG) {
      const result = await extractJPEGData(imgArrayBuffer);
      pixelData = result.pixelData;
      metadataData = result.metadataData;
    }*/
   console.log("Pixel data length:", pixelData.length);
    
    // Calcola gli hash con ethers.js
    const pixelHash = ethers.sha256(new Uint8Array(pixelData));
    console.log("Hash dei pixel uintarray:", pixelHash);
    //const metadataHash = ethers.sha256(pixelData);
    
    return {
      pixelHash: pixelHash,
      metadataHash: pixelHash,
    };
  } catch (error) {
    console.error("Errore durante il calcolo degli hash:", error);
    throw error;
  }
}


// Estrazione dati JPEG usando jpeg-js e ExifReader
async function extractPixelData(buffer) {
  // Usa ExifReader per estrarre i metadati
  console.log("Estrazione metadati JPEG con exifreader");
  const tags = ExifReader.load(buffer);
  
  // Converti i metadati in un buffer
  const metadataStr = JSON.stringify(tags);
  console.log("Metadati JPEG:", metadataStr);
  const metadataData = Buffer.from(metadataStr);
  console.log("decodifica jpeg con jpeg-js per ottenere i pixel");
  // Usa jpeg-js per decodificare l'immagine e ottenere i pixel
  const jpegData = JPEG.decode(buffer);
  const pixelData = Buffer.from(jpegData.data);
  
  return {
    pixelData,
    metadataData
  };
}

// Estrazione dati PNG usando pngjs
async function extractPNGData(buffer) {
  return new Promise((resolve, reject) => {
    // Usa la libreria PNG per analizzare il file
    const png = new PNG();
    
    // Parser per gli eventi e raccolta metadati
    const metadataChunks = [];
    
    // Intercetta i chunk per raccogliere metadati
    png.on('metadata', metadata => {
      // Converti il metadata in buffer
      const metadataStr = JSON.stringify(metadata);
      const metadataBuffer = Buffer.from(metadataStr);
      metadataChunks.push(metadataBuffer);
    });
    
    // Analizza i dati PNG
    png.parse(buffer, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      
      // I pixel sono accessibili tramite data.data
      const pixelData = Buffer.from(data.data);
      
      // Se non abbiamo metadati, creiamo un buffer vuoto
      const metadataData = Buffer.concat(metadataChunks.length > 0 ? 
        metadataChunks : [Buffer.from([])]);
      
      resolve({
        pixelData,
        metadataData
      });
    });
  });
}