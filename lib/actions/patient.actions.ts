"use server";  

import { ID, Query } from "node-appwrite";
import { account, DATABASE_ID, databases, PATIENT_COLLECTION_ID, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

interface AddPatientParams { 
  name: string;    
  address: string;  
  phone: string;   
  reason: string;     
  notes: string;     // Add this line
  gender: "male" | "female" | "other"; // Add this line 
}

export type Gender = "male" | "female" | "other";

export interface createPatientProfile {
  name: string; 
  phone: string;
  address: string;
  birthDate: string; 
  gender: Gender;  // Use the Gender type
  allergies: string;
  pastMedicalHistory: string;
  familyMedicalHistory: string;
  currentMedication: string;
  email: string; // Ensure it's a string
  userId: string; // Clerk user ID  
}

export interface Patient {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date; // Expecting a Date object
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  privacyConsent: boolean;
} 


// CREATE USER AND SEND SMS AUTHENTICATION
export const createUser = async (user: { phone: string }) => {
  try {
    // Send SMS to initiate phone authentication
    const token = await account.createPhoneToken(ID.unique(), user.phone);
    return { userId: token.userId, phone: user.phone };
  } catch (error: any) {
    console.error("An error occurred during phone authentication:", error);
  }
};

// VERIFY PHONE LOGIN WITH OTP
export const verifyPhoneLogin = async (userId: string, secret: string) => {
  try {
    // Verify OTP and create a session
    const session = await account.createSession(userId, secret);
    return session;
  } catch (error: any) {
    console.error("An error occurred while verifying the phone number:", error);
  }
}; 

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    const parsedUser = parseStringify(user); 
 
    // Log the parsed user data
    console.log("Parsed user data:", parsedUser);

    return parsedUser; 
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  } 
};

export const registerPatient = async (patientData: {
  name: string;
  email: string;
  phone: string; // Phone number from the form
  userId: string; // UserId from query params
  gender: string; // Added gender
  birthDate: string; // Added birthdate
  address: string; // Added address
  allergies?: string;
}) => {
  try {
    // Make sure to replace with your actual database ID and collection ID
    const response = await databases.createDocument(
      DATABASE_ID!, // Replace with your actual database ID
      PATIENT_COLLECTION_ID!, // Replace with your actual collection ID
      ID.unique(), // Automatically generate a unique document ID
      {
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        userId: patientData.userId, 
        gender: patientData.gender, // New field  
        birthDate: patientData.birthDate, // New field  
        address: patientData.address, // New field
        allergies:patientData.allergies || "", 
      }
    );

    return response;
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error; // Throwing error for further handling in the caller
  }
};       

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!, 
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents);
  } catch (error) {
    console.error( 
      "An error occurred while retrieving the patient details:",
      error
    );
  }
}; 

export const getUserById = async (userId: string) => {
  try {
    // Ensure you're using the correct field name and Query.equal is used properly
    const user = await databases.listDocuments(
      DATABASE_ID!, 
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)] // 'userId' must match the field name in your database
    );
     
    if (user.total === 0) { 
      throw new Error("User not found");
    }
    
    return parseStringify(user.documents[0]); // Return the first document if userId is unique
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const addnewPatient = async ({
  name,
  phone,
  address,
  birthDate,
  gender,
  allergies,
  pastMedicalHistory,
  familyMedicalHistory,
  currentMedication,
  email,
  userId,
}: createPatientProfile) => {
  try {

    if (!userId) {
      throw new Error("User ID is required to create a patient profile.");
    }

    const addnew = await databases.createDocument(
      DATABASE_ID!,  // ID of your Appwrite database
      PATIENT_COLLECTION_ID!,  // Collection ID for patients
      ID.unique(),  // Unique ID for the document
      {
        name,
        phone,
        address,
        birthDate, 
        gender,
        allergies,
        pastMedicalHistory,
        familyMedicalHistory,
        currentMedication,
        email,
        userId,  // Clerk user ID for association
      }
    );

    return addnew; // Return the newly created patient document
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;  // Throw an error if document creation fails
  }
};



