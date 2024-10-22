import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">One-Time File Share</h1>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-l-lg focus:outline-none transition duration-300 ease-in-out`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="inline-block mr-2" size={18} />
            Upload
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'download'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-r-lg focus:outline-none transition duration-300 ease-in-out`}
            onClick={() => setActiveTab('download')}
          >
            <Download className="inline-block mr-2" size={18} />
            Download
          </button>
        </div>
        {activeTab === 'upload' ? <FileUpload /> : <FileDownload />}
      </div>
    </div>
  );
}

export default App;