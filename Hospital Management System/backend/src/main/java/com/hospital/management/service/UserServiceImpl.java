package com.hospital.management.service;

import com.hospital.management.model.User;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(String name, String email, String password, String role) {
        User user = new User(name, email, password, role);
        return userRepository.save(user);
    }

    @Override
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return null;
        }
        
        if (!user.getPassword().equals(password)) {
            return null;
        }
        
        if (!user.getActive()) {
            return null;
        }
        
        return user;
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}

