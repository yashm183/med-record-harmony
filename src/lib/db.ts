
import { PGlite } from '@electric-sql/pglite';
import { Patient } from '@/types';

// Initialize PGlite with IndexedDB storage
let dbPromise: Promise<PGlite> | null = null;

export const initializeDb = async (): Promise<PGlite> => {
  if (!dbPromise) {
    // Create a new PGlite instance using IndexedDB storage
    dbPromise = new PGlite({
      name: 'patient_registry',
      storage: 'indexeddb'
    }).connect();
    
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
export const getDb = async (): Promise<PGlite> => {
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
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
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
  const result = await db.exec<Patient>(`SELECT * FROM patients ORDER BY createdAt DESC`);
  return result.rows;
};

// Execute custom SQL queries
export const executeQuery = async (query: string): Promise<any[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }
  
  try {
    const db = await getDb();
    const result = await db.exec(query);
    return result.rows;
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
};
