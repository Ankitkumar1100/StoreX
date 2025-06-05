# SoftwareHub - Modern Software Download Portal

A React-based web application that allows administrators to upload software and users to browse and download them.

## Features

- **User Authentication**: Secure login system for administrators
- **Admin Panel**: Upload, manage, and delete software entries
- **Software Catalog**: Browse, search, and filter software by categories and tags
- **Download Tracking**: Keep track of download counts
- **Responsive Design**: Works on all device sizes

## Getting Started

### Prerequisites

- Node.js (v16+)
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
4. Connect to Supabase
   - Click the "Connect to Supabase" button in the interface
   - Apply the migrations in the `supabase/migrations` folder
5. Start the development server
   ```
   npm run dev
   ```

## Database Structure

The application uses Supabase with the following tables:

- **profiles**: User profiles with admin privileges
- **software**: Software entries with metadata and download information

# Storage buckets and policies setup
  
  1. Creates storage buckets for:
    - Software files (executables, archives)
    - Software images (thumbnails, screenshots)
  
  2. Sets up policies for:
    - Upload restrictions by file type and size
    - Public download access

## Admin Account Setup

To create an admin account:

1. Sign up through the Supabase Auth system
2. In Supabase, manually set the `is_admin` field to `true` for your user in the `profiles` table

## Customization

- Update the theme colors in `tailwind.config.js`
- Modify the navigation links in `Navbar.tsx`
- Add or remove software categories as needed

## Deployment

Build the application for production:

```
npm run build
```

The build artifacts will be in the `dist` directory.

## License

This project is licensed under the MIT License.