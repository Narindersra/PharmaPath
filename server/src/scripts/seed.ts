import { connectDB } from '../config/db.js';
import { User } from '../models/user.model.js';
import { Medicine } from '../models/medicine.model.js';
import { Reservation } from '../models/reservation.model.js';

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Cleaning up or updating existing demo accounts...');

    // 1. SEED ADMIN USER
    let admin = await User.findOne({ email: 'admin@pharmapath.com' });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: 'admin@pharmapath.com',
        password: 'Admin@12345',
        role: 'ADMIN',
      });
      console.log('✅ Admin user created: admin@pharmapath.com / Admin@12345');
    } else {
      console.log('ℹ️ Admin user already exists: admin@pharmapath.com');
    }

    // 2. SEED PHARMACIES
    let apollo = await User.findOne({ email: 'apollo@pharmacy.com' });
    if (!apollo) {
      apollo = await User.create({
        name: 'Apollo Pharmacy Green Park',
        pharmacyName: 'Apollo Pharmacy',
        email: 'apollo@pharmacy.com',
        password: 'Pharmacy@123',
        role: 'PHARMACY',
        address: 'Green Park Main Market, New Delhi',
        city: 'New Delhi',
        phone: '+91 98112 34567',
        licenseNumber: 'DL-2026-PH-APOLLO-01',
        isVerified: true,
        open24Hours: true,
        rating: 4.9,
      });
      console.log('✅ Apollo Pharmacy created: apollo@pharmacy.com / Pharmacy@123');
    } else {
      apollo.isVerified = true;
      await apollo.save();
      console.log('ℹ️ Apollo Pharmacy exists.');
    }

    let medplus = await User.findOne({ email: 'medplus@pharmacy.com' });
    if (!medplus) {
      medplus = await User.create({
        name: 'MedPlus Wellness Hauz Khas',
        pharmacyName: 'MedPlus Wellness Pharmacy',
        email: 'medplus@pharmacy.com',
        password: 'Pharmacy@123',
        role: 'PHARMACY',
        address: 'Hauz Khas Enclave Market, New Delhi',
        city: 'New Delhi',
        phone: '+91 98114 98765',
        licenseNumber: 'DL-2026-PH-MEDPLUS-04',
        isVerified: true,
        open24Hours: false,
        closingTime: '11:00 PM',
        rating: 4.8,
      });
      console.log('✅ MedPlus Pharmacy created: medplus@pharmacy.com / Pharmacy@123');
    } else {
      medplus.isVerified = true;
      await medplus.save();
      console.log('ℹ️ MedPlus Pharmacy exists.');
    }

    // 3. SEED CUSTOMER
    let customer = await User.findOne({ email: 'rahul@example.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'Customer@123',
        role: 'CUSTOMER',
        phone: '+91 98711 00223',
      });
      console.log('✅ Demo Customer created: rahul@example.com / Customer@123');
    } else {
      console.log('ℹ️ Demo Customer exists: rahul@example.com');
    }

    // 4. SEED MEDICINES FOR APOLLO
    const apolloMedicines = [
      {
        name: 'Dolo 650mg Tablet',
        genericName: 'Paracetamol 650mg + Micro-crystalline Cellulose',
        price: 32.5,
        mrp: 42.0,
        stock: 85,
        minStockAlert: 20,
        expiryDate: '2026-09-30',
        batchNumber: 'BT-9921',
        rackLocation: 'Rack A-04',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: false,
        pharmacyId: apollo._id,
      },
      {
        name: 'Augmentin 625 Duo Tablet',
        genericName: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
        price: 201.5,
        mrp: 245.0,
        stock: 45,
        minStockAlert: 30,
        expiryDate: '2026-11-15',
        batchNumber: 'AUG-442',
        rackLocation: 'Rack B-12',
        category: 'schedule-h' as const,
        isColdChain: false,
        requiresPrescription: true,
        pharmacyId: apollo._id,
      },
      {
        name: 'Pan-D Capsule (Strip of 15)',
        genericName: 'Pantoprazole (40mg) + Domperidone (30mg)',
        price: 198.0,
        mrp: 235.0,
        stock: 140,
        minStockAlert: 40,
        expiryDate: '2026-12-31',
        batchNumber: 'PND-108',
        rackLocation: 'Rack A-02',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: false,
        pharmacyId: apollo._id,
      },
      {
        name: 'Telma 40mg Tablet',
        genericName: 'Telmisartan (40mg) + Chlorthalidone (12.5mg)',
        price: 245.0,
        mrp: 290.0,
        stock: 88,
        minStockAlert: 25,
        expiryDate: '2026-07-20',
        batchNumber: 'TL-882',
        rackLocation: 'Rack C-01',
        category: 'schedule-h' as const,
        isColdChain: false,
        requiresPrescription: true,
        pharmacyId: apollo._id,
      },
      {
        name: 'Insulin Mixtard 30/70 (100 IU/ml)',
        genericName: 'Isophane Insulin Human Suspension 100 IU/ml',
        price: 178.5,
        mrp: 215.0,
        stock: 14,
        minStockAlert: 20,
        expiryDate: '2026-06-30',
        batchNumber: 'IN-5501',
        rackLocation: 'Cold Vault #2',
        category: 'cold-chain' as const,
        isColdChain: true,
        requiresPrescription: true,
        pharmacyId: apollo._id,
      },
      {
        name: 'Thyronorm 50mcg Tablet',
        genericName: 'Thyroxine Sodium (Abbott Formulations)',
        price: 145.2,
        mrp: 175.0,
        stock: 64,
        minStockAlert: 20,
        expiryDate: '2026-08-31',
        batchNumber: 'TH-302',
        rackLocation: 'Rack B-03',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: true,
        pharmacyId: apollo._id,
      },
    ];

    for (const medData of apolloMedicines) {
      const existing = await Medicine.findOne({
        name: medData.name,
        pharmacyId: apollo._id,
      });
      if (!existing) {
        await Medicine.create(medData);
      }
    }
    console.log(`✅ Seeded medicines for ${apollo.pharmacyName}`);

    // 5. SEED MEDICINES FOR MEDPLUS
    const medplusMedicines = [
      {
        name: 'Dolo 650mg Tablet',
        genericName: 'Paracetamol 650mg Fast-Action',
        price: 31.0,
        mrp: 42.0,
        stock: 120,
        minStockAlert: 20,
        expiryDate: '2026-10-15',
        batchNumber: 'BT-9844',
        rackLocation: 'Rack A-01',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: false,
        pharmacyId: medplus._id,
      },
      {
        name: 'Azithral 500mg Tablet',
        genericName: 'Azithromycin Dihydrate (Strip of 5)',
        price: 119.5,
        mrp: 145.0,
        stock: 35,
        minStockAlert: 15,
        expiryDate: '2026-08-15',
        batchNumber: 'AZ-120',
        rackLocation: 'Rack C-04',
        category: 'schedule-h' as const,
        isColdChain: false,
        requiresPrescription: true,
        pharmacyId: medplus._id,
      },
      {
        name: 'Montair-LC Tablet',
        genericName: 'Montelukast Sodium (10mg) + Levocetirizine (5mg)',
        price: 165.0,
        mrp: 198.0,
        stock: 52,
        minStockAlert: 20,
        expiryDate: '2026-12-10',
        batchNumber: 'MLC-902',
        rackLocation: 'Rack B-01',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: false,
        pharmacyId: medplus._id,
      },
      {
        name: 'Shelcal 500 Calcium Tablet',
        genericName: 'Calcium 500mg + Vitamin D3 (250 IU)',
        price: 112.0,
        mrp: 135.0,
        stock: 95,
        minStockAlert: 25,
        expiryDate: '2027-01-20',
        batchNumber: 'SH-441',
        rackLocation: 'Rack A-05',
        category: 'all' as const,
        isColdChain: false,
        requiresPrescription: false,
        pharmacyId: medplus._id,
      },
      {
        name: 'Glycomet 500 SR Tablet',
        genericName: 'Metformin Hydrochloride Prolonged Release',
        price: 48.0,
        mrp: 60.0,
        stock: 110,
        minStockAlert: 30,
        expiryDate: '2026-11-30',
        batchNumber: 'GL-332',
        rackLocation: 'Rack C-02',
        category: 'schedule-h' as const,
        isColdChain: false,
        requiresPrescription: true,
        pharmacyId: medplus._id,
      },
    ];

    for (const medData of medplusMedicines) {
      const existing = await Medicine.findOne({
        name: medData.name,
        pharmacyId: medplus._id,
      });
      if (!existing) {
        await Medicine.create(medData);
      }
    }
    console.log(`✅ Seeded medicines for ${medplus.pharmacyName}`);

    // 6. SEED ACTIVE RESERVATIONS FOR RAHUL
    const doloMed = await Medicine.findOne({ name: 'Dolo 650mg Tablet', pharmacyId: apollo._id });
    if (doloMed) {
      const existingRes = await Reservation.findOne({
        customerId: customer._id,
        pharmacyId: apollo._id,
        status: 'CONFIRMED',
      });

      if (!existingRes) {
        await Reservation.create({
          customerId: customer._id,
          pharmacyId: apollo._id,
          medicineId: doloMed._id,
          quantity: 2,
          unitPrice: doloMed.price,
          totalPrice: doloMed.price * 2,
          status: 'CONFIRMED',
          token: 'TKN-8491',
          smsPin: '4829',
          counterNumber: 'Counter 2',
          expiresAt: new Date(Date.now() + 105 * 60 * 1000), // ~1 hr 45 min
          notes: 'Emergency cold & fever hold',
        });
        console.log('✅ Seeded active reservation for customer Rahul Sharma');
      }
    }

    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seed();
