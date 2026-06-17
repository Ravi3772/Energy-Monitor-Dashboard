package com.dunelect.v1.models;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "line")
public class Lines {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "line_id")
	private Integer lineId;

	@Column(name = "line_name", nullable = false, length = 100)
	private String lineName;

	@Column(name = "location", nullable = false, length = 150)
	private String location;

	@OneToMany(fetch = FetchType.LAZY,mappedBy = "line", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<Meters> meters = new ArrayList<>();

	public void addMeter(Meters m) {
		meters.add(m);
		m.setLine(this);
	}

	public void removeMeter(Meters m) {
		meters.remove(m);
		m.setLine(null);
	}

	public Integer getLineId() {
		return lineId;
	}

	public void setLineId(Integer lineId) {
		this.lineId = lineId;
	}

	public String getLineName() {
		return lineName;
	}

	public void setLineName(String lineName) {
		this.lineName = lineName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public List<Meters> getMeters() {
		return meters;
	}

	public void setMeters(List<Meters> meters) {
		this.meters = meters;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Lines))
			return false;
		Lines other = (Lines) o;
		return lineId != null && lineId.equals(other.lineId);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(lineId);
	}
}
