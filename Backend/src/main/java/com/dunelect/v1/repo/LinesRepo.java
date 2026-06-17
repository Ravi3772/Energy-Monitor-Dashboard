package com.dunelect.v1.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dunelect.v1.models.Lines;

public interface LinesRepo extends JpaRepository<Lines, Integer> {

}
