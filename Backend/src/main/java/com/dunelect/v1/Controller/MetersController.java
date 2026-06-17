package com.dunelect.v1.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dunelect.v1.models.EnergyReadings;
import com.dunelect.v1.models.Meters;
import com.dunelect.v1.service.MeterService;
import com.dunelect.v1.service.impl.EnergyService;

@RestController  
@RequestMapping("/api/meters")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class MetersController {

	@Autowired
	private MeterService meterService;
	@Autowired
	private EnergyService energyService;

	@GetMapping("/{id}") //Done
	public Meters getMeterById(@PathVariable int id) {
		return meterService.getMeterById(id);

	}

	@GetMapping({"/",""})  //Done
	public List<Meters> getAllMeters() {
		return meterService.getAllMeters();
	}

	@GetMapping("/{meterId}/{day}/peak-hour-by-day")  //Done
	public Entry<Integer, Double> getPeakHourByDate(@PathVariable Integer meterId,@PathVariable LocalDate date) {
		return energyService.getPeakHourByDate(meterId,date);
	}
	
	@GetMapping("/{meterId}/peak-hour")  //Done
	public Entry<Integer, Double> getPeakHour(@PathVariable Integer meterId) {
		return energyService.getPeakHour(meterId);
	}
	
	@PostMapping({"/",""}) //Done
	public ResponseEntity<Meters> createMeter(@RequestBody Meters meter) {
		return new ResponseEntity<>(meterService.createMeter(meter), HttpStatus.CREATED);
	}

	@PutMapping("/{meterId}/inject-spike")  //Done
	public ResponseEntity<EnergyReadings> injectSpike(@PathVariable Integer meterId, @RequestParam double value, @RequestParam String timestamp) {
		return new ResponseEntity<>(energyService.injectSpike(meterId, value, timestamp), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")  //Done
	public ResponseEntity<Meters> updateMeter(@RequestBody Meters meter, @PathVariable int id) {
		return ResponseEntity.ok(meterService.updateMeter(meter, id));
	}

	@DeleteMapping("/{id}") //Done
	public ResponseEntity<String> deleteMeter(@PathVariable int id) {
		meterService.deleteMeter(id);
		return ResponseEntity.ok("Meter entity deleted Successfully");
	}
}
