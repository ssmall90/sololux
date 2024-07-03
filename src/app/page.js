"use client";
import Head from 'next/head';
import { ChakraProvider, Box } from '@chakra-ui/react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Form from './components/Form';
import Activities from './components/Activities';
import { useEffect, useRef, useState } from "react";
import "./globals.css";
import 'react-datepicker/dist/react-datepicker.css'

export default function Home() {

  const [activities, setActivities] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const sectionRef = useRef(null);

  const updateActivities = (newActivities) => {
    setActivities(newActivities);
    setResultsLoaded(true);
  };


  useEffect(() => {
    if (resultsLoaded) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setResultsLoaded(false);
    }
  },[resultsLoaded])

  return (
    <ChakraProvider >
       <Head>
        <title>SoloLux</title>
        <meta name="description" content="Plan your travel with ease using SoloLux." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <Hero/>
      <Form updateActivities={updateActivities}/>
      <Box ref={sectionRef}>
      {activities.length > 0 ? 
      (
        <Activities activities={activities}/> 
      ):
      <div></div>
    }
      </Box>
    </ChakraProvider>
  );
}
