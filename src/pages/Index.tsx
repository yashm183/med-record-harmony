
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PatientForm from "@/components/PatientForm";
import PatientTable from "@/components/PatientTable";
import QueryPanel from "@/components/QueryPanel";
import { Patient, PatientFormData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { initializeDb, savePatient, getAllPatients } from "@/lib/db";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("register");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize database and load patients
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await initializeDb();
        const loadedPatients = await getAllPatients();
        setPatients(loadedPatients);
      } catch (error) {
        console.error("Failed to load patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'db_updated') {
        try {
          const loadedPatients = await getAllPatients();
          setPatients(loadedPatients);
        } catch (error) {
          console.error("Failed to reload patients:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRegisterPatient = async (formData: PatientFormData) => {
    try {
      const newPatient: Patient = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      
      await savePatient(newPatient);
      
      // Update the local state
      setPatients((prevPatients) => [newPatient, ...prevPatients]);
      
      // Automatically switch to the patients tab after registration
      setActiveTab("patients");
    } catch (error) {
      console.error("Failed to register patient:", error);
      toast.error("Failed to register patient");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "register" && (
          <PatientForm onSubmit={handleRegisterPatient} />
        )}
        
        {activeTab === "patients" && (
          <PatientTable patients={patients} isLoading={isLoading} />
        )}
        
        {activeTab === "query" && (
          <QueryPanel />
        )}
      </main>
    </div>
  );
};

export default Index;
