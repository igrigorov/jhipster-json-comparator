package gr.cognity.web.rest;

import gr.cognity.domain.WsRequestsStateJSON;
import gr.cognity.repository.WsRequestsStateJSONRepository;
import gr.cognity.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link gr.cognity.domain.WsRequestsStateJSON}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WsRequestsStateJSONResource {

    private final Logger log = LoggerFactory.getLogger(WsRequestsStateJSONResource.class);

    private static final String ENTITY_NAME = "wsRequestsStateJSON";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WsRequestsStateJSONRepository wsRequestsStateJSONRepository;

    public WsRequestsStateJSONResource(WsRequestsStateJSONRepository wsRequestsStateJSONRepository) {
        this.wsRequestsStateJSONRepository = wsRequestsStateJSONRepository;
    }

    /**
     * {@code POST  /ws-requests-state-jsons} : Create a new wsRequestsStateJSON.
     *
     * @param wsRequestsStateJSON the wsRequestsStateJSON to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new wsRequestsStateJSON, or with status {@code 400 (Bad Request)} if the wsRequestsStateJSON has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ws-requests-state-jsons")
    public ResponseEntity<WsRequestsStateJSON> createWsRequestsStateJSON(@RequestBody WsRequestsStateJSON wsRequestsStateJSON)
        throws URISyntaxException {
        log.debug("REST request to save WsRequestsStateJSON : {}", wsRequestsStateJSON);
        if (wsRequestsStateJSON.getId() != null) {
            throw new BadRequestAlertException("A new wsRequestsStateJSON cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WsRequestsStateJSON result = wsRequestsStateJSONRepository.save(wsRequestsStateJSON);
        return ResponseEntity
            .created(new URI("/api/ws-requests-state-jsons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ws-requests-state-jsons/:id} : Updates an existing wsRequestsStateJSON.
     *
     * @param id the id of the wsRequestsStateJSON to save.
     * @param wsRequestsStateJSON the wsRequestsStateJSON to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wsRequestsStateJSON,
     * or with status {@code 400 (Bad Request)} if the wsRequestsStateJSON is not valid,
     * or with status {@code 500 (Internal Server Error)} if the wsRequestsStateJSON couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ws-requests-state-jsons/{id}")
    public ResponseEntity<WsRequestsStateJSON> updateWsRequestsStateJSON(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WsRequestsStateJSON wsRequestsStateJSON
    ) throws URISyntaxException {
        log.debug("REST request to update WsRequestsStateJSON : {}, {}", id, wsRequestsStateJSON);
        if (wsRequestsStateJSON.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wsRequestsStateJSON.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wsRequestsStateJSONRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WsRequestsStateJSON result = wsRequestsStateJSONRepository.save(wsRequestsStateJSON);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wsRequestsStateJSON.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ws-requests-state-jsons/:id} : Partial updates given fields of an existing wsRequestsStateJSON, field will ignore if it is null
     *
     * @param id the id of the wsRequestsStateJSON to save.
     * @param wsRequestsStateJSON the wsRequestsStateJSON to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wsRequestsStateJSON,
     * or with status {@code 400 (Bad Request)} if the wsRequestsStateJSON is not valid,
     * or with status {@code 404 (Not Found)} if the wsRequestsStateJSON is not found,
     * or with status {@code 500 (Internal Server Error)} if the wsRequestsStateJSON couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ws-requests-state-jsons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WsRequestsStateJSON> partialUpdateWsRequestsStateJSON(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WsRequestsStateJSON wsRequestsStateJSON
    ) throws URISyntaxException {
        log.debug("REST request to partial update WsRequestsStateJSON partially : {}, {}", id, wsRequestsStateJSON);
        if (wsRequestsStateJSON.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wsRequestsStateJSON.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wsRequestsStateJSONRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WsRequestsStateJSON> result = wsRequestsStateJSONRepository
            .findById(wsRequestsStateJSON.getId())
            .map(existingWsRequestsStateJSON -> {
                if (wsRequestsStateJSON.getRequestId() != null) {
                    existingWsRequestsStateJSON.setRequestId(wsRequestsStateJSON.getRequestId());
                }
                if (wsRequestsStateJSON.getRequestIdx() != null) {
                    existingWsRequestsStateJSON.setRequestIdx(wsRequestsStateJSON.getRequestIdx());
                }
                if (wsRequestsStateJSON.getCmdListJson() != null) {
                    existingWsRequestsStateJSON.setCmdListJson(wsRequestsStateJSON.getCmdListJson());
                }
                if (wsRequestsStateJSON.getSrcSystem() != null) {
                    existingWsRequestsStateJSON.setSrcSystem(wsRequestsStateJSON.getSrcSystem());
                }
                if (wsRequestsStateJSON.getCreated() != null) {
                    existingWsRequestsStateJSON.setCreated(wsRequestsStateJSON.getCreated());
                }

                return existingWsRequestsStateJSON;
            })
            .map(wsRequestsStateJSONRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wsRequestsStateJSON.getId().toString())
        );
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

    /**
     * {@code DELETE  /ws-requests-state-jsons/:id} : delete the "id" wsRequestsStateJSON.
     *
     * @param id the id of the wsRequestsStateJSON to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ws-requests-state-jsons/{id}")
    public ResponseEntity<Void> deleteWsRequestsStateJSON(@PathVariable Long id) {
        log.debug("REST request to delete WsRequestsStateJSON : {}", id);
        wsRequestsStateJSONRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
