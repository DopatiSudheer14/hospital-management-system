package com.hospital.management.service;

import com.hospital.management.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    
    Doctor createDoctor(Doctor doctor);
    
    List<Doctor> getAllDoctors();
    
    Optional<Doctor> getDoctorById(Long id);
    
    Doctor updateDoctor(Long id, Doctor doctorDetails);
    
    void deleteDoctor(Long id);
}

