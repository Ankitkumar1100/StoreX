import MainLayout from '../components/layout/MainLayout';
import SoftwareList from '../components/software/SoftwareList';
import { ArrowRight, Download, Server, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function HomePage() {
  const features = [
    {
      icon: <Download className="h-6 w-6 text-blue-500" />,
      title: "Curated Software",
      description: "All software is thoroughly tested and verified for safety and performance"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Fast Downloads",
      description: "High-speed servers ensure quick and reliable downloads"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Secure & Safe",
      description: "All files are scanned for viruses and malware"
    },
    {
      icon: <Server className="h-6 w-6 text-purple-500" />,
      title: "Regular Updates",
      description: "New software and updates are added frequently"
    }
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Download Trusted Software
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Discover and download high-quality, verified software for all your needs
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/browse">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Browse Software
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured software section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SoftwareList title="Featured Software" limit={6} showFilters={false} />
          <div className="mt-12 text-center">
            <Link to="/browse">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Software
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose SoftwareHub?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              We provide the highest quality software with security and performance in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md"
              >
                <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Categories</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Browse software by category to find what you need
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Utilities', 'Productivity', 'Design', 'Development', 'Security', 'Entertainment'].map((category) => (
              <Link
                key={category}
                to={`/categories/${category.toLowerCase()}`}
                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-4 rounded-lg text-center transition-colors border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View all</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}