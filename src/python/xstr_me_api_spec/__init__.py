"""
XStr.me API Specification Python Package

This package provides convenient access to the XStr.me API OpenAPI specification
for Python applications.

Example usage:
    >>> from xstr_me_api_spec import ApiSpec
    >>> spec_dict = ApiSpec.get_api_spec_as_dict()
    >>> spec_yaml = ApiSpec.get_api_spec_as_yaml()
    >>> spec_json = ApiSpec.get_api_spec_as_json()
"""

from .api_spec import ApiSpec

__version__ = "1.0.0"
__author__ = "XStr.me Team"
__email__ = "dev@xstr.me"
__license__ = "MIT"

__all__ = ["ApiSpec"]
