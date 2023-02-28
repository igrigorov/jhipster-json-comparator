package gr.cognity.web.rest;

import gr.cognity.IntegrationTest;
import gr.cognity.domainapp.WsRequestsStateJSON;
import gr.cognity.repositoryapp.WsRequestsStateJSONRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link WsRequestsStateJSONResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WsRequestsStateJSONResourceIT {

    private static final Long DEFAULT_REQUEST_ID = 1L;
    private static final Long UPDATED_REQUEST_ID = 2L;

    private static final Integer DEFAULT_REQUEST_IDX = 1;
    private static final Integer UPDATED_REQUEST_IDX = 2;

    private static final String DEFAULT_CMD_LIST_JSON = "AAAAAAAAAA";
    private static final String UPDATED_CMD_LIST_JSON = "BBBBBBBBBB";

    private static final String DEFAULT_SRC_SYSTEM = "AAAAAAAAAA";
    private static final String UPDATED_SRC_SYSTEM = "BBBBBBBBBB";

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
            .requestIdx(DEFAULT_REQUEST_IDX)
            .cmdListJson(DEFAULT_CMD_LIST_JSON)
            .srcSystem(DEFAULT_SRC_SYSTEM)
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
            .requestIdx(UPDATED_REQUEST_IDX)
            .cmdListJson(UPDATED_CMD_LIST_JSON)
            .srcSystem(UPDATED_SRC_SYSTEM)
            .created(UPDATED_CREATED);
        return wsRequestsStateJSON;
    }

    @BeforeEach
    public void initTest() {
        wsRequestsStateJSON = createEntity(em);
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
            .andExpect(jsonPath("$.[*].requestIdx").value(hasItem(DEFAULT_REQUEST_IDX)))
            .andExpect(jsonPath("$.[*].cmdListJson").value(hasItem(DEFAULT_CMD_LIST_JSON.toString())))
            .andExpect(jsonPath("$.[*].srcSystem").value(hasItem(DEFAULT_SRC_SYSTEM)))
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
            .andExpect(jsonPath("$.requestIdx").value(DEFAULT_REQUEST_IDX))
            .andExpect(jsonPath("$.cmdListJson").value(DEFAULT_CMD_LIST_JSON.toString()))
            .andExpect(jsonPath("$.srcSystem").value(DEFAULT_SRC_SYSTEM))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWsRequestsStateJSON() throws Exception {
        // Get the wsRequestsStateJSON
        restWsRequestsStateJSONMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }
}
