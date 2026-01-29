package com.hospital.management.service;

import com.hospital.management.model.Appointment;
import com.hospital.management.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Appointment createAppointment(Appointment appointment) {
        appointment.setActive(true);
        if (appointment.getStatus() == null || appointment.getStatus().trim().isEmpty()) {
            appointment.setStatus("SCHEDULED");
        }
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findByActiveTrue();
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findByIdAndActiveTrue(id)
                .orElse(null);
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRepository.findByIdAndActiveTrue(id)
                .orElse(null);
        
        if (existingAppointment == null) {
            return null;
        }
        
        existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        existingAppointment.setReason(appointment.getReason());
        existingAppointment.setStatus(appointment.getStatus());
        
        if (appointment.getPatient() != null) {
            existingAppointment.setPatient(appointment.getPatient());
        }
        
        if (appointment.getDoctor() != null) {
            existingAppointment.setDoctor(appointment.getDoctor());
        }
        
        return appointmentRepository.save(existingAppointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findByIdAndActiveTrue(id)
                .orElse(null);
        
        if (appointment != null) {
            appointment.setActive(false);
            appointmentRepository.save(appointment);
        }
    }
}

