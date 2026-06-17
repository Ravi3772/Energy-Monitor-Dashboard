package com.dunelect.v1.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "meters")
public class Meters {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "meter_id")
	private Integer meterId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "line_id", nullable = false, foreignKey = @ForeignKey(name = "fk_meter_line"))
	@JsonBackReference
	private Lines line;

	@Column(name = "meter_code", nullable = false, length = 50, unique = true)
	private String meterCode;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@OneToMany(mappedBy = "meter", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<EnergyReadings> readings = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.Active;

	public Integer getMeterId() {
		return meterId;
	}

	public void setMeterId(Integer meterId) {
		this.meterId = meterId;
	}

	public Lines getLine() {
		return line;
	}

	@JsonProperty("lineId")
	public Integer getLineId() {
		return line == null ? null : line.getLineId();
	}

	@JsonProperty("lineName")
	public String getLineName() {
		return line == null ? null : line.getLineName();
	}

	public void setLine(Lines line) {
		this.line = line;
	}

	public String getMeterCode() {
		return meterCode;
	}

	public void setMeterCode(String meterCode) {
		this.meterCode = meterCode;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public List<EnergyReadings> getReadings() {
		return readings;
	}

	public void setReadings(List<EnergyReadings> readings) {
		this.readings = readings;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public void addReading(EnergyReadings r) {
		readings.add(r);
		r.setMeter(this);
	}

	public void removeReading(EnergyReadings r) {
		readings.remove(r);
		r.setMeter(null);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Meters))
			return false;
		Meters other = (Meters) o;
		return meterId != null && meterId.equals(other.meterId);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(meterId);
	}

	@Override
	public String toString() {
		return "Meters[meterId=" + meterId + ", line=" + (line != null ? line.getLineId() : null) + ", meterCode="
				+ meterCode + ", createdAt=" + createdAt + "]";
	}
}
