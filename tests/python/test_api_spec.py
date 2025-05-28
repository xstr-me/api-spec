"""
Test cases for the ApiSpec class.

This module contains comprehensive tests for the Python ApiSpec utility class,
following the same test patterns as the PHP implementation.
"""

import json
import pytest
from typing import Dict, Any

from xstr_me_api_spec import ApiSpec
from xstr_me_api_spec.api_spec import ApiSpecError


class TestApiSpec:
    """Test cases for the ApiSpec class."""
    
    def setup_method(self):
        """Clear cache before each test."""
        ApiSpec.clear_cache()
    
    def test_api_spec_is_available(self):
        """Test that the API specification is available."""
        # Test by trying to load it
        spec = ApiSpec.get_api_spec_as_dict()
        assert isinstance(spec, dict)
        assert len(spec) > 0
    
    def test_get_api_spec_as_dict(self):
        """Test getting API spec as dictionary."""
        spec = ApiSpec.get_api_spec_as_dict()
        
        assert isinstance(spec, dict)
        assert "openapi" in spec
        assert "info" in spec
        assert "paths" in spec
        assert spec["openapi"] == "3.0.3"
        
        # Verify it's a copy (modifications don't affect original)
        spec["test_key"] = "test_value"
        spec2 = ApiSpec.get_api_spec_as_dict()
        assert "test_key" not in spec2
    
    def test_get_api_spec_as_yaml(self):
        """Test getting API spec as YAML string."""
        yaml_content = ApiSpec.get_api_spec_as_yaml()
        
        assert isinstance(yaml_content, str)
        assert "openapi: 3.0.3" in yaml_content
        assert "title: XStr.me API" in yaml_content
        assert len(yaml_content) > 0
    
    def test_get_api_spec_as_json(self):
        """Test getting API spec as JSON string."""
        json_content = ApiSpec.get_api_spec_as_json()
        
        assert isinstance(json_content, str)
        # Verify it's valid JSON
        decoded = json.loads(json_content)
        assert isinstance(decoded, dict)
        assert decoded["openapi"] == "3.0.3"
    
    def test_get_api_spec_as_json_with_indent(self):
        """Test getting API spec as formatted JSON."""
        json_content = ApiSpec.get_api_spec_as_json(indent=2)
        
        assert isinstance(json_content, str)
        # Should contain indentation (pretty printed)
        assert "  " in json_content or "\\n" in json_content
        
        # Verify it's valid JSON
        decoded = json.loads(json_content)
        assert isinstance(decoded, dict)
        assert decoded["openapi"] == "3.0.3"
    
    def test_get_api_version(self):
        """Test getting API version."""
        version = ApiSpec.get_api_version()
        
        assert isinstance(version, str)
        assert version == "1.0.0"
    
    def test_get_api_title(self):
        """Test getting API title."""
        title = ApiSpec.get_api_title()
        
        assert isinstance(title, str)
        assert title == "XStr.me API"
    
    def test_get_api_description(self):
        """Test getting API description."""
        description = ApiSpec.get_api_description()
        
        assert isinstance(description, str)
        assert len(description) > 0
        assert "XStr.me" in description
    
    def test_get_servers(self):
        """Test getting server configurations."""
        servers = ApiSpec.get_servers()
        
        assert isinstance(servers, list)
        assert len(servers) > 0
        
        for server in servers:
            assert isinstance(server, dict)
            assert "url" in server
            assert "description" in server
    
    def test_get_paths(self):
        """Test getting API paths."""
        paths = ApiSpec.get_paths()
        
        assert isinstance(paths, dict)
        assert len(paths) > 0
        
        # Check for expected paths
        path_list = list(paths.keys())
        assert "/health" in path_list
    
    def test_cache_is_working(self):
        """Test that caching mechanism works properly."""
        # First call should load from file
        spec1 = ApiSpec.get_api_spec_as_dict()
        
        # Second call should use cache
        spec2 = ApiSpec.get_api_spec_as_dict()
        
        assert spec1 == spec2
        
        # Clear cache and verify it's cleared
        ApiSpec.clear_cache()
        spec3 = ApiSpec.get_api_spec_as_dict()
        
        assert spec1 == spec3
    
    def test_yaml_cache_is_working(self):
        """Test that YAML caching works properly."""
        # First call should load from file
        yaml1 = ApiSpec.get_api_spec_as_yaml()
        
        # Second call should use cache
        yaml2 = ApiSpec.get_api_spec_as_yaml()
        
        assert yaml1 == yaml2
        assert yaml1 is yaml2  # Should be the same object (cached)
        
        # Clear cache and verify it's cleared
        ApiSpec.clear_cache()
        yaml3 = ApiSpec.get_api_spec_as_yaml()
        
        assert yaml1 == yaml3
        assert yaml1 is not yaml3  # Should be different objects after cache clear
    
    def test_cannot_instantiate(self):
        """Test that ApiSpec cannot be instantiated."""
        with pytest.raises(AssertionError, match="Utility class should not be instantiated"):
            ApiSpec()
    
    def test_clear_cache(self):
        """Test clearing the cache."""
        # Load spec to populate cache
        ApiSpec.get_api_spec_as_dict()
        ApiSpec.get_api_spec_as_yaml()
        
        # Verify cache is populated
        assert ApiSpec._cached_spec is not None
        assert ApiSpec._cached_yaml is not None
        
        # Clear cache
        ApiSpec.clear_cache()
        
        # Verify cache is cleared
        assert ApiSpec._cached_spec is None
        assert ApiSpec._cached_yaml is None
    
    def test_error_handling_missing_version(self, monkeypatch):
        """Test error handling when version is missing from spec."""
        def mock_load_spec():
            return {"info": {"title": "Test"}}  # Missing version
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="API version not found"):
            ApiSpec.get_api_version()
    
    def test_error_handling_missing_title(self, monkeypatch):
        """Test error handling when title is missing from spec."""
        def mock_load_spec():
            return {"info": {"version": "1.0.0"}}  # Missing title
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="API title not found"):
            ApiSpec.get_api_title()
    
    def test_error_handling_missing_description(self, monkeypatch):
        """Test error handling when description is missing from spec."""
        def mock_load_spec():
            return {"info": {"version": "1.0.0", "title": "Test"}}  # Missing description
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="API description not found"):
            ApiSpec.get_api_description()
    
    def test_servers_default_empty_list(self, monkeypatch):
        """Test that get_servers returns empty list when servers not defined."""
        def mock_load_spec():
            return {"info": {"version": "1.0.0"}}  # No servers
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        servers = ApiSpec.get_servers()
        assert servers == []
    
    def test_paths_default_empty_dict(self, monkeypatch):
        """Test that get_paths returns empty dict when paths not defined."""
        def mock_load_spec():
            return {"info": {"version": "1.0.0"}}  # No paths
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        paths = ApiSpec.get_paths()
        assert paths == {}


