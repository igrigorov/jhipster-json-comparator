package gr.cognity.service;

import gr.cognity.service.dto.CompareResult;

/**
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
public interface CompareService {
	CompareResult compare(String input1, String input2);
}
