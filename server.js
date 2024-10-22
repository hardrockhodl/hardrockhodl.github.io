import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileId = uuidv4();
  const fileExtension = req.file.originalname.split('.').pop();
  const fileName = `${fileId}.${fileExtension}`;

  try {
    console.log('Uploading file:', fileName);
    console.log('File size:', req.file.size);
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_BUCKET_NAME:', process.env.SUPABASE_BUCKET_NAME);

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);
    res.json({ fileId: fileName });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

app.get('/api/download/:fileId', async (req, res) => {
  const fileName = req.params.fileId;

  try {
    console.log('Downloading file:', fileName);

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .download(fileName);

    if (error) {
      console.error('Supabase download error:', error);
      throw error;
    }

    res.setHeader('Content-Type', data.type);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(await data.arrayBuffer());

    console.log('File downloaded successfully');

    // Delete the file after successful download
    const { error: deleteError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove([fileName]);

    if (deleteError) {
      console.error('Error deleting file:', deleteError);
    } else {
      console.log('File deleted successfully');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(404).send(`File not found or already downloaded: ${error.message}`);
  }
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(process.cwd(), 'dist')));

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_BUCKET_NAME:', process.env.SUPABASE_BUCKET_NAME);
});

export default app;