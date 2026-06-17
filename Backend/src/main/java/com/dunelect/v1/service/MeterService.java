package com.dunelect.v1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dunelect.v1.models.Meters;

@Service
public interface MeterService {

	Meters getMeterById(int id);

	List<Meters> getAllMeters();

	Meters createMeter(Meters meter);
	
	Meters updateMeter(Meters meter,int id);
	
	void deleteMeter(int id);
}
