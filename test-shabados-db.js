// Test script to check Shabados Database integration
const createDatabaseClient = require('@shabados/database').default;

console.log('Testing Shabados Database integration...\n');

try {
  const db = createDatabaseClient();
  console.log('✅ Database client created successfully!\n');

  // Test querying banis
  db.query.banis.findMany().then(banis => {
    console.log(`Found ${banis.length} banis in database:`);
    banis.forEach(bani => {
      console.log(`- ${bani.id}: ${bani.name?.gurmukhi || bani.name?.english || bani.id}`);
    });
  }).catch(error => {
    console.error('❌ Error querying banis:', error.message);
  });

} catch (error) {
  console.error('❌ Error creating database client:', error.message);
  console.error('\nFull error:', error);
}
