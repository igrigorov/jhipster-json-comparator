package gr.cognity.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import tech.jhipster.config.JHipsterConstants;
import tech.jhipster.config.h2.H2ConfigurationHelper;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Objects;

@Configuration
@EnableJpaRepositories(entityManagerFactoryRef = "systemEntityManagerFactory", transactionManagerRef = "systemTransactionManager",
		basePackages = { "gr.cognity.repository" })
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableTransactionManagement
public class DatabaseConfiguration {

	private final Logger log = LoggerFactory.getLogger(DatabaseConfiguration.class);

	private final Environment env;

	public DatabaseConfiguration(Environment env) {
		this.env = env;
	}

	@Primary
	@Bean
	@ConfigurationProperties("spring.datasource")
	public DataSourceProperties systemDataSourceProperties() {
		return new DataSourceProperties();
	}

	@Primary
	@Bean
	public DataSource systemDataSource() {
		return systemDataSourceProperties().initializeDataSourceBuilder().build();
	}

	@Bean
	public JdbcTemplate systemJdbcTemplate(@Qualifier("systemDataSource") DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}

	@Primary
	@Bean
	public LocalContainerEntityManagerFactoryBean systemEntityManagerFactory(@Qualifier("systemDataSource") DataSource dataSource,
			EntityManagerFactoryBuilder builder) {
		return builder.dataSource(dataSource).packages("gr.cognity.domain").build();
	}

	@Primary
	@Bean
	public PlatformTransactionManager systemTransactionManager(
			@Qualifier("systemEntityManagerFactory") LocalContainerEntityManagerFactoryBean systemEntityManagerFactory) {
		return new JpaTransactionManager(Objects.requireNonNull(systemEntityManagerFactory.getObject()));
	}

	/**
	 * Open the TCP port for the H2 database, so it is available remotely.
	 *
	 * @return the H2 database TCP server.
	 * @throws SQLException if the server failed to start.
	 */
	@Bean(initMethod = "start", destroyMethod = "stop")
	@Profile(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)
	public Object h2TCPServer() throws SQLException {
		String port = getValidPortForH2();
		log.debug("H2 database is available on port {}", port);
		return H2ConfigurationHelper.createServer(port);
	}

	private String getValidPortForH2() {
		int port = Integer.parseInt(env.getProperty("server.port"));
		if (port < 10000) {
			port = 10000 + port;
		} else {
			if (port < 63536) {
				port = port + 2000;
			} else {
				port = port - 2000;
			}
		}
		return String.valueOf(port);
	}
}
