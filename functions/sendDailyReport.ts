"use server";

import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "@/lib/appwrite.config";
import { Query } from 'node-appwrite';
import { sendEmail } from '../lib/email'; // Import email function from email.ts

// Function to gather statistics for the daily report
async function getStatistics() {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

    // Fetch patients added today
    const patientResponse = await databases.listDocuments(
        DATABASE_ID!, 
        PATIENT_COLLECTION_ID!, 
        [
        Query.greaterThanEqual('addedAt', startOfDay),   
        Query.lessThanEqual('addedAt', endOfDay)
        ]
    );

    const totalPatients = patientResponse.total;   

    // Determine the most common reason for patient visits
    const reasons = patientResponse.documents.map((patient: any) => patient.reason);
    const commonReason = reasons.reduce((acc: string, reason: string, _, arr: string[]) =>
        arr.filter(r => r === reason).length > arr.filter(r => r === acc).length ? reason : acc
    );

    // Find the peak hour of patient visits
    const hours = patientResponse.documents.map((patient: any) => new Date(patient.addedAt).getHours());
    const peakHour = hours.reduce((acc: number, hour: number, _, arr: number[]) =>
        arr.filter(h => h === hour).length > arr.filter(h => h === acc).length ? hour : acc
    );

    // Fetch all doctors to send the email
    const doctorResponse = await databases.listDocuments(process.env.DATABASE_ID!, process.env.DOCTOR_COLLECTION_ID!);

    // Prepare and send emails to doctors
    const emailPromises = doctorResponse.documents.map(async (doctor: any) => {
        const emailBody = `Hello Dr. ${doctor.name},
        
        Here is the daily report for your clinic:
        
        - Total patients added today: ${totalPatients}
        - Most common reason for visit: ${commonReason}
        - Peak hour for patients: ${peakHour}:00
        
        Thank you,
        Doctors Club Team
        `;
        await sendEmail(doctor.email, 'Daily Patient Summary', emailBody);
    });

    await Promise.all(emailPromises);
}

// API handler to trigger the email function
export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        try {
            await getStatistics();
            res.status(200).send('Emails sent successfully');
        } catch (error) {
            res.status(500).send('Error: ' + error);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}