const { connectToDatabase } = require('../../src/utils/mongodb');
const OpenAI = require("openai");
const axios = require("axios");
const Activity = require('../../src/api/activity'); // Correct import

const googleApiKey = process.env.GOOGLE_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Validates if a URL is accessible.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is accessible, false otherwise.
 */
async function isValidURL(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}


/**
 * Creates a Google search link for a given item name.
 * @param {string} itemName - The name of the item to search for.
 * @returns {string} - The Google search link.
 */
function createGoogleSearchLink(itemName) {
  const query = encodeURIComponent(itemName);
  return `https://www.google.com/search?q=${query}`;
}


/**
 * Constructs the photo URL from a photo reference.
 * @param {string} photoReference - The photo reference from the Google Places API.
 * @returns {string} - The URL to fetch the photo.
 */
function getPhotoUrl(photoReference) {
  const maxWidth = 400; // Set the desired width of the photo
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${googleApiKey}`;
}


/**
 * Fetches places matching the query in the specified city and country.
 * @param {string} query - The search query / activity name returned by prompt.
 * @param {string} city - The city to search in.
 * @param {string} country - The country to search in.
 * @returns {Array} - An array of places.
 */
const getPlaces = async (query, city, country) => {
  const encodedQuery = encodeURIComponent(query);
  const encodedCity = encodeURIComponent(city);
  const encodedCountry = encodeURIComponent(country);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}+in+${encodedCity}+${encodedCountry}&key=${googleApiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.results;
    } else {
      console.error("Error fetching places:", response.data.status);
      return [];
    }
  } catch (error) {
    console.error("Error making request:", error);
    return [];
  }
};


/**
 * Processes the valid items by fetching and updating their details from Google Places API.
 * @param {Array} validItems - The list of valid items to process.
 * @returns {Array} - The updated list of items.
 */
const processValidItems = async (validItems) => {
  for (const item of validItems) {
    try {
      const places = await getPlaces(item.name, item.city, item.country);
      if (places.length > 0) {
        const place = places[0];
        item.name = place.name;
        item.address = place.formatted_address || 'Address not available';
        item.website = place.website || createGoogleSearchLink(place.name);
        item.type = place.types ? place.types.join(", ") : 'N/A';
        item.rating = place.rating || 0; // Default rating
        item.place_id = place.place_id || 'N/A'; // Default place ID

        // Handle photos
        if (place.photos && place.photos.length > 0) {
          item.photos = [getPhotoUrl(place.photos[0].photo_reference)];
        } else {
          item.photos = [`http://localhost:5000/static/activity-card-resort.jpg`]; // Default photo URL
        }
      } else {
        // Set default values if no places found
        item.address = item.address || 'Address not available';
        item.website = item.website || createGoogleSearchLink(item.name);
        item.rating = 0; 
        item.place_id = 'N/A'; 
        item.photos = [`http://localhost:5000/static/activity-card-resort.jpg`]; 
      }
    } catch (error) {
      console.error("Error:", error);
      // Ensure defaults are set even in case of an error
      item.address = item.address || 'Address not available';
      item.website = item.website || createGoogleSearchLink(item.name);
      item.rating = 0; 
      item.place_id = 'N/A'; 
      item.photos = [`http://localhost:5000/static/activity-card-resort.jpg`]; 
    }
  }
  return validItems;
};

/**
 * Saves valid items to the MongoDB database using upsert to avoid duplicates.
 * @param {Array} validItems - The list of valid items to save.
 */
async function saveValidItems(validItems) {
    try {
      const { db } = await connectToDatabase(); 
      for (const item of validItems) {
        await db.collection('activities').findOneAndUpdate(
          { place_id: item.place_id },
          { $set: item },
          { upsert: true }
        );
      }
      console.log("Items saved to database successfully.");
    } catch (error) {
      console.error("Error saving items to database:", error);
    }
  }


/**
 * Handles the /chat endpoint.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export default async function handler(req, res) {
    console.log("Handler called");
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { prompt } = req.body;
    console.log("Prompt received:", prompt);
  
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
  
      const content = completion.choices[0].message.content;
      console.log("Completion received:", content);
  
      let items;
      try {
        items = JSON.parse(content);
        console.log("Parsed items:", items);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        return res.status(500).json({ error: "Failed to parse JSON response from OpenAI" });
      }
  
      const validItems = [];
      for (const item of items) {
        if (item.website && (await isValidURL(item.website))) {
          validItems.push(item);
        } else {
          item.website = createGoogleSearchLink(item.name);
          validItems.push(item);
        }
      }
  
      await processValidItems(validItems);
      await saveValidItems(validItems);
  
      return res.json(validItems);
    } catch (error) {
      console.error("Error creating completion:", error);
      return res.status(500).json({ error: "Failed to create completion" });
    }
  }