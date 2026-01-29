package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.model.Doctor;
import com.hospital.management.service.DoctorService;
import com.hospital.management.util.RoleUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping
    public ResponseEntity<ApiResponse> createDoctor(@RequestBody Doctor doctor, HttpServletRequest request) {
        // Role-based access control: Only ADMIN can create doctors
        if (!RoleUtil.isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Access denied. Only ADMIN can create doctors."));
        }
        try {
            // Validate required fields
            if (doctor.getDoctorName() == null || doctor.getDoctorName().trim().isEmpty() ||
                doctor.getSpecialization() == null || doctor.getSpecialization().trim().isEmpty() ||
                doctor.getQualification() == null || doctor.getQualification().trim().isEmpty() ||
                doctor.getExperience() == null ||
                doctor.getContactNumber() == null || doctor.getContactNumber().trim().isEmpty() ||
                doctor.getEmail() == null || doctor.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "All fields are required"));
            }

            // Validate experience
            if (doctor.getExperience() < 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Experience cannot be negative"));
            }

            Doctor createdDoctor = doctorService.createDoctor(doctor);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Doctor created successfully", createdDoctor));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to create doctor: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllDoctors() {
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            return ResponseEntity.ok(new ApiResponse(true, "Doctors retrieved successfully", doctors));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to retrieve doctors: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDoctorById(@PathVariable Long id) {
        try {
            Optional<Doctor> doctor = doctorService.getDoctorById(id);
            if (doctor.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Doctor retrieved successfully", doctor.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Doctor not found or inactive"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to retrieve doctor: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor, HttpServletRequest request) {
        // Role-based access control: Only ADMIN can update doctors
        if (!RoleUtil.isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Access denied. Only ADMIN can update doctors."));
        }
        try {
            // Validate required fields
            if (doctor.getDoctorName() == null || doctor.getDoctorName().trim().isEmpty() ||
                doctor.getSpecialization() == null || doctor.getSpecialization().trim().isEmpty() ||
                doctor.getQualification() == null || doctor.getQualification().trim().isEmpty() ||
                doctor.getExperience() == null ||
                doctor.getContactNumber() == null || doctor.getContactNumber().trim().isEmpty() ||
                doctor.getEmail() == null || doctor.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "All fields are required"));
            }

            // Validate experience
            if (doctor.getExperience() < 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Experience cannot be negative"));
            }

            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            if (updatedDoctor != null) {
                return ResponseEntity.ok(new ApiResponse(true, "Doctor updated successfully", updatedDoctor));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Doctor not found or inactive"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to update doctor: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDoctor(@PathVariable Long id, HttpServletRequest request) {
        // Role-based access control: Only ADMIN can delete doctors
        if (!RoleUtil.isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Access denied. Only ADMIN can delete doctors."));
        }
        try {
            Optional<Doctor> doctorOptional = doctorService.getDoctorById(id);
            if (doctorOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Doctor not found or inactive"));
            }
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(new ApiResponse(true, "Doctor soft-deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to delete doctor: " + e.getMessage()));
        }
    }
}

