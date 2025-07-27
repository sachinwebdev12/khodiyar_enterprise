import React, { useState, useEffect } from 'react';
import { Cloud, Save, Download, Upload } from 'lucide-react';
import { storage } from '../../utils/storage';
import { cloudStorage } from '../../utils/cloudStorage';

const CloudSettings: React.FC = () => {
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const config = storage.getCloudConfig();
    if (config) {
      setToken(config.token || '');
      setGistId(config.gistId || '');
      setIsConfigured(cloudStorage.isConfigured());
    }
    
    // Check for existing gist ID in localStorage
    const existingGistId = localStorage.getItem('transport_gist_id');
    if (existingGistId) {
      setGistId(existingGistId);
    }
  }, []);

  const handleSaveConfig = async () => {
    if (!token.trim()) {
      setMessage('Please enter a GitHub token');
      return;
    }

    setLoading(true);
    try {
      const config = { token: token.trim(), gistId: gistId.trim() || undefined };
      await cloudStorage.initialize(config);
      storage.setCloudConfig(config);
      setIsConfigured(true);
      setMessage('Cloud storage configured successfully!');
    } catch (error) {
      setMessage('Failed to configure cloud storage. Please check your token.');
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    if (!isConfigured) {
      setMessage('Please configure cloud storage first');
      return;
    }

    setLoading(true);
    try {
      const data = {
        clients: storage.getClients(),
        bills: storage.getBills(),
        payments: storage.getPayments(),
        settings: storage.getSettings(),
        billCounter: storage.getBillCounter()
      };
      
      const success = await cloudStorage.saveData(data);
      if (success) {
        setMessage('Data backed up successfully!');
      } else {
        setMessage('Failed to backup data');
      }
    } catch (error) {
      setMessage('Failed to backup data');
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!isConfigured) {
      setMessage('Please configure cloud storage first');
      return;
    }

    if (!window.confirm('This will replace all current data. Are you sure?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await storage.loadFromCloud();
      if (success) {
        setMessage('Data restored successfully! Please refresh the page.');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage('No backup data found or failed to restore');
      }
    } catch (error) {
      setMessage('Failed to restore data');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Cloud className="mr-2 text-blue-600" size={20} />
        Cloud Storage Settings
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Setup Instructions:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Go to GitHub → Settings → Developer settings → Personal access tokens</li>
            <li>2. Generate a new token with 'gist' scope</li>
            <li>3. Copy and paste the token below</li>
            <li>4. Your data will be stored in a private GitHub Gist</li>
          </ol>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Personal Access Token *
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gist ID (optional - leave empty for new gist)
          </label>
          <input
            type="text"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Auto-generated on first backup"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveConfig}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Configure</span>
          </button>

          <button
            onClick={handleBackup}
            disabled={loading || !isConfigured}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Backup Now</span>
          </button>

          <button
            onClick={handleRestore}
            disabled={loading || !isConfigured}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Restore Data</span>
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Status:</strong> {isConfigured ? '✅ Configured' : '❌ Not configured'}</p>
          <p><strong>Auto-backup:</strong> Enabled (saves after each change)</p>
        </div>
      </div>
    </div>
  );
};

export default CloudSettings;