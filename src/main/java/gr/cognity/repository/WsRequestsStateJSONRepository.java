package gr.cognity.repository;

import gr.cognity.domain.WsRequestsStateJSON;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WsRequestsStateJSON entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WsRequestsStateJSONRepository extends JpaRepository<WsRequestsStateJSON, Long> {}
