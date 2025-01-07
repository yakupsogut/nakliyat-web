import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Eksik çevre değişkenleri');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addAdminRole() {
  try {
    // Kullanıcıyı bul
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      throw userError;
    }

    const adminUser = users.find(user => user.email === 'admin@nakliyatpro.com');

    if (!adminUser) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Admin_users tablosuna ekle
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: adminUser.id,
        email: adminUser.email,
        ad_soyad: 'Admin Kullanıcı',
        role: 'admin'
      });

    if (adminError) {
      throw adminError;
    }

    console.log('Admin rolü başarıyla eklendi:', adminUser.email);
  } catch (error) {
    console.error('Hata:', error);
  }
}

addAdminRole(); 