#!/usr/bin/env node

/**
 * Development utilities script for the Xstr.me API Spec workspace
 * Provides common development tasks and workspace management
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Configuration
const config = {
  workspacePackages: ['src/main/typescript', 'src/test/typescript'],
  apiSpec: 'api-spec.yml',
  docsOutput: 'docs/api-docs.html',
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red,
  };

  console.log(
    `${colors[type]('[' + type.toUpperCase() + ']')} ${timestamp} - ${message}`
  );
}

function runCommand(command, options = {}) {
  log(`Executing: ${command}`, 'info');
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options,
    });
    return result;
  } catch (error) {
    log(`Command failed: ${error.message}`, 'error');
    throw error;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

// Tasks
async function validateEnvironment() {
  log('Validating development environment...', 'info');

  const checks = [
    { name: 'Node.js', command: 'node --version' },
    { name: 'npm', command: 'npm --version' },
    { name: 'Maven', command: 'mvn --version' },
    { name: 'Git', command: 'git --version' },
  ];

  const results = [];

  for (const check of checks) {
    try {
      const version = runCommand(check.command, { silent: true }).trim();
      results.push({ name: check.name, status: 'OK', version });
      log(`${check.name}: ${version}`, 'success');
    } catch (error) {
      results.push({ name: check.name, status: 'MISSING', version: null });
      log(`${check.name}: Not found or not working`, 'error');
    }
  }

  // Check required files
  const requiredFiles = [config.apiSpec, 'package.json', 'pom.xml'];
  for (const file of requiredFiles) {
    if (checkFileExists(file)) {
      log(`Required file ${file}: Found`, 'success');
    } else {
      log(`Required file ${file}: Missing`, 'error');
    }
  }

  return results;
}

async function cleanWorkspace() {
  log('Cleaning workspace...', 'info');

  const cleanCommands = [
    'npm run clean',
    'npm run workspace:clean',
    'mvn clean',
  ];

  for (const command of cleanCommands) {
    try {
      runCommand(command);
    } catch (error) {
      log(`Clean command failed: ${command}`, 'warning');
    }
  }

  log('Workspace cleaned successfully', 'success');
}

async function setupWorkspace() {
  log('Setting up workspace...', 'info');

  const setupCommands = [
    'npm install',
    'npm run workspace:install',
    'mvn validate',
  ];

  for (const command of setupCommands) {
    runCommand(command);
  }

  log('Workspace setup completed', 'success');
}

async function runTests() {
  log('Running all tests...', 'info');

  const testCommands = ['npm run ci:test', 'mvn test'];

  for (const command of testCommands) {
    runCommand(command);
  }

  log('All tests completed', 'success');
}

async function buildAll() {
  log('Building all components...', 'info');

  const buildCommands = [
    'npm run build',
    'npm run workspace:build',
    'mvn compile',
  ];

  for (const command of buildCommands) {
    runCommand(command);
  }

  log('Build completed successfully', 'success');
}

// Main CLI interface
async function main() {
  console.log(chalk.blue.bold('\n🔧 Xstr.me API Spec Development Utilities\n'));

  const { task } = await inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: 'What would you like to do?',
      choices: [
        { name: '🔍 Validate Environment', value: 'validate' },
        { name: '🧹 Clean Workspace', value: 'clean' },
        { name: '⚙️ Setup Workspace', value: 'setup' },
        { name: '🧪 Run Tests', value: 'test' },
        { name: '🏗️ Build All', value: 'build' },
        { name: '🔄 Full Reset & Setup', value: 'reset' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ]);

  switch (task) {
    case 'validate':
      await validateEnvironment();
      break;
    case 'clean':
      await cleanWorkspace();
      break;
    case 'setup':
      await setupWorkspace();
      break;
    case 'test':
      await runTests();
      break;
    case 'build':
      await buildAll();
      break;
    case 'reset':
      await cleanWorkspace();
      await setupWorkspace();
      await buildAll();
      break;
    case 'exit':
      log('Goodbye!', 'info');
      process.exit(0);
      break;
    default:
      log('Invalid task selected', 'error');
      process.exit(1);
  }

  log('Task completed successfully', 'success');
}

// Handle CLI arguments
if (process.argv.length > 2) {
  const task = process.argv[2];
  switch (task) {
    case 'validate':
      validateEnvironment();
      break;
    case 'clean':
      cleanWorkspace();
      break;
    case 'setup':
      setupWorkspace();
      break;
    case 'test':
      runTests();
      break;
    case 'build':
      buildAll();
      break;
    default:
      console.log('Available commands: validate, clean, setup, test, build');
      process.exit(1);
  }
} else {
  main().catch(error => {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  });
}
