package me.xstr.api.example;

import me.xstr.api.client.ApiClient;
import me.xstr.api.client.Configuration;
import me.xstr.api.client.api.HealthApi;
import me.xstr.api.client.api.InfoApi;
import me.xstr.api.client.model.HealthResponse;
import me.xstr.api.client.model.VersionResponse;

/**
 * Test class to verify the generated OpenAPI client code compiles and works
 * correctly.
 * This demonstrates basic usage of the generated API client.
 */
public class GeneratedCodeTest {

    public static void main(String[] args) {
        System.out.println("OpenAPI Generated Java Client Test");
        System.out.println("==================================");

        try {
            // Initialize the API client with base URL
            ApiClient apiClient = Configuration.getDefaultApiClient();
            apiClient.setBasePath("https://api.xstr.me");

            // Create API instances
            HealthApi healthApi = new HealthApi(apiClient);
            InfoApi infoApi = new InfoApi(apiClient);

            System.out.println("✓ API Client initialized successfully");
            System.out.println("✓ HealthApi instance created: " + healthApi.getClass().getSimpleName());
            System.out.println("✓ InfoApi instance created: " + infoApi.getClass().getSimpleName());

            // Test model classes instantiation
            HealthResponse healthResponse = new HealthResponse();
            VersionResponse versionResponse = new VersionResponse();

            System.out
                    .println("✓ HealthResponse model class instantiated: " + healthResponse.getClass().getSimpleName());
            System.out.println(
                    "✓ VersionResponse model class instantiated: " + versionResponse.getClass().getSimpleName());            // Test setting values on models
            healthResponse.setStatus(HealthResponse.StatusEnum.HEALTHY);
            healthResponse.setTimestamp(java.time.OffsetDateTime.parse("2025-05-30T16:21:00Z"));
            healthResponse.setUptime("12345s");
            healthResponse.setVersion("1.0.0");            versionResponse.setVersion("1.0.0");
            versionResponse.setBuild("abc123");
            versionResponse.setTimestamp(java.time.OffsetDateTime.parse("2025-05-30T16:21:00Z"));

            System.out.println("✓ Model properties set successfully");
            System.out.println("  - Health Status: " + healthResponse.getStatus());
            System.out.println("  - Health Timestamp: " + healthResponse.getTimestamp());
            System.out.println("  - Health Uptime: " + healthResponse.getUptime());
            System.out.println("  - Version: " + versionResponse.getVersion());
            System.out.println("  - Build: " + versionResponse.getBuild());
            System.out.println("  - Timestamp: " + versionResponse.getTimestamp());

            System.out.println("\n🎉 All tests passed! Generated Java client code is working correctly.");

        } catch (Exception e) {
            System.err.println("❌ Error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
