"""
Utility class for accessing the XStr.me API specification in Python applications.

This module provides convenient methods to load and access the OpenAPI
specification that is bundled with this package.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any, Optional

try:
    import yaml
except ImportError:
    yaml = None


class ApiSpecError(Exception):
    """Base exception for API specification related errors."""
    pass


class ApiSpec:
    """
    Utility class for accessing the XStr.me API specification.
    
    This class provides convenient methods to load and access the OpenAPI
    specification that is bundled with this package.
    
    Example:
        >>> from xstr_me_api_spec import ApiSpec
        >>> spec_dict = ApiSpec.get_api_spec_as_dict()
        >>> spec_yaml = ApiSpec.get_api_spec_as_yaml()
        >>> spec_json = ApiSpec.get_api_spec_as_json()
    """
    
    _API_SPEC_PATH = Path(__file__).parent / "api-spec.yml"
    _cached_spec: Optional[Dict[str, Any]] = None
    _cached_yaml: Optional[str] = None
    
    def __init__(self) -> None:
        """Private constructor to prevent instantiation."""
        raise AssertionError("Utility class should not be instantiated")
    
    @classmethod
    def get_api_spec_as_dict(cls) -> Dict[str, Any]:
        """
        Get the API specification as a Python dictionary.
        
        Returns:
            Dict[str, Any]: The parsed API specification
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
            ImportError: If PyYAML is not installed
        """
        if cls._cached_spec is None:
            cls._cached_spec = cls._load_and_parse_spec()
        
        return cls._cached_spec.copy()
    
    @classmethod
    def get_api_spec_as_yaml(cls) -> str:
        """
        Get the API specification as YAML string.
        
        Returns:
            str: The API specification YAML content
            
        Raises:
            ApiSpecError: If the API specification cannot be found
        """
        if cls._cached_yaml is None:
            if not cls._API_SPEC_PATH.exists():
                raise ApiSpecError(
                    f"API specification not found at: {cls._API_SPEC_PATH}"
                )
            
            try:
                cls._cached_yaml = cls._API_SPEC_PATH.read_text(encoding='utf-8')
            except OSError as e:
                raise ApiSpecError(
                    f"Failed to read API specification: {e}"
                ) from e
        
        return cls._cached_yaml
    
    @classmethod
    def get_api_spec_as_json(cls, indent: Optional[int] = None) -> str:
        """
        Get the API specification as JSON string.
        
        Args:
            indent: Number of spaces for JSON indentation. None for compact format.
        
        Returns:
            str: The API specification JSON content
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec_dict = cls.get_api_spec_as_dict()
        try:
            return json.dumps(spec_dict, indent=indent, ensure_ascii=False)
        except (TypeError, ValueError) as e:
            raise ApiSpecError(
                f"Failed to serialize API specification to JSON: {e}"
            ) from e
    
    @classmethod
    def get_api_version(cls) -> str:
        """
        Get the API version from the specification.
        
        Returns:
            str: The API version
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec = cls.get_api_spec_as_dict()
        try:
            return spec["info"]["version"]
        except KeyError as e:
            raise ApiSpecError(
                f"API version not found in specification: {e}"
            ) from e
    
    @classmethod
    def get_api_title(cls) -> str:
        """
        Get the API title from the specification.
        
        Returns:
            str: The API title
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec = cls.get_api_spec_as_dict()
        try:
            return spec["info"]["title"]
        except KeyError as e:
            raise ApiSpecError(
                f"API title not found in specification: {e}"
            ) from e
    
    @classmethod
    def get_api_description(cls) -> str:
        """
        Get the API description from the specification.
        
        Returns:
            str: The API description
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec = cls.get_api_spec_as_dict()
        try:
            return spec["info"]["description"]
        except KeyError as e:
            raise ApiSpecError(
                f"API description not found in specification: {e}"
            ) from e
    
    @classmethod
    def get_servers(cls) -> list:
        """
        Get the server configurations from the specification.
        
        Returns:
            list: List of server configurations
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec = cls.get_api_spec_as_dict()
        return spec.get("servers", [])
    
    @classmethod
    def get_paths(cls) -> Dict[str, Any]:
        """
        Get the API paths from the specification.
        
        Returns:
            Dict[str, Any]: Dictionary of API paths and their configurations
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
        """
        spec = cls.get_api_spec_as_dict()
        return spec.get("paths", {})
    
    @classmethod
    def _load_and_parse_spec(cls) -> Dict[str, Any]:
        """
        Load and parse the API specification file.
        
        Returns:
            Dict[str, Any]: The parsed API specification
            
        Raises:
            ApiSpecError: If the API specification cannot be found or parsed
            ImportError: If PyYAML is not installed
        """
        if yaml is None:
            raise ImportError(
                "PyYAML is required to parse the API specification. "
                "Install it with: pip install pyyaml"
            )
        
        if not cls._API_SPEC_PATH.exists():
            raise ApiSpecError(
                f"API specification not found at: {cls._API_SPEC_PATH}"
            )
        
        try:
            yaml_content = cls._API_SPEC_PATH.read_text(encoding='utf-8')
            return yaml.safe_load(yaml_content)
        except OSError as e:
            raise ApiSpecError(
                f"Failed to read API specification: {e}"
            ) from e
        except yaml.YAMLError as e:
            raise ApiSpecError(
                f"Failed to parse API specification YAML: {e}"
            ) from e
    
    @classmethod
    def clear_cache(cls) -> None:
        """
        Clear the internal cache for the API specification.
        
        This method is useful for testing or when the specification file
        might have changed during runtime.
        """
        cls._cached_spec = None
        cls._cached_yaml = None
