package gr.cognity.repositoryapp;

import gr.cognity.domainapp.WsRequestsStateJSON;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the WsRequestsStateJSON entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WsRequestsStateJSONRepository extends JpaRepository<WsRequestsStateJSON, Long> {
	List<WsRequestsStateJSON> findByRequestIdAndRequestIdxAndSrcSystemIn(Long requestId, Integer requestIdx, List<String> srcSystems);
}
