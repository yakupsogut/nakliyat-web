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

async function createAdminUser() {
  try {
    // Kullanıcı oluştur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@nakliyatpro.com',
      password: 'Yakup.7221',
      email_confirm: true
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Kullanıcı oluşturulamadı');
    }

    // Admin_users tablosuna ekle
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        ad_soyad: 'Admin Kullanıcı',
        role: 'admin'
      });

    if (adminError) {
      throw adminError;
    }

    console.log('Admin kullanıcısı başarıyla oluşturuldu:', authData.user.email);
  } catch (error) {
    console.error('Hata:', error);
  }
}

createAdminUser(); 