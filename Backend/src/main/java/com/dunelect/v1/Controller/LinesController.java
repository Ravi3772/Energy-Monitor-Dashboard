package com.dunelect.v1.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dunelect.v1.models.Lines;
import com.dunelect.v1.service.LineService;
import com.dunelect.v1.service.impl.EnergyService;

@RestController   
@RequestMapping("/api/lines")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LinesController {

	@Autowired
	private LineService lineService;
	@Autowired
	private EnergyService energyService;
	
	

	
	@GetMapping({"","/"}) //Done
	public List<Lines> getAllLines() {
		return lineService.getAllLines();
	}

	@GetMapping("/{id}") //Done
	public Lines getLineById(@PathVariable int id) {
		return lineService.getLineById(id);

	}

	/** Lightweight line fields only (avoids serializing meters and nested readings). */
	@GetMapping("/{id}/meta")
	public Map<String, Object> getLineMeta(@PathVariable int id) {
		Lines l = lineService.getLineById(id);
		Map<String, Object> m = new HashMap<>();
		m.put("lineId", l.getLineId());
		m.put("lineName", l.getLineName());
		m.put("location", l.getLocation());
		return m;
	}


	@GetMapping("/{lineId}/{date}/daily-totals") //Done
	public Map<LocalDate, Double> getDailyTotals(@PathVariable Integer lineId,
			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return energyService.getDailyTotals(lineId, date);
	}

	@PostMapping({"","/"}) //Done
	public ResponseEntity<Lines> createLine(@RequestBody Lines line) {
		return new ResponseEntity<>(lineService.createLine(line), HttpStatus.CREATED);
	}

	@PutMapping("/{id}") //Done
	public ResponseEntity<Lines> updateLine(@RequestBody Lines line, @PathVariable int id) {
		return ResponseEntity.ok(lineService.updateLine(line, id));
	}

	@DeleteMapping("/{id}") //Done
	public ResponseEntity<String> deleteLine(@PathVariable int id) {
		lineService.deleteLine(id);
		return ResponseEntity.ok("Line entity deleted Successfully");
	}

	@GetMapping("/{lineId}/{year}/{month}/daily-totals-per-line")
	public Map<LocalDate, Double> getDailyTotalsPerLine(@PathVariable Integer lineId,
			@PathVariable Integer year,
			@PathVariable Integer month) {
		return energyService.getDailyTotalsPerLine(lineId, month, year);
	}
	
}
