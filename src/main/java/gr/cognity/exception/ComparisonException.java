package gr.cognity.exception;

import java.io.Serial;

/**
 * @author Ivan Grigorov
 * @version 2023.02.08
 */
public class ComparisonException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ComparisonException(String message) {
        super(message);
    }

    public ComparisonException(String message, Exception x) {
        super(message, x);
    }
}
