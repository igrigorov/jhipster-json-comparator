package gr.cognity.service.dto;

/**
 * Contains the required input for comparing the same request (and optionally specific request index) from 2 different systems
 *
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
public record ComPair(Long requestId, Integer requestIdx, String system1, String system2) {}
