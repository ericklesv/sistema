const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restoreMiniaturas() {
  try {
    console.log('Iniciando restauração das miniaturas...\n');

    // Miniaturas Base
    const miniaturasBase = [
      // Hot Wheels
      { code: 'HW001', name: 'Corvette C8.R', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-03-15') },
      { code: 'HW002', name: 'Nissan Skyline GT-R R34', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-03-15') },
      { code: 'HW003', name: 'Ford Mustang GT 2015', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-04-01') },
      { code: 'HW004', name: 'Dodge Charger R/T 1970', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-04-01') },
      { code: 'HW005', name: 'Lamborghini Aventador', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-04-15') },
      { code: 'HW006', name: 'Ferrari F40', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-04-15') },
      { code: 'HW007', name: 'Porsche 911 GT3', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-05-01') },
      { code: 'HW008', name: 'BMW M3 E46', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-05-01') },
      { code: 'HW009', name: 'Toyota Supra MK4', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-05-15') },
      { code: 'HW010', name: 'Chevrolet Camaro SS', brand: 'Hot Wheels', isPreOrder: true, releaseDate: new Date('2025-05-15') },
      
      // Matchbox
      { code: 'MB001', name: 'Land Rover Defender', brand: 'Matchbox', isPreOrder: true, releaseDate: new Date('2025-03-20') },
      { code: 'MB002', name: 'Ford F-150 Raptor', brand: 'Matchbox', isPreOrder: true, releaseDate: new Date('2025-03-20') },
      { code: 'MB003', name: 'Jeep Wrangler', brand: 'Matchbox', isPreOrder: true, releaseDate: new Date('2025-04-05') },
      { code: 'MB004', name: 'Mercedes-Benz G-Class', brand: 'Matchbox', isPreOrder: true, releaseDate: new Date('2025-04-05') },
      { code: 'MB005', name: 'Toyota Hilux', brand: 'Matchbox', isPreOrder: true, releaseDate: new Date('2025-04-20') },
      
      // Tomica
      { code: 'TM001', name: 'Nissan GT-R R35', brand: 'Tomica', isPreOrder: true, releaseDate: new Date('2025-03-25') },
      { code: 'TM002', name: 'Honda NSX', brand: 'Tomica', isPreOrder: true, releaseDate: new Date('2025-03-25') },
      { code: 'TM003', name: 'Mazda RX-7 FD', brand: 'Tomica', isPreOrder: true, releaseDate: new Date('2025-04-10') },
      { code: 'TM004', name: 'Subaru WRX STI', brand: 'Tomica', isPreOrder: true, releaseDate: new Date('2025-04-10') },
      { code: 'TM005', name: 'Mitsubishi Lancer Evolution', brand: 'Tomica', isPreOrder: true, releaseDate: new Date('2025-04-25') },
      
      // Mini GT
      { code: 'MG001', name: 'Nissan Skyline GT-R R34 Nismo', brand: 'Mini GT', isPreOrder: true, releaseDate: new Date('2025-06-01') },
      { code: 'MG002', name: 'Toyota GR Supra', brand: 'Mini GT', isPreOrder: true, releaseDate: new Date('2025-06-01') },
      { code: 'MG003', name: 'Honda Civic Type R FK8', brand: 'Mini GT', isPreOrder: true, releaseDate: new Date('2025-06-15') },
      { code: 'MG004', name: 'McLaren 720S', brand: 'Mini GT', isPreOrder: true, releaseDate: new Date('2025-06-15') },
      { code: 'MG005', name: 'Lamborghini Huracán GT3', brand: 'Mini GT', isPreOrder: true, releaseDate: new Date('2025-07-01') },
      
      // Majorette
      { code: 'MJ001', name: 'Peugeot 208 Rally', brand: 'Majorette', isPreOrder: true, releaseDate: new Date('2025-05-20') },
      { code: 'MJ002', name: 'Renault Clio RS', brand: 'Majorette', isPreOrder: true, releaseDate: new Date('2025-05-20') },
      { code: 'MJ003', name: 'Citroën C3 WRC', brand: 'Majorette', isPreOrder: true, releaseDate: new Date('2025-06-05') },
      { code: 'MJ004', name: 'Alpine A110', brand: 'Majorette', isPreOrder: true, releaseDate: new Date('2025-06-05') },
      { code: 'MJ005', name: 'Bugatti Chiron', brand: 'Majorette', isPreOrder: true, releaseDate: new Date('2025-06-20') },
    ];

    console.log('Restaurando Miniaturas Base...');
    for (const miniatura of miniaturasBase) {
      const existing = await prisma.miniaturaBase.findUnique({
        where: { code: miniatura.code }
      });
      
      if (!existing) {
        await prisma.miniaturaBase.create({ data: miniatura });
        console.log(`✓ ${miniatura.code} - ${miniatura.name}`);
      } else {
        console.log(`○ ${miniatura.code} - ${miniatura.name} (já existe)`);
      }
    }

    console.log('\n✓ Restauração concluída!');
    console.log(`Total de miniaturas base: ${miniaturasBase.length}`);

  } catch (error) {
    console.error('Erro ao restaurar miniaturas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreMiniaturas();
