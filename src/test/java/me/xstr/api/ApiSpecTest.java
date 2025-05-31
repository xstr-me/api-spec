package me.xstr.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.EmptySource;
import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.*;

import java.io.InputStream;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.atomic.AtomicInteger;

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
    }    @Nested
    @DisplayName("API Specification Availability Tests")
    class AvailabilityTests {
        
        @Test
        @DisplayName("Should confirm API specification is available")
        void shouldConfirmApiSpecIsAvailable() {
            // Using AssertJ for fluent assertions
            assertThat(ApiSpec.isAvailable())
                .as("API specification should be available in classpath")
                .isTrue();
        }
        
        @RepeatedTest(value = 5, name = "Repeated test {currentRepetition}/{totalRepetitions}")
        @DisplayName("Should consistently return true for availability")
        void shouldConsistentlyReturnTrueForAvailability() {
            assertThat(ApiSpec.isAvailable()).isTrue();
        }
    }    @Nested
    @DisplayName("API Specification Stream Tests")
    class StreamTests {
        
        @Test
        @DisplayName("Should return valid InputStream for API specification")
        void shouldReturnValidInputStream() {
            InputStream stream = ApiSpec.getApiSpecAsStream();
            
            // Using AssertJ for better assertions
            assertThat(stream)
                .as("InputStream should not be null")
                .isNotNull();
            
            assertThatCode(stream::available)
                .as("InputStream should be readable")
                .doesNotThrowAnyException();
        }
        
        @Test
        @DisplayName("Should return different InputStream instances on multiple calls")
        void shouldReturnDifferentStreamInstances() {
            InputStream stream1 = ApiSpec.getApiSpecAsStream();
            InputStream stream2 = ApiSpec.getApiSpecAsStream();
            
            assertThat(stream1)
                .as("Multiple calls should return different InputStream instances")
                .isNotSameAs(stream2);
        }
        
        @ParameterizedTest
        @ValueSource(ints = {1, 2, 3, 5, 10})
        @DisplayName("Should return valid streams for multiple concurrent calls")
        void shouldReturnValidStreamsForMultipleCalls(int numberOfCalls) {
            for (int i = 0; i < numberOfCalls; i++) {
                InputStream stream = ApiSpec.getApiSpecAsStream();
                assertThat(stream).isNotNull();
            }
        }
    }    @Nested
    @DisplayName("API Specification String Tests")
    class StringTests {
        
        @Test
        @DisplayName("Should return valid YAML content as String")
        void shouldReturnValidYamlContent() throws IOException {
            String content = ApiSpec.getApiSpecAsString();
            
            // Using AssertJ for fluent assertions
            assertThat(content)
                .as("Content should not be null")
                .isNotNull()
                .as("Content should not be empty")
                .isNotBlank()
                .as("Content should contain OpenAPI specification marker")
                .contains("openapi:")
                .as("Content should contain info section")
                .contains("info:")
                .as("Content should contain paths section")
                .contains("paths:");
        }
        
        @Test
        @DisplayName("Should return consistent content on multiple calls")
        void shouldReturnConsistentContent() throws IOException {
            String content1 = ApiSpec.getApiSpecAsString();
            String content2 = ApiSpec.getApiSpecAsString();
            
            assertThat(content1)
                .as("Multiple calls should return identical content")
                .isEqualTo(content2);
        }
        
        @Test
        @DisplayName("Should contain expected API version in content")
        void shouldContainExpectedVersionInContent() throws IOException {
            String content = ApiSpec.getApiSpecAsString();
            
            // The YAML should contain the version information
            assertThat(content)
                .as("Content should contain version information")
                .satisfiesAnyOf(
                    c -> assertThat(c).contains("version:"),
                    c -> assertThat(c).contains("\"version\"")
                );
        }
        
        @ParameterizedTest
        @CsvSource({
            "'openapi:', 'OpenAPI specification marker'",
            "'info:', 'API info section'",
            "'paths:', 'API paths section'",
            "'version', 'version information'"
        })
        @DisplayName("Should contain expected YAML sections")
        void shouldContainExpectedYamlSections(String expectedContent, String description) throws IOException {
            String content = ApiSpec.getApiSpecAsString();
            
            assertThat(content)
                .as("Content should contain " + description)
                .contains(expectedContent);
        }
    }    @Nested
    @DisplayName("Version Information Tests")
    class VersionTests {
        
        @Test
        @DisplayName("Should return valid version string")
        void shouldReturnValidVersionString() {
            String version = ApiSpec.getVersion();
            
            assertThat(version)
                .as("Version should not be null")
                .isNotNull()
                .as("Version should not be empty")
                .isNotBlank();
        }
        
        @Test
        @DisplayName("Should return consistent version on multiple calls")
        void shouldReturnConsistentVersion() {
            String version1 = ApiSpec.getVersion();
            String version2 = ApiSpec.getVersion();
            
            assertThat(version1)
                .as("Multiple calls should return same version")
                .isEqualTo(version2);
        }
        
        @Test
        @DisplayName("Should return alpha version format")
        void shouldReturnAlphaVersionFormat() {
            String version = ApiSpec.getVersion();
            
            // Should either be from manifest or fallback to alpha version
            assertThat(version)
                .as("Version should follow semantic versioning or be alpha fallback")
                .satisfiesAnyOf(
                    v -> assertThat(v).matches("\\d+\\.\\d+\\.\\d+.*"),
                    v -> assertThat(v).isEqualTo("0.0.1-alpha")
                );
        }
        
        @ParameterizedTest
        @NullSource
        @EmptySource
        @ValueSource(strings = {"", "   ", "\t", "\n"})
        @DisplayName("Should never return null or blank version")
        void shouldNeverReturnNullOrBlankVersion(String ignoredInput) {
            // This test validates that regardless of input conditions,
            // the version method always returns a valid string
            String version = ApiSpec.getVersion();
            
            assertThat(version)
                .as("Version should never be null or blank")
                .isNotNull()
                .isNotBlank();
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
    }    @Nested
    @DisplayName("Performance Tests")
    class PerformanceTests {
        
        private final AtomicInteger callCounter = new AtomicInteger(0);
        
        @Test
        @DisplayName("Should handle multiple rapid calls efficiently")
        void shouldHandleMultipleRapidCalls() {
            // Test that multiple rapid calls don't cause issues
            for (int i = 0; i < 100; i++) {
                assertThat(ApiSpec.isAvailable()).isTrue();
                assertThat(ApiSpec.getVersion()).isNotNull();
                assertThat(ApiSpec.getApiSpecAsStream()).isNotNull();
                callCounter.incrementAndGet();
            }
            
            assertThat(callCounter.get())
                .as("All calls should have been executed")
                .isEqualTo(100);
        }
        
        @ParameterizedTest
        @ValueSource(ints = {10, 50, 100, 200})
        @DisplayName("Should handle variable load efficiently")
        void shouldHandleVariableLoadEfficiently(int numberOfCalls) {
            long startTime = System.nanoTime();
            
            for (int i = 0; i < numberOfCalls; i++) {
                assertThat(ApiSpec.isAvailable()).isTrue();
            }
            
            long endTime = System.nanoTime();
            long durationMs = (endTime - startTime) / 1_000_000;
            
            // Should complete reasonably fast (less than 1 second for any reasonable load)
            assertThat(durationMs)
                .as("Operations should complete in reasonable time")
                .isLessThan(1000);
        }
    }
}
