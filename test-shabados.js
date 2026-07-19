/**
 * Quick test to see what's available in ShabadOS database
 */
const Database = require('@shabados/database');

async function testConnection() {
  try {
    console.log('Testing ShabadOS Database connection...\n');
    
    const db = new Database();
    
    // Query for Dasam Granth sources
    console.log('Querying for Dasam Granth compositions...\n');
    
    // This will show us the structure and what's available
    const sources = await db.query(`
      SELECT * FROM Sources WHERE name_english LIKE '%Dasam%' LIMIT 10
    `);
    
    console.log('Available Dasam sources:', JSON.stringify(sources, null, 2));
    
    // Try to get compositions
    const compositions = await db.query(`
      SELECT * FROM Compositions WHERE source_id IN (SELECT id FROM Sources WHERE name_english LIKE '%Dasam%') LIMIT 10
    `);
    
    console.log('\nAvailable compositions:', JSON.stringify(compositions, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nNote: The exact API might be different. Checking documentation...');
  }
}

testConnection();
