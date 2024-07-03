"use client";

import React from 'react';
import { Box, Flex, Text } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box
      className="hero"
      id="hero"
      justifyContent="flex-start"
      alignItems="flex-end"
      py="50px"
      px="50px"
      h={{ base: "400px", md: "500px", lg: "500px", xl: "500px" }}
      backgroundImage={'/hero-img-3.jpg'}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(100, 130, 250, 0.5)"
        zIndex="1"
      />
      <Flex flexDirection="column" zIndex="2" maxW="50%">
        <Box  className="headline-container">
          <Text
            as={'span'}
            lineHeight={'1.2em'}
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            className="headline"
            color="#FFFDD0"
            maxW="100%">
            Luxury Solo Travel Made Easy with <Text mb={'10px'} color={'#F8D47A'}>SoloLux</Text></Text>
        </Box>
        <Box className="description-container">
          <Text
            className="description"
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            fontWeight="600"
            bgGradient="linear(45deg, rgba(0, 31, 63, 0.8), rgba(230, 230, 250, 0.5))"
            color="#FFFDD0"
            border="solid 0.5px #F8D47A"
            rounded="md"
            padding="8px"
          >
            Discover a world of sophisticated luxury, tailored exclusively for the refined traveler.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
};

export default Hero;