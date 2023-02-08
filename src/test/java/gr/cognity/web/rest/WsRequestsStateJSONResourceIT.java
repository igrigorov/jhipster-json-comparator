package gr.cognity.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import gr.cognity.IntegrationTest;
import gr.cognity.domain.WsRequestsStateJSON;
import gr.cognity.repository.WsRequestsStateJSONRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link WsRequestsStateJSONResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WsRequestsStateJSONResourceIT {

    private static final Long DEFAULT_REQUEST_ID = 1L;
    private static final Long UPDATED_REQUEST_ID = 2L;

    private static final Integer DEFAULT_INDEX = 1;
    private static final Integer UPDATED_INDEX = 2;

    private static final String DEFAULT_CMD_LIST_JSON = "AAAAAAAAAA";
    private static final String UPDATED_CMD_LIST_JSON = "BBBBBBBBBB";

    private static final String DEFAULT_SYSTEM = "AAAAAAAAAA";
    private static final String UPDATED_SYSTEM = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/ws-requests-state-jsons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WsRequestsStateJSONRepository wsRequestsStateJSONRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWsRequestsStateJSONMockMvc;

    private WsRequestsStateJSON wsRequestsStateJSON;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WsRequestsStateJSON createEntity(EntityManager em) {
        WsRequestsStateJSON wsRequestsStateJSON = new WsRequestsStateJSON()
            .requestId(DEFAULT_REQUEST_ID)
            .index(DEFAULT_INDEX)
            .cmdListJson(DEFAULT_CMD_LIST_JSON)
            .system(DEFAULT_SYSTEM)
            .created(DEFAULT_CREATED);
        return wsRequestsStateJSON;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WsRequestsStateJSON createUpdatedEntity(EntityManager em) {
        WsRequestsStateJSON wsRequestsStateJSON = new WsRequestsStateJSON()
            .requestId(UPDATED_REQUEST_ID)
            .index(UPDATED_INDEX)
            .cmdListJson(UPDATED_CMD_LIST_JSON)
            .system(UPDATED_SYSTEM)
            .created(UPDATED_CREATED);
        return wsRequestsStateJSON;
    }

    @BeforeEach
    public void initTest() {
        wsRequestsStateJSON = createEntity(em);
    }

    @Test
    @Transactional
    void createWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeCreate = wsRequestsStateJSONRepository.findAll().size();
        // Create the WsRequestsStateJSON
        restWsRequestsStateJSONMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isCreated());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeCreate + 1);
        WsRequestsStateJSON testWsRequestsStateJSON = wsRequestsStateJSONList.get(wsRequestsStateJSONList.size() - 1);
        assertThat(testWsRequestsStateJSON.getRequestId()).isEqualTo(DEFAULT_REQUEST_ID);
        assertThat(testWsRequestsStateJSON.getIndex()).isEqualTo(DEFAULT_INDEX);
        assertThat(testWsRequestsStateJSON.getCmdListJson()).isEqualTo(DEFAULT_CMD_LIST_JSON);
        assertThat(testWsRequestsStateJSON.getSystem()).isEqualTo(DEFAULT_SYSTEM);
        assertThat(testWsRequestsStateJSON.getCreated()).isEqualTo(DEFAULT_CREATED);
    }

    @Test
    @Transactional
    void createWsRequestsStateJSONWithExistingId() throws Exception {
        // Create the WsRequestsStateJSON with an existing ID
        wsRequestsStateJSON.setId(1L);

        int databaseSizeBeforeCreate = wsRequestsStateJSONRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWsRequestsStateJSONMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isBadRequest());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWsRequestsStateJSONS() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        // Get all the wsRequestsStateJSONList
        restWsRequestsStateJSONMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(wsRequestsStateJSON.getId().intValue())))
            .andExpect(jsonPath("$.[*].requestId").value(hasItem(DEFAULT_REQUEST_ID.intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].cmdListJson").value(hasItem(DEFAULT_CMD_LIST_JSON.toString())))
            .andExpect(jsonPath("$.[*].system").value(hasItem(DEFAULT_SYSTEM)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())));
    }

    @Test
    @Transactional
    void getWsRequestsStateJSON() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        // Get the wsRequestsStateJSON
        restWsRequestsStateJSONMockMvc
            .perform(get(ENTITY_API_URL_ID, wsRequestsStateJSON.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(wsRequestsStateJSON.getId().intValue()))
            .andExpect(jsonPath("$.requestId").value(DEFAULT_REQUEST_ID.intValue()))
            .andExpect(jsonPath("$.index").value(DEFAULT_INDEX))
            .andExpect(jsonPath("$.cmdListJson").value(DEFAULT_CMD_LIST_JSON.toString()))
            .andExpect(jsonPath("$.system").value(DEFAULT_SYSTEM))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWsRequestsStateJSON() throws Exception {
        // Get the wsRequestsStateJSON
        restWsRequestsStateJSONMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWsRequestsStateJSON() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();

        // Update the wsRequestsStateJSON
        WsRequestsStateJSON updatedWsRequestsStateJSON = wsRequestsStateJSONRepository.findById(wsRequestsStateJSON.getId()).get();
        // Disconnect from session so that the updates on updatedWsRequestsStateJSON are not directly saved in db
        em.detach(updatedWsRequestsStateJSON);
        updatedWsRequestsStateJSON
            .requestId(UPDATED_REQUEST_ID)
            .index(UPDATED_INDEX)
            .cmdListJson(UPDATED_CMD_LIST_JSON)
            .system(UPDATED_SYSTEM)
            .created(UPDATED_CREATED);

        restWsRequestsStateJSONMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWsRequestsStateJSON.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWsRequestsStateJSON))
            )
            .andExpect(status().isOk());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
        WsRequestsStateJSON testWsRequestsStateJSON = wsRequestsStateJSONList.get(wsRequestsStateJSONList.size() - 1);
        assertThat(testWsRequestsStateJSON.getRequestId()).isEqualTo(UPDATED_REQUEST_ID);
        assertThat(testWsRequestsStateJSON.getIndex()).isEqualTo(UPDATED_INDEX);
        assertThat(testWsRequestsStateJSON.getCmdListJson()).isEqualTo(UPDATED_CMD_LIST_JSON);
        assertThat(testWsRequestsStateJSON.getSystem()).isEqualTo(UPDATED_SYSTEM);
        assertThat(testWsRequestsStateJSON.getCreated()).isEqualTo(UPDATED_CREATED);
    }

    @Test
    @Transactional
    void putNonExistingWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                put(ENTITY_API_URL_ID, wsRequestsStateJSON.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isBadRequest());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isBadRequest());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWsRequestsStateJSONWithPatch() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();

        // Update the wsRequestsStateJSON using partial update
        WsRequestsStateJSON partialUpdatedWsRequestsStateJSON = new WsRequestsStateJSON();
        partialUpdatedWsRequestsStateJSON.setId(wsRequestsStateJSON.getId());

        partialUpdatedWsRequestsStateJSON.requestId(UPDATED_REQUEST_ID).created(UPDATED_CREATED);

        restWsRequestsStateJSONMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWsRequestsStateJSON.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWsRequestsStateJSON))
            )
            .andExpect(status().isOk());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
        WsRequestsStateJSON testWsRequestsStateJSON = wsRequestsStateJSONList.get(wsRequestsStateJSONList.size() - 1);
        assertThat(testWsRequestsStateJSON.getRequestId()).isEqualTo(UPDATED_REQUEST_ID);
        assertThat(testWsRequestsStateJSON.getIndex()).isEqualTo(DEFAULT_INDEX);
        assertThat(testWsRequestsStateJSON.getCmdListJson()).isEqualTo(DEFAULT_CMD_LIST_JSON);
        assertThat(testWsRequestsStateJSON.getSystem()).isEqualTo(DEFAULT_SYSTEM);
        assertThat(testWsRequestsStateJSON.getCreated()).isEqualTo(UPDATED_CREATED);
    }

    @Test
    @Transactional
    void fullUpdateWsRequestsStateJSONWithPatch() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();

        // Update the wsRequestsStateJSON using partial update
        WsRequestsStateJSON partialUpdatedWsRequestsStateJSON = new WsRequestsStateJSON();
        partialUpdatedWsRequestsStateJSON.setId(wsRequestsStateJSON.getId());

        partialUpdatedWsRequestsStateJSON
            .requestId(UPDATED_REQUEST_ID)
            .index(UPDATED_INDEX)
            .cmdListJson(UPDATED_CMD_LIST_JSON)
            .system(UPDATED_SYSTEM)
            .created(UPDATED_CREATED);

        restWsRequestsStateJSONMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWsRequestsStateJSON.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWsRequestsStateJSON))
            )
            .andExpect(status().isOk());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
        WsRequestsStateJSON testWsRequestsStateJSON = wsRequestsStateJSONList.get(wsRequestsStateJSONList.size() - 1);
        assertThat(testWsRequestsStateJSON.getRequestId()).isEqualTo(UPDATED_REQUEST_ID);
        assertThat(testWsRequestsStateJSON.getIndex()).isEqualTo(UPDATED_INDEX);
        assertThat(testWsRequestsStateJSON.getCmdListJson()).isEqualTo(UPDATED_CMD_LIST_JSON);
        assertThat(testWsRequestsStateJSON.getSystem()).isEqualTo(UPDATED_SYSTEM);
        assertThat(testWsRequestsStateJSON.getCreated()).isEqualTo(UPDATED_CREATED);
    }

    @Test
    @Transactional
    void patchNonExistingWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, wsRequestsStateJSON.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isBadRequest());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isBadRequest());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWsRequestsStateJSON() throws Exception {
        int databaseSizeBeforeUpdate = wsRequestsStateJSONRepository.findAll().size();
        wsRequestsStateJSON.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWsRequestsStateJSONMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(wsRequestsStateJSON))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WsRequestsStateJSON in the database
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWsRequestsStateJSON() throws Exception {
        // Initialize the database
        wsRequestsStateJSONRepository.saveAndFlush(wsRequestsStateJSON);

        int databaseSizeBeforeDelete = wsRequestsStateJSONRepository.findAll().size();

        // Delete the wsRequestsStateJSON
        restWsRequestsStateJSONMockMvc
            .perform(delete(ENTITY_API_URL_ID, wsRequestsStateJSON.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WsRequestsStateJSON> wsRequestsStateJSONList = wsRequestsStateJSONRepository.findAll();
        assertThat(wsRequestsStateJSONList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
