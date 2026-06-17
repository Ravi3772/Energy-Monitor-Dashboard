package com.dunelect.v1.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dunelect.v1.models.Meters;

public interface MetersRepo extends JpaRepository<Meters, Integer> {

	@Query("SELECT DISTINCT m FROM Meters m JOIN FETCH m.line")
	List<Meters> findAllWithLine();

	@Query("SELECT m FROM Meters m JOIN FETCH m.line WHERE m.meterId = :id")
	Optional<Meters> findByIdWithLine(@Param("id") int id);
}
