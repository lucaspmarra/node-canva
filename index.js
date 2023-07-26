const express = require('express');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000 || process.env.PORT;

// Middleware to parse JSON body (if needed)
app.use(express.json());

// Root endpoint to show all available endpoints
app.get('/', (req, res) => {
  const endpoints = [
    { path: '/generate', method: 'POST', description: 'Generate an image with customized text.', bodyParams: ['backgroundImageUrl', 'value1', 'value2', 'value3', 'value4'] },
    { path: '/download/:filename', method: 'GET', description: 'Download a generated image by filename.' },
    { path: '/list', method: 'GET', description: 'List all generated image files.' },
  ];

  res.json({ endpoints });
});

// Define the image generation route
app.post('/generate', async (req, res) => {
  try {
    // Fetch data from the API (assuming client sends data in the request body)
    // const { backgroundImageUrl, value1, value2, value3, value4 } = req.body;
    const { backgroundImageUrl, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11 } = req.body;

    // Load the background image from the provided URL
    const baseImage = await loadImage(backgroundImageUrl);

    // Create a canvas with the background image dimensions
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // Draw the background image on the canvas
    ctx.drawImage(baseImage, 0, 0);

    // Render data on the canvas with different styles for each text
    /*  ctx.fillStyle = 'black';
     ctx.font = '20px Arial';
     ctx.fillText(`${value1}`, 80, 340);
 
     ctx.fillStyle = 'black';
     ctx.font = '20px Arial';
     ctx.fillText(`${value2}`, 80 * 5, 340);
 
     ctx.fillStyle = 'black';
     ctx.font = '20px Arial';
     ctx.fillText(`${value3}`, 80 * 5, 550);
 
     ctx.fillStyle = 'black';
     ctx.font = '20px Arial';
     ctx.fillText(`${value4}`, 80, 550); */

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`${value1}`, 67, 31);
    ctx.fillText(`${value2}`, 145, 40);
    ctx.fillText(`${value3}`, 294, 40);
    ctx.fillText(`${value4}`, 294, 37);
    ctx.fillText(`${value5}`, 102, 335);
    ctx.fillText(`${value6}`, 199, 371);
    ctx.fillText(`${value7}`, 410, 334);
    ctx.fillText(`${value8}`, 529, 372);
    ctx.fillText(`${value9}`, 92, 541);
    ctx.fillText(`${value10}`, 220, 582);
    ctx.fillText(`${value11}`, 411, 538);
    ctx.fillText(`${value11}`, 513, 582);

    // Generate a unique filename for the image
    const filename = `generated_image_${Date.now()}.png`;

    // Create the "generated_images" folder if it doesn't exist
    const imagesFolder = path.join(__dirname, 'generated_images');
    if (!fs.existsSync(imagesFolder)) {
      fs.mkdirSync(imagesFolder);
    }

    // Save the canvas as an image file locally
    const imagePath = path.join(__dirname, 'generated_images', filename);
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise((resolve, reject) => {
      out.on('finish', resolve);
      out.on('error', reject);
    });

    // Send the file download link as a response
    const downloadLink = `/download/${filename}`;
    res.json({ downloadLink });
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

// Define the file download route
app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'generated_images', filename);

  try {
    // Check if the file exists
    await fs.promises.access(imagePath);

    // Set the response content type to image/png
    res.set('Content-Type', 'image/png');

    // Set the Content-Disposition header to trigger download
    res.set('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file to the response
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(404).json({ error: 'File not found' });
  }
});

// Define the endpoint to list all files in the "generated_images" folder
app.get('/list', (req, res) => {
  const imagesFolder = path.join(__dirname, 'generated_images');

  try {
    // Read the contents of the "generated_images" folder synchronously
    const filenames = fs.readdirSync(imagesFolder);

    // Send the list of filenames as a JSON response
    res.json({ files: `${filenames}` });
  } catch (error) {
    console.error('Error listing files:', error.message);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port} port.`);
});
