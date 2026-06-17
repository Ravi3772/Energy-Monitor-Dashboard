package com.dunelect.v1.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dunelect.v1.exception.ResourceNotFoundException;
import com.dunelect.v1.models.Meters;
import com.dunelect.v1.repo.MetersRepo;
import com.dunelect.v1.service.MeterService;


@Service
public class MeterServiceImpl implements MeterService {

	@Autowired
	private MetersRepo metersRepo;

	@Override
	public Meters getMeterById(int id) {
		return metersRepo.findByIdWithLine(id)
				.orElseThrow(() -> new ResourceNotFoundException("Meters", "id", id));
	}

	@Override
	public List<Meters> getAllMeters() {
		return metersRepo.findAllWithLine();
	}

	@Override
	public Meters createMeter(Meters meter) {
		return metersRepo.save(meter);
	}

	@Override
	public Meters updateMeter(Meters meter, int id) {
		Meters m= metersRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Meters", "id", id));
		m.setCreatedAt(meter.getCreatedAt());
		m.setLine(meter.getLine());
		m.setMeterCode(meter.getMeterCode());
		m.setStatus(meter.getStatus());
		return metersRepo.save(m);
	}

	@Override
	public void deleteMeter(int id) {
		Meters m= metersRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Meters", "id", id));
		metersRepo.delete(m);
	}

}
