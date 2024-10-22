import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure the uploads directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileId = uuidv4();
  const fileExtension = path.extname(req.file.originalname);
  const newFileName = `${fileId}${fileExtension}`;
  const newFilePath = path.join(UPLOAD_DIR, newFileName);

  try {
    await fs.rename(req.file.path, newFilePath);
    res.json({ fileId: newFileName });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).send('Error saving file.');
  }
});

app.get('/api/download/:fileId', async (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.fileId);

  try {
    await fs.access(filePath);
    res.download(filePath, async (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      } else {
        await fs.unlink(filePath);
      }
    });
  } catch (error) {
    console.error('Error accessing file:', error);
    res.status(404).send('File not found or already downloaded.');
  }
});

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile('index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();