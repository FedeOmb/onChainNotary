import React from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  createIcon,
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
    <Container maxW={'3xl'} minH={'20vh'} maxH={"40vh"}display={'flex'} alignItems={'center'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          Notarizza i tuoi documenti <br />
          <Text as={'span'} color={'blue.400'}>
            sulla blockchain
          </Text>
        </Heading>
        <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }}>
          onChainNotary ti permette di salvare l'impronta digitale dei tuoi file sulla blockchain
          Ethereum. Proteggi l'autenticità dei tuoi documenti e immagini in modo immutabile e
          verificabile da chiunque.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          <Button
            colorScheme={'blue'}
            bg={'blue.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={scrollToUpload}
          >
            Inizia ora
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}