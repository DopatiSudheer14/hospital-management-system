package com.hospital.management.service;

import com.hospital.management.model.Patient;
import com.hospital.management.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Patient createPatient(Patient patient) {
        patient.setActive(true);
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findByActiveTrue();
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findByIdAndActiveTrue(id)
                .orElse(null);
    }

    @Override
    public Patient updatePatient(Long id, Patient patient) {
        Patient existingPatient = patientRepository.findByIdAndActiveTrue(id)
                .orElse(null);
        
        if (existingPatient == null) {
            return null;
        }
        
        existingPatient.setPatientName(patient.getPatientName());
        existingPatient.setGender(patient.getGender());
        existingPatient.setAge(patient.getAge());
        existingPatient.setBloodGroup(patient.getBloodGroup());
        existingPatient.setContactNumber(patient.getContactNumber());
        existingPatient.setAddress(patient.getAddress());
        
        return patientRepository.save(existingPatient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findByIdAndActiveTrue(id)
                .orElse(null);
        
        if (patient != null) {
            patient.setActive(false);
            patientRepository.save(patient);
        }
    }
}

