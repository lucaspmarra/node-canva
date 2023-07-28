const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const {Chart} = require('chart.js');
const chartjsAnnotations = require('chartjs-plugin-annotation');

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());

app.post('/generate-chart', async (req, res) => {
  try {
    const { backgroundImageUrl, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, chartData, chartOptions } = req.body;

    const baseImage = await loadImage(backgroundImageUrl);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`${value1}`, 65, 50);
    ctx.fillText(`${value2}`, 150, 50);
    ctx.fillText(`${value3}`, 250, 50);
    ctx.fillText(`${value4}`, 100, 340);
    ctx.fillText(`${value5}`, 200, 380);
    ctx.fillText(`${value6}`, 410, 340);
    ctx.fillText(`${value7}`, 530, 380);
    ctx.fillText(`${value8}`, 100, 540);
    ctx.fillText(`${value9}`, 220, 600);
    ctx.fillText(`${value10}`, 410, 540);
    ctx.fillText(`${value11}`, 530, 600);

 // Initialize Chart.js with chartData and chartOptions directly
    const chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    chart.plugins.register(chartjsAnnotations);


    const filename = `generated_chart_${Date.now()}.png`;

    const imagesFolder = path.join(__dirname, 'generated_images');
    if (!fs.existsSync(imagesFolder)) {
      fs.mkdirSync(imagesFolder);
    }

    const imagePath = path.join(__dirname, 'generated_images', filename);
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise((resolve, reject) => {
      out.on('finish', resolve);
      out.on('error', reject);
    });

    const downloadLink = `/download/${filename}`;
    res.json({ downloadLink });
  } catch (error) {
    console.error('Error generating chart:', error.message);
    res.status(500).json({ error: 'Chart generation failed' });
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
