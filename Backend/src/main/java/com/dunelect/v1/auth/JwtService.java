package com.dunelect.v1.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dunelect.v1.models.AppRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final String secret;
	private final long expirationMs;

	public JwtService(
			@Value("${dunelect.jwt.secret}") String secret,
			@Value("${dunelect.jwt.expiration-ms}") long expirationMs) {
		this.secret = secret;
		this.expirationMs = expirationMs;
	}

	private SecretKey signingKey() {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(secret.getBytes(StandardCharsets.UTF_8));
			return Keys.hmacShaKeyFor(hash);
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException(e);
		}
	}

	public String generateToken(String username, AppRole role) {
		long now = System.currentTimeMillis();
		return Jwts.builder()
				.subject(username)
				.claim("role", role.name())
				.issuedAt(new Date(now))
				.expiration(new Date(now + expirationMs))
				.signWith(signingKey())
				.compact();
	}

	public Claims parseToken(String token) {
		return Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
