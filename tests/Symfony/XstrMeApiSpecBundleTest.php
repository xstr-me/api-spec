<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec\Tests\Symfony;

use PHPUnit\Framework\TestCase;
use XstrMe\ApiSpec\Symfony\XstrMeApiSpecBundle;
use XstrMe\ApiSpec\Symfony\XstrMeApiSpecExtension;

/**
 * Test cases for the Symfony bundle.
 */
class XstrMeApiSpecBundleTest extends TestCase
{
    public function testGetContainerExtension(): void
    {
        $bundle = new XstrMeApiSpecBundle();
        $extension = $bundle->getContainerExtension();
        
        $this->assertInstanceOf(XstrMeApiSpecExtension::class, $extension);
    }
}
