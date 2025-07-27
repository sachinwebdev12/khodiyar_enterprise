import { Octokit } from '@octokit/rest';

interface CloudStorageConfig {
  token: string;
  gistId?: string;
}

class CloudStorage {
  private octokit: Octokit | null = null;
  private gistId: string | null = null;
  private config: CloudStorageConfig | null = null;

  async initialize(config: CloudStorageConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
    this.gistId = config.gistId || null;
  }

  async saveData(data: any) {
    if (!this.octokit || !this.config) {
      throw new Error('Cloud storage not initialized');
    }

    const content = JSON.stringify(data, null, 2);
    
    try {
      if (this.gistId) {
        // Update existing gist
        await this.octokit.gists.update({
          gist_id: this.gistId,
          files: {
            'transport-billing-data.json': {
              content,
            },
          },
        });
      } else {
        // Create new gist
        const response = await this.octokit.gists.create({
          files: {
            'transport-billing-data.json': {
              content,
            },
          },
          description: 'Transport Billing Software Data',
          public: false,
        });
        this.gistId = response.data.id;
        // Save gist ID to localStorage for future use
        localStorage.setItem('transport_gist_id', this.gistId);
      }
      return true;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    }
  }

  async loadData() {
    if (!this.octokit || !this.gistId) {
      return null;
    }

    try {
      const response = await this.octokit.gists.get({
        gist_id: this.gistId,
      });

      const file = response.data.files?.['transport-billing-data.json'];
      if (file && file.content) {
        return JSON.parse(file.content);
      }
      return null;
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return null;
    }
  }

  isConfigured() {
    return this.config !== null;
  }
}

export const cloudStorage = new CloudStorage();