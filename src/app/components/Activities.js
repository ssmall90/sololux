import React from 'react';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import ActivityCard from './ActivityCard';

const Activities = ({ activities }) => {
  return (
    <Box w="100vw" bg={'#F8D47A'} p={0}>
      <Box pt={'20px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Text fontSize={'2em'} color={'#002B55'}>{activities?.length > 0 ? activities[0].city : <></> }</Text>
      <Text fontSize={'1.4em'} color={'#002B55'}>{activities?.length > 0 ? activities[0].country : <></> }</Text>
      </Box>

      <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={10}
      mb={10}
      w="95vw"
      p={6}
      marginBottom={0}
      bg="#F8D47A"
      mx={'auto'}
    >
      {activities?.length > 0 ? activities.map((activity, index) => (
        <ActivityCard
          key={index}
          country={activity.country}
          city={activity.city}
          title={activity.name}
          address={activity.address}
          type={activity.type}
          description={activity.description}
          website={activity.website}
          rating={activity.rating}
          photos={activity.photos || []} 
        />
      )) : (
        <div>No Activities Available</div>
      )}
    </SimpleGrid>

    </Box>
  );
};

export default Activities;