package gr.cognity.service;

import gr.cognity.domain.WsRequestsStateJSON;
import gr.cognity.exception.ComparisonException;
import gr.cognity.repository.WsRequestsStateJSONRepository;
import gr.cognity.service.dto.ComPair;
import gr.cognity.service.dto.CompareResponse;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private final CsvComPairService csvService;

    public CompareResponse singleCompare(ComPair input) {
        var requestId = input.getRequestId();
        var pfx = "singleCompare[%d.%d]: ".formatted(requestId, input.getRequestIdx());
        LOG.info("{}Start with input: {}", pfx, input);

        var idx = input.getRequestIdx() == null ? 1 : input.getRequestIdx();

        var dbRequests = requestsRepository.findByRequestIdAndRequestIdxAndSrcSystemIn(
            requestId,
            idx,
            Arrays.asList(input.getSystem1(), input.getSystem2())
        );

        LOG.info("{}Retrieved dbRequests: {}", pfx, dbRequests.toString());

        if (dbRequests.size() != 2) throw new ComparisonException(
            "Invalid number of dbRequests found in DB: expected 2, found " + dbRequests.size()
        );

        return new CompareResponse(requestId, idx, compareJsonService.compare(dbRequests.get(0), dbRequests.get(1)));
    }

    public List<CompareResponse> bulkCompare(MultipartFile file) {
        var comPairs = csvService.parse(file);

        return comPairs.stream().map(this::singleCompare).toList();
    }
}
