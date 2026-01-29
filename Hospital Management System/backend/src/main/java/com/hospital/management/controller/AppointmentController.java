package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.Patient;
import com.hospital.management.model.Doctor;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            // Validate required fields
            if (request.getAppointmentDate() == null ||
                request.getAppointmentTime() == null || request.getAppointmentTime().trim().isEmpty() ||
                request.getReason() == null || request.getReason().trim().isEmpty() ||
                request.getPatientId() == null || request.getDoctorId() == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Appointment date, time, reason, patient ID, and doctor ID are required"));
            }

            // Validate patient exists
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElse(null);
            if (patient == null || !patient.getActive()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Patient not found or inactive"));
            }

            // Validate doctor exists
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElse(null);
            if (doctor == null || !doctor.getActive()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Doctor not found or inactive"));
            }

            // Validate status
            String status = request.getStatus();
            if (status == null || status.trim().isEmpty()) {
                status = "SCHEDULED";
            } else if (!status.equals("SCHEDULED") && 
                      !status.equals("COMPLETED") && 
                      !status.equals("CANCELLED")) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid status. Must be SCHEDULED, COMPLETED, or CANCELLED"));
            }

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setAppointmentTime(request.getAppointmentTime());
            appointment.setReason(request.getReason());
            appointment.setStatus(status);
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);

            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Appointment created successfully", createdAppointment));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to create appointment: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(new ApiResponse(true, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to retrieve appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAppointmentById(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            
            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Appointment not found"));
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Appointment retrieved successfully", appointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to retrieve appointment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        try {
            // Validate required fields
            if (request.getAppointmentDate() == null ||
                request.getAppointmentTime() == null || request.getAppointmentTime().trim().isEmpty() ||
                request.getReason() == null || request.getReason().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Appointment date, time, and reason are required"));
            }

            // Validate status if provided
            String status = request.getStatus();
            if (status != null && !status.trim().isEmpty() &&
                !status.equals("SCHEDULED") && 
                !status.equals("COMPLETED") && 
                !status.equals("CANCELLED")) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid status. Must be SCHEDULED, COMPLETED, or CANCELLED"));
            }

            // Get existing appointment
            Appointment existingAppointment = appointmentService.getAppointmentById(id);
            if (existingAppointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Appointment not found"));
            }

            // Update appointment
            Appointment appointment = new Appointment();
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setAppointmentTime(request.getAppointmentTime());
            appointment.setReason(request.getReason());
            appointment.setStatus(status != null && !status.trim().isEmpty() ? status : existingAppointment.getStatus());

            // Update patient if provided
            if (request.getPatientId() != null) {
                Patient patient = patientRepository.findById(request.getPatientId())
                        .orElse(null);
                if (patient == null || !patient.getActive()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Patient not found or inactive"));
                }
                appointment.setPatient(patient);
            } else {
                appointment.setPatient(existingAppointment.getPatient());
            }

            // Update doctor if provided
            if (request.getDoctorId() != null) {
                Doctor doctor = doctorRepository.findById(request.getDoctorId())
                        .orElse(null);
                if (doctor == null || !doctor.getActive()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Doctor not found or inactive"));
                }
                appointment.setDoctor(doctor);
            } else {
                appointment.setDoctor(existingAppointment.getDoctor());
            }

            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointment);
            
            if (updatedAppointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Appointment not found"));
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Appointment updated successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to update appointment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            
            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Appointment not found"));
            }
            
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(new ApiResponse(true, "Appointment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to delete appointment: " + e.getMessage()));
        }
    }
}

