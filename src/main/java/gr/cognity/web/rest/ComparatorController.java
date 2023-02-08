package gr.cognity.web.rest;

import gr.cognity.service.WorkflowCompareService;
import gr.cognity.service.dto.ComPair;
import gr.cognity.service.dto.CompareResult;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public CompareResult singleCompare(@RequestBody ComPair input) {
        return workflowCompareService.singleCompare(input);
    }
}
