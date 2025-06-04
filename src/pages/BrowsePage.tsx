import MainLayout from '../components/layout/MainLayout';
import SoftwareList from '../components/software/SoftwareList';

export default function BrowsePage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SoftwareList title="All Software" />
      </div>
    </MainLayout>
  );
}