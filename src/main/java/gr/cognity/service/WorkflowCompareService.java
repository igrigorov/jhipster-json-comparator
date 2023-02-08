package gr.cognity.service;

import gr.cognity.domain.WsRequestsStateJSON;
import gr.cognity.exception.ComparisonException;
import gr.cognity.repository.WsRequestsStateJSONRepository;
import gr.cognity.service.dto.ComPair;
import gr.cognity.service.dto.CompareResult;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link WsRequestsStateJSON}.
 */
@Service
@RequiredArgsConstructor
public class WorkflowCompareService {

    private final Logger LOG = LoggerFactory.getLogger(WorkflowCompareService.class);

    /*
     * Repositories
     */
    private final WsRequestsStateJSONRepository requestsRepository;

    /*
     * Services
     */
    private final CompareJsonService compareJsonService;

    public CompareResult singleCompare(ComPair input) {
        var pfx = "singleCompare[%d.%d]: ".formatted(input.requestId(), input.requestIdx());
        LOG.info("{}Start with input: {}", pfx, input);

        var idx = input.requestIdx() == null ? 1 : input.requestIdx();

        var dbRequests = requestsRepository.findByRequestIdAndRequestIdxAndSrcSystemIn(
            input.requestId(),
            idx,
            Arrays.asList(input.system1(), input.system2())
        );

        LOG.info("{}Retrieved dbRequests: {}", pfx, dbRequests.toString());

        if (dbRequests.size() != 2) throw new ComparisonException(
            "Invalid number of dbRequests found in DB: expected 2, found " + dbRequests.size()
        );

        return compareJsonService.compare(dbRequests.get(0), dbRequests.get(1));
    }
}
