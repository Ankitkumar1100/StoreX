import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <span className="sr-only">About</span>
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <span className="sr-only">Privacy Policy</span>
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <span className="sr-only">Terms of Service</span>
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <span className="sr-only">Contact</span>
              Contact
            </a>
          </div>
          
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-base text-gray-500 dark:text-gray-400">
              <span className="flex items-center justify-center md:justify-end">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by SoftwareHub
              </span>
              <span>&copy; {currentYear} SoftwareHub. All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}