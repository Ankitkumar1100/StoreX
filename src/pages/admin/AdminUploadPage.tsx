import { Card, CardContent } from '../../components/ui/Card';
import SoftwareUploadForm from '../../components/admin/SoftwareUploadForm';

export default function AdminUploadPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Software</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Add new software to your platform
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <SoftwareUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}