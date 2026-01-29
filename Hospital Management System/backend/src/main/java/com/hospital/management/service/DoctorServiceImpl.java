package com.hospital.management.service;

import com.hospital.management.model.Doctor;
import com.hospital.management.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findByIdAndActiveTrue(id);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        return doctorRepository.findByIdAndActiveTrue(id).map(doctor -> {
            doctor.setDoctorName(doctorDetails.getDoctorName());
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setQualification(doctorDetails.getQualification());
            doctor.setExperience(doctorDetails.getExperience());
            doctor.setContactNumber(doctorDetails.getContactNumber());
            doctor.setEmail(doctorDetails.getEmail());
            return doctorRepository.save(doctor);
        }).orElse(null);
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.findByIdAndActiveTrue(id).ifPresent(doctor -> {
            doctor.setActive(false);
            doctorRepository.save(doctor);
        });
    }
}

