import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { connectDB } from '../config/db.js';
import { User } from '../models/user.model.js';
import { Medicine } from '../models/medicine.model.js';
import { Reservation } from '../models/reservation.model.js';

// Indian First & Last Names for authentic customer profiles
const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Abhimanyu', 'Rudra', 'Dhruv', 'Kabir', 'Ananya', 'Diya', 'Saanvi', 'Aadhya',
  'Kiara', 'Ira', 'Myra', 'Anushka', 'Riya', 'Pari', 'Aarohi', 'Avani', 'Advika', 'Kavya',
  'Rahul', 'Rohit', 'Amit', 'Pooja', 'Priya', 'Neha', 'Sneha', 'Vikas', 'Deepak', 'Suresh',
  'Ramesh', 'Manish', 'Kunal', 'Rajesh', 'Sunita', 'Geeta', 'Meena', 'Anita', 'Sunil', 'Anil',
  'Rakesh', 'Sanjay', 'Ajay', 'Vijay', 'Karan', 'Pooja', 'Swati', 'Preeti', 'Shweta', 'Tanvi',
  'Varun', 'Nikhil', 'Gaurav', 'Alok', 'Mohit', 'Harsh', 'Siddharth', 'Pranav', 'Mayank', 'Sachin',
  'Bhavna', 'Rashmi', 'Divya', 'Deepika', 'Komal', 'Simran', 'Shruti', 'Garima', 'Pallavi', 'Akanksha'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Rao', 'Chowdhury',
  'Chatterjee', 'Banerjee', 'Mukherjee', 'Singh', 'Kaur', 'Joshi', 'Bhat', 'Kulkarni', 'Deshmukh', 'Pawar',
  'Shinde', 'Chauhan', 'Yadav', 'Mishra', 'Pandey', 'Dubey', 'Tiwari', 'Tripathi', 'Agarwal', 'Bansal',
  'Goyal', 'Mittals', 'Saxena', 'Srivastava', 'Bhattacharya', 'Ghosh', 'Das', 'Dutta', 'Sengupta', 'Chopra',
  'Malhotra', 'Kapoor', 'Khanna', 'Bhatia', 'Arora', 'Sehgal', 'Soni', 'Seth', 'Jain', 'Shah'
];

const INDIAN_METROS = [
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    center: [77.5946, 12.9716],
    areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Malleshwaram', 'BTM Layout', 'JP Nagar', 'Electronic City', 'Marathahalli', 'Hebbal', 'Yelahanka']
  },
  {
    city: 'New Delhi',
    state: 'Delhi',
    center: [77.2090, 28.6139],
    areas: ['Connaught Place', 'Green Park', 'Hauz Khas', 'South Extension', 'Lajpat Nagar', 'Rohini', 'Dwarka', 'Saket', 'Karol Bagh', 'Pitampura', 'Vasant Kunj', 'Greater Kailash']
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    center: [72.8777, 19.0760],
    areas: ['Bandra West', 'Andheri East', 'Powai', 'Juhu', 'Colaba', 'Dadar', 'Borivali West', 'Goregaon', 'Malad', 'Thane West', 'Navi Mumbai', 'Kharghar']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    center: [78.4867, 17.3850],
    areas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Hitech City', 'Kukatpally', 'Secunderabad', 'Begumpet', 'Kondapur', 'Ameerpet']
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    center: [80.2707, 13.0827],
    areas: ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Besant Nagar', 'Thiruvanmiyur', 'Porur', 'Guindy']
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    center: [73.8567, 18.5204],
    areas: ['Kothrud', 'Viman Nagar', 'Hinjewadi', 'Baner', 'Aundh', 'Kalyani Nagar', 'Hadapsar', 'Wakad', 'Magarpatta City', 'Deccan']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    center: [88.3639, 22.5726],
    areas: ['Salt Lake', 'Park Street', 'New Town', 'Ballygunge', 'Alipore', 'Gariahat', 'Howrah', 'Dum Dum', 'Behala', 'Shyambazar']
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    center: [72.5714, 23.0225],
    areas: ['Navrangpura', 'Satellite', 'Bodakdev', 'Vastrapur', 'SG Highway', 'Maninagar', 'Prahlad Nagar', 'Ellisbridge']
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    center: [75.7873, 26.9124],
    areas: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Raja Park', 'Tonk Road', 'Jagatpura', 'Bani Park']
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    center: [80.9462, 26.8467],
    areas: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Alambagh', 'Vikas Nagar', 'Chowk']
  }
];

const PHARMACY_BRANDS = [
  'Apollo Pharmacy',
  'MedPlus Pharmacy',
  'Wellness Forever',
  'Guardian Pharmacy',
  'Netmeds Pharmacy Store',
  'Frank Ross Pharmacy',
  'Noble Plus Chemist',
  'Relief Chemist & Druggist',
  'Sanjivani Health Mart',
  'Fortis Healthworld',
  'Max Care Medicos',
  'City LifeCare Chemist',
  'Health & Glow Chemist',
  'Green Cross Pharmacy',
  'Shree Ganesh Medicals',
  'Trust Care Pharmacy',
  'Pulse Point Chemist',
  'Prime Cure Pharmacy',
  'Apex Medicos',
  'LifeLine Chemist & Druggist'
];

// Master list of 210+ top prescribed Indian pharmaceuticals
interface MasterMedicineDefinition {
  name: string;
  genericName: string;
  price: number;
  mrp: number;
  category: 'all' | 'low-stock' | 'near-expiry' | 'cold-chain' | 'schedule-h';
  isColdChain: boolean;
  requiresPrescription: boolean;
}

