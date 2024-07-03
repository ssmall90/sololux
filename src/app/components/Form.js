import {
    Box,
    Button,
    Select,
    VStack,
    FormLabel,
    FormControl,
    Text,
    Flex,
    Checkbox,
    Icon,
    Center,
    Spinner,
    SimpleGrid,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { FaCity, FaRegCalendarCheck, FaGlobe } from "react-icons/fa";
  import { MdOutlineLocalActivity } from "react-icons/md";
  import { GiChoice } from "react-icons/gi";
  import DatePicker from "react-datepicker";
  import { differenceInDays, isBefore } from "date-fns";
  import axios from "axios";
  import React from "react";
  
const Form = ({ updateActivities }) => {
 
    const HTTP = "http://localhost:5000/chat";

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
  
    const [countriesWithCities, setCountriesWithCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cities, setCities] = useState([]);
  
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [daysBetween, setDaysBetween] = useState(0);
  
    const [numberOfAdventures, setNumberOfAdventures] = useState(0);
  
    const [preferences, setPreferences] = useState([]);
    const [preferencesString, setPreferencesString] = useState('')
  
    const [prompt, setPrompt] = useState("");
  
  
    /****** USE EFFECTS ******/
  
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
          );
          const data = await response.json();
          const countriesWithCities = data.data.map((country) => ({
            country: country.country,
            cities: country.cities,
          }));
          setCountriesWithCities(countriesWithCities);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching countries", error);
          setLoading(false);
        }
      };
  
      fetchCountries();
    }, []);
  
  
    useEffect(() => {
      if (isBefore(endDate, startDate)) {
        setError("End date cannot be before start date");
        setDaysBetween(0);
      } else {
        setError("");
        const days = differenceInDays(endDate, startDate);
        setDaysBetween(days + 1);
      }
    }, [startDate, endDate]);
  
  
    useEffect(() => {
      const updatedPreferencesString = preferences.length > 0 ? preferences.join(", ") : "";
      setPreferencesString(updatedPreferencesString);
      if (selectedCity !== "" && numberOfAdventures > 0) {
        handlePrompt(updatedPreferencesString);
      }
      console.log("Updated Preference String:", updatedPreferencesString);
      console.log("Preferences:", preferences);
    }, [selectedCity, numberOfAdventures, preferences]);
  
  
    /****** METHODS ******/
  
    
    // Used to maintain the state of the selected country
    const HandleOnCountryChange = (countryName) => {
      setSelectedCountry(countryName);
      const thisCountry = countriesWithCities.find(
        (country) => country.country === countryName
      );
      setCities(thisCountry.cities);
    };
  
  
    // Used to maintain the state of the selected city
    const HandleCityOnChange = (cityName) => {
      setSelectedCity(cityName);
    };
  
  
    // Used to set the end date of the trip
    const handleEndDateChange = (date) => {
      if (isBefore(date, startDate)) {
        setError("End date cannot be before start date");
        setEndDate(startDate);
      } else {
        setError("");
        setEndDate(date);
      }
    };
  
  
    // Used to maintain the state of number of activites selected by user
    const handleOnActivityChange = (amount) => {
      setNumberOfAdventures(amount);
    };
  
  
    //Used to maintain the state of selected preferences
    const handleCheckboxChange = (value) => {
      setPreferences((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
      setPreferencesString(preferences.length > 0 ? preferences.join(", ") : "")
    };
  
  
  //Create prompt for openai API
    const handlePrompt = (updatedPreferencesString) => {
      setPrompt(
      `Curate a luxurious travel itinerary containing ${numberOfAdventures} activities in ${selectedCountry}, ${selectedCity} between ${startDate.toDateString()} and ${endDate.toDateString()}. The activities should only be from the following categories: ${updatedPreferencesString}. For each item in the list, ensure the activity strictly falls under one of these categories. Return the following properties in JSON format:
        {
          "country": "Country of Activity",
          "city": "City of Activity",
          "name": "Activity Name",
          "type": "Activity Category",
          "description": "Description of Activity",
          "website": "Link to the website for the activity"
        }
        Ensure each property is always included, even if it means returning an empty string. Validate the URLs to ensure they are accessible and return only valid links. Return the list as a JSON array without any extra text.`
      );
    };
  
    
    // Send request to openai API and update activities with returned JSON content.
    const getResponse = () => {
      setSubmitLoading(true);
      axios
        .post("/api/chat", { prompt })
        .then((res) => {
          try {
            const responseContent = res.data;
            updateActivities(responseContent);
          } catch (error) {
            console.error("Error parsing JSON response", error);
          }
          setSubmitLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching response:", error);
          setSubmitLoading(false);
        });
    };

  return (
 <Box w="100vw" p={6} borderWidth={1} boxShadow="lg" bg="#001F3F">
      {loading ? (
        <Center>
          <Spinner size="xl" color="#F8D47A" />
        </Center>
      ) : (
        <Box className="form-section" w="100vw" bg="#001F3F">
          <form className="form-box">
            <VStack
              p={6}
              spacing={0}
              align="stretch"
              w={"80vw"}
              alignItems={"center"}
            >
              <Text mb={"20px"} color={"#F8D47A"} fontSize={"1.4em"}>
                Lets Plan Your Next Adventure
              </Text>

              {/* Country Selection */}
              <FormControl display={"flex"} id="country" isRequired>
                <FormLabel className="form-label">
                  <Icon as={FaGlobe} w={"2em"} h={"2em"} color={"white"} />
                </FormLabel>
                <Select
                  placeholder="Select country"
                  variant="filled"
                  className="select"
                  onChange={(event) => {
                    const countryName = event.target.value;
                    HandleOnCountryChange(countryName);
                  }}
                >
                  {countriesWithCities.map((item, index) => (
                    <option key={index}>{item.country}</option>
                  ))}
                </Select>
              </FormControl>

              {/* City Selection */}
              <FormControl display={"flex"} id="city" isRequired>
                <FormLabel className="form-label">
                  <Icon as={FaCity} w={"2em"} h={"2em"} color={"white"} />
                </FormLabel>
                <Select
                  placeholder="Select city"
                  variant="filled"
                  className="select"
                  onChange={(event) => {
                    const cityName = event.target.value;
                    HandleCityOnChange(cityName);
                  }}
                >
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>

                {/*Date Selection*/}
              </FormControl>
              <Box>
                {daysBetween > 0 ? (
                  <Text mb={"15px"} color="#F8D47A">
                    Number of days: {daysBetween}
                  </Text>
                ) : (
                  <Text color="#F8D47A"></Text>
                )}
              </Box>

              <Flex
                w={"100%"}
                justifyContent={"space-between"}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Icon
                  mr={"20px"}
                  as={FaRegCalendarCheck}
                  color={"white"}
                  w={"2em"}
                  h={"2em"}
                  mb={{ base: "10px", md: "none" }}
                />

                {/*Start Date Selection*/}
                <FormControl
                  className="select"
                  pb={"20px"}
                  pt={"10px"}
                  borderTopLeftRadius={{ base: "13px", md: "13px" }}
                  borderTopRightRadius={{ base: "13px", md: "none" }}
                  borderBottomLeftRadius={{ base: "none", md: "13px" }}
                  borderRight={{ base: "none", md: "solid 1px #F8D47A" }}
                  display="flex"
                  flexDirection={"column"}
                  alignItems={"center"}
                  id="startDate"
                  isRequired
                >
                  <FormLabel ml={0} className="cal-date-label" color="white">
                    Start Date{" "}
                  </FormLabel>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMMM d, yyyy"
                  />
                </FormControl>

                {/*End Date Selection*/}
                <FormControl
                  className="select"
                  pb={"10px"}
                  pt={"10px"}
                  borderTopRightRadius={{ base: "none", md: "13px" }}
                  borderBottomRightRadius={{ base: "13px", md: "13px" }}
                  borderBottomLeftRadius={{ base: "13px", md: "none" }}
                  borderLeft={{ base: "none", md: "solid 1px #F8D47A" }}
                  display="flex"
                  flexDirection="column"
                  alignItems={"center"}
                  id="endDate"
                  isRequired
                >
                  <FormLabel ml={0} className="cal-date-label" color="white">
                    End Date{" "}
                  </FormLabel>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormat="MMMM d, yyyy"
                  />
                </FormControl>
              </Flex>

              {error && (
                <Text mt={"15px"} color="red">
                  {error}
                </Text>
              )}

              {/*Activity Selection*/}
              <FormControl
                mt={"40px"}
                display={"flex"}
                id="activities"
                isRequired
              >
                <FormLabel className="form-label">
                  <Icon
                    as={MdOutlineLocalActivity}
                    w={"2em"}
                    h={"2em"}
                    color={"white"}
                  />
                </FormLabel>
                <Select
                  placeholder="How many adventures?"
                  variant="filled"
                  className="select"
                  onChange={(event) => {
                    const amount = event.target.value;
                    handleOnActivityChange(amount);
                  }}
                >
                  {daysBetween > 0 ? (
                    Array.from({ length: Math.min(daysBetween, 10) }).map(
                      (_, index) => (
                        <option value={index + 1} key={index}>
                          {index + 1}
                        </option>
                      )
                    )
                  ) : (
                    <option>Please extend your trip to at least 1 day</option>
                  )}
                </Select>
              </FormControl>

              {/* /*Preferences Selection */}
              <FormControl>
                <FormLabel
                  className="form-label"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mb={10}
                >
                  <Icon color={"#F8D47A"} as={GiChoice} w={"1em"} h={"1em"} />
                  <Text color={"#F8D47A"} ml={"0.5em"}>
                    Adventure Preferences
                  </Text>
                </FormLabel>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  spacing={10}
                  mb={10}
                >
                  <Checkbox
                    isChecked={preferences.includes("spa-and-wellness")}
                    onChange={() => handleCheckboxChange("spa-and-wellness")}
                    colorScheme="green"
                    color={"white"}
                    value="spa-and-wellness"
                  >
                    Spa and Wellness
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("restuarants")}
                    onChange={() => handleCheckboxChange("restuarants")}
                    colorScheme="green"
                    color={"white"}
                    value="restuarants"
                  >
                    Restuarants
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes(
                      "cultural-and-artistic-exploration"
                    )}
                    onChange={() =>
                      handleCheckboxChange("cultural-and-artistic-exploration")
                    }
                    colorScheme="green"
                    color={"white"}
                    value="cultural-and-artistic-exploration"
                  >
                    Cultural and Artistic Exploration
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("exclusive-shopping")}
                    onChange={() => handleCheckboxChange("exclusive-shopping")}
                    colorScheme="green"
                    color={"white"}
                    value="exclusive-shopping"
                  >
                    Exclusive Shopping
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("adventure-and-outdoor")}
                    onChange={() =>
                      handleCheckboxChange("adventure-and-outdoor")
                    }
                    colorScheme="green"
                    color={"white"}
                    value="adventure-and-outdoor"
                  >
                    Adventure and Outdoor
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("fitness-and-sports")}
                    onChange={() => handleCheckboxChange("fitness-and-sports")}
                    colorScheme="green"
                    color={"white"}
                    value="fitness-and-sports"
                  >
                    Fitness and Sports
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("cultural-immersion")}
                    onChange={() => handleCheckboxChange("cultural-immersion")}
                    colorScheme="green"
                    color={"white"}
                    value="cultural-immersion"
                  >
                    Cultural Immersion
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("luxury-accomodation")}
                    onChange={() => handleCheckboxChange("luxury-accomodation")}
                    colorScheme="green"
                    color={"white"}
                    value="luxury-accomodation"
                  >
                    Luxury Accommodation
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes(
                      "exclusive-events-and-festivals"
                    )}
                    onChange={() =>
                      handleCheckboxChange("exclusive-events-and-festivals")
                    }
                    colorScheme="green"
                    color={"white"}
                    value="exclusive-events-and-festivals"
                  >
                    Exclusive Events and Festivals
                  </Checkbox>
                  <Checkbox
                    isChecked={preferences.includes("personal-development")}
                    onChange={() =>
                      handleCheckboxChange("personal-development")
                    }
                    colorScheme="green"
                    color={"white"}
                    value="personal-development"
                  >
                    Personal Development
                  </Checkbox>
                </SimpleGrid>
              </FormControl>

              {/* Submit Button */}
              <Box
                borderRadius={"15px"}
                onClick={() => getResponse(selectedCountry, selectedCity)}
                size="lg"
                mt={4}
              >
                {submitLoading ? (
                  <Button
                    className="submit-btn"
                    borderRadius={"15px"}
                    isLoading
                    loadingText="Finding Activities"
                    colorScheme={"yellow"}
                  ></Button>
                ) : (
                  <Box as="button" className="submit-btn" borderRadius={"15px"}>
                    Explore
                  </Box>
                )}
              </Box>
            </VStack>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default Form;