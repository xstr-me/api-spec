<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec\Tests\Symfony;

use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use XstrMe\ApiSpec\Symfony\XstrMeApiSpecExtension;
use XstrMe\ApiSpec\ApiSpec;

/**
 * Test cases for the Symfony extension.
 */
class XstrMeApiSpecExtensionTest extends TestCase
{
    public function testLoad(): void
    {
        $container = new ContainerBuilder();
        $extension = new XstrMeApiSpecExtension();
        
        $extension->load([], $container);
        
        // Check that the service is registered
        $this->assertTrue($container->hasDefinition('xstr_me_api_spec.api_spec'));
        
        // Check that aliases are created
        $this->assertTrue($container->hasAlias(ApiSpec::class));
        $this->assertTrue($container->hasAlias('xstr_me.api_spec'));
        
        // Check that the service is public
        $definition = $container->getDefinition('xstr_me_api_spec.api_spec');
        $this->assertTrue($definition->isPublic());
    }
    
    public function testGetAlias(): void
    {
        $extension = new XstrMeApiSpecExtension();
        $this->assertEquals('xstr_me_api_spec', $extension->getAlias());
    }
}
