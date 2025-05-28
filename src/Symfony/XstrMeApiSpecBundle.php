<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec\Symfony;

use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Symfony Bundle for XStr.me API Specification.
 * 
 * This bundle integrates the XStr.me API specification into Symfony applications,
 * providing easy access to the OpenAPI specification through dependency injection.
 */
class XstrMeApiSpecBundle extends Bundle
{
    public function getContainerExtension(): ?XstrMeApiSpecExtension
    {
        return new XstrMeApiSpecExtension();
    }
}
