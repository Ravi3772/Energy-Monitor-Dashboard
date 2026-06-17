package com.dunelect.v1.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dunelect.v1.repo.AppUserRepository;

@Service
public class AppUserDetailsService implements UserDetailsService {

	private final AppUserRepository users;

	public AppUserDetailsService(AppUserRepository users) {
		this.users = users;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return users.findByUsernameIgnoreCase(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}
}
