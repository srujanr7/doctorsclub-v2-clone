"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllDoctorsPaginated } from '@/lib/actions/doctor.actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AppointmentModal from "@/components/AppointmentModal";
import { useCoupons } from "@/context/CouponContext";

interface Doctor {
  $id: string;
  doctorName: string;   
  clinicAddress: string;
  clinicPhone: string;
  clinicName: string;
  specialty: string;
}

interface Coupon {
  title: string;
  discount: string;     
  code: string;
  link: string;
}

export const TabsDemo = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { coupons } = useCoupons();

  const fetchDoctors = async (page: number) => {
    setLoading(true);
    try {
      const { doctorsList, totalPages } = await getAllDoctorsPaginated(page);
      const newDoctors: Doctor[] = doctorsList as unknown as Doctor[];

      setDoctors((prevDoctors) => {  
        const filteredDoctors = newDoctors.filter(
          (newDoctor) => !prevDoctors.some((doc) => doc.$id === newDoctor.$id)
        );
        return [...prevDoctors, ...filteredDoctors];
      });
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
    setLoading(false);
  };

  const lastDoctorElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchDoctors(page);
  }, [page]);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  const handleBookNow = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      <Tabs defaultValue="doctors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <div className="grid grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <Card
                key={doctor.$id}
                ref={index === doctors.length - 1 ? lastDoctorElementRef : null}
                className="bg-white shadow-md rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 h-64"
                onClick={() => handleDoctorClick(doctor)}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-black font-bold">Dr. {doctor.doctorName}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{doctor.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-64">
                  <p className="text-sm text-gray-500"><strong>Phone:</strong> {doctor.clinicPhone}</p>
                  <p className="text-sm text-gray-500"><strong>Clinic:</strong> {doctor.clinicName}</p>
                  <p className="text-sm text-gray-500"><strong>Clinic Address:</strong> {doctor.clinicAddress}</p>
                </CardContent>
              </Card>
            ))}   
          </div>
          {loading && <p>Loading...</p>}
          {!hasMore && <p>No more doctors available.</p>}
        </TabsContent>
        <TabsContent value="offers">
        <h2 className="mt-6 text-xl font-semibold">Your Offers:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="font-bold">{coupon.title}</h3>
                <p>{coupon.discount}</p>
                {coupon.code && <p className="mt-2 text-sm text-green-600">{coupon.code}</p>}
                <a href={coupon.link} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-600 hover:underline block">
                  Shop Now
                </a>
              </div>
            ))
          ) : (
            <p>No coupons available.</p>
          )}
        </div>
      </TabsContent>   
    {/* Other tab contents can be added here */}
  </Tabs>   

  {selectedDoctor && (
    <Dialog open={true} onOpenChange={handleCloseModal}>
      <DialogContent className="w-[80%] max-w-4xl mt-18 h-auto max-h-[80vh] overflow-auto bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg text-black">{selectedDoctor.doctorName}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">{selectedDoctor.specialty}</DialogDescription>
        </DialogHeader>
        <div className="p-4 text-black">
          <p className="text-sm"><strong>Clinic Phone:</strong> {selectedDoctor.clinicPhone}</p>
          <p className="text-sm"><strong>Clinic Name:</strong> {selectedDoctor.clinicName}</p>
          <Button className="mt-2 bg-blue-700 text-white" onClick={handleBookNow}>Book Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  )}

  <AppointmentModal 
    open={isAppointmentModalOpen} 
    onClose={handleCloseAppointmentModal} 
    selectedDoctor={selectedDoctor}    
  />
</>
); };
       
export default TabsDemo;
