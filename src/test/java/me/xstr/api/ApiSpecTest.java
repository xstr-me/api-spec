package me.xstr.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import static org.junit.jupiter.api.Assertions.*;

import java.io.InputStream;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 * Comprehensive unit tests for the ApiSpec utility class.
 * 
 * Tests cover all public methods, error conditions, and edge cases
 * to ensure the utility class behaves correctly in all scenarios.
 */
@DisplayName("ApiSpec Utility Class Tests")
class ApiSpecTest {

    @Nested
    @DisplayName("Constructor Tests")
    class ConstructorTests {
        
        @Test
        @DisplayName("Should prevent instantiation via reflection")
        void shouldPreventInstantiation() throws NoSuchMethodException {
            Constructor<ApiSpec> constructor = ApiSpec.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            
            InvocationTargetException exception = assertThrows(
                InvocationTargetException.class,
                constructor::newInstance,
                "Constructor should throw AssertionError when called"
            );
            
            assertInstanceOf(AssertionError.class, exception.getCause(),
                "Root cause should be AssertionError");
            assertEquals("Utility class should not be instantiated", 
                exception.getCause().getMessage(),
                "Error message should match expected text");
        }
    }

    @Nested
    @DisplayName("API Specification Availability Tests")
    class AvailabilityTests {
        
        @Test
        @DisplayName("Should confirm API specification is available")
        void shouldConfirmApiSpecIsAvailable() {
            assertTrue(ApiSpec.isAvailable(), 
                "API specification should be available in classpath");
        }
    }

    @Nested
    @DisplayName("API Specification Stream Tests")
    class StreamTests {
        
        @Test
        @DisplayName("Should return valid InputStream for API specification")
        void shouldReturnValidInputStream() {
            InputStream stream = ApiSpec.getApiSpecAsStream();
            
            assertNotNull(stream, "InputStream should not be null");
            assertDoesNotThrow(stream::available, 
                "InputStream should be readable");
        }
        
        @Test
        @DisplayName("Should return different InputStream instances on multiple calls")
        void shouldReturnDifferentStreamInstances() {
            InputStream stream1 = ApiSpec.getApiSpecAsStream();
            InputStream stream2 = ApiSpec.getApiSpecAsStream();
            
            assertNotSame(stream1, stream2, 
                "Multiple calls should return different InputStream instances");
        }
    }

    @Nested
    @DisplayName("API Specification String Tests")
    class StringTests {
        
        @Test
        @DisplayName("Should return valid YAML content as String")
        void shouldReturnValidYamlContent() throws IOException {
            String content = ApiSpec.getApiSpecAsString();
            
            assertNotNull(content, "Content should not be null");
            assertFalse(content.trim().isEmpty(), "Content should not be empty");
            assertTrue(content.contains("openapi:"), 
                "Content should contain OpenAPI specification marker");
            assertTrue(content.contains("info:"), 
                "Content should contain info section");
            assertTrue(content.contains("paths:"), 
                "Content should contain paths section");
        }
        
        @Test
        @DisplayName("Should return consistent content on multiple calls")
        void shouldReturnConsistentContent() throws IOException {
            String content1 = ApiSpec.getApiSpecAsString();
            String content2 = ApiSpec.getApiSpecAsString();
            
            assertEquals(content1, content2, 
                "Multiple calls should return identical content");
        }
        
        @Test
        @DisplayName("Should contain expected API version in content")
        void shouldContainExpectedVersionInContent() throws IOException {
            String content = ApiSpec.getApiSpecAsString();
            
            // The YAML should contain the version information
            assertTrue(content.contains("version:") || content.contains("\"version\""),
                "Content should contain version information");
        }
    }

    @Nested
    @DisplayName("Version Information Tests")
    class VersionTests {
        
        @Test
        @DisplayName("Should return valid version string")
        void shouldReturnValidVersionString() {
            String version = ApiSpec.getVersion();
            
            assertNotNull(version, "Version should not be null");
            assertFalse(version.trim().isEmpty(), "Version should not be empty");
        }
        
        @Test
        @DisplayName("Should return consistent version on multiple calls")
        void shouldReturnConsistentVersion() {
            String version1 = ApiSpec.getVersion();
            String version2 = ApiSpec.getVersion();
            
            assertEquals(version1, version2, 
                "Multiple calls should return same version");
        }
        
        @Test
        @DisplayName("Should return alpha version format")
        void shouldReturnAlphaVersionFormat() {
            String version = ApiSpec.getVersion();
            
            // Should either be from manifest or fallback to alpha version
            assertTrue(version.matches("\\d+\\.\\d+\\.\\d+.*") || 
                      version.equals("0.0.1-alpha"),
                "Version should follow semantic versioning or be alpha fallback");
        }
    }

    @Nested
    @DisplayName("Integration Tests")
    class IntegrationTests {
        
        @Test
        @DisplayName("Should handle full workflow correctly")
        void shouldHandleFullWorkflow() throws IOException {
            // Test the complete workflow: check availability, get stream, get string
            assertTrue(ApiSpec.isAvailable(), "API spec should be available");
            
            try (InputStream stream = ApiSpec.getApiSpecAsStream()) {
                assertNotNull(stream, "Stream should be available");
                assertTrue(stream.available() > 0, "Stream should have content");
            }
            
            String content = ApiSpec.getApiSpecAsString();
            assertNotNull(content, "String content should be available");
            assertFalse(content.isEmpty(), "Content should not be empty");
            
            String version = ApiSpec.getVersion();
            assertNotNull(version, "Version should be available");
        }
    }

    @Nested
    @DisplayName("Performance Tests")
    class PerformanceTests {
        
        @Test
        @DisplayName("Should handle multiple rapid calls efficiently")
        void shouldHandleMultipleRapidCalls() {
            // Test that multiple rapid calls don't cause issues
            for (int i = 0; i < 100; i++) {
                assertTrue(ApiSpec.isAvailable());
                assertNotNull(ApiSpec.getVersion());
                assertNotNull(ApiSpec.getApiSpecAsStream());
            }
        }
    }
}
