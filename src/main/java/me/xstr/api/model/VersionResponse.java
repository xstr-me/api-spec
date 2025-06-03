package me.xstr.api.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import org.springframework.format.annotation.DateTimeFormat;
import java.io.Serializable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * VersionResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
public class VersionResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private String version;

  private String build;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime timestamp;

  public VersionResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public VersionResponse(String version, String build) {
    this.version = version;
    this.build = build;
  }

  public VersionResponse version(String version) {
    this.version = version;
    return this;
  }

  /**
   * API version
   * @return version
  */
  @NotNull 
  @Schema(name = "version", description = "API version", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("version")
  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public VersionResponse build(String build) {
    this.build = build;
    return this;
  }

  /**
   * Build number or commit hash
   * @return build
  */
  @NotNull 
  @Schema(name = "build", description = "Build number or commit hash", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("build")
  public String getBuild() {
    return build;
  }

  public void setBuild(String build) {
    this.build = build;
  }

  public VersionResponse timestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Build timestamp
   * @return timestamp
  */
  @Valid 
  @Schema(name = "timestamp", description = "Build timestamp", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("timestamp")
  public OffsetDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    VersionResponse versionResponse = (VersionResponse) o;
    return Objects.equals(this.version, versionResponse.version) &&
        Objects.equals(this.build, versionResponse.build) &&
        Objects.equals(this.timestamp, versionResponse.timestamp);
  }

  @Override
  public int hashCode() {
    return Objects.hash(version, build, timestamp);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class VersionResponse {\n");
    sb.append("    version: ").append(toIndentedString(version)).append("\n");
    sb.append("    build: ").append(toIndentedString(build)).append("\n");
    sb.append("    timestamp: ").append(toIndentedString(timestamp)).append("\n");
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

