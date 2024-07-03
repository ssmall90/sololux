'use client'

import { Box, Flex, Link, Image } from '@chakra-ui/react'
import React from 'react';

const Navbar = () => {
  return (
    <Box bg={'#001F3F'} px={4} color={'#F8D47A'}>
    <Flex h={24} alignItems={'center'} justifyContent={'space-between'}>
      <Box>
        <Image boxSize={'115px'} src='./logo.png'/>
        </Box>
      <Flex alignItems={'center'}>
        <Link href="/" px={2} py={1} rounded={'md'} _hover={{ textDecoration: 'none', color: 'white'}}>
          Home
        </Link>
      </Flex>
    </Flex>
  </Box>
  )
};

export default Navbar;