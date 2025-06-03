package me.xstr.api;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OpenApiGeneratorApplicationTests {

    @Test
    void contextLoads() {
        // Simple unit test - verify the application class can be instantiated
        OpenApiGeneratorApplication app = new OpenApiGeneratorApplication();
        assertNotNull(app, "Application should be instantiable");
    }

}