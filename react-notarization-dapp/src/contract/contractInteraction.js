import { ethers } from "ethers";

export async function verifyDocHash(contract, hash, algorithm="sha256") {
    try {
        console.log("Hash da verificare:", hash);
        const result = await contract.getDocumentByHash(hash, algorithm.toLowerCase());

        const [uploader, timestamp, hashAlgorithm, extension] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
        console.log(date)
    
    return {
        docHash: hash,
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        hashAlgorithm: hashAlgorithm,
        extension: extension,
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }
}

export async function verifyImageHash(contract, hash, algorithm="sha256") {
    try {
        console.log("Hash da verificare:", hash);
        const result = await contract.getImageByHash(hash, algorithm.toLowerCase());

        const [fullHash, uploader, timestamp, extension, pixelHashAlgorithm, fullHashAlgorithm] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
        console.log(date)
    return {
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        pixelHash: hash,
        fullHash: fullHash,
        extension: extension,
        pixelHashAlgorithm: pixelHashAlgorithm,
        fullHashAlgorithm: fullHashAlgorithm,
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }    
}

export async function notarizeDocument(contract, hash, algorithm, extension){
    try{
        const tx = await contract.notarizeDocument(hash, algorithm, extension);

        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
    if (error?.message?.includes("hash already stored") || error?.reason?.includes("hash already stored")) {
          throw new Error("Transazione annullata: questo hash è già stato memorizzato sulla blockchain.");
    }    
    if(error.code === "ACTION_REJECTED" || error.code === 4001) {
        throw new Error("Transazione annullata dall'utente.");
    }
        console.error("Errore durante la notarizzazione del documento:", error);
        throw new Error("Errore durante la notarizzazione del documento. Riprova. ");
    }
}


export async function notarizeImage(contract, pixelHash, fullHash, extension, algoPixelHash, algoFullHash){
    try{
        console.log("notarizzazione immagine in corso")
        const tx = await contract.notarizeImage(pixelHash, fullHash, extension, algoPixelHash, algoFullHash);

        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
    if (error?.message?.includes("hash already stored") || error?.reason?.includes("hash already stored")) {
          throw new Error("Transazione annullata: questo hash è già stato memorizzato sulla blockchain.");
    }    
    if(error.code === "ACTION_REJECTED" || error.code === 4001) {
        throw new Error("Transazione annullata dall'utente.");
    }
        console.error("Errore durante la notarizzazione dell'immagine:", error);
        throw new Error("Errore durante la notarizzazione dell'immagine. Riprova. ");
    }
}

export async function documentExists(contract, hash, algorithm="sha256") {
    try {
        const exists = await contract.documentExistsByHash(hash, algorithm.toLowerCase());

        console.log("Document exists:", exists);
        return exists;
    } catch (error) { 
        console.error("Errore durante la verifica del documento:", error);
        throw error;
    }
}

export async function imageExists(contract, hash, algorithm="sha256") {
    try {
        const exists = await contract.imageExistsByHash(hash, algorithm.toLowerCase());
      
        console.log("Image exists:", exists);
        return exists;
    } catch (error) {
        console.error("Errore durante la verifica dell'immagine:", error);
        throw error;
    }
}

export async function getMyDocumentsKeys(contract) {
try {
        const keys = await contract.getMyDocumentsKeys();
/*         const hashes = await Promise.race([
            contract.getMyDocumentsHashes(),
            getTimeoutPromise()
        ]);            */
        // Converti gli hash in formato leggibile
        const hashesReadable = keys.map(key => ethers.hexlify(key));    
        console.log("keys retrieved:", hashesReadable);
        return hashesReadable;
} catch (error) {
        console.error("Errore durante il recupero degli hash", error);
        throw error;
    }    
}

export async function getMyImagesKeys(contract) {
try {
        const keys = await contract.getMyImagesKeys();
/*         const hashes = await Promise.race([
            contract.getMyImagesHashes(),
            getTimeoutPromise()
        ]);  */              
        // Converti gli hash in formato leggibile
        const hashesReadable = keys.map(key => ethers.hexlify(key));    
        console.log("keys retrieved:", hashesReadable);
        return hashesReadable;
} catch (error) {
        console.error("Errore durante il recupero degli hash", error);
        throw error;
    }        
}

export async function getMyFilesCount(contract){
try {
        const count = await contract.getMyFilesCount();
             
        console.log("Number of documents:", count[0].toString());
        console.log("Number of images:", count[1].toString());
        return {
            documents: Number(count[0]),
            images: Number(count[1])
        };
} catch (error) {
        console.error("Errore durante il recupero", error);
        throw error;
    }        
}

export async function getImageByKey(contract, key) {
    try {
        console.log("image key da recuperare", key);
        const result = await contract.getImageByKey(key);

        const [imageHash, fullHash, uploader, timestamp, extension, pixelHashAlgorithm, fullHashAlgorithm] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
    return {
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        pixelHash: imageHash,
        fullHash: fullHash,
        extension: extension,
        pixelHashAlgorithm: pixelHashAlgorithm,
        fullHashAlgorithm: fullHashAlgorithm,
    };
} catch (error) {
    console.error("Errore durante il recupero dell'immagine:", error);
    throw error;
  }    
}

export async function getDocumentByKey(contract, key) {
    try {
        console.log("chiave da verificare", key);
        const result = await contract.getDocumentByKey(key);
        const [docHash, uploader, timestamp, hashAlgorithm, extension] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
    return {
        docHash: docHash,
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        hashAlgorithm: hashAlgorithm,
        extension: extension,
    };
} catch (error) {
    console.error("Errore durante il recupero del documento:", error);
    throw error;
  }
}