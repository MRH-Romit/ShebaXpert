const crypto = require('crypto');
const Notification = require('../models/Notification');
require('dotenv').config();

// Facebook webhook verification
exports.verifyWebhook = (req, res) => {
  // Facebook sends these parameters to verify your webhook
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.FB_WEBHOOK_TOKEN || 'your_webhook_verify_token';

  // Check if token and mode is in the query string
  if (mode && token) {
    // Check the mode and token
    if (mode === 'subscribe' && token === verifyToken) {
      // Respond with the challenge token
      console.log('Webhook verified');
      return res.status(200).send(challenge);
    }
    
    // Respond with '403 Forbidden' if verify tokens do not match
    return res.sendStatus(403);
  }
  
  return res.sendStatus(400);
};

// Process webhook events
exports.processWebhook = async (req, res) => {
  // Verify request is from Facebook
  if (!verifyFacebookSignature(req)) {
    console.error('Invalid signature');
    return res.sendStatus(403);
  }

  const body = req.body;

  // Check if this is an event from a page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple
    for (const entry of body.entry) {
      // Get the webhook event
      const webhookEvent = entry.messaging[0];
      
      // Process the event based on its type
      if (webhookEvent.message) {
        await handleMessage(webhookEvent);
      } else if (webhookEvent.postback) {
        await handlePostback(webhookEvent);
      }
    }

    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

// Verify request is from Facebook
function verifyFacebookSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const webhookSecret = process.env.FB_WEBHOOK_SECRET || 'your_webhook_secret';
  
  if (!signature || !webhookSecret) {
    return false;
  }

  // Create HMAC
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(JSON.stringify(req.body));
  const expectedSignature = 'sha256=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(expectedSignature)
  );
}

// Handle received messages
async function handleMessage(event) {
  try {
    const senderId = event.sender.id;
    const message = event.message;
    
    console.log(`Received message from ${senderId}: ${message.text}`);
    
    // Here you would:
    // 1. Find the user associated with this Facebook ID
    // 2. Create a notification for them
    
    // This is a placeholder implementation
    const userId = await getUserIdFromFacebookId(senderId);
    if (userId) {
      await Notification.create({
        userId,
        message: message.text,
        type: 'facebook_message',
        referenceId: message.mid,
        isRead: false
      });
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

// Handle postback events
async function handlePostback(event) {
  try {
    const senderId = event.sender.id;
    const postback = event.postback;
    
    console.log(`Received postback from ${senderId}: ${postback.payload}`);
    
    // Process different postback payloads
    // This is a placeholder implementation
    const userId = await getUserIdFromFacebookId(senderId);
    if (userId) {
      await Notification.create({
        userId,
        message: `Received postback: ${postback.payload}`,
        type: 'facebook_postback',
        referenceId: event.id,
        isRead: false
      });
    }
  } catch (error) {
    console.error('Error handling postback:', error);
  }
}

// Helper function to get user ID from Facebook ID
// In a real implementation, this would query your database
async function getUserIdFromFacebookId(facebookId) {
  // Implementation would look up a user by their Facebook ID
  // and return your system's internal user ID
  return null; // Placeholder
}
