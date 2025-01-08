-- Sıralama güncellemesi için özel tip oluştur
create type public.referans_siralama_input as (
  id bigint,
  siralama integer
);

-- Sıralama güncelleme fonksiyonu
create or replace function public.update_referans_siralama(yeni_siralama referans_siralama_input[])
returns void
language plpgsql
security definer
as $$
begin
  -- Transaction başlat
  begin
    -- Tüm sıralamaları güncelle
    for i in 1..array_length(yeni_siralama, 1) loop
      update public.referanslar
      set siralama = (yeni_siralama[i]).siralama
      where id = (yeni_siralama[i]).id;
    end loop;
  end;
end;
$$;

-- RLS politikası ekle
grant execute on function public.update_referans_siralama(referans_siralama_input[]) to authenticated; 