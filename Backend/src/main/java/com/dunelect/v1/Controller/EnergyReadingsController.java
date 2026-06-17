package com.dunelect.v1.Controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.dunelect.v1.models.EnergyReadings;
import com.dunelect.v1.service.EnergyReadingsService;
import com.dunelect.v1.service.impl.EnergyService;

@RestController   
@RequestMapping("/api/energyReadings")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class EnergyReadingsController {
	
	@Autowired
	private EnergyReadingsService energyReadingsService;
	@Autowired
	private EnergyService energyService;
	@GetMapping("/{id}") //Done
	public EnergyReadings getEnergyReadingById(@PathVariable int id) {
		return energyReadingsService.getEnergyReadingById(id);
		
	}
	
	
	@GetMapping({"","/"}) //Done
	public List<EnergyReadings> getAllEnergyReadings(){
		return energyReadingsService.getAllEnergyReadings();
	}
	
	@GetMapping("/lineTotal/{id}")
	public Double getLineTotal(@PathVariable Integer id){
		return energyService.getLineTotals(id);
	}	
	@PostMapping({"","/"}) //Done
	public ResponseEntity<EnergyReadings> createEnergyReading(@RequestBody EnergyReadings reading){
		return new ResponseEntity<>(energyReadingsService.createEnergyReading(reading),HttpStatus.CREATED);
	}
	
	@PutMapping("/{id}") //Done
	public ResponseEntity<EnergyReadings> updateEnergyReading(@RequestBody EnergyReadings reading,@PathVariable int id){
		return ResponseEntity.ok(energyReadingsService.updateEnergyReading(reading,id));
	}
	
	@DeleteMapping("/{id}") //Done
	public ResponseEntity<String> deleteEnergyReading(@PathVariable int id){
		energyReadingsService.deleteEnergyReading(id);
		return ResponseEntity.ok("Energy Readings entity deleted Successfully");
	}
}
