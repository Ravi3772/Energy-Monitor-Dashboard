package com.dunelect.v1.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dunelect.v1.exception.ResourceNotFoundException;
import com.dunelect.v1.models.Lines;
import com.dunelect.v1.repo.*;
import com.dunelect.v1.service.LineService;


@Service
public class LineServiceImpl implements LineService {

	@Autowired
	private LinesRepo linesRepo;

	@Override
	public Lines getLineById(int id) {
		return linesRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lines", "id", id));
	}

	@Override
	public List<Lines> getAllLines() {
		return linesRepo.findAll();
	}

	@Override
	public Lines createLine(Lines line) {
		return linesRepo.save(line);
	}

	@Override
	public Lines updateLine(Lines line, int id) {
		Lines l = linesRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lines", "id", id));
		l.setLineName(line.getLineName());
		l.setLocation(line.getLocation());
		return linesRepo.save(l);
	}

	@Override
	public void deleteLine(int id) {
		
		linesRepo.delete(linesRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lines", "id", id)));

	}

	

}
