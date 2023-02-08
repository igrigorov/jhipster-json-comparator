package gr.cognity.service.dto;

/**
 * Describes the status of the comparison for a pair of requests, including any differences found.
 *
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
public record CompareResult(Integer code, String message, java.util.List<String> diff) {}
