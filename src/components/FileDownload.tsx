import React, { useState } from 'react';
import { Download, Check, AlertCircle } from 'lucide-react';

const FileDownload: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!fileId) return;

    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/api/download/${fileId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('File not found or already downloaded.');
        }
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileId;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadError(error.message || 'Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="text"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="Enter file ID"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDownload}
          disabled={!fileId || downloading}
          className={`py-2 px-4 ${
            !fileId || downloading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-r-lg transition duration-300 ease-in-out`}
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
      {downloadSuccess && (
        <div className="flex items-center text-green-500">
          <Check className="mr-2" size={18} />
          File downloaded successfully!
        </div>
      )}
      {downloadError && (
        <div className="flex items-center text-red-500">
          <AlertCircle className="mr-2" size={18} />
          {downloadError}
        </div>
      )}
    </div>
  );
};

export default FileDownload;