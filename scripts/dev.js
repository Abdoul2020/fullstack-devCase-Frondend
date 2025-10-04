#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const port = process.env.PORT || '3001';
const isDev = process.argv.includes('--dev');

const command = isDev ? 'next' : 'next';
const args = isDev 
  ? ['dev', '--turbopack', '--port', port]
  : ['start', '--port', port];

console.log(`Starting Next.js on port ${port}...`);

const child = spawn('npx', [command, ...args], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: port }
});

child.on('error', (error) => {
  console.error('Error starting Next.js:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});
