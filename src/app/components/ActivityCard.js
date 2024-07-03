import { Box, Text, Image, Icon } from "@chakra-ui/react";
import { GoStarFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa6";

const ActivityCard = ({
    title,
    type,
    description,
    website,
    rating,
    address,
    photos,}) => {

    const defaultImage = '/activity-card-resort.jpg';

    console.log("Photos array: ", photos);
    console.log("Default image path: ", defaultImage);

    return(
        <Box border={"solid 1px white"} 
        bg={'#001F3F'}
        borderRadius={'20px'}
        className="activity-bx" 
        p={8}
        position="relative">
          <Box
            display={"flex"}
            flexDirection={"column"}
            color={"white"}
            className="activity-txt"
          >
            <Box h={'50px'} >
            <Text color={'#F8D47A'}  fontSize={'1.3em'}>{title}</Text>
            </Box>
          </Box>
          <Box  h={'200px'} position={'relative'} display="flex" flexWrap="wrap" justifyContent="center" gap={4} overflow="hidden" >
          {photos && photos.length > 0 ? photos.map((photoUrl, index) => (
          <Image
            key={index}
            border={'solid 2px #F8D47A'}
            borderRadius={'20px'}
            boxSize={'100%'}
            objectFit='cover'
            src={photoUrl}
            alt={`Image ${index + 1}`}
          />
        )) : (
          <Image
            border={'solid 2px #F8D47A'}
            borderRadius={'20px'}
            boxSize={'100%'}
            objectFit='cover'
            src={defaultImage}
            alt="Default Image"
          />
        )}
              <Box justifyContent={'center'} p={'10px'} alignItems={'center'} display={'flex'} position={'absolute'} bg={'#002B55'} w={'30%'} h={'20%'} bottom={'0'} right={'-3'} borderLeft={'solid 1px #F8D47A'} borderTop={'solid 2px #F8D47A'} borderTopLeftRadius={'10px'} borderTopRightRadius={'10px'} >
              <Box textAlign={'center'}  fontSize={{base: '1em'}} color={"white"}>{rating > 0 ? <Box mr={'5px'} mt={'3px'} display={'flex'}>{rating}<Icon ml={'4px'} as={GoStarFill} w={"1em"} h={"1em"} color={"#F8D47A"}/></Box> : (<Text pt={{base:'0px', md: '2px'}} mr={{base: '0px', md: '7px', lg: '7px'}}>No Votes</Text>)}</Box>
              </Box>
          </Box>
    
          <Box pb={'20px'} pt={'20px'}>
            <h2>Description</h2>
            <Box className="info-bx"><Text color={"white"}>{description}</Text></Box>
    
            <h2>Address</h2>
            <Box className="info-bx"><Text color={"white"}>{address}</Text></Box>
    
            <h2>Categories</h2>
            <Box className="info-bx"><Text color={"white"}>{type}</Text></Box>
          </Box>
    
          <Box  position="absolute" bottom="18px" right="35px">
            <Text fontSize={'1em'} color={"white"}>
              <a className="link-bx" href={website} target="_blank" rel="noopener noreferrer">
                {"Visit"}
                <Icon marginLeft={'6px'} as={FaArrowRight} w={"1em"} h={"1em"} color={"#F8D47A"}/>
              </a>
            </Text>
          </Box>
        </Box>
    )
}

export default ActivityCard;