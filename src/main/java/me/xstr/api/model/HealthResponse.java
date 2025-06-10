package me.xstr.api.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.OffsetDateTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.io.Serializable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * HealthResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.13.0")
public class HealthResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * Health status of the API
   */
  public enum StatusEnum {
    HEALTHY("healthy"),
    
    UNHEALTHY("unhealthy");

    private final String value;

    StatusEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static StatusEnum fromValue(String value) {
      for (StatusEnum b : StatusEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }

  private StatusEnum status;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime timestamp;

  private String version;

  private String uptime;

  public HealthResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public HealthResponse(StatusEnum status, OffsetDateTime timestamp) {
    this.status = status;
    this.timestamp = timestamp;
  }

  public HealthResponse status(StatusEnum status) {
    this.status = status;
    return this;
  }

  /**
   * Health status of the API
   * @return status
   */
  @NotNull 
  @Schema(name = "status", description = "Health status of the API", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("status")
  public StatusEnum getStatus() {
    return status;
  }

  public void setStatus(StatusEnum status) {
    this.status = status;
  }

  public HealthResponse timestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Timestamp of the health check
   * @return timestamp
   */
  @NotNull @Valid 
  @Schema(name = "timestamp", description = "Timestamp of the health check", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("timestamp")
  public OffsetDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public HealthResponse version(String version) {
    this.version = version;
    return this;
  }

  /**
   * API version
   * @return version
   */
  
  @Schema(name = "version", description = "API version", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("version")
  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public HealthResponse uptime(String uptime) {
    this.uptime = uptime;
    return this;
  }

  /**
   * API uptime duration
   * @return uptime
   */
  
  @Schema(name = "uptime", example = "2d 5h 30m", description = "API uptime duration", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("uptime")
  public String getUptime() {
    return uptime;
  }

  public void setUptime(String uptime) {
    this.uptime = uptime;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    HealthResponse healthResponse = (HealthResponse) o;
    return Objects.equals(this.status, healthResponse.status) &&
        Objects.equals(this.timestamp, healthResponse.timestamp) &&
        Objects.equals(this.version, healthResponse.version) &&
        Objects.equals(this.uptime, healthResponse.uptime);
  }

  @Override
  public int hashCode() {
    return Objects.hash(status, timestamp, version, uptime);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class HealthResponse {\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    timestamp: ").append(toIndentedString(timestamp)).append("\n");
    sb.append("    version: ").append(toIndentedString(version)).append("\n");
    sb.append("    uptime: ").append(toIndentedString(uptime)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

