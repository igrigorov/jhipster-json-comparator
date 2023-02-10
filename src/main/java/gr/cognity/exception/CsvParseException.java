package gr.cognity.exception;

import java.lang.module.ResolutionException;

/**
 * @author Ivan Grigorov
 * @version 2023.02.10
 */
public class CsvParseException extends ResolutionException {

	public CsvParseException(String message, Throwable re) {
		super(message, re);
	}
}