const MASTER_MEDICINES: MasterMedicineDefinition[] = [
  // 1-30: Pain Relief, Antipyretic & Anti-inflammatory
  { name: 'Dolo 650mg Tablet', genericName: 'Paracetamol (650mg)', price: 31.5, mrp: 35.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Crocin 650 Advance Tablet', genericName: 'Fast Release Paracetamol (650mg)', price: 33.0, mrp: 38.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Calpol 500mg Tablet', genericName: 'Paracetamol (500mg)', price: 18.0, mrp: 21.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Combiflam Tablet', genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Meftal-Spas Tablet', genericName: 'Mefenamic Acid (250mg) + Dicyclomine (10mg)', price: 54.0, mrp: 62.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zerodol-P Tablet', genericName: 'Aceclofenac (100mg) + Paracetamol (325mg)', price: 65.0, mrp: 75.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zerodol-SP Tablet', genericName: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)', price: 118.0, mrp: 135.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ultracet Tablet', genericName: 'Tramadol (37.5mg) + Paracetamol (325mg)', price: 215.0, mrp: 245.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Voveran 50 GE Tablet', genericName: 'Diclofenac Sodium (50mg)', price: 82.0, mrp: 95.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Voveran SR 100mg Tablet', genericName: 'Diclofenac Sodium Sustained Release (100mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Flexon Tablet', genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)', price: 34.0, mrp: 40.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Ketorol-DT 10mg Tablet', genericName: 'Ketorolac Tromethamine (10mg)', price: 135.0, mrp: 155.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Brufen 400mg Tablet', genericName: 'Ibuprofen (400mg)', price: 22.0, mrp: 26.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Sumo Tablet', genericName: 'Nimesulide (100mg) + Paracetamol (325mg)', price: 110.0, mrp: 128.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Dynapar AQ Injection', genericName: 'Diclofenac Sodium (75mg/ml)', price: 28.0, mrp: 35.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Hifenac-P Tablet', genericName: 'Aceclofenac (100mg) + Paracetamol (325mg)', price: 68.0, mrp: 78.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Nise 100mg Tablet', genericName: 'Nimesulide (100mg)', price: 92.0, mrp: 105.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Dolonex DT 20mg Tablet', genericName: 'Piroxicam (20mg)', price: 175.0, mrp: 200.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Volini Pain Relief Gel (50g)', genericName: 'Diclofenac Diethylamine + Linseed Oil + Methyl Salicylate', price: 145.0, mrp: 165.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Omnigel Gel (50g)', genericName: 'Diclofenac + Virgin Linseed Oil + Menthol', price: 138.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Moov Pain Relief Ointment (50g)', genericName: 'Wintergreen Oil + Nilgiri Oil + Turpentine Oil', price: 175.0, mrp: 195.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Iodex Balm (40g)', genericName: 'Methyl Salicylate + Menthol + Camphor', price: 150.0, mrp: 165.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Crocin Pain Relief Tablet', genericName: 'Paracetamol (650mg) + Caffeine (50mg)', price: 65.0, mrp: 72.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Saridon Tablet', genericName: 'Paracetamol (250mg) + Propyphenazone (150mg) + Caffeine (50mg)', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Disprin 325mg Effervescent Tablet', genericName: 'Aspirin (325mg)', price: 12.0, mrp: 15.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Esgipyrin SP Tablet', genericName: 'Diclofenac (50mg) + Paracetamol (325mg) + Serratiopeptidase (10mg)', price: 95.0, mrp: 110.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Enzoflam Tablet', genericName: 'Diclofenac (50mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)', price: 125.0, mrp: 142.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Myospaz Forte Tablet', genericName: 'Chlorzoxazone (500mg) + Paracetamol (325mg)', price: 185.0, mrp: 210.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Mobizox Tablet', genericName: 'Diclofenac (50mg) + Paracetamol (325mg) + Chlorzoxazone (500mg)', price: 195.0, mrp: 225.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Zandu Balm (25ml)', genericName: 'Mentha Extract + Gaultheria Oil + Eucalyptus Oil', price: 85.0, mrp: 95.0, category: 'all', isColdChain: false, requiresPrescription: false },

  // 31-65: Antibiotics & Anti-infectives
  { name: 'Augmentin 625 Duo Tablet', genericName: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)', price: 198.0, mrp: 223.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Clavam 625 Tablet', genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)', price: 192.0, mrp: 218.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Moxikind-CV 625 Tablet', genericName: 'Amoxicillin (500mg) + Potassium Clavulanate (125mg)', price: 175.0, mrp: 205.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Azithral 500mg Tablet', genericName: 'Azithromycin (500mg)', price: 115.0, mrp: 132.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Azee 500mg Tablet', genericName: 'Azithromycin (500mg)', price: 118.0, mrp: 135.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Taxim-O 200mg Tablet', genericName: 'Cefixime (200mg)', price: 105.0, mrp: 120.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Mahacef 200mg Tablet', genericName: 'Cefixime (200mg)', price: 98.0, mrp: 115.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zifi 200mg Tablet', genericName: 'Cefixime (200mg)', price: 112.0, mrp: 128.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Monocef-O 200mg Tablet', genericName: 'Cefpodoxime Proxetil (200mg)', price: 168.0, mrp: 192.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Gudcef 200mg Tablet', genericName: 'Cefpodoxime Proxetil (200mg)', price: 172.0, mrp: 198.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cepodem 200mg Tablet', genericName: 'Cefpodoxime Proxetil (200mg)', price: 178.0, mrp: 205.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cifran 500mg Tablet', genericName: 'Ciprofloxacin (500mg)', price: 42.0, mrp: 49.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ciplox 500mg Tablet', genericName: 'Ciprofloxacin (500mg)', price: 40.0, mrp: 47.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Levomac 500mg Tablet', genericName: 'Levofloxacin (500mg)', price: 95.0, mrp: 110.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Loxof 500mg Tablet', genericName: 'Levofloxacin (500mg)', price: 98.0, mrp: 115.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Oflox 200mg Tablet', genericName: 'Ofloxacin (200mg)', price: 68.0, mrp: 78.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zenflox-OZ Tablet', genericName: 'Ofloxacin (200mg) + Ornidazole (500mg)', price: 125.0, mrp: 145.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'O2 Tablet', genericName: 'Ofloxacin (200mg) + Ornidazole (500mg)', price: 135.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Norflox-TZ Tablet', genericName: 'Norfloxacin (400mg) + Tinidazole (600mg)', price: 88.0, mrp: 102.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Metrogyl 400mg Tablet', genericName: 'Metronidazole (400mg)', price: 24.0, mrp: 28.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Flagyl 400mg Tablet', genericName: 'Metronidazole (400mg)', price: 23.0, mrp: 27.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Doxy-1 100mg Capsule', genericName: 'Doxycycline Hyclate (100mg)', price: 110.0, mrp: 130.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Bactrim DS Tablet', genericName: 'Trimethoprim (160mg) + Sulphamethoxazole (800mg)', price: 26.0, mrp: 31.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Septran DS Tablet', genericName: 'Trimethoprim (160mg) + Sulfamethoxazole (800mg)', price: 28.0, mrp: 33.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rifaximin 400mg (Rifagut)', genericName: 'Rifaximin (400mg)', price: 340.0, mrp: 390.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Rifagut 550mg Tablet', genericName: 'Rifaximin (550mg)', price: 460.0, mrp: 520.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Cefakind 500mg Tablet', genericName: 'Cefuroxime Axetil (500mg)', price: 490.0, mrp: 560.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ceftum 500mg Tablet', genericName: 'Cefuroxime Axetil (500mg)', price: 540.0, mrp: 610.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zocon 150mg Tablet', genericName: 'Fluconazole (150mg)', price: 38.0, mrp: 44.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Forcan 150mg Tablet', genericName: 'Fluconazole (150mg)', price: 39.0, mrp: 45.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Canditral 100mg Capsule', genericName: 'Itraconazole (100mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Itrangil 200mg Capsule', genericName: 'Itraconazole Pellets (200mg)', price: 245.0, mrp: 285.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zentel 400mg Tablet', genericName: 'Albendazole (400mg)', price: 10.0, mrp: 12.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Band 400 Plus Chewable Tablet', genericName: 'Albendazole (400mg) + Ivermectin (6mg)', price: 28.0, mrp: 34.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ivecop 12mg Tablet', genericName: 'Ivermectin (12mg)', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: true },

  // 66-100: Gastrointestinal, Antacids & Anti-emetics
  { name: 'Pan 40mg Tablet', genericName: 'Pantoprazole Gastro-resistant (40mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Pantocid 40mg Tablet', genericName: 'Pantoprazole (40mg)', price: 148.0, mrp: 172.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Pantop-D Capsule', genericName: 'Pantoprazole (40mg) + Domperidone SR (30mg)', price: 185.0, mrp: 212.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Pan-D Capsule', genericName: 'Pantoprazole (40mg) + Domperidone (30mg)', price: 188.0, mrp: 215.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Omez 20mg Capsule', genericName: 'Omeprazole (20mg)', price: 58.0, mrp: 68.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Omez-D Capsule', genericName: 'Omeprazole (20mg) + Domperidone (10mg)', price: 142.0, mrp: 165.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Razo 20mg Tablet', genericName: 'Rabeprazole Sodium (20mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Razo-D Capsule', genericName: 'Rabeprazole (20mg) + Domperidone SR (30mg)', price: 195.0, mrp: 228.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rabekind-DSR Capsule', genericName: 'Rabeprazole (20mg) + Domperidone (30mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Nexpro 40mg Tablet', genericName: 'Esomeprazole (40mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Sompraz 40mg Tablet', genericName: 'Esomeprazole (40mg)', price: 152.0, mrp: 175.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Sompraz D 40 Capsule', genericName: 'Esomeprazole (40mg) + Domperidone (30mg)', price: 215.0, mrp: 245.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Aciloc 150mg Tablet', genericName: 'Ranitidine Hydrochloride (150mg)', price: 38.0, mrp: 44.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Rantac 150mg Tablet', genericName: 'Ranitidine (150mg)', price: 36.0, mrp: 42.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Gelusil MPS Antacid Syrup (200ml)', genericName: 'Aluminium Hydroxide + Dimethicone + Magnesium Hydroxide', price: 125.0, mrp: 140.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Digene Mint Flavour Syrup (200ml)', genericName: 'Magnesium Hydroxide + Simethicone + Sodium Carboxymethylcellulose', price: 142.0, mrp: 158.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Digene Chewable Mint Tablets (Strip of 15)', genericName: 'Dried Aluminium Hydroxide Gel + Magnesium Aluminium Silicate', price: 22.0, mrp: 26.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Cremaffin Mixed Fruit Syrup (225ml)', genericName: 'Liquid Paraffin + Milk of Magnesia', price: 275.0, mrp: 310.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Duphalac Oral Solution (150ml)', genericName: 'Lactulose (10g/15ml)', price: 285.0, mrp: 320.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Kaylite Laxative Syrup (200ml)', genericName: 'Sodium Picosulfate + Liquid Paraffin', price: 220.0, mrp: 250.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Ondem 4mg Tablet', genericName: 'Ondansetron (4mg)', price: 54.0, mrp: 62.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Vomikind 4mg Fast Dissolving Tablet', genericName: 'Ondansetron MD (4mg)', price: 52.0, mrp: 60.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Emeset 4mg Tablet', genericName: 'Ondansetron (4mg)', price: 55.0, mrp: 63.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cyclopam Tablet', genericName: 'Dicyclomine (20mg) + Paracetamol (500mg)', price: 52.0, mrp: 60.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Colimex Oral Drops (15ml)', genericName: 'Dicyclomine (10mg) + Simethicone (40mg)', price: 58.0, mrp: 68.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Pudin Hara Active Pearls (Strip of 10)', genericName: 'Mentha Piperita Oil (Spearmint & Peppermint)', price: 32.0, mrp: 36.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Gas-O-Fast Asli Jeera Sachet (Pack of 5)', genericName: 'Svarjiksara (Shudh) + Nimbukamlam (Shushk)', price: 45.0, mrp: 50.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Eno Fruit Salt Regular (100g Bottle)', genericName: 'Svarjiksara + Nimbukamlam', price: 155.0, mrp: 170.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Mucaine Gel Mint Flavour (200ml)', genericName: 'Oxetacaine (10mg) + Aluminium Hydroxide (0.291g)', price: 185.0, mrp: 210.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Sucrafil Suspension (200ml)', genericName: 'Sucralfate (1000mg/5ml)', price: 235.0, mrp: 265.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Econorm 250mg Sachet (Probiotic)', genericName: 'Saccharomyces Boulardii (250mg)', price: 58.0, mrp: 65.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Darolac Capsule (Probiotic)', genericName: 'Lactobacillus Rhamnosus + Bifidobacterium Longum', price: 125.0, mrp: 140.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Sporlac DS Tablet', genericName: 'Lactic Acid Bacillus (120 Million Spores)', price: 110.0, mrp: 125.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Electral ORS Powder (21.8g Sachet)', genericName: 'Oral Rehydration Salts (WHO Formulation)', price: 22.0, mrp: 25.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Enerzal Energy Drink Powder (100g)', genericName: 'Electrolyte Energy Booster with Glucose & Minerals', price: 65.0, mrp: 72.0, category: 'all', isColdChain: false, requiresPrescription: false },

  // 101-135: Cardiovascular, Blood Pressure & Cholesterol
  { name: 'Telma 40mg Tablet', genericName: 'Telmisartan (40mg)', price: 198.0, mrp: 228.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Telma-H Tablet', genericName: 'Telmisartan (40mg) + Hydrochlorothiazide (12.5mg)', price: 245.0, mrp: 280.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Telmikind 40mg Tablet', genericName: 'Telmisartan (40mg)', price: 65.0, mrp: 78.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Amlong 5mg Tablet', genericName: 'Amlodipine Besylate (5mg)', price: 78.0, mrp: 90.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Amlodac 5mg Tablet', genericName: 'Amlodipine (5mg)', price: 75.0, mrp: 88.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cilacar 10mg Tablet', genericName: 'Cilnidipine (10mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cilacar 20mg Tablet', genericName: 'Cilnidipine (20mg)', price: 245.0, mrp: 280.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Concor 5mg Tablet', genericName: 'Bisoprolol Fumarate (5mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Betaloc 25mg Tablet', genericName: 'Metoprolol Tartrate (25mg)', price: 95.0, mrp: 110.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Metolar XR 50mg Capsule', genericName: 'Metoprolol Succinate Extended Release (50mg)', price: 185.0, mrp: 215.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Nebicard 5mg Tablet', genericName: 'Nebivolol (5mg)', price: 195.0, mrp: 225.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Losar 50mg Tablet', genericName: 'Losartan Potassium (50mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Losar-H Tablet', genericName: 'Losartan Potassium (50mg) + Hydrochlorothiazide (12.5mg)', price: 185.0, mrp: 215.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cardivas 3.125mg Tablet', genericName: 'Carvedilol (3.125mg)', price: 72.0, mrp: 85.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Envas 5mg Tablet', genericName: 'Enalapril Maleate (5mg)', price: 68.0, mrp: 78.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Dytor 10mg Tablet', genericName: 'Torsemide (10mg)', price: 92.0, mrp: 105.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Dytor Plus 10 Tablet', genericName: 'Torsemide (10mg) + Spironolactone (50mg)', price: 148.0, mrp: 170.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Lasix 40mg Tablet', genericName: 'Furosemide (40mg)', price: 14.0, mrp: 18.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Arkamin Tablet', genericName: 'Clonidine Hydrochloride (100mcg)', price: 65.0, mrp: 75.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Minipress XL 2.5mg Tablet', genericName: 'Prazosin Extended Release (2.5mg)', price: 345.0, mrp: 395.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Sorbitrate 5mg Sublingual Tablet', genericName: 'Isosorbide Dinitrate (5mg)', price: 48.0, mrp: 55.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Monit 20mg Tablet', genericName: 'Isosorbide Mononitrate (20mg)', price: 85.0, mrp: 98.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Nitrocontin 2.6mg Controlled Release Tablet', genericName: 'Nitroglycerin (2.6mg)', price: 295.0, mrp: 340.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Atorva 20mg Tablet', genericName: 'Atorvastatin Calcium (20mg)', price: 245.0, mrp: 285.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Atorva 10mg Tablet', genericName: 'Atorvastatin (10mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Atorlip 20mg Tablet', genericName: 'Atorvastatin (20mg)', price: 235.0, mrp: 275.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Storvas 40mg Tablet', genericName: 'Atorvastatin (40mg)', price: 385.0, mrp: 445.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rosuvas 10mg Tablet', genericName: 'Rosuvastatin Calcium (10mg)', price: 215.0, mrp: 250.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rosuvas 20mg Tablet', genericName: 'Rosuvastatin (20mg)', price: 365.0, mrp: 420.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rozavel 10mg Tablet', genericName: 'Rosuvastatin (10mg)', price: 198.0, mrp: 230.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Lipaglyn 4mg Tablet', genericName: 'Saroglitazar (4mg)', price: 395.0, mrp: 450.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Fenolip 145mg Tablet', genericName: 'Fenofibrate Nanoparticles (145mg)', price: 195.0, mrp: 225.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ecosprin 75mg Gastro-resistant Tablet', genericName: 'Aspirin (75mg)', price: 8.5, mrp: 10.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Ecosprin 150mg Tablet', genericName: 'Aspirin (150mg)', price: 12.0, mrp: 14.5, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Clopilet 75mg Tablet', genericName: 'Clopidogrel (75mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },

  // 136-160: Antidiabetic Medications
  { name: 'Glycomet 500mg SR Tablet', genericName: 'Metformin Hydrochloride Prolonged Release (500mg)', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Glycomet 1g SR Tablet', genericName: 'Metformin Sustained Release (1000mg)', price: 65.0, mrp: 75.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Glycomet-GP 1 Forte Tablet', genericName: 'Glimepiride (1mg) + Metformin SR (1000mg)', price: 128.0, mrp: 145.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Glycomet-GP 2 Forte Tablet', genericName: 'Glimepiride (2mg) + Metformin SR (1000mg)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Amaryl 1mg Tablet', genericName: 'Glimepiride (1mg)', price: 95.0, mrp: 110.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Amaryl 2mg Tablet', genericName: 'Glimepiride (2mg)', price: 175.0, mrp: 200.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Januvia 100mg Tablet', genericName: 'Sitagliptin Phosphate (100mg)', price: 540.0, mrp: 620.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Janumet 50/500mg Tablet', genericName: 'Sitagliptin (50mg) + Metformin (500mg)', price: 485.0, mrp: 550.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Galvus 50mg Tablet', genericName: 'Vildagliptin (50mg)', price: 345.0, mrp: 395.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Galvus Met 50/500mg Tablet', genericName: 'Vildagliptin (50mg) + Metformin (500mg)', price: 395.0, mrp: 450.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Jalra 50mg Tablet', genericName: 'Vildagliptin (50mg)', price: 335.0, mrp: 380.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Teneliglip-M 20/500mg Tablet', genericName: 'Teneligliptin (20mg) + Metformin (500mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Zita Plus 20mg Tablet', genericName: 'Teneligliptin (20mg)', price: 125.0, mrp: 145.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Forxiga 10mg Tablet', genericName: 'Dapagliflozin Propanediol (10mg)', price: 680.0, mrp: 780.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Oxra 10mg Tablet', genericName: 'Dapagliflozin (10mg)', price: 320.0, mrp: 365.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Jardiance 25mg Tablet', genericName: 'Empagliflozin (25mg)', price: 790.0, mrp: 890.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Glucobay 50mg Tablet', genericName: 'Acarbose (50mg)', price: 185.0, mrp: 215.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Rybelsus 3mg Tablet', genericName: 'Oral Semaglutide (3mg)', price: 3200.0, mrp: 3500.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Trajenta 5mg Tablet', genericName: 'Linagliptin (5mg)', price: 685.0, mrp: 780.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Gemer 2 Tablet', genericName: 'Glimepiride (2mg) + Metformin (500mg) + Pioglitazone (15mg)', price: 215.0, mrp: 245.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Pioz 15mg Tablet', genericName: 'Pioglitazone (15mg)', price: 95.0, mrp: 110.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Volibo 0.2mg Tablet', genericName: 'Voglibose (0.2mg)', price: 115.0, mrp: 132.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Voglimac 0.3mg Tablet', genericName: 'Voglibose (0.3mg)', price: 125.0, mrp: 145.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Gluconorm-G 1 Forte Tablet', genericName: 'Glimepiride (1mg) + Metformin SR (1000mg)', price: 135.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Daonil 5mg Tablet', genericName: 'Glibenclamide (5mg)', price: 38.0, mrp: 45.0, category: 'all', isColdChain: false, requiresPrescription: true },

  // 161-175: Cold Chain Biologics & Insulins (Cold Vault Required)
  { name: 'Human Mixtard 30/70 40IU/ml Suspension (10ml)', genericName: 'Soluble Insulin (30%) + Isophane Insulin (70%)', price: 185.0, mrp: 210.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Human Actrapid 40IU/ml Injection (10ml)', genericName: 'Soluble Human Regular Insulin', price: 175.0, mrp: 200.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Lantus SoloStar Pen (3ml / 100IU/ml)', genericName: 'Insulin Glargine Recombinant (100IU/ml)', price: 780.0, mrp: 890.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Novorapid Flexpen (3ml / 100U/ml)', genericName: 'Insulin Aspart Fast Acting (100U/ml)', price: 890.0, mrp: 990.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Humalog KwikPen 100IU/ml', genericName: 'Insulin Lispro Solution', price: 920.0, mrp: 1050.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Tresiba FlexTouch Pen (3ml)', genericName: 'Insulin Degludec (100U/ml)', price: 1650.0, mrp: 1850.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Ryzodeg FlexTouch Pen (3ml)', genericName: 'Insulin Degludec (70%) + Insulin Aspart (30%)', price: 1750.0, mrp: 1980.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Lupisulin M 30/70 40IU/ml (10ml)', genericName: 'Biphasic Isophane Insulin Injection', price: 165.0, mrp: 190.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Clexane 40mg/0.4ml Prefilled Syringe', genericName: 'Enoxaparin Sodium Low Molecular Weight Heparin', price: 495.0, mrp: 560.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Clexane 60mg/0.6ml Syringe', genericName: 'Enoxaparin Sodium (60mg)', price: 690.0, mrp: 780.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Epofer 4000IU Injection', genericName: 'Recombinant Human Erythropoietin (4000IU)', price: 950.0, mrp: 1100.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Rabipur Rabies Vaccine Vial (1 Dose)', genericName: 'Inactivated Rabies Virus Antigens', price: 385.0, mrp: 430.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Rotarix Oral Vaccine (1.5ml)', genericName: 'Live Attenuated Human Rotavirus Strains', price: 1150.0, mrp: 1290.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Tetglob 250IU Pre-filled Syringe', genericName: 'Human Tetanus Immunoglobulin (250IU)', price: 680.0, mrp: 770.0, category: 'cold-chain', isColdChain: true, requiresPrescription: true },
  { name: 'Tetanus Toxoid Vaccine (0.5ml Ampoule)', genericName: 'Adsorbed Tetanus Vaccine (5Lf)', price: 18.0, mrp: 22.0, category: 'cold-chain', isColdChain: true, requiresPrescription: false },

  // 176-200: Respiratory, Allergy & Cough
  { name: 'Allegra 120mg Tablet', genericName: 'Fexofenadine Hydrochloride (120mg)', price: 195.0, mrp: 225.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Allegra 180mg Tablet', genericName: 'Fexofenadine Hydrochloride (180mg)', price: 245.0, mrp: 280.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Montair-LC Tablet', genericName: 'Montelukast Sodium (10mg) + Levocetirizine (5mg)', price: 295.0, mrp: 340.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Telekast-L Tablet', genericName: 'Montelukast (10mg) + Levocetirizine Dihydrochloride (5mg)', price: 285.0, mrp: 330.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Levocet-M Tablet', genericName: 'Levocetirizine (5mg) + Montelukast (10mg)', price: 165.0, mrp: 190.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Cetzine 10mg Tablet', genericName: 'Cetirizine Hydrochloride (10mg)', price: 21.0, mrp: 25.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Okacet 10mg Tablet', genericName: 'Cetirizine (10mg)', price: 22.0, mrp: 26.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Bilashine 20mg Tablet', genericName: 'Bilastine (20mg)', price: 198.0, mrp: 230.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Asthalin Inhaler (200 Metred Doses)', genericName: 'Salbutamol / Albuterol (100mcg/puff)', price: 165.0, mrp: 185.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Budecort 200 Inhaler (200 MDI)', genericName: 'Budesonide (200mcg/puff)', price: 420.0, mrp: 480.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Foracort 200 Inhaler (120 MDI)', genericName: 'Formoterol Fumarate (6mcg) + Budesonide (200mcg)', price: 540.0, mrp: 610.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Seroflo 250 Inhaler (120 MDI)', genericName: 'Salmeterol (25mcg) + Fluticasone Propionate (250mcg)', price: 740.0, mrp: 840.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Ascoril D Plus Cough Syrup (100ml)', genericName: 'Dextromethorphan (10mg) + Phenylephrine (5mg) + Chlorpheniramine (2mg)', price: 135.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Benadryl Cough Syrup (150ml)', genericName: 'Diphenhydramine (14.08mg) + Ammonium Chloride (138mg)', price: 145.0, mrp: 162.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Grilinctus-L Oral Suspension (100ml)', genericName: 'Levocloperastine Fendizoate (20mg/5ml)', price: 175.0, mrp: 198.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Alex Cough Syrup (100ml)', genericName: 'Dextromethorphan + Chlorpheniramine + Phenylephrine', price: 138.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Cheston Cold Tablet', genericName: 'Cetirizine (5mg) + Paracetamol (325mg) + Phenylephrine (10mg)', price: 48.0, mrp: 55.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Sinarest New Tablet', genericName: 'Paracetamol (500mg) + Phenylephrine (10mg) + Chlorpheniramine (2mg)', price: 65.0, mrp: 74.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Maxtra Oral Drops (15ml)', genericName: 'Phenylephrine (2.5mg) + Chlorpheniramine Maleate (1mg)', price: 82.0, mrp: 95.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Otrivin Adult Nasal Spray (10ml)', genericName: 'Xylometazoline Hydrochloride (0.1% w/v)', price: 110.0, mrp: 125.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Nasivion Classic Adult Nasal Spray (10ml)', genericName: 'Oxymetazoline Hydrochloride (0.05%)', price: 105.0, mrp: 120.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Deriphyllin Retard 150mg Tablet', genericName: 'Theophylline (115mg) + Etofylline (35mg)', price: 32.0, mrp: 38.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Flomist Nasal Spray (100 MDI)', genericName: 'Fluticasone Propionate (50mcg/spray)', price: 395.0, mrp: 450.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Koflet-H Ginger Lozenges (Box of 100)', genericName: 'Herbal Honey & Clove Cough Formulation', price: 195.0, mrp: 220.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Strepsils Orange Lozenges (Strip of 8)', genericName: 'Dichlorobenzyl Alcohol + Amylmetacresol', price: 38.0, mrp: 42.0, category: 'all', isColdChain: false, requiresPrescription: false },

  // 201-225: Dermatology, Vitamins, Supplements & Schedule H Neuro
  { name: 'Becosules Z Capsule (Strip of 20)', genericName: 'Vitamin B-Complex + Vitamin C + Zinc Sulphate', price: 54.0, mrp: 62.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Shelcal 500mg Tablet (Strip of 15)', genericName: 'Elemental Calcium (500mg) + Vitamin D3 (250IU)', price: 135.0, mrp: 155.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Neurobion Forte Tablet (Strip of 30)', genericName: 'Vitamin B1 + B2 + B3 + B5 + B6 + B12', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Evion 400mg Capsule (Strip of 10)', genericName: 'Tocopheryl Acetate / Vitamin E (400mg)', price: 38.0, mrp: 44.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Zincovit Tablet (Strip of 15)', genericName: 'Multivitamins + Multi-minerals + Grape Seed Extract', price: 110.0, mrp: 125.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Uprise-D3 60K Capsule (Pack of 4)', genericName: 'Cholecalciferol / Vitamin D3 (60000IU)', price: 145.0, mrp: 168.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Calcirol Sachet (1g)', genericName: 'Cholecalciferol Granules (60000IU)', price: 48.0, mrp: 55.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Folvite 5mg Tablet (Strip of 45)', genericName: 'Folic Acid / Vitamin B9 (5mg)', price: 85.0, mrp: 98.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Orofer-XT Tablet (Strip of 10)', genericName: 'Ferrous Ascorbate (100mg) + Folic Acid (1.5mg)', price: 185.0, mrp: 215.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Dexorange Syrup (200ml)', genericName: 'Ferric Ammonium Citrate + Cyanocobalamin + Folic Acid', price: 165.0, mrp: 188.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Limcee 500mg Chewable Tablet (Orange)', genericName: 'Ascorbic Acid / Vitamin C (500mg)', price: 26.0, mrp: 30.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Celin 500mg Tablet (Strip of 25)', genericName: 'Vitamin C (500mg)', price: 42.0, mrp: 48.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Revital H Daily Health Supplement (30 Capsules)', genericName: 'Ginseng + 10 Vitamins + 9 Minerals', price: 345.0, mrp: 395.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Supradyn Daily Multivitamin Tablet', genericName: '12 Vitamins + 5 Trace Elements + Amino Acids', price: 58.0, mrp: 65.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Betnovate-N Cream (20g)', genericName: 'Betamethasone Valerate (0.1%) + Neomycin Sulphate (0.5%)', price: 58.0, mrp: 66.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Quadriderm RF Cream (10g)', genericName: 'Beclomethasone + Clotrimazole + Neomycin', price: 115.0, mrp: 130.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Candid-B Cream (20g)', genericName: 'Clotrimazole (1% w/w) + Beclomethasone Dipropionate (0.025%)', price: 165.0, mrp: 188.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'T-Bact 2% Ointment (15g)', genericName: 'Mupirocin Ointment USP (2% w/w)', price: 185.0, mrp: 212.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Soframycin Skin Cream (30g)', genericName: 'Framycetin Sulphate (1% w/w)', price: 68.0, mrp: 78.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Burnol Antiseptic Cream (20g)', genericName: 'Aminacrine HCl (0.1%) + Cetrimide (0.5%)', price: 75.0, mrp: 85.0, category: 'all', isColdChain: false, requiresPrescription: false },
  { name: 'Clindac-A Gel (20g)', genericName: 'Clindamycin Phosphate Topical Gel (1% w/w)', price: 195.0, mrp: 225.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Lulifin Cream (30g)', genericName: 'Luliconazole Cream (1% w/w)', price: 345.0, mrp: 395.0, category: 'all', isColdChain: false, requiresPrescription: true },
  { name: 'Alprax 0.5mg Tablet', genericName: 'Alprazolam (0.5mg)', price: 42.0, mrp: 48.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Nexito 10mg Tablet', genericName: 'Escitalopram Oxalate (10mg)', price: 115.0, mrp: 130.0, category: 'schedule-h', isColdChain: false, requiresPrescription: true },
  { name: 'Ciplox Eye Drops (10ml)', genericName: 'Ciprofloxacin Eye/Ear Drops (0.3% w/v)', price: 21.0, mrp: 24.5, category: 'all', isColdChain: false, requiresPrescription: true }
];

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('[Seed] Clearing existing collections (Reservations, Medicines, Users)...');
    await Reservation.deleteMany({});
    await Medicine.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Successfully purged existing collections.');

    // Pre-hash password 'password123' so all seeded accounts can authenticate seamlessly
    console.log('[Seed] Generating bcrypt hash for universal password: password123');
    const universalHashedPassword = await bcrypt.hash('password123', 10);

    // -------------------------------------------------------------------------
    // 1. CREATE ADMIN USER
    // -------------------------------------------------------------------------
    console.log('[Seed] Creating System Administrator account...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@pharmapath.com',
      password: 'password123', // Mongoose pre-save hook will hash it
      role: 'ADMIN',
      phone: '+91 99999 88888',
      city: 'New Delhi',
      address: 'Central Health Governance Bureau, Sansad Marg',
      isVerified: true
    });
    console.log(`[Seed] Admin created: ${adminUser.email} / password123`);

    // -------------------------------------------------------------------------
    // 2. CREATE 100 CUSTOMERS
    // -------------------------------------------------------------------------
    console.log('[Seed] Generating 100 realistic Indian Customer profiles...');
    const customerDocs = [];
    const usedCustomerEmails = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const firstName = INDIAN_FIRST_NAMES[i % INDIAN_FIRST_NAMES.length];
      const lastName = INDIAN_LAST_NAMES[Math.floor(Math.random() * INDIAN_LAST_NAMES.length)];
      const fullName = `${firstName} ${lastName}`;
      
      let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 40 ? i : ''}@gmail.com`;
      if (usedCustomerEmails.has(email)) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${faker.number.int({ min: 100, max: 999 })}@gmail.com`;
      }
      usedCustomerEmails.add(email);

      const metro = INDIAN_METROS[i % INDIAN_METROS.length];
      const area = metro.areas[Math.floor(Math.random() * metro.areas.length)];

      customerDocs.push({
        name: fullName,
        email,
        password: universalHashedPassword,
        role: 'CUSTOMER' as const,
        phone: `+91 ${faker.number.int({ min: 7000000000, max: 9999999999 })}`,
        city: metro.city,
        address: `${faker.number.int({ min: 1, max: 400 })}, ${area}, ${metro.city} - ${faker.number.int({ min: 110001, max: 700099 })}`,
        isVerified: true
      });
    }

    const createdCustomers = await User.insertMany(customerDocs);
    console.log(`[Seed] Successfully seeded ${createdCustomers.length} Customers.`);

    // -------------------------------------------------------------------------
    // 3. CREATE 70 PHARMACY OWNERS WITH REALISTIC GEOJSON
    // -------------------------------------------------------------------------
    console.log('[Seed] Generating 70 Pharmacy Owners with GeoJSON coordinates...');
    const pharmacyDocs = [];
    const usedPharmacyEmails = new Set<string>();

    for (let i = 0; i < 70; i++) {
      const metro = INDIAN_METROS[i % INDIAN_METROS.length];
      const area = metro.areas[i % metro.areas.length];
      const brand = PHARMACY_BRANDS[i % PHARMACY_BRANDS.length];
      const pharmacyName = `${brand} - ${area}`;
      
      const pharmacistFirstName = INDIAN_FIRST_NAMES[(i + 15) % INDIAN_FIRST_NAMES.length];
      const pharmacistLastName = INDIAN_LAST_NAMES[(i + 7) % INDIAN_LAST_NAMES.length];
      const ownerName = `Pharmacist ${pharmacistFirstName} ${pharmacistLastName}`;

      const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
      const areaSlug = area.toLowerCase().replace(/[^a-z0-9]/g, '');
      let email = `${brandSlug}.${areaSlug}.${i + 1}@pharmapath.test`;
      if (usedPharmacyEmails.has(email)) {
        email = `${brandSlug}.${areaSlug}.${faker.number.int({ min: 1000, max: 9999 })}@pharmapath.test`;
      }
      usedPharmacyEmails.add(email);

      // Add small realistic offset around city center (+/- ~0.08 degrees)
      const lngOffset = (Math.random() - 0.5) * 0.14;
      const latOffset = (Math.random() - 0.5) * 0.14;
      const longitude = Number((metro.center[0] + lngOffset).toFixed(6));
      const latitude = Number((metro.center[1] + latOffset).toFixed(6));

      const is24x7 = i % 5 === 0; // 20% are open 24 Hours
      const rating = Number((4.3 + Math.random() * 0.6).toFixed(1)); // 4.3 to 4.9

      pharmacyDocs.push({
        name: ownerName,
        pharmacyName,
        email,
        password: universalHashedPassword,
        role: 'PHARMACY' as const,
        phone: `+91 ${faker.number.int({ min: 8000000000, max: 9999999999 })}`,
        city: metro.city,
        address: `#${faker.number.int({ min: 10, max: 250 })}, Main Market Road, ${area}, ${metro.city} - ${faker.number.int({ min: 110001, max: 700099 })}`,
        licenseNumber: `DL-${metro.city.slice(0, 3).toUpperCase()}-2026-${faker.number.int({ min: 10000, max: 99999 })}`,
        isVerified: true,
        open24Hours: is24x7,
        closingTime: is24x7 ? 'Open 24/7' : (i % 2 === 0 ? '10:30 PM' : '11:00 PM'),
        rating,
        location: {
          type: 'Point' as const,
          coordinates: [longitude, latitude] // [lng, lat]
        }
      });
    }

    const createdPharmacies = await User.insertMany(pharmacyDocs);
    console.log(`[Seed] Successfully seeded ${createdPharmacies.length} Pharmacy Owners with GeoJSON locations.`);

    // -------------------------------------------------------------------------
    // 4. CREATE INVENTORY (15-30 RANDOM MEDICINES PER PHARMACY)
    // -------------------------------------------------------------------------
    console.log(`[Seed] Generating inventory for 70 pharmacies from master catalog of ${MASTER_MEDICINES.length} medicines...`);
    const inventoryDocs = [];

    const RACK_PREFIXES = ['Rack A', 'Rack B', 'Rack C', 'Rack D', 'Dispensing Bay', 'Cold Vault'];

    for (const pharmacy of createdPharmacies) {
      // Pick random number of medicines (15 to 30)
      const countToAssign = faker.number.int({ min: 15, max: 30 });
      
      // Shuffle master medicines and take first `countToAssign`
      const shuffled = [...MASTER_MEDICINES].sort(() => 0.5 - Math.random());
      const selectedMeds = shuffled.slice(0, countToAssign);

      for (const med of selectedMeds) {
        const stock = faker.number.int({ min: 8, max: 120 });
        const expiryMonth = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
        const expiryYear = faker.number.int({ min: 26, max: 29 });
        const expiryDate = `${expiryMonth}/${expiryYear}`;

        const rackPrefix = med.isColdChain
          ? 'Cold Vault #1'
          : `${RACK_PREFIXES[Math.floor(Math.random() * (RACK_PREFIXES.length - 1))]}-${faker.number.int({ min: 1, max: 18 })}`;

        inventoryDocs.push({
          name: med.name,
          genericName: med.genericName,
          price: med.price,
          mrp: med.mrp,
          stock,
          minStockAlert: 15,
          expiryDate,
          batchNumber: `BT-${faker.string.alphanumeric({ length: 4, casing: 'upper' })}-${faker.number.int({ min: 10, max: 99 })}`,
          rackLocation: rackPrefix,
          category: med.isColdChain ? 'cold-chain' : (stock < 15 ? 'low-stock' : 'all'),
          isColdChain: med.isColdChain,
          requiresPrescription: med.requiresPrescription,
          pharmacyId: pharmacy._id
        });
      }
    }

    console.log(`[Seed] Inserting ${inventoryDocs.length} Medicine SKUs into MongoDB...`);
    const createdMedicines = await Medicine.insertMany(inventoryDocs);
    console.log(`[Seed] Successfully inserted ${createdMedicines.length} Medicine SKUs across 70 pharmacies.`);

    // -------------------------------------------------------------------------
    // 5. SUMMARY TELEMETRY REPORT
    // -------------------------------------------------------------------------
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    const customerCount = await User.countDocuments({ role: 'CUSTOMER' });
    const pharmacyCount = await User.countDocuments({ role: 'PHARMACY' });
    const totalMedicines = await Medicine.countDocuments();
    const totalReservations = await Reservation.countDocuments();

    console.log('\n================================================================');
    console.log('✅ DATABASE SEED COMPLETE - SUMMARY TELEMETRY');
    console.log('================================================================');
    console.log(`Total Users in Database:       ${totalUsers}`);
    console.log(` - Admin Accounts:             ${adminCount}`);
    console.log(` - Customer Accounts:          ${customerCount}`);
    console.log(` - Verified Pharmacies:        ${pharmacyCount}`);
    console.log(`Total Medicine Inventory SKUs: ${totalMedicines}`);
    console.log(`Total Reservations:            ${totalReservations} (Fresh Queue)`);
    console.log('----------------------------------------------------------------');
    console.log('Universal Password for testing: password123');
    console.log('Admin Email:                   admin@pharmapath.com');
    console.log('Sample Pharmacy Email:         apollo.koramangala.1@pharmapath.test');
    console.log('Sample Customer Email:         aarav.sharma@gmail.com');
    console.log('================================================================\n');

  } catch (error) {
    console.error('[Seed Error]:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB Atlas.');
    process.exit(0);
  }
}

seed();
