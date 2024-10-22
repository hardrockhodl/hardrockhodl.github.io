import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  return (
    <div className="app-container">
      <div className="neumorph-card">
        <h1 className="title">One-Time File Share</h1>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="icon" size={18} />
            Upload
          </button>
          <button
            className={`tab-button ${activeTab === 'download' ? 'active' : ''}`}
            onClick={() => setActiveTab('download')}
          >
            <Download className="icon" size={18} />
            Download
          </button>
        </div>
        {activeTab === 'upload' ? <FileUpload /> : <FileDownload />}
      </div>
    </div>
  );
}

export default App;