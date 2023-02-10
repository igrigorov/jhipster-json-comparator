package gr.cognity.service.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contains the required input for comparing the same request (and optionally specific request index) from 2 different systems
 *
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public final class ComPair {

	@CsvBindByName(column = "requestId", required = true)
	private Long requestId;

	@CsvBindByName(column = "requestIdx", required = true)
	private Integer requestIdx;

	@CsvBindByName(column = "system1", required = true)
	private String system1;

	@CsvBindByName(column = "system2", required = true)
	private String system2;
}
