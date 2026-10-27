import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Farm from './models/Farm.js';
import Crop from './models/Crop.js';
import Resource from './models/Resource.js';
import Order from './models/Order.js';
import ForumPost from './models/ForumPost.js';
import Consultation from './models/Consultation.js';
import connectDB from './config/db.js';
import { analyzeSoil } from './utils/soilAnalytics.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Purging existing data...');
    await User.deleteMany();
    await Farm.deleteMany();
    await Crop.deleteMany();
    await Resource.deleteMany();
    await Order.deleteMany();
    await ForumPost.deleteMany();
    await Consultation.deleteMany();

    console.log('🌱 Seeding platform users...');
    const adminUser = await User.create({
      name: 'Dr. Vikram Patel (AgriTech Admin)',
      email: 'admin@agritech.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      location: { region: 'National Agritech Hub', state: 'Delhi', country: 'India' },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    const farmerUser = await User.create({
      name: 'Gurpreet Singh',
      email: 'farmer@agritech.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '+91 98111 22334',
      location: { region: 'Ludhiana District', state: 'Punjab', country: 'India' },
      languagePreference: 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const expertUser = await User.create({
      name: 'Dr. Sunita Deshmukh',
      email: 'expert@agritech.com',
      password: 'expert123',
      role: 'expert',
      phone: '+91 98333 44556',
      location: { region: 'State Agricultural University', state: 'Maharashtra', country: 'India' },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });

    console.log('🚜 Seeding farms...');
    const farm1 = await Farm.create({
      user: farmerUser._id,
      name: 'Green Valley Golden Acres',
      location: {
        address: 'Village Khanna, GT Road',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141401',
        lat: 30.7046,
        lng: 76.2163,
      },
      totalArea: 18.5,
      soilType: 'alluvial',
      irrigationType: 'drip',
      establishedYear: 2018,
      notes: 'High yield wheat-paddy rotation block with laser-levelled fields.',
    });

    const farm2 = await Farm.create({
      user: farmerUser._id,
      name: 'Sunrise Horticulture & Organic Orchards',
      location: {
        address: 'Sector 4, Near Canal Road',
        city: 'Jalandhar',
        state: 'Punjab',
        pincode: '144001',
        lat: 31.326,
        lng: 75.5762,
      },
      totalArea: 7.2,
      soilType: 'loam',
      irrigationType: 'sprinkler',
      establishedYear: 2021,
      notes: 'Certified organic vegetables and hybrid corn.',
    });

    console.log('🌾 Seeding crops and soil health records...');
    const wheatMetrics = { ph: 6.7, moisture: 42, nitrogen: 110, phosphorus: 28, potassium: 175, organicCarbon: 0.68 };
    const wheatAnalysis = analyzeSoil(wheatMetrics);

    await Crop.create({
      farm: farm1._id,
      user: farmerUser._id,
      cropName: 'Wheat',
      variety: 'HD-2967 (High Yielding)',
      areaPlanted: 10.0,
      plantingDate: new Date('2026-11-10'),
      expectedHarvestDate: new Date('2027-04-15'),
      stage: 'Vegetative',
      healthStatus: 'Excellent',
      soilMetrics: wheatMetrics,
      recommendations: wheatAnalysis.recommendations,
      notes: 'Healthy tillering observed; second irrigation scheduled with light nitrogen top-dressing.',
    });

    const tomatoMetrics = { ph: 5.8, moisture: 30, nitrogen: 95, phosphorus: 18, potassium: 130, organicCarbon: 0.45 };
    const tomatoAnalysis = analyzeSoil(tomatoMetrics);

    await Crop.create({
      farm: farm2._id,
      user: farmerUser._id,
      cropName: 'Tomato',
      variety: 'Arka Rakshak F1 Hybrid',
      areaPlanted: 3.5,
      plantingDate: new Date('2026-09-01'),
      expectedHarvestDate: new Date('2027-01-20'),
      stage: 'Flowering',
      healthStatus: 'Warning',
      soilMetrics: tomatoMetrics,
      recommendations: tomatoAnalysis.recommendations,
      notes: 'Soil shows slight acidity; calcium nitrate and dolomite foliar spray recommended for blossom end rot prevention.',
    });

    console.log('🛒 Seeding marketplace resources...');
    const sampleResources = [
      {
        name: 'Certified Hybrid Wheat Seed (HD-2967)',
        category: 'seeds',
        price: 1350,
        unit: '40 kg bag',
        stock: 120,
        description: 'Certified high-tillering variety resistant to yellow rust with high protein milling quality.',
        manufacturer: 'National Seeds Corporation',
        isOrganic: false,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Bio-Enriched Vermicompost (Organic Gold)',
        category: 'fertilizers',
        price: 450,
        unit: '50 kg bag',
        stock: 250,
        description: '100% natural organic compost enriched with beneficial earthworms, humic acid, and microflora.',
        manufacturer: 'AgriTech Bio-Inputs',
        isOrganic: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'NPK 19-19-19 Water Soluble Fertilizer',
        category: 'fertilizers',
        price: 1100,
        unit: '25 kg bag',
        stock: 85,
        description: 'Balanced water-soluble fertilizer ideal for drip fertigation and foliar nutrition in all field crops.',
        manufacturer: 'IFFCO Agro Tech',
        isOrganic: false,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Cold-Pressed Pure Neem Oil (10,000 PPM Azadirachtin)',
        category: 'pesticides',
        price: 680,
        unit: '1 Litre bottle',
        stock: 140,
        description: 'Eco-friendly organic broad-spectrum repellent for sucking pests, whiteflies, aphids, and mites.',
        manufacturer: 'GreenLife Organics',
        isOrganic: true,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Smart Solar Drip Irrigation Kit (1 Acre Complete)',
        category: 'irrigation',
        price: 18500,
        unit: '1 Acre Kit',
        stock: 20,
        description: 'Precision water-saving drip kit with inline emitters, disk filter, venturi injector, and PVC mains.',
        manufacturer: 'Jain Smart Agri Solutions',
        isOrganic: false,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Digital 4-in-1 Soil Tester (pH, Moisture, Temp, Sunlight)',
        category: 'tools',
        price: 1250,
        unit: '1 Device',
        stock: 65,
        description: 'Handheld probe for instant on-field determination of soil pH, root-zone moisture, and temperature.',
        manufacturer: 'Precision Agro Labs',
        isOrganic: false,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      },
    ];

    const createdResources = await Resource.insertMany(sampleResources);

    console.log('📦 Seeding sample order...');
    await Order.create({
      user: farmerUser._id,
      items: [
        {
          resource: createdResources[0]._id,
          name: createdResources[0].name,
          quantity: 2,
          price: createdResources[0].price,
          unit: createdResources[0].unit,
        },
        {
          resource: createdResources[1]._id,
          name: createdResources[1].name,
          quantity: 4,
          price: createdResources[1].price,
          unit: createdResources[1].unit,
        },
      ],
      shippingAddress: {
        address: 'Green Valley Golden Acres, GT Road',
        city: 'Ludhiana',
        state: 'Punjab',
        postalCode: '141401',
        contactNumber: '+91 98111 22334',
      },
      paymentMethod: 'Cash on Delivery (Kisan Pay)',
      paymentStatus: 'Pending',
      totalAmount: 2 * 1350 + 4 * 450,
      orderStatus: 'Confirmed',
    });

    console.log('💬 Seeding community forum discussions...');
    await ForumPost.create({
      author: farmerUser._id,
      title: 'Managing yellow rust in late sown wheat varieties under fluctuating winter temperatures',
      category: 'Crop Diseases & Pests',
      content:
        'With mild rain and overcast weather this week, I noticed slight yellow streaks on upper leaves in northern field blocks. Has anyone sprayed Propiconazole early, or did bio-neem extract suffice?',
      tags: ['Wheat', 'YellowRust', 'Fungicide', 'CropCare'],
      likes: [farmerUser._id, expertUser._id],
      comments: [
        {
          user: expertUser._id,
          authorName: 'Dr. Sunita Deshmukh',
          authorRole: 'expert',
          content:
            'Hello Gurpreet. For yellow rust, early preventive spray of Propiconazole 25% EC @ 1ml/L is strongly recommended before sporulation accelerates. Ensure proper nozzle calibration.',
        },
      ],
    });

    console.log('👨‍🌾 Seeding expert consultations...');
    await Consultation.create({
      farmer: farmerUser._id,
      expertType: 'Soil Scientist',
      cropConcerned: 'Tomato Hybrid',
      topic: 'Soil acidity management and blossom end rot mitigation',
      description: 'Tomato crop showing calcium deficiency symptoms and pH is around 5.8. Seeking advice on foliar dosage.',
      preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      preferredTimeSlot: '11:00 AM - 01:00 PM',
      consultationMode: 'Video Call',
      status: 'Scheduled',
      assignedExpertName: 'Dr. Sunita Deshmukh (Soil Scientist, ICAR)',
      advisoryNotes: 'Preliminary check: Advised 0.5% calcium chloride foliar spray as immediate rescue.',
    });

    console.log('✅ AgriTech Database Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Logins created:');
    console.log('   Farmer: farmer@agritech.com / farmer123');
    console.log('   Admin:  admin@agritech.com  / admin123');
    console.log('   Expert: expert@agritech.com / expert123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
