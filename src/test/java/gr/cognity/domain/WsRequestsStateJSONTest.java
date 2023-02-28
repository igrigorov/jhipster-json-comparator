package gr.cognity.domain;

import gr.cognity.domainapp.WsRequestsStateJSON;
import gr.cognity.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WsRequestsStateJSONTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WsRequestsStateJSON.class);
        WsRequestsStateJSON wsRequestsStateJSON1 = new WsRequestsStateJSON();
        wsRequestsStateJSON1.setId(1L);
        WsRequestsStateJSON wsRequestsStateJSON2 = new WsRequestsStateJSON();
        wsRequestsStateJSON2.setId(wsRequestsStateJSON1.getId());
        assertThat(wsRequestsStateJSON1).isEqualTo(wsRequestsStateJSON2);
        wsRequestsStateJSON2.setId(2L);
        assertThat(wsRequestsStateJSON1).isNotEqualTo(wsRequestsStateJSON2);
        wsRequestsStateJSON1.setId(null);
        assertThat(wsRequestsStateJSON1).isNotEqualTo(wsRequestsStateJSON2);
    }
}
