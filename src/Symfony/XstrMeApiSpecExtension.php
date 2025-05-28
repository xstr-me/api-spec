<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec\Symfony;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Definition;
use XstrMe\ApiSpec\ApiSpec;

/**
 * Symfony DependencyInjection extension for XStr.me API Specification.
 * 
 * This extension registers the ApiSpec service in the Symfony container
 * and provides configuration options for the API specification.
 */
class XstrMeApiSpecExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        // Register the ApiSpec service
        $definition = new Definition(ApiSpec::class);
        $definition->setPublic(true);
        $container->setDefinition('xstr_me_api_spec.api_spec', $definition);
        
        // Create an alias for easier access
        $container->setAlias(ApiSpec::class, 'xstr_me_api_spec.api_spec');
        $container->setAlias('xstr_me.api_spec', 'xstr_me_api_spec.api_spec');
    }
    
    public function getAlias(): string
    {
        return 'xstr_me_api_spec';
    }
}
