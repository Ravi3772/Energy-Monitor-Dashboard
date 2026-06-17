package com.dunelect.v1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dunelect.v1.models.Lines;

@Service
public interface LineService {

	Lines getLineById(int id);

	List<Lines> getAllLines();

	Lines createLine(Lines line);
	
	Lines updateLine(Lines line,int id);
	
	void deleteLine(int id);

	
	
	
	
	
	
}
