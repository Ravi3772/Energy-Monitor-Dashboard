package com.dunelect.v1.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dunelect.v1.models.EnergyReadings;

@Repository
public interface EnergyReadingsRepo extends JpaRepository<EnergyReadings, Integer> {

	@Query(value = "SELECT m.line_id AS line_id, DATE(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) AS reading_date, SUM(r.kwh) AS total_kwh "
			+ "FROM energy_readings r " + "JOIN meters m ON r.meter_id = m.meter_id " + "WHERE m.line_id = :lineId "
			+ "  AND DATE(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) = :date "
			+ "GROUP BY m.line_id, reading_date", nativeQuery = true)
	List<Object[]> getDailyKWhByLineAndDate(@Param("lineId") Integer lineId, @Param("date") LocalDate date);

	@Query(value = "SELECT EXTRACT(HOUR FROM CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) AS hour, SUM(r.kwh) AS total "
			+ "FROM energy_readings r " + "WHERE r.meter_id = :meterId "
			+ "  AND DATE(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) = :date " + "GROUP BY hour "
			+ "ORDER BY total DESC", nativeQuery = true)
	List<Object[]> getPeakHourByMeterAndDate(@Param("meterId") Integer meterId, @Param("date") LocalDate date);

	@Query(value = "SELECT EXTRACT(HOUR FROM CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) AS hour, SUM(r.kwh) AS total "
			+ "FROM energy_readings r " + "WHERE r.meter_id = :meterId " + "GROUP BY hour "
			+ "ORDER BY total DESC", nativeQuery = true)
	List<Object[]> getPeakHourByMeter(@Param("meterId") Integer meterId);

	@Query(value = "SELECT COALESCE(SUM(e.kwh), 0) " + "FROM energy_readings e "
			+ "JOIN meters m ON m.meter_id = e.meter_id " + "JOIN line l   ON l.line_id   = m.line_id "
			+ "WHERE l.line_id = :lineId", nativeQuery = true)
	Double getLineTotal(@Param("lineId") Integer lineId);

	@Query(value = """
			SELECT DATE(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) AS reading_date,
			        SUM(r.kwh) AS total_kwh
			FROM energy_readings r
			JOIN meters m ON r.meter_id = m.meter_id
			WHERE m.line_id = :lineId
			AND YEAR(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) = :year
			AND MONTH(CONVERT_TZ(r.time_stamp, '+00:00', '+05:30')) = :month
			GROUP BY reading_date
			ORDER BY reading_date
			""", nativeQuery = true)
	List<Object[]> getDailyTotalsPerLine(@Param("lineId") Integer lineId, @Param("month") Integer month,
			@Param("year") Integer year);

	@Query("SELECT e FROM EnergyReadings e WHERE e.meter.meterId = :meterId AND e.timeStamp = :timeStamp")
	Optional<EnergyReadings> findByMeterIdAndTimeStamp(@Param("meterId") Integer meterId,
			@Param("timeStamp") LocalDateTime timeStamp);

}
