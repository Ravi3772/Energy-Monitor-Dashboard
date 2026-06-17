package com.dunelect.v1.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dunelect.v1.auth.dto.CreateOperatorRequest;
import com.dunelect.v1.auth.dto.OperatorAccountResponse;
import com.dunelect.v1.models.AppRole;
import com.dunelect.v1.models.AppUser;
import com.dunelect.v1.repo.AppUserRepository;

@Service
public class AdminOperatorService {

	private static final int MIN_PASSWORD_LENGTH = 8;
	private static final int MAX_USERNAME_LENGTH = 80;

	private final AppUserRepository users;
	private final PasswordEncoder passwordEncoder;

	public AdminOperatorService(AppUserRepository users, PasswordEncoder passwordEncoder) {
		this.users = users;
		this.passwordEncoder = passwordEncoder;
	}

	public OperatorAccountResponse createOperator(CreateOperatorRequest req) {
		if (req.username() == null || req.username().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required.");
		}
		if (req.password() == null || req.password().length() < MIN_PASSWORD_LENGTH) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Password must be at least " + MIN_PASSWORD_LENGTH + " characters.");
		}

		String username = req.username().trim().toLowerCase();
		if (username.length() > MAX_USERNAME_LENGTH) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is too long.");
		}
		if (!username.matches("^[a-z0-9._-]+$")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Username may only contain letters, digits, dot, underscore, and hyphen.");
		}

		if (users.existsByUsernameIgnoreCase(username)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "That username is already taken.");
		}

		AppUser u = new AppUser();
		u.setUsername(username);
		u.setPasswordHash(passwordEncoder.encode(req.password()));
		u.setRole(AppRole.OPERATOR);
		users.save(u);

		return new OperatorAccountResponse(u.getUsername(), "operator");
	}

	public List<OperatorAccountResponse> listOperators() {
		return users.findAllByRoleOrderByUsernameAsc(AppRole.OPERATOR).stream()
				.map(u -> new OperatorAccountResponse(u.getUsername(), "operator"))
				.toList();
	}
}
