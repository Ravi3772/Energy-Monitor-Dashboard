package com.dunelect.v1.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dunelect.v1.auth.dto.CreateOperatorRequest;
import com.dunelect.v1.auth.dto.OperatorAccountResponse;
import com.dunelect.v1.service.impl.AdminOperatorService;

@RestController
@RequestMapping("/api/admin/operators")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminOperatorController {

	private final AdminOperatorService adminOperatorService;

	public AdminOperatorController(AdminOperatorService adminOperatorService) {
		this.adminOperatorService = adminOperatorService;
	}

	@PostMapping
	public ResponseEntity<OperatorAccountResponse> create(@RequestBody CreateOperatorRequest body) {
		OperatorAccountResponse created = adminOperatorService.createOperator(body);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping
	public List<OperatorAccountResponse> list() {
		return adminOperatorService.listOperators();
	}
}
