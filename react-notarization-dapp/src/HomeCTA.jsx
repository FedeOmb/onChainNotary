import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Span,
  Button,
  Stack,
  Icon,
  createIcon,
  Image
} from '@chakra-ui/react';

export default function HomeCTA() {
  const scrollToUpload = () => {
    // Trova l'elemento Upload e scrolla fino ad esso
    const uploadSection = document.querySelector('#upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Flex width="100vw" minH={'30vh'} maxH={"40vh"} alignItems={'center'} justify="center" bg="gray.50">
      <Stack
      maxWidth={"6xl"}
        as={Box}
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 30 }}
      >
                <Image src="./icons/stamp.png" height="70px"/>
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
          Ethereum. <br/> Proteggi integrità e autenticità dei tuoi documenti e immagini in modo immutabile e
          verificabile da chiunque.
        </Text>

        <Button
          bg={{base:"orange.600", _hover:'orange.700'}}
          rounded={'full'}
          px={6}
          onClick={scrollToUpload}
        >
          Inizia ora
        </Button>

      </Stack>
    </Flex>
  );
}