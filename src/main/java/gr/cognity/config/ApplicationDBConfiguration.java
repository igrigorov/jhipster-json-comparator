package gr.cognity.config;

import gr.cognity.domainapp.WsRequestsStateJSON;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Objects;

/**
 * @author Ivan Grigorov
 * @version 2023.02.28
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "applicationEntityManagerFactory", transactionManagerRef = "applicationTransactionManager",
		basePackages = { "gr.cognity.repositoryapp" })
public class ApplicationDBConfiguration {

	@Bean
	@ConfigurationProperties("comparator.datasource")
	public DataSourceProperties applicationDataSourceProperties() {
		return new DataSourceProperties();
	}

	@Bean
	@ConfigurationProperties("comparator.datasource.hikari")
	public DataSource applicationDataSource() {
		return applicationDataSourceProperties().initializeDataSourceBuilder().build();
	}

	@Bean
	public JdbcTemplate applicationJdbcTemplate(@Qualifier("applicationDataSource") DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}

	@Bean
	public LocalContainerEntityManagerFactoryBean applicationEntityManagerFactory(@Qualifier("applicationDataSource") DataSource dataSource,
			EntityManagerFactoryBuilder builder) {
		return builder.dataSource(dataSource).packages(WsRequestsStateJSON.class).build();
	}

	@Bean
	public PlatformTransactionManager applicationTransactionManager(
			@Qualifier("applicationEntityManagerFactory") LocalContainerEntityManagerFactoryBean applicationEntityManagerFactory) {
		return new JpaTransactionManager(Objects.requireNonNull(applicationEntityManagerFactory.getObject()));
	}

}
