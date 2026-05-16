package com.samlego.backend.controller;

import com.samlego.backend.dto.UserProfileRequest;
import com.samlego.backend.model.User;
import com.samlego.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/store-info")
    public ResponseEntity<?> getStoreInfo() {
        User admin = userRepository.findByUsername("admin")
                .orElseGet(() -> userRepository.findAll().stream()
                        .filter(u -> u.getRole() == User.Role.ADMIN)
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Admin not found")));
        
        Map<String, String> info = new HashMap<>();
        info.put("accountNumber", admin.getAccountNumber());
        info.put("bankName", admin.getBankName());
        info.put("accountHolderName", admin.getAccountHolderName());
        info.put("qrCodeUrl", admin.getQrCodeUrl());
        
        return ResponseEntity.ok(info);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileRequest profileRequest, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileRequest.getFullName() != null) user.setFullName(profileRequest.getFullName());
        if (profileRequest.getPhone() != null) user.setPhone(profileRequest.getPhone());
        if (profileRequest.getAddress() != null) user.setAddress(profileRequest.getAddress());
        if (profileRequest.getAvatarUrl() != null) user.setAvatarUrl(profileRequest.getAvatarUrl());
        if (profileRequest.getQrCodeUrl() != null) user.setQrCodeUrl(profileRequest.getQrCodeUrl());
        if (profileRequest.getAccountNumber() != null) user.setAccountNumber(profileRequest.getAccountNumber());
        if (profileRequest.getBankName() != null) user.setBankName(profileRequest.getBankName());
        if (profileRequest.getAccountHolderName() != null) user.setAccountHolderName(profileRequest.getAccountHolderName());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
