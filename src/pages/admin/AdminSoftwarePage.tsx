import SoftwareManagementTable from '../../components/admin/SoftwareManagementTable';

export default function AdminSoftwarePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Software</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          View, edit, and delete software in your catalog
        </p>
      </div>
      
      <SoftwareManagementTable />
    </div>
  );
}