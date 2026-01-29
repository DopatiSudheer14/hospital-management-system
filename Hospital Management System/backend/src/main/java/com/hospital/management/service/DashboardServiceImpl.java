package com.hospital.management.service;

import com.hospital.management.dto.DashboardSummary;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.BillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillingRepository billingRepository;

    @Override
    public DashboardSummary getDashboardSummary() {
        // Count active patients
        Long totalPatients = patientRepository.countByActiveTrue();

        // Count active doctors
        Long totalDoctors = doctorRepository.countByActiveTrue();

        // Count active appointments
        Long totalAppointments = appointmentRepository.countByActiveTrue();

        // Count active billings
        Long totalBills = billingRepository.countByActiveTrue();

        // Get total revenue (sum of paid billings)
        Double totalRevenue = billingRepository.getTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }

        // Count pending payments
        Long pendingPayments = billingRepository.countPendingPayments();
        if (pendingPayments == null) {
            pendingPayments = 0L;
        }

        return new DashboardSummary(
            totalPatients,
            totalDoctors,
            totalAppointments,
            totalBills,
            totalRevenue,
            pendingPayments
        );
    }
}