export const addPatient = async ({ name, address, phone, reason, notes, gender }: AddPatientParams, doctorId: string) => {
  try {
    const currentTime = new Date().toISOString(); 
  
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        address,
        phone,
        reason,
        notes, // Add notes to the document
        gender, // Add gender to the document
        doctorId,
        addedAt: currentTime,
      }
    );

    revalidatePath("/admin");

    return newPatient;
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
}; 

export const getPatientList = async (doctorId: string) => {
  try { 
    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [Query.equal("doctorId", doctorId)]);
    return parseStringify(patients); // Return the formatted response    
  } catch (error) {  
    console.error("Error fetching patient list:", error);
    throw error;
  }
}; 

export const getTodayPatients = async (doctorId: string) => {
  try {
    const now = new Date(); // Use UTC time
    const startOfDay = new Date(now.setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(now.setUTCHours(23, 59, 59, 999)).toISOString();

    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.equal("doctorId", doctorId),
        Query.greaterThanEqual("addedAt", startOfDay),
        Query.lessThanEqual("addedAt", endOfDay)  
      ]
    );

    return parseStringify(patients);
  } catch (error) {
    console.error("Error fetching today's patients:", error);
    throw error;
  }
};

// Fetch all patients for a specific doctor
export const getAllPatients = async (doctorId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.equal("doctorId", doctorId),
        Query.limit(1000),  
      ]
    );

    return parseStringify(patients);  
  } catch (error) {
    console.error("Error fetching all patients:", error);
    throw error;
  }
};  

export const getPatientsLast7Days = async (doctorId: string) => {    
  const today = new Date();
  const past7Days = new Date();
  past7Days.setDate(today.getDate() - 7);    

  const patients = await databases.listDocuments(
    DATABASE_ID!,
    PATIENT_COLLECTION_ID!,
    [
      Query.equal("doctorId", doctorId),
      Query.greaterThanEqual("addedAt", past7Days.toISOString()),
      Query.lessThanEqual("addedAt", today.toISOString())   
    ]
  );
  return parseStringify(patients);
};

export const getPatientDistributionByHour = async (doctorId: string) => {
  const today = new Date();
  const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)).toISOString();

  const patients = await databases.listDocuments(
    DATABASE_ID!,
    PATIENT_COLLECTION_ID!,
    [
      Query.equal("doctorId", doctorId),
      Query.greaterThanEqual("addedAt", startOfDay),
      Query.lessThanEqual("addedAt", endOfDay),
    ]
  );

  const distribution = Array(24).fill(0); // Initialize an array with 24 zeros (hours of the day)

  patients.documents.forEach((patient) => {
    const hour = new Date(patient.addedAt).getUTCHours();  
    distribution[hour]++;
  });

  return distribution.map((visits, hour) => ({
    hour,
    visits,
  }));
};

export const getVisitReasonDistribution = async (doctorId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("doctorId", doctorId)]
    );

    const reasonsCount: { [key: string]: number } = {};

    patients.documents.forEach((patient) => {
      const reason = patient.reason;
      reasonsCount[reason] = (reasonsCount[reason] || 0) + 1;
    });

    return Object.entries(reasonsCount).map(([reason, count]) => ({
      reason,
      count,
    }));
  } catch (error) {
    console.error("Error fetching visit reason distribution:", error);
    throw error;
  }
};     

export const getPatientByUserId = async (userId: string) => {
  try {
    // Query the database to fetch the patient with the matching userId
    const response = await databases.listDocuments(   
      DATABASE_ID!,  // Your Appwrite database ID
      PATIENT_COLLECTION_ID!,  // Patient collection ID
      [Query.equal("userId", userId)]  // Querying by userId
    );

    // Check if the patient record was found
    if (response.total > 0) {
      return response.documents[0]; // Return the first matching document
    } else {
      throw new Error("Patient not found");
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};     