import cloudinary from '@/lib/cloudinary';

export const cloudinaryService = {
  /**
   * Generate a signed upload URL so the browser can upload directly to Cloudinary
   * without passing the file through Vercel's servers (bypasses 4.5MB limit)
   */
  generateSignedUploadParams(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      folder,
    };
  },

  /**
   * Delete an asset from Cloudinary by its public_id
   * Called when admin deletes a sight word, video, etc.
   */
  async deleteAsset(publicId: string, resourceType: 'image' | 'video' = 'image') {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  },

  /**
   * Extract the public_id from a Cloudinary URL
   * e.g. https://res.cloudinary.com/demo/image/upload/v123/tap2read/videos/abc.mp4
   * returns: tap2read/videos/abc
   */
  extractPublicId(url: string): string {
    try {
      const parts = url.split('/upload/');
      if (parts.length < 2) return '';
      const afterUpload = parts[1];
      // Remove version prefix (v123456/) if present
      const withoutVersion = afterUpload.replace(/^v\d+\//, '');
      // Remove file extension
      return withoutVersion.replace(/\.[^/.]+$/, '');
    } catch {
      return '';
    }
  },
};
