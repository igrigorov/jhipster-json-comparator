package gr.cognity.service;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import gr.cognity.exception.CsvParseException;
import io.micrometer.core.instrument.util.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.GenericTypeResolver;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Generic interface for streamlined parsing of CSVs in different formats
 *
 * @author Ivan Grigorov
 * @version 2023.02.10
 */
public abstract class CsvService<T> {

	public static final String SEMICOLON = ";";

	public static final Logger LOG = LoggerFactory.getLogger(CsvService.class);

	// contains the class of the generic type passed, needed for CSVCompare
	private final Class<T> genericType;

	public CsvService() {
		genericType = (Class<T>) GenericTypeResolver.resolveTypeArgument(getClass(), CsvService.class);
	}

	/**
	 * Parses a CSV file in format, specific to each implementation. Can use {@link #readCsvFile(MultipartFile)} below as utility method.
	 *
	 * @param csvFile {@link MultipartFile}, as received by the frontend
	 */
	public abstract List<T> parse(MultipartFile csvFile);

	/**
	 * Raw text parser of CSVs
	 *
	 * @deprecated in favor of CSVParser
	 */
	@Deprecated
	public List<List<String>> readCsvFile(MultipartFile csvFile) {
		var pfx = "readCsvFile[%S]: ".formatted(csvFile.getName());
		LOG.info(pfx + "Start");

		ArrayList<List<String>> csvList;

		try {
			// read CSV
			ByteArrayInputStream stream = new ByteArrayInputStream(csvFile.getBytes());
			String rawFile = IOUtils.toString(stream, StandardCharsets.UTF_8);
			var csvRows = rawFile.split("\n");

			// CSV cleanup: remove CRLFs, empty lines, trim cells
			csvList = Arrays.stream(csvRows)
					.map(String::trim)
					.filter(StringUtils::isNotBlank)
					.map(row -> Arrays.stream(row.split(SEMICOLON)).map(String::trim).toList())
					.collect(Collectors.toCollection(ArrayList::new));

			return csvList;
		} catch (IOException e) {
			LOG.error("{}Error reading CSV file", pfx, e);
			throw new CsvParseException("Error reading CSV file", e);
		}
	}

	public List<T> parseDirect(MultipartFile csvFile) {
		var pfx = "parseDirect[%s]: ".formatted(csvFile.getName());
		LOG.info(pfx + "Start");

		try (Reader reader = new InputStreamReader(csvFile.getInputStream())) {
			CsvToBean<T> builder = new CsvToBeanBuilder<T>(reader).withType(genericType).withSeparator(';').withQuoteChar('"').build();

			return builder.parse();
		} catch (IOException e) {
			LOG.error("{}Error reading CSV file", pfx, e);
			throw new CsvParseException("Error reading CSV file", e);
		}
	}
}
