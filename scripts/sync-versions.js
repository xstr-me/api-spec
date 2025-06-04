#!/usr/bin/env node

/**
 * Version synchronization script for workspace
 * Syncs version from root package.json to all workspace packages
 */

const fs = require('fs');
const path = require('path');

// Read root package.json version
const rootPackagePath = path.join(__dirname, '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const version = rootPackage.version;

console.log(`Synchronizing version ${version} across workspace...`);

// Workspace packages to update
const workspacePackages = [
  'src/main/typescript/package.json',
  'src/test/typescript/package.json',
];

let updated = 0;

workspacePackages.forEach(packagePath => {
  const fullPath = path.join(__dirname, '..', packagePath);

  if (fs.existsSync(fullPath)) {
    try {
      const package = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const oldVersion = package.version;

      package.version = version;

      fs.writeFileSync(fullPath, JSON.stringify(package, null, 2) + '\n');

      console.log(`✓ Updated ${packagePath}: ${oldVersion} → ${version}`);
      updated++;
    } catch (error) {
      console.error(`✗ Failed to update ${packagePath}:`, error.message);
    }
  } else {
    console.warn(`⚠ Package not found: ${packagePath}`);
  }
});

console.log(`\nVersion synchronization complete. Updated ${updated} packages.`);

// Update Maven POM version if needed
const pomPath = path.join(__dirname, '..', 'pom.xml');
if (fs.existsSync(pomPath)) {
  try {
    let pomContent = fs.readFileSync(pomPath, 'utf8');
    const versionRegex = /<version>([^<]+)<\/version>/;
    const match = pomContent.match(versionRegex);

    if (match && match[1] !== version) {
      pomContent = pomContent.replace(
        versionRegex,
        `<version>${version}</version>`
      );
      fs.writeFileSync(pomPath, pomContent);
      console.log(`✓ Updated pom.xml version: ${match[1]} → ${version}`);
    } else {
      console.log(`✓ POM version already synchronized: ${version}`);
    }
  } catch (error) {
    console.error(`✗ Failed to update pom.xml:`, error.message);
  }
}
