import React from 'react';
import { Box, Heading, Flex, Text, Span, Button, Stack, Icon, Image } from '@chakra-ui/react';
import stamp from "../assets/icons/stamp.png"

export default function HomeCTA() {

  const scrollToSection = (sectionID) => {
    const sectionElem = document.getElementById(sectionID);
    if (sectionElem) {
      sectionElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Flex width="100vw" minH={'30vh'} maxH={"40vh"} alignItems={'center'} justify="center" bg="orange.50">
      <Stack
        maxWidth={"6xl"}
        as={Box}
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 30 }}
      >
        <Image src={stamp} height="70px" />
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          <Span color={'orange.400'}>Notarizza</Span> i tuoi documenti<br />
          sulla <Span color={'orange.400'}> blockchain</Span>
        </Heading>
        <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }}>
          onChainNotary ti permette di salvare l'impronta digitale dei tuoi file sulla blockchain
          Ethereum. <br /> Proteggi integrità e autenticità dei tuoi documenti e immagini in modo immutabile e
          verificabile da chiunque.
        </Text>
        <Flex gap="4">
          <Button
            bg={{ base: "orange.600", _hover: 'orange.700' }}
            rounded={'full'}
            px={6}
            onClick={scrollToSection("#upload-section")}
          >
            Inizia ora
          </Button>
          <Button
            bg={{ base: "orange.subtle", _hover: 'orange.300' }}
            color={"orange.600"}
            borderColor="orange.600"
            rounded={'full'}
            px={6}
            onClick={scrollToSection("#faq-section")}
          >
            Come funziona?
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
}