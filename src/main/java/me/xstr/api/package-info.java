/**
 * XStr.me API Specification Utility Package.
 * 
 * <p>This package provides utilities for accessing and working with the XStr.me 
 * OpenAPI specification. The specification is bundled within the JAR and can be 
 * accessed programmatically through the {@link me.xstr.api.ApiSpec} utility class.</p>
 * 
 * <h2>Usage Examples</h2>
 * 
 * <h3>Getting the API Specification as a String</h3>
 * <pre>{@code
 * import me.xstr.api.ApiSpec;
 * import java.io.IOException;
 * 
 * public class Example {
 *     public void readApiSpec() throws IOException {
 *         String apiSpec = ApiSpec.getApiSpecAsString();
 *         System.out.println("API Specification:");
 *         System.out.println(apiSpec);
 *     }
 * }
 * }</pre>
 * 
 * <h3>Getting the API Specification as an InputStream</h3>
 * <pre>{@code
 * import me.xstr.api.ApiSpec;
 * import java.io.InputStream;
 * 
 * public class Example {
 *     public void processApiSpec() {
 *         try (InputStream stream = ApiSpec.getApiSpecAsStream()) {
 *             // Process the stream as needed
 *             // For example, pass to a YAML parser
 *         }
 *     }
 * }
 * }</pre>
 * 
 * <h3>Checking Availability and Version</h3>
 * <pre>{@code
 * import me.xstr.api.ApiSpec;
 * 
 * public class Example {
 *     public void checkApiSpec() {
 *         if (ApiSpec.isAvailable()) {
 *             String version = ApiSpec.getVersion();
 *             System.out.println("XStr.me API Specification version: " + version);
 *         } else {
 *             System.err.println("API specification not found!");
 *         }
 *     }
 * }
 * }</pre>
 * 
 * <h2>Integration with YAML Parsers</h2>
 * 
 * <p>The API specification can be easily integrated with popular YAML parsing libraries:</p>
 * 
 * <h3>Using SnakeYAML</h3>
 * <pre>{@code
 * import me.xstr.api.ApiSpec;
 * import org.yaml.snakeyaml.Yaml;
 * import java.io.IOException;
 * import java.util.Map;
 * 
 * public class YamlExample {
 *     public void parseApiSpec() throws IOException {
 *         Yaml yaml = new Yaml();
 *         String apiSpecContent = ApiSpec.getApiSpecAsString();
 *         Map<String, Object> apiSpec = yaml.load(apiSpecContent);
 *         
 *         // Access API information
 *         Map<String, Object> info = (Map<String, Object>) apiSpec.get("info");
 *         String title = (String) info.get("title");
 *         String version = (String) info.get("version");
 *         
 *         System.out.println("API Title: " + title);
 *         System.out.println("API Version: " + version);
 *     }
 * }
 * }</pre>
 * 
 * <h3>Using Jackson YAML</h3>
 * <pre>{@code
 * import me.xstr.api.ApiSpec;
 * import com.fasterxml.jackson.databind.ObjectMapper;
 * import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
 * import java.io.IOException;
 * import java.util.Map;
 * 
 * public class JacksonExample {
 *     public void parseApiSpec() throws IOException {
 *         ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
 *         String apiSpecContent = ApiSpec.getApiSpecAsString();
 *         Map<String, Object> apiSpec = mapper.readValue(apiSpecContent, Map.class);
 *         
 *         // Process the parsed API specification
 *         System.out.println("Parsed API Specification: " + apiSpec);
 *     }
 * }
 * }</pre>
 * 
 * <h2>Error Handling</h2>
 * 
 * <p>All methods in this package provide appropriate error handling:</p>
 * <ul>
 * <li>{@link me.xstr.api.ApiSpec#getApiSpecAsStream()} throws {@link IllegalStateException} 
 *     if the specification cannot be found</li>
 * <li>{@link me.xstr.api.ApiSpec#getApiSpecAsString()} throws {@link java.io.IOException} 
 *     if there's an error reading the specification, and {@link IllegalStateException} 
 *     if the specification cannot be found</li>
 * <li>{@link me.xstr.api.ApiSpec#isAvailable()} never throws exceptions and can be used 
 *     for safe availability checking</li>
 * <li>{@link me.xstr.api.ApiSpec#getVersion()} never throws exceptions and provides 
 *     fallback version information</li>
 * </ul>
 * 
 * <h2>Thread Safety</h2>
 * 
 * <p>All methods in this package are thread-safe and can be called concurrently 
 * from multiple threads without external synchronization.</p>
 * 
 * <h2>Resource Management</h2>
 * 
 * <p>When using {@link me.xstr.api.ApiSpec#getApiSpecAsStream()}, ensure proper 
 * resource management by closing the stream when done, preferably using try-with-resources 
 * as shown in the examples above.</p>
 * 
 * @since 0.0.1-alpha
 * @version 0.0.1-alpha
 * @author XStr.me Development Team
 */
package me.xstr.api;
