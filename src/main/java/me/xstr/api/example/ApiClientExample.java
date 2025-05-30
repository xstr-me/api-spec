package me.xstr.api.example;

import me.xstr.api.client.ApiClient;
import me.xstr.api.client.api.HealthApi;
import me.xstr.api.client.api.InfoApi;
import me.xstr.api.client.model.HealthResponse;
import me.xstr.api.client.model.VersionResponse;

/**
 * Example usage of the generated XStr.me API client
 */
public class ApiClientExample {

    public static void main(String[] args) {
        // Configure the API client
        ApiClient apiClient = Configuration.getDefaultApiClient();
        apiClient.setBasePath("https://api.xstr.me/v1");

        // Create API instances
        HealthApi healthApi = new HealthApi(apiClient);
        InfoApi infoApi = new InfoApi(apiClient);

        try {
            // Example: Check API health
            HealthResponse health = healthApi.getHealth();
            System.out.println("API Status: " + health.getStatus());
            System.out.println("API Version: " + health.getVersion());
            System.out.println("API Uptime: " + health.getUptime());

            // Example: Get API version
            VersionResponse version = infoApi.getVersion();
            System.out.println("Version: " + version.getVersion());
            System.out.println("Build: " + version.getBuild());

        } catch (Exception e) {
            System.err.println("Error calling API: " + e.getMessage());
        }
    }
}
