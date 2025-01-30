import dotenv from 'dotenv';
dotenv.config();
    
console.log('Testing environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing');
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY ? '✅ Found' : '❌ Missing');

// Print first few characters of each to verify content (but not full credentials)
console.log('\nFirst 10 chars of DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 10) + '...');
console.log('First 10 chars of TMDB_API_KEY:', process.env.TMDB_API_KEY?.substring(0, 10) + '...'); 