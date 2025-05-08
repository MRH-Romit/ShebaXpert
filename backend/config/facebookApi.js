const axios = require('axios');
require('dotenv').config();

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_API_VERSION = 'v18.0';
const FB_API_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

// Post to Facebook Page
async function postToPage(message, link = null) {
  try {
    const postData = {
      message,
      access_token: FB_ACCESS_TOKEN
    };

    if (link) {
      postData.link = link;
    }

    const response = await axios.post(
      `${FB_API_URL}/${FB_PAGE_ID}/feed`,
      postData
    );

    return response.data;
  } catch (error) {
    console.error('Error posting to Facebook:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Get comments from a post
async function getComments(postId) {
  try {
    const response = await axios.get(
      `${FB_API_URL}/${postId}/comments`,
      {
        params: {
          access_token: FB_ACCESS_TOKEN
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  postToPage,
  getComments
};
