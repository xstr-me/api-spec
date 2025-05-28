package me.xstr.api;

import java.io.InputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Utility class for accessing the XStr.me API specification.
 *  * This class provides convenient methods to load and access the OpenAPI
 * specification that is bundled with this JAR.
 *  * @version 0.0.1-alpha
 */
public class ApiSpec {
    
    private static final String API_SPEC_RESOURCE = "/api-spec.yml";
    
    /**
     * Private constructor to prevent instantiation.
     */
    private ApiSpec() {
        throw new AssertionError("Utility class should not be instantiated");
    }
    
    /**
     * Get the API specification as an InputStream.
     * 
     * @return InputStream containing the API specification YAML content
     * @throws IllegalStateException if the API specification cannot be found
     */
    public static InputStream getApiSpecAsStream() {
        InputStream stream = ApiSpec.class.getResourceAsStream(API_SPEC_RESOURCE);
        if (stream == null) {
            throw new IllegalStateException("API specification not found in classpath: " + API_SPEC_RESOURCE);
        }
        return stream;
    }
    
    /**
     * Get the API specification as a String.
     * 
     * @return String containing the API specification YAML content
     * @throws IOException if there's an error reading the specification
     * @throws IllegalStateException if the API specification cannot be found
     */
    public static String getApiSpecAsString() throws IOException {
        try (InputStream stream = getApiSpecAsStream()) {
            return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
      /**
     * Get the version of the API specification.
     * 
     * @return API specification version
     */
    public static String getVersion() {
        // Try to read version from package implementation version first
        Package pkg = ApiSpec.class.getPackage();
        if (pkg != null && pkg.getImplementationVersion() != null) {
            return pkg.getImplementationVersion();
        }
        
        // Fallback to current version if package info not available
        return "0.0.1-alpha";
    }
    
    /**
     * Check if the API specification is available.
     * 
     * @return true if the API specification is available, false otherwise
     */
    public static boolean isAvailable() {
        return ApiSpec.class.getResource(API_SPEC_RESOURCE) != null;
    }
}
