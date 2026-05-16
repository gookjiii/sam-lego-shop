package com.samlego.backend;

import com.samlego.backend.model.Category;
import com.samlego.backend.model.Product;
import com.samlego.backend.model.User;
import com.samlego.backend.repository.CategoryRepository;
import com.samlego.backend.repository.ProductRepository;
import com.samlego.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository, 
						   CategoryRepository categoryRepository,
						   ProductRepository productRepository,
						   PasswordEncoder passwordEncoder) {
		return args -> {
			// Initialize Admin
			if (userRepository.findByUsername("minhthu2009").isEmpty()) {
				User admin = new User();
				admin.setUsername("minhthu2009");
				admin.setPassword(passwordEncoder.encode("admin1104"));
				admin.setEmail("admin@samlego.com");
				admin.setFullName("SamLego Admin");
				admin.setRole(User.Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Default Admin account created: minhthu2009 / admin1104");
			}
		};
	}
}
