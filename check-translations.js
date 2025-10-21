import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTranslations() {
  try {
    const count = await prisma.translation.count();
    console.log(`\n📊 Current translations in database: ${count}`);
    
    if (count > 0) {
      const sample = await prisma.translation.findMany({
        take: 5,
        select: {
          key: true,
          namespace: true,
          locale: true,
          value: true
        }
      });
      
      console.log('\n📝 Sample translations:');
      sample.forEach(t => {
        console.log(`  - ${t.locale}/${t.namespace}/${t.key}: "${t.value}"`);
      });
    }
    
    const byLocale = await prisma.translation.groupBy({
      by: ['locale'],
      _count: true
    });
    
    console.log('\n🌐 By locale:');
    byLocale.forEach(l => {
      console.log(`  - ${l.locale}: ${l._count} translations`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTranslations();
