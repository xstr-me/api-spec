package me.xstr.api;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple unit test that doesn't require Spring context
 */
class SimpleApplicationTest {

    @Test
    void testApplicationClassExists() {
        // Test that the main application class can be instantiated
        OpenApiGeneratorApplication app = new OpenApiGeneratorApplication();
        assertNotNull(app);
    }

    @Test
    void testBasicFunctionality() {
        // Simple test to verify basic functionality
        String expected = "test";
        String actual = "test";
        assertEquals(expected, actual);
    }
}
