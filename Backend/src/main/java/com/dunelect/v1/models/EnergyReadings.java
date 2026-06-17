package com.dunelect.v1.models;

import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "energy_readings")
public class EnergyReadings {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "reading_id")
	private Integer readingId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "meter_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reading_meter"))
	@JsonBackReference
	private Meters meter;

	@Column(name = "kwh", nullable = false)
	private Double kwh;

	@Column(name = "time_stamp", nullable = false) 
	private LocalDateTime timeStamp;

	public Integer getReadingId() {
		return readingId;
	}

	public void setReadingId(Integer readingId) {
		this.readingId = readingId;
	}

	public Meters getMeter() {
		return meter;
	}

	public void setMeter(Meters meter) {
		this.meter = meter;
	}

	public Double getKwh() {
		return kwh;
	}

	public void setKwh(Double kwh) {
		this.kwh = kwh;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof EnergyReadings))
			return false;
		EnergyReadings other = (EnergyReadings) o;
		return readingId != null && readingId.equals(other.readingId);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(readingId);
	}

	@Override
	public String toString() {
		return "EnergyReadings[readingId=" + readingId + ", meter=" + (meter != null ? meter.getMeterId() : null)
				+ ", kwh=" + kwh + ", timeStamp=" + timeStamp + "]";
	}
}
