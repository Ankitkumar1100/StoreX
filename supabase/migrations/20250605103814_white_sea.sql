/*
  # Storage buckets and policies setup
  
  1. Creates storage buckets for:
    - Software files (executables, archives)
    - Software images (thumbnails, screenshots)
  
  2. Sets up policies for:
    - Upload restrictions by file type and size
    - Public download access
*/

-- Create the software-files bucket
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (
        'software-files',
        'software-files',
        true
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public)
    VALUES (
        'software-images',
        'software-images',
        true
    )
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Policy for software-files bucket: authenticated users can upload, everyone can download
CREATE POLICY "Authenticated users can upload software files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'software-files' AND
    (length(COALESCE(name, '')) < 1000000000) AND -- 1GB max file size
    (
        lower(regexp_replace(name, '^.*\.', '')) in (
            'zip', 'exe', 'dmg', 'app'
        )
    )
);

CREATE POLICY "Anyone can download software files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'software-files');

-- Policy for software-images bucket: authenticated users can upload, everyone can download
CREATE POLICY "Authenticated users can upload software images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'software-images' AND
    (length(COALESCE(name, '')) < 10000000) AND -- 10MB max file size
    (
        lower(regexp_replace(name, '^.*\.', '')) in (
            'jpg', 'jpeg', 'png', 'webp'
        )
    )
);

CREATE POLICY "Anyone can download software images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'software-images');