package gr.cognity.service;

import gr.cognity.service.dto.ComPair;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Ivan Grigorov
 * @version 2023.02.10
 */
@Service
public class CsvComPairService extends CsvService<ComPair> {

    /**
     * Parses the incoming csvFile, using the default parser provided by OpenCSV
     *
     * @param csvFile {@link MultipartFile}, as received by the frontend
     */
    @Override
    public List<ComPair> parse(MultipartFile csvFile) {
        return parseDirect(csvFile);
    }
}
