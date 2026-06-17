package com.dunelect.v1.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dunelect.v1.auth.JwtService;
import com.dunelect.v1.auth.dto.LoginRequest;
import com.dunelect.v1.auth.dto.LoginResponse;
import com.dunelect.v1.models.AppRole;
import com.dunelect.v1.models.AppUser;
import com.dunelect.v1.repo.AppUserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

	private final AppUserRepository users;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthController(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.users = users;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest req) {
		if (req.username() == null || req.username().isBlank()
				|| req.password() == null || req.role() == null || req.role().isBlank()) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "Username, password, and role are required."));
		}

		AppRole expectedRole;
		try {
			expectedRole = AppRole.valueOf(req.role().trim().toUpperCase());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "Role must be admin or operator."));
		}

		AppUser user = users.findByUsernameIgnoreCase(req.username().trim()).orElse(null);
		if (user == null || !passwordEncoder.matches(req.password(), user.getPassword())) {
			return ResponseEntity.status(401)
					.body(Map.of("message", "Invalid username or password."));
		}

		if (user.getRole() != expectedRole) {
			return ResponseEntity.status(403)
					.body(Map.of("message", "Selected role does not match this account."));
		}

		String token = jwtService.generateToken(user.getUsername(), user.getRole());
		return ResponseEntity.ok(new LoginResponse(token, "Bearer", user.getUsername(),
				user.getRole().name().toLowerCase()));
	}
}
