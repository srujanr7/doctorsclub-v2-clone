"use server";

import { ID, Query } from "node-appwrite";
import { DATABASE_ID, databases, DOCTOR_COLLECTION_ID } from "../appwrite.config";
import { parseStringify } from "../utils";

interface createDoctorProfile {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;   
  doctorName: string;    
  specialty: string;           
  email: string;
  doctorId: string;
}

export const addDoctor = async ({
  clinicName,
  clinicAddress,
  clinicPhone,
  doctorName,
  specialty,
  email,
  doctorId,
}: createDoctorProfile) => {
  try {
    const newDoctor = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      ID.unique(),
      {
        clinicName,
        clinicAddress,
        clinicPhone,
        doctorName,
        specialty,
        email,
        doctorId,
      }
    );

    return newDoctor ;      
  } catch (error) {
    console.error("Error adding doctor :", error);
    throw error; 
  }
};   


export const getDoctorById = async (doctorId: string) => {
  try {
    const doctor = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      [Query.equal('doctorId', doctorId)]
    );

    if (doctor.total === 0) {
      throw new Error('Doctor not found');
    }

    return doctor.documents[0]; // Assuming doctorId is unique and only one document is returned
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    throw error;
  }
};   

export const getAllDoctors = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!  
    );
 
    if (response.total === 0) {
      throw new Error("No doctors found");
    }  

    return response.documents; // Return all the doctor documents  
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getAllDoctorsPaginated = async (page = 1, limit = 9) => {
  try {
    // Calculate the offset based on the page number
    const offset = (page - 1) * limit;

    const response = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,  
      [
        Query.limit(limit), // Set the limit of documents to fetch
        Query.offset(offset), // Skip the documents for previous pages
      ]
    );

    // Return doctors list and total pages based on the total count of documents
    return {
      doctorsList: response.documents,
      totalPages: Math.ceil(response.total / limit),
    };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};   