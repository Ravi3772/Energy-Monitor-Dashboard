package com.dunelect.v1.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dunelect.v1.exception.ResourceNotFoundException;
import com.dunelect.v1.models.EnergyReadings;
import com.dunelect.v1.repo.EnergyReadingsRepo;
import com.dunelect.v1.repo.MetersRepo;

@Service
public class EnergyService {

	@Autowired
	private MetersRepo metersRepo;
	@Autowired
	private EnergyReadingsRepo energyReadingsRepo;

	public EnergyReadings injectSpike(int meterId, double spikeValue, String timestamp) {
		LocalDateTime ts = timestamp != null ? LocalDateTime.parse(timestamp) : LocalDateTime.now();
		
		Optional<EnergyReadings> existing = energyReadingsRepo.findByMeterIdAndTimeStamp(meterId, ts);

		if (existing.isPresent()) {
			EnergyReadings spike = existing.get();
			spike.setKwh(spikeValue);
			return energyReadingsRepo.save(spike);
		} else {
			EnergyReadings spike = new EnergyReadings();
			spike.setMeter(metersRepo.findById(meterId)
					.orElseThrow(() -> new ResourceNotFoundException("Meters", "id", meterId)));
			spike.setKwh(spikeValue);
			spike.setTimeStamp(ts);
			return energyReadingsRepo.save(spike);
		}
	}

	public Map<LocalDate, Double> getDailyTotals(Integer lineId, LocalDate date) {
		List<Object[]> results = energyReadingsRepo.getDailyKWhByLineAndDate(lineId, date);
		Map<LocalDate, Double> totals = new HashMap<>();
		for (Object[] row : results) {
			LocalDate readingDate = (LocalDate) row[1];
			Double totalKwh = ((Number) row[2]).doubleValue();

			totals.put(readingDate, totalKwh);
		}
		return totals;
	}

	public Map.Entry<Integer, Double> getPeakHourByDate(Integer meterId, LocalDate date) {
		List<Object[]> results = energyReadingsRepo.getPeakHourByMeterAndDate(meterId, date);
		if (results.isEmpty()) {
			return null;
		}
		Object[] row = results.get(0);
		Integer hour = ((Number) row[0]).intValue();
		Double kwh = ((Number) row[1]).doubleValue();
		return Map.entry(hour, kwh);
	}

	public Map.Entry<Integer, Double> getPeakHour(Integer meterId) {
		List<Object[]> results = energyReadingsRepo.getPeakHourByMeter(meterId);
		if (results.isEmpty()) {
			return null;
		}
		Object[] row = results.get(0);
		Integer hour = ((Number) row[0]).intValue();
		Double kwh = ((Number) row[1]).doubleValue();
		return Map.entry(hour, kwh);
	}

	public Double getLineTotals(Integer lineId) {
		return energyReadingsRepo.getLineTotal(lineId);
	}

	public Map<LocalDate, Double> getDailyTotalsPerLine(Integer lineId, Integer month, Integer year) {
		List<Object[]> results = energyReadingsRepo.getDailyTotalsPerLine(lineId, month, year);
		Map<LocalDate, Double> totals = new HashMap<>();

		for (Object[] row : results) {
			Object dateObj = row[0];
			LocalDate readingDate;

			if (dateObj instanceof java.sql.Date) {
				readingDate = ((java.sql.Date) dateObj).toLocalDate();
			} else if (dateObj instanceof LocalDate) {
				readingDate = (LocalDate) dateObj;
			} else {
				throw new IllegalStateException("Unexpected date type: " + dateObj.getClass());
			}

			Double totalKwh = ((Number) row[1]).doubleValue();
			totals.put(readingDate, totalKwh);
		}

		return totals;
	}
}
