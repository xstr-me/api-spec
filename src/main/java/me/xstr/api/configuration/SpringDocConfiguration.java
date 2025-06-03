package me.xstr.api.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SpringDocConfiguration {

    @Bean(name = "me.xstr.api.configuration.SpringDocConfiguration.apiInfo")
    OpenAPI apiInfo() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("XStr.me API")
                                .description("OpenAPI specification for XStr.me services.  This API provides endpoints for managing and accessing XStr.me functionality. ")
                                .license(
                                        new License()
                                                .name("MIT")
                                                .url("https://opensource.org/licenses/MIT")
                                )
                                .version("0.0.1-alpha")
                )
                .components(
                        new Components()
                                .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                )
                )
        ;
    }
}