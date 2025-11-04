import { db } from './src/db';

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema constraints...');
  
  try {
    // Check if categoryId column allows NULL values
    const schemaInfo = await db.execute(`
      SELECT 
        column_name, 
        is_nullable, 
        column_default,
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'experience' 
      AND column_name = 'categoryId'
    `);
    
    console.log('📋 CategoryId column info:', schemaInfo.rows);
    
    // Also check if there are any constraints on categoryId
    const constraints = await db.execute(`
      SELECT 
        tc.constraint_name, 
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'experience'
      AND kcu.column_name = 'categoryId'
    `);
    
    console.log('🔒 CategoryId constraints:', constraints.rows);
    
  } catch (error) {
    console.error('❌ Failed to check schema:', error);
  }
}

checkDatabaseSchema();