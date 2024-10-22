import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Upload failed');
      }

      const data = await response.json();
      setFileId(data.fileId);
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        setUploadError(error.message || 'Failed to upload file. Please try again.');
      } else {
        setUploadError('An unknown error occurred. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex-grow px-4 py-2 bg-gray-100 text-gray-700 rounded-l-lg cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out"
        >
          {file ? file.name : 'Choose a file'}
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`py-2 px-4 ${
            !file || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-r-lg transition duration-300 ease-in-out`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {uploadSuccess && (
        <div className="flex items-center text-green-500">
          <Check className="mr-2" size={18} />
          File uploaded successfully! File ID: {fileId}
        </div>
      )}
      {uploadError && (
        <div className="flex items-center text-red-500">
          <AlertCircle className="mr-2" size={18} />
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default FileUpload;