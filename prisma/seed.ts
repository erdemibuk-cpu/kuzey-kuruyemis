import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ehysoft.com' },
    update: {},
    create: {
      email: 'admin@ehysoft.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Admin user created:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'kuruyemisler' }, update: {}, create: { name: 'Kuruyemisler', slug: 'kuruyemisler', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'kuru-meyveler' }, update: {}, create: { name: 'Kuru Meyveler', slug: 'kuru-meyveler', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'lokum-sekerleme' }, update: {}, create: { name: 'Lokum & Sekerleme', slug: 'lokum-sekerleme', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'baharatlar' }, update: {}, create: { name: 'Baharatlar', slug: 'baharatlar', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'cikolata-seker' }, update: {}, create: { name: 'Cikolata & Seker', slug: 'cikolata-seker', sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: 'kahve-cay' }, update: {}, create: { name: 'Kahve & Cay', slug: 'kahve-cay', sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: 'kampanyalar' }, update: {}, create: { name: 'Kampanyalar', slug: 'kampanyalar', sortOrder: 7 } }),
  ])
  console.log('Categories created:', categories.length)

  // Create sample products
  const sampleProducts = [
    { name: 'Antep Fistigi (Ic)', slug: 'antep-fistigi-ic', category: 0, basePrice: 850, salePrice: 749, featured: true, desc: 'Taze ve dogal Antep fistigi. Ozenle secilmis, kavrulmus.' },
    { name: 'Kaju', slug: 'kaju', category: 0, basePrice: 650, salePrice: 599, featured: true, desc: 'Premium kalite kaju. Taze ve lezzetli.' },
    { name: 'Badem (Ic)', slug: 'badem-ic', category: 0, basePrice: 450, salePrice: null, featured: true, desc: 'Dogal ic badem. Atistirmalik veya tatlilarda kullanilabilir.' },
    { name: 'Ceviz (Ic)', slug: 'ceviz-ic', category: 0, basePrice: 380, salePrice: 349, featured: true, desc: 'Yerli ceviz ici. Taze ve lezzetli.' },
    { name: 'Findik (Ic)', slug: 'findik-ic', category: 0, basePrice: 320, salePrice: null, featured: false, desc: 'Giresun findigi. Dogal ve taze.' },
    { name: 'Yer Fistigi (Kavrulmus)', slug: 'yer-fistigi-kavrulmus', category: 0, basePrice: 180, salePrice: 159, featured: false, desc: 'Tuzlu kavrulmus yer fistigi.' },
    { name: 'Malatya Kayisisi Jumbo', slug: 'malatya-kayisisi-jumbo', category: 1, basePrice: 280, salePrice: 249, featured: true, desc: 'Malatya\'nin verimli topraklarindan jumbo boy kayisi.' },
    { name: 'Sari Uzum', slug: 'sari-uzum', category: 1, basePrice: 150, salePrice: null, featured: false, desc: 'Dogal sari uzum. Katkisiz ve saglikli.' },
    { name: 'Kuru Incir', slug: 'kuru-incir', category: 1, basePrice: 220, salePrice: 199, featured: true, desc: 'Aydin inciri. Dogal ve lezzetli.' },
    { name: 'Kuru Cilek', slug: 'kuru-cilek', category: 1, basePrice: 350, salePrice: null, featured: false, desc: 'Dondurularak kurutulmus dogal cilek.' },
    { name: 'Antep Fistikli Lokum', slug: 'antep-fistikli-lokum', category: 2, basePrice: 420, salePrice: 379, featured: true, desc: 'Bol Antep fistikli geleneksel lokum.' },
    { name: 'Karisik Baharat Seti', slug: 'karisik-baharat-seti', category: 3, basePrice: 180, salePrice: 149, featured: false, desc: '10 cesit baharat iceren ozel set.' },
    { name: 'Turk Kahvesi', slug: 'turk-kahvesi', category: 5, basePrice: 120, salePrice: null, featured: true, desc: 'Geleneksel Turk kahvesi. Taze cekilmis.' },
  ]

  for (const p of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.desc,
        categoryId: categories[p.category].id,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stock: 100,
        isActive: true,
        isFeatured: p.featured,
        images: {
          create: [{
            url: `https://placehold.co/600x600/0e532e/ffffff?text=${encodeURIComponent(p.name.substring(0, 12))}`,
            alt: p.name,
            sortOrder: 0,
          }],
        },
        variants: {
          create: [
            { name: '250 Gr', price: p.basePrice * 0.3, salePrice: p.salePrice ? p.salePrice * 0.3 : null, stock: 50, sortOrder: 0 },
            { name: '500 Gr', price: p.basePrice * 0.55, salePrice: p.salePrice ? p.salePrice * 0.55 : null, stock: 50, sortOrder: 1 },
            { name: '1 KG', price: p.basePrice, salePrice: p.salePrice, stock: 100, sortOrder: 2 },
          ],
        },
      },
    })
    console.log('Product created:', product.name)
  }

  // Create banners
  await prisma.banner.upsert({
    where: { id: 'banner1' },
    update: {},
    create: {
      id: 'banner1',
      title: 'Taze Kuruyemisler',
      subtitle: 'En kaliteli kuruyemisler uygun fiyatlarla!',
      image: '',
      link: '/kategori/kuruyemisler',
      sortOrder: 0,
    },
  })
  await prisma.banner.upsert({
    where: { id: 'banner2' },
    update: {},
    create: {
      id: 'banner2',
      title: 'Kampanyali Urunler',
      subtitle: '%30\'a varan indirimler!',
      image: '',
      link: '/kategori/kampanyalar',
      sortOrder: 1,
    },
  })
  console.log('Banners created')

  // Create site settings
  const siteSettings = [
    { key: 'site_name', value: 'Kuzey Kuruyemis' },
    { key: 'site_description', value: 'En taze kuruyemis, kuru meyve, baharat ve daha fazlasi.' },
    { key: 'phone', value: '0850 XXX XX XX' },
    { key: 'email', value: 'info@kuzeykuruyemis.com' },
    { key: 'address', value: 'Istanbul, Turkiye' },
    { key: 'free_shipping_min', value: '1500' },
  ]

  for (const s of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log('Settings created')

  console.log('Seed complete!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
