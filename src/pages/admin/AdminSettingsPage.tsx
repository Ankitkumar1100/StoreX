import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'SoftwareHub',
    siteDescription: 'Download trusted software',
    maxUploadSize: '500',
    allowedFileTypes: '.zip,.exe,.dmg,.app',
    requireEmailVerification: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-gray-400">
          Configure your software platform
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">General Settings</h2>
              
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="bg-gray-900 border-gray-700 text-white"
                />

                <Input
                  label="Site Description"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Upload Settings</h2>
              
              <div className="space-y-4">
                <Input
                  label="Maximum Upload Size (MB)"
                  name="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={handleChange}
                  className="bg-gray-900 border-gray-700 text-white"
                />

                <Input
                  label="Allowed File Types"
                  name="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={handleChange}
                  helperText="Comma-separated list of file extensions"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-500"
                  />
                  <span className="text-white">Require email verification</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}