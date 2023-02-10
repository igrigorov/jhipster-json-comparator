package gr.cognity.web.rest;

import gr.cognity.service.WorkflowCompareService;
import gr.cognity.service.dto.ComPair;
import gr.cognity.service.dto.CompareResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

/**
 * Central controller for comparing requests.
 *
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComparatorController {

	private final Logger LOG = LoggerFactory.getLogger(ComparatorController.class);

	/*
	 * Services
	 */
	private final WorkflowCompareService workflowCompareService;

	@PostMapping("/compare-single")
	public List<CompareResponse> singleCompare(@RequestBody ComPair input) {
		return Collections.singletonList(workflowCompareService.singleCompare(input));
	}

	@PostMapping(path = "/bulk-compare", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<CompareResponse> performBulkCompare(@RequestPart("file") MultipartFile file) {
		List<CompareResponse> response;
		response = workflowCompareService.bulkCompare(file);
		return response;
	}
}
