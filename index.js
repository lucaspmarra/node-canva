const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());


app.get('/', (req, res) => {
  const endpoints = [
    {
      path: '/generate', method: 'POST',
      description: 'Generate an image with customized text.',
      bodyParams: ['backgroundImageUrl', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6', 'value7', 'value8', 'value9', 'value10', 'value11']
    },
    { path: '/download/:filename', method: 'GET', description: 'Download a generated image by filename.' },
    { path: '/list', method: 'GET', description: 'List all generated image files.' },
  ];

  res.json({ endpoints });
});

app.post('/generate', async (req, res) => {
  try {
    const { backgroundImageUrl, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11 } = req.body;

    // Load the background image from the provided URL in req.body
    const baseImage = await loadImage(backgroundImageUrl);

    // Create a canvas with the background image dimensions
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');
;
    // Draw the background image on the canvas
    ctx.drawImage(baseImage, 0, 0);


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
    ctx.fillText(`${value1}`, 65, 50); // header
    ctx.fillText(`${value2}`, 150, 50); // header
    ctx.fillText(`${value3}`, 250, 50); // header
    ctx.fillText(`${value4}`, 100, 340); // 4 e 6
    ctx.fillText(`${value5}`, 200, 380); // 5 e 7
    ctx.fillText(`${value6}`, 410, 340); // 4 e 6
    ctx.fillText(`${value7}`, 530, 380); // 5 e 7
    ctx.fillText(`${value8}`, 100, 540); // 8 e 10
    ctx.fillText(`${value9}`, 220, 600); // 9 e 11
    ctx.fillText(`${value10}`, 410, 540); // 8 e 10
    ctx.fillText(`${value11}`, 530, 600); // 9 e 11

    // Generate a unique filename for the image
    const filename = `generated_image_${Date.now()}.png`;

    // Create the "generated_images" folder using Node if it doesn't exist
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

app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'generated_images', filename);

  try {
    await fs.promises.access(imagePath);

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(404).json({ error: 'File not found' });
  }
});


app.get('/list', (req, res) => {
  const imagesFolder = path.join(__dirname, 'generated_images');

  try {
    const filenames = fs.readdirSync(imagesFolder);
    res.json({ files: filenames });
  } catch (error) {
    console.error('Error listing files:', error.message);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port.`);
});
