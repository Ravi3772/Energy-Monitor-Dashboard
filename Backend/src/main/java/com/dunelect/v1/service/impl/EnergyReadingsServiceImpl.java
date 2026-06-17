package com.dunelect.v1.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dunelect.v1.exception.ResourceNotFoundException;
import com.dunelect.v1.models.EnergyReadings;
import com.dunelect.v1.repo.EnergyReadingsRepo;
import com.dunelect.v1.service.EnergyReadingsService;

@Service
public class EnergyReadingsServiceImpl implements EnergyReadingsService {
	
	@Autowired
	private EnergyReadingsRepo energyReadingsRepo;

	@Override
	public EnergyReadings getEnergyReadingById(int id) {
		return energyReadingsRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("EnergyReadings", "id", id));
	}

	@Override
	public List<EnergyReadings> getAllEnergyReadings() {
		return energyReadingsRepo.findAll();
	}

	@Override
	public EnergyReadings createEnergyReading(EnergyReadings reading) {
		return energyReadingsRepo.save(reading);
	}

	@Override
	public EnergyReadings updateEnergyReading(EnergyReadings reading, int id) {
		EnergyReadings e = energyReadingsRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("EnergyReadings", "id", id));
		e.setKwh(reading.getKwh());
		e.setMeter(reading.getMeter());
		return energyReadingsRepo.save(e);

	}

	@Override
	public void deleteEnergyReading(int id) {
		energyReadingsRepo.delete(getEnergyReadingById(id));

	}

}
