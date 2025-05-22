
import { tblrx, initDb } from '@vlcn.io/crsqlite-wasm';
import { Patient } from '@/types';

// Database initialization
let dbPromise: Promise<any> | null = null;

export const initializeDb = async () => {
  if (!dbPromise) {
    dbPromise = initDb('patient_registry.db');
    const db = await dbPromise;

    // Create patients table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        dateOfBirth TEXT NOT NULL,
        gender TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        medicalHistory TEXT,
        insuranceProvider TEXT,
        insuranceNumber TEXT,
        emergencyContact TEXT,
        emergencyPhone TEXT,
        createdAt TEXT NOT NULL
      )
    `);
  }

  return dbPromise;
};

// Get database instance
export const getDb = async () => {
  return await initializeDb();
};

// Save patient to database
export const savePatient = async (patient: Patient): Promise<void> => {
  const db = await getDb();
  await db.exec(`
    INSERT INTO patients (
      id, firstName, lastName, dateOfBirth, gender, email, phone, address, 
      medicalHistory, insuranceProvider, insuranceNumber, 
      emergencyContact, emergencyPhone, createdAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `, [
    patient.id, patient.firstName, patient.lastName, patient.dateOfBirth,
    patient.gender, patient.email, patient.phone, patient.address,
    patient.medicalHistory, patient.insuranceProvider, patient.insuranceNumber,
    patient.emergencyContact, patient.emergencyPhone, patient.createdAt
  ]);

  // Broadcast a custom event to notify other tabs about data change
  window.localStorage.setItem('db_updated', new Date().toISOString());
};

// Get all patients from database
export const getAllPatients = async (): Promise<Patient[]> => {
  const db = await getDb();
  const result = await db.execO(`SELECT * FROM patients ORDER BY createdAt DESC`);
  return result as Patient[];
};

// Execute custom SQL queries
export const executeQuery = async (query: string): Promise<any[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }
  
  try {
    const db = await getDb();
    const result = await db.execO(query);
    return result;
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
};
