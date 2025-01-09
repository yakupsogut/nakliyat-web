/**
 * Supabase resim URL'sini proxy URL'sine dönüştüren fonksiyon
 * @param imageUrl - Orijinal Supabase resim URL'si
 * @param bucketName - Supabase bucket adı (örn: 'blog-images', 'profile-photos' vb.)
 * @returns Proxy üzerinden servis edilecek resim URL'si
 */
export function convertSupabaseImageUrl(imageUrl: string, bucketName: string = 'blog-images'): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
    return imageUrl;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '');
  const fullBucketPath = `${supabaseUrl}/storage/v1/object/public/${bucketName}/`;
  
  if (imageUrl.includes(fullBucketPath)) {
    const imagePath = imageUrl.split(fullBucketPath)[1];
    return `/api/image?path=${encodeURIComponent(imagePath)}&bucket=${encodeURIComponent(bucketName)}`;
  }
  return imageUrl;
} 