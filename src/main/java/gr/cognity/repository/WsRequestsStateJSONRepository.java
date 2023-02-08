package gr.cognity.repository;

import gr.cognity.domain.WsRequestsStateJSON;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WsRequestsStateJSON entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WsRequestsStateJSONRepository extends JpaRepository<WsRequestsStateJSON, Long> {
    List<WsRequestsStateJSON> findByRequestIdAndRequestIdxAndSrcSystemIn(Long requestId, Integer requestIdx, List<String> srcSystems);
}
