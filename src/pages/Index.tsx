
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PatientForm from "@/components/PatientForm";
import PatientTable from "@/components/PatientTable";
import QueryPanel from "@/components/QueryPanel";
import { Patient, PatientFormData } from "@/types";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("register");
  const [patients, setPatients] = useState<Patient[]>([]);

  // Load patients from localStorage on initial render
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (error) {
        console.error("Failed to parse patients from localStorage:", error);
      }
    }
  }, []);

  // Save patients to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const handleRegisterPatient = (formData: PatientFormData) => {
    const newPatient: Patient = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    
    // Automatically switch to the patients tab after registration
    setActiveTab("patients");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "register" && (
          <PatientForm onSubmit={handleRegisterPatient} />
        )}
        
        {activeTab === "patients" && (
          <PatientTable patients={patients} />
        )}
        
        {activeTab === "query" && (
          <QueryPanel />
        )}
      </main>
    </div>
  );
};

export default Index;
