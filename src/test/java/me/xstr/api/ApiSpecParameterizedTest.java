package me.xstr.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import static org.assertj.core.api.Assertions.*;

import java.io.InputStream;
import java.io.IOException;
import java.util.stream.Stream;

/**
 * Parameterized tests for the ApiSpec utility class.
 * 
 * Tests use JUnit 5 parameterized test capabilities to test multiple scenarios
 * and edge cases with different inputs and conditions.
 */
@DisplayName("ApiSpec Parameterized Tests")
class ApiSpecParameterizedTest {

    @ParameterizedTest
    @ValueSource(ints = {1, 5, 10, 50, 100})
    @DisplayName("Should handle multiple concurrent stream requests")
    void shouldHandleMultipleConcurrentStreamRequests(int iterations) {
        for (int i = 0; i < iterations; i++) {
            InputStream stream = ApiSpec.getApiSpecAsStream();
            assertThat(stream)
                .as("Stream %d should not be null", i + 1)
                .isNotNull();
            
            assertThatNoException()
                .as("Stream %d should be readable", i + 1)
                .isThrownBy(stream::available);
        }
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 10, 25, 50})
    @DisplayName("Should consistently return same string content")
    void shouldConsistentlyReturnSameStringContent(int iterations) throws IOException {
        String firstContent = ApiSpec.getApiSpecAsString();
        
        for (int i = 1; i < iterations; i++) {
            String content = ApiSpec.getApiSpecAsString();
            assertThat(content)
                .as("Content iteration %d should match first content", i + 1)
                .isEqualTo(firstContent);
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "openapi:", 
        "info:", 
        "paths:", 
        "version:", 
        "title:",
        "description:"
    })
    @DisplayName("Should contain essential OpenAPI elements")
    void shouldContainEssentialOpenApiElements(String element) throws IOException {
        String content = ApiSpec.getApiSpecAsString();
        
        assertThat(content)
            .as("Content should contain OpenAPI element: %s", element)
            .contains(element);
    }    @ParameterizedTest
    @CsvSource({
        "'3.0', true",
        "'3.0.3', true", 
        "'3.1', false",
        "'2.0', false",
        "'4.0', false"
    })
    @DisplayName("Should validate OpenAPI version compatibility")
    void shouldValidateOpenApiVersionCompatibility(String version, boolean shouldContain) throws IOException {
        String content = ApiSpec.getApiSpecAsString();
        
        if (shouldContain) {
            assertThat(content)
                .as("Content should contain OpenAPI version %s", version)
                .containsIgnoringCase(version);
        } else {
            assertThat(content)
                .as("Content should not contain unsupported OpenAPI version %s", version)
                .doesNotContain(version);
        }
    }

    @ParameterizedTest
    @MethodSource("providePotentialResourcePaths")
    @DisplayName("Should only respond to correct resource path")
    void shouldOnlyRespondToCorrectResourcePath(String resourcePath, boolean shouldExist) {
        InputStream stream = ApiSpec.class.getResourceAsStream(resourcePath);
        
        if (shouldExist) {
            assertThat(stream)
                .as("Resource %s should exist", resourcePath)
                .isNotNull();
        } else {
            assertThat(stream)
                .as("Resource %s should not exist", resourcePath)
                .isNull();
        }
    }

    private static Stream<Arguments> providePotentialResourcePaths() {
        return Stream.of(
            Arguments.of("/api-spec.yml", true),
            Arguments.of("/api-spec.yaml", false),
            Arguments.of("/openapi.yml", false),
            Arguments.of("/openapi.yaml", false),
            Arguments.of("/spec.yml", false),
            Arguments.of("/nonexistent.yml", false)
        );
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 1, 5, 10, 20})
    @DisplayName("Should handle availability check under different conditions")
    void shouldHandleAvailabilityCheckUnderDifferentConditions(int priorCalls) {
        // Make some prior calls to potentially affect state
        for (int i = 0; i < priorCalls; i++) {
            ApiSpec.isAvailable();
            ApiSpec.getVersion();
        }
        
        // The availability should always be true regardless of prior calls
        assertThat(ApiSpec.isAvailable())
            .as("Availability should be true after %d prior calls", priorCalls)
            .isTrue();
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "\t", "\n", "\r\n"})
    @DisplayName("Should return non-whitespace version string")
    void shouldReturnNonWhitespaceVersionString(String whitespace) {
        String version = ApiSpec.getVersion();
        
        assertThat(version)
            .as("Version should not be null, empty, or whitespace-only")
            .isNotNull()
            .isNotEmpty()
            .isNotBlank();
            
        if (whitespace != null) {
            assertThat(version.trim())
                .as("Version should not equal whitespace string '%s'", whitespace)
                .isNotEqualTo(whitespace);
        }
    }
}