class TestApiSpecErrorHandling:
    """Test error handling scenarios."""
    
    def setup_method(self):
        """Clear cache before each test."""
        ApiSpec.clear_cache()
    
    def test_missing_yaml_dependency(self, monkeypatch):
        """Test error when PyYAML is not available."""
        # Mock yaml module to be None
        import xstr_me_api_spec.api_spec
        monkeypatch.setattr(xstr_me_api_spec.api_spec, "yaml", None)
        ApiSpec.clear_cache()
        
        with pytest.raises(ImportError, match="PyYAML is required"):
            ApiSpec.get_api_spec_as_dict()
    
    def test_missing_spec_file(self, monkeypatch):
        """Test error when API spec file is missing."""
        from pathlib import Path
        
        # Mock the path to point to non-existent file
        fake_path = Path("/non/existent/path/api-spec.yml")
        monkeypatch.setattr(ApiSpec, "_API_SPEC_PATH", fake_path)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="API specification not found"):
            ApiSpec.get_api_spec_as_dict()
    
    def test_invalid_yaml_content(self, monkeypatch, tmp_path):
        """Test error when YAML content is invalid."""
        # Create a temporary file with invalid YAML
        invalid_yaml_file = tmp_path / "invalid.yml"
        invalid_yaml_file.write_text("invalid: yaml: content: [unclosed", encoding='utf-8')
        
        monkeypatch.setattr(ApiSpec, "_API_SPEC_PATH", invalid_yaml_file)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="Failed to parse API specification YAML"):
            ApiSpec.get_api_spec_as_dict()
    
    def test_unreadable_file(self, monkeypatch):
        """Test error when file cannot be read."""
        from pathlib import Path
        
        # Mock Path.read_text to raise OSError
        def mock_read_text(*args, **kwargs):
            raise OSError("Permission denied")
        
        mock_path = Path("test.yml")
        monkeypatch.setattr(mock_path, "exists", lambda: True)
        monkeypatch.setattr(mock_path, "read_text", mock_read_text)
        monkeypatch.setattr(ApiSpec, "_API_SPEC_PATH", mock_path)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="Failed to read API specification"):
            ApiSpec.get_api_spec_as_yaml()
    
    def test_json_serialization_error(self, monkeypatch):
        """Test error when JSON serialization fails."""
        def mock_load_spec():
            # Return something that can't be JSON serialized
            class NonSerializable:
                pass
            return {"data": NonSerializable()}
        
        monkeypatch.setattr(ApiSpec, "_load_and_parse_spec", mock_load_spec)
        ApiSpec.clear_cache()
        
        with pytest.raises(ApiSpecError, match="Failed to serialize API specification to JSON"):
            ApiSpec.get_api_spec_as_json()
