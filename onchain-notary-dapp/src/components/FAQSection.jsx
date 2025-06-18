import React from 'react';
import { Box, VStack, Span, Heading, Text, Accordion, Container, List, Mark } from '@chakra-ui/react';

export default function FAQSection() {
  return (
    <Box bg="white" width="100vw" py={8} id="faq-section">
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <Heading as="h2" size="xl" color="orange.600" textAlign="center">
            FAQ - Domande Frequenti
          </Heading>

          <Accordion.Root allowMultiple collapsible variant="subtle" size="lg">
            <Accordion.Item value="0">
              <Accordion.ItemTrigger>
                <Span flex="1">Come funziona il processo di notarizzazione?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  Il processo di notarizzazione segue questi passaggi:
                  <List.Root as="ol" variant={"marker"} colorPalette={"orange"} ml="5" mt="2" gap={2}>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Selezione del file </Mark> (documento o immagine) presente sul tuo pc
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Calcolo dell'impronta digitale </Mark>(hash) del file, l'elaborazione avviene <Mark variant="subtle">localmente</Mark> nel browser
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Invio dell'hash alla Blockchain</Mark> attraverso una transazione eseguita tramite il tuo Wallet Metamask
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      La blockchain <Mark variant="subtle">memorizza permanentemente</Mark> l'hash insieme a data, ora e indirizzo del wallet che ha effettuato l'operazione
                    </List.Item>
                  </List.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="1">
              <Accordion.ItemTrigger>
                <Span flex="1">Cosa significa notarizzare un file?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Text colorPalette={"orange"}>
                    Notarizzare significa registrare in modo <Mark variant="subtle">permanente e immutabile</Mark> l'<Mark variant="subtle">esistenza</Mark> di un file in una determinata data.
                    Attraverso la blockchain, viene memorizzata l'impronta digitale univoca del file (hash) che ne <Mark variant="subtle">garantisce l'integrità</Mark>. <br />
                    Questo permette in un momento successivo, a chiunque sia in possesso del file, di verificare che esisteva in una certa data, non è stato modificato da allora e qual è l'account Ethereum che l'ha registrato.
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="2">
              <Accordion.ItemTrigger>
                <Span flex="1">Qual è la differenza tra notarizzare un documento e un'immagine?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>

                  <List.Root ml="5" mt="2" gap={2} colorPalette={"orange"}>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      Per i <Mark variant="subtle">documenti</Mark> viene calcolato un solo hash SHA-256 dell'intero file, che permette di garantire l'integrità del documento.
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      Per le <Mark variant="subtle">immagini</Mark> invece è possibile scegliere tra due approcci:
                    </List.Item>
                  </List.Root>
                  <List.Root as="ol" variant={"marker"} colorPalette={"orange"} ml="10" mt="2" gap={2}>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Hash SHA-256 </Mark> del contenuto visivo dell'immagine (esclusi i metadati): è l'approccio predefinito e più rigoroso che permette di garantire l'integrità.
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Hash percettivo (pHash) </Mark>: è un approccio meno rigoroso ma più flessibile per la successiva verifica.
                    </List.Item>
                  </List.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="3">
              <Accordion.ItemTrigger>
                <Span flex="1">Qual è la differenza tra usare l'algoritmo SHA-256 e pHash per notarizzare una immagine?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <List.Root variant={"marker"} colorPalette={"orange"} ml="5" mt="2" gap={2}>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      L'<Mark variant="subtle">Hash SHA-256 </Mark> del contenuto dell'immagine (esclusi i metadati), garantisce l'integrità dell'immagine in modo analogo ai documenti, qualsiasi modifica successiva, anche minima come un nuovo salvataggio o una compressione, produrrà un hash completamente diverso e la verifica non andrà a buon fine.
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      L'<Mark variant="subtle">Hash percettivo (pHash) </Mark>(hash), genera un hash basato sulle caratteristiche visive principali dell'immagine invece che sui dati binari.
                      L'hash rimane uguale anche se l'immagine ha subito modifiche minori come compressione, ridimensionamento o pubblicazione sui social media, permettendo di verificare comunque l'immagine anche in questi casi.
                      Tuttavia data la sua flessibilità, pHash non garantisce l'integrità dell'immagine e può dare falsi positivi.
                    </List.Item>
                  </List.Root>
                  <Text ml="10" mt="2">
                    In entrambi i casi insieme all'hash del contenuto visivo dell'immagine (solo i pixel esclusi i metadati) viene anche salvato l'<Mark variant="subtle">hash del file completo</Mark> (pixel + metadati) per verificare anche l'integrità complessiva del file immagine, nel caso di una corrispondenza trovata.
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="4">
              <Accordion.ItemTrigger>
                <Span flex="1">I documenti e le immagini notarizzate sono salvate sulla blockchain o su un server?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Text colorPalette={"orange"}>
                    <Mark variant="subtle">No</Mark>, i file che carichi nella piattaforma non vengono mai salvati sulla blockchain o inviati a server esterni.
                    Tutta <Mark variant="subtle">l'elaborazione avviene localmente</Mark> nel browser dell'utente e <Mark variant="subtle">solo l'hash</Mark> (l'impronta digitale)
                    viene salvato sulla blockchain. Questo garantisce la privacy dei tuoi contenuti.
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="5">
              <Accordion.ItemTrigger>
                <Span flex="1">Quali sono i formati di immagine e documenti supportati?</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <List.Root variant={"marker"} colorPalette={"orange"} ml="5" mt="2" gap={2}>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Formati di immagine supportati:</Mark>  JPEG, PNG, GIF, BMP con dimensione massima 20 MB
                    </List.Item>
                    <List.Item _marker={{ color: "orange.700", fontWeight: "bold" }}>
                      <Mark variant="subtle">Formati di documenti supportati:</Mark>  PDF, formati di Microsoft Office, formati di OpenOffice, txt, csv, html, xml, json e markdown con dimensione massima di 50 MB

                    </List.Item>
                  </List.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

          </Accordion.Root>
        </VStack>
      </Container>
    </Box>
  );
}