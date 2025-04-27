// This script runs the Teams to Organizations migration
const { spawn } = require('child_process');
const path = require('path');

console.log('Running Teams to Organizations migration script...');

// Run the TypeScript migration script using ts-node
const migrationProcess = spawn(
  'npx', 
  ['ts-node', path.join(__dirname, 'scripts', 'migrateTeamsToOrganizations.ts')],
  { stdio: 'inherit' }
);

migrationProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('Migration completed successfully!');
    process.exit(0);
  } else {
    console.error(`Migration failed with code ${code}`);
    process.exit(code);
  }
});

migrationProcess.on('error', (err) => {
  console.error('Failed to start migration process:', err);
  process.exit(1);
}); 