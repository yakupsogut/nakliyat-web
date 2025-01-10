import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">İletişim</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Bizimle iletişime geçmek için aşağıdaki formu doldurabilir veya iletişim bilgilerimizi kullanabilirsiniz.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">İletişim Bilgileri</h3>
              <dl className="mt-6 space-y-4 text-base leading-7 text-gray-600">
                <div>
                  <dt className="font-semibold">Adres</dt>
                  <dd>Örnek Mahallesi, Örnek Sokak No:1, İstanbul</dd>
                </div>
                <div>
                  <dt className="font-semibold">Telefon</dt>
                  <dd>
                    <a href="tel:+902121234567" className="hover:text-blue-600">
                      +90 (212) 123 45 67
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">E-posta</dt>
                  <dd>
                    <a href="mailto:info@nakliyatpro.com" className="hover:text-blue-600">
                      info@nakliyatpro.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Çalışma Saatleri</dt>
                  <dd>Pazartesi - Cumartesi: 09:00 - 18:00</dd>
                </div>
              </dl>

              <div className="mt-10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.443928507323!2d28.97913681541372!3d41.03717297929828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zVGFrc2ltIE1leWRhbsSxLCBHw7xtw7zFn3N1eXUsIDM0NDM1IEJleW_En2x1L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1635000000000!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">İletişim Formu</h3>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 