package gr.cognity.web.rest;

import gr.cognity.domainapp.WsRequestsStateJSON;
import gr.cognity.repositoryapp.WsRequestsStateJSONRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link WsRequestsStateJSON}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WsRequestsStateJSONResource {

	private final Logger log = LoggerFactory.getLogger(WsRequestsStateJSONResource.class);

	private final WsRequestsStateJSONRepository wsRequestsStateJSONRepository;

	public WsRequestsStateJSONResource(WsRequestsStateJSONRepository wsRequestsStateJSONRepository) {
		this.wsRequestsStateJSONRepository = wsRequestsStateJSONRepository;
	}

	/**
	 * {@code GET  /ws-requests-state-jsons} : get all the wsRequestsStateJSONS.
	 *
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of wsRequestsStateJSONS in body.
	 */
	@GetMapping("/ws-requests-state-jsons")
	public List<WsRequestsStateJSON> getAllWsRequestsStateJSONS() {
		log.debug("REST request to get all WsRequestsStateJSONS");
		return wsRequestsStateJSONRepository.findAll();
	}

	/**
	 * {@code GET  /ws-requests-state-jsons/:id} : get the "id" wsRequestsStateJSON.
	 *
	 * @param id the id of the wsRequestsStateJSON to retrieve.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the wsRequestsStateJSON, or with status {@code 404 (Not Found)}.
	 */
	@GetMapping("/ws-requests-state-jsons/{id}")
	public ResponseEntity<WsRequestsStateJSON> getWsRequestsStateJSON(@PathVariable Long id) {
		log.debug("REST request to get WsRequestsStateJSON : {}", id);
		Optional<WsRequestsStateJSON> wsRequestsStateJSON = wsRequestsStateJSONRepository.findById(id);
		return ResponseUtil.wrapOrNotFound(wsRequestsStateJSON);
	}
}
