package inc.plab.bpmn.camunda;

import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.camunda.bpm.engine.spring.SpringProcessEngineConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CamundaConfiguration {

    @Bean
    public SpringProcessEngineConfiguration processEngineConfiguration(List<ProcessEnginePlugin> processEnginePlugins) {
        SpringProcessEngineConfiguration configuration = new SpringProcessEngineConfiguration();
        configuration.setProcessEnginePlugins(processEnginePlugins);
        return configuration;
    }

    @Bean
    public ProcessEnginePlugin parseListenerPlugin() {
        return new ParseListenerPlugin();
    }

    @Bean
    public ProcessEnginePlugin exceptionCodeProviderPlugin() {
        return new ExceptionCodeProviderPlugin();
    }

}