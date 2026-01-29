package com.hospital.management.repository;

import com.hospital.management.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByActiveTrue();
    
    Optional<Appointment> findByIdAndActiveTrue(Long id);
    
    long countByActiveTrue();
    
    @Query(value = "SELECT DATE_FORMAT(a.appointment_date, '%Y-%m') as month, COUNT(a.id) as count " +
           "FROM appointments a WHERE a.active = true " +
           "GROUP BY DATE_FORMAT(a.appointment_date, '%Y-%m') " +
           "ORDER BY DATE_FORMAT(a.appointment_date, '%Y-%m')", nativeQuery = true)
    List<Object[]> getMonthlyAppointmentCountsRaw();
}

