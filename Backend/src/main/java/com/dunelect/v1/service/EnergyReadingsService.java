package com.dunelect.v1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dunelect.v1.models.EnergyReadings;

@Service
public interface EnergyReadingsService {

	EnergyReadings getEnergyReadingById(int id);

	List<EnergyReadings> getAllEnergyReadings();
	
	EnergyReadings createEnergyReading(EnergyReadings reading);

	EnergyReadings updateEnergyReading(EnergyReadings reading, int id);

	void deleteEnergyReading(int id);
	
}
