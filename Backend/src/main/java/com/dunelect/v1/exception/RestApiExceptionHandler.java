package com.dunelect.v1.exception;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class RestApiExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException ex) {
		String message = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
		return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", message));
	}
}
