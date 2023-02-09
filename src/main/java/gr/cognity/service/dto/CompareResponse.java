package gr.cognity.service.dto;

/**
 * @author Ivan Grigorov
 * @version 2023.02.09
 */
public record CompareResponse(Long requestId, Integer requestIdx, CompareResult result) {}
