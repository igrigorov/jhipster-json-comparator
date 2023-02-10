package gr.cognity.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flipkart.zjsonpatch.JsonDiff;
import gr.cognity.domain.WsRequestsStateJSON;
import gr.cognity.exception.ComparisonException;
import gr.cognity.service.dto.CompareResult;
import io.json.compare.DefaultJsonComparator;
import io.json.compare.matcher.JsonMatcher;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Manages the comparison-related tasks for JSON compare.
 *
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
@Service
@RequiredArgsConstructor
public class CompareJsonService implements CompareService {

	private final Logger LOG = LoggerFactory.getLogger(CompareJsonService.class);

	public CompareResult compare(WsRequestsStateJSON request1, WsRequestsStateJSON request2) {
		var pfx = "singleCompare[%d from %s and %s]: ".formatted(request1.getRequestId(), request1.getSrcSystem(), request2.getSrcSystem());
		LOG.info("{}Start with input1:\n{}\n{}", pfx, request1, request2);

		return compare(request1.getCmdListJson(), request2.getCmdListJson());
	}

	@Deprecated
	public CompareResult compareZJsonPatch(String input1, String input2) {
		String diffs;
		try {
			var jacksonMapper = new ObjectMapper();
			JsonNode beforeNode = jacksonMapper.readTree(input1);
			JsonNode afterNode = jacksonMapper.readTree(input2);
			JsonNode patch = JsonDiff.asJson(beforeNode, afterNode);
			diffs = patch.toString();
		} catch (JsonProcessingException e) {
			throw new ComparisonException("Error comparing requests", e);
		}

		return new CompareResult(0, "OK", /*diffs*/null);
	}

	/**
	 * Compares jsonInput1 and jsonInput2 using [JSON Compare](https://github.com/fslev/json-compare) and returns the {@link CompareResult},
	 * including any differences found.
	 */
	@Override
	public CompareResult compare(String jsonInput1, String jsonInput2) {
		List<String> diffs;

		try {
			// TODO ::: 2023-02-09 IG : set up to ignore dates etc.
			var jacksonMapper = new ObjectMapper();
			JsonNode expectedJson = jacksonMapper.readTree(jsonInput1);
			JsonNode actualJson = jacksonMapper.readTree(jsonInput2);
			var jsonMatcher = new JsonMatcher(expectedJson, actualJson, new DefaultJsonComparator(null), null);
			diffs = jsonMatcher.match();
		} catch (JsonProcessingException e) {
			throw new ComparisonException("Error comparing requests", e);
		}

		if (diffs.size() == 0)
			return new CompareResult(0, "OK", diffs);
		else
			return new CompareResult(1, "DIFF", diffs);
	}
}
