const fs = require('fs');

// Read the .env file
let content = fs.readFileSync('.env', 'utf8');

// Replace the DATABASE_URL
content = content.replace(
  'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"',
  'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/web_platform?schema=public"'
);

// Write it back
fs.writeFileSync('.env', content);

console.log('Updated DATABASE_URL in .env file');
