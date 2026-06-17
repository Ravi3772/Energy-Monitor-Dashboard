package com.dunelect.v1.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dunelect.v1.models.AppRole;
import com.dunelect.v1.models.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

	Optional<AppUser> findByUsernameIgnoreCase(String username);

	boolean existsByUsernameIgnoreCase(String username);

	List<AppUser> findAllByRoleOrderByUsernameAsc(AppRole role);
}
