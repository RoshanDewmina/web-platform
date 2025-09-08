// Test script to verify API endpoints
// Run this after logging in to get your auth token from the browser

const API_BASE = 'http://localhost:3000/api';

// You need to get this from your browser after logging in
// In Chrome DevTools: Application > Cookies > __clerk_db_jwt
const AUTH_TOKEN = process.argv[2];

if (!AUTH_TOKEN) {
  console.error('Usage: node scripts/test-api-endpoints.js <auth-token>');
  console.error('\nTo get your auth token:');
  console.error('1. Log in to the app');
  console.error('2. Open Chrome DevTools (F12)');
  console.error('3. Go to Application > Cookies');
  console.error('4. Copy the value of __clerk_db_jwt');
  process.exit(1);
}

const headers = {
  'Cookie': `__clerk_db_jwt=${AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    
    const data = await response.json().catch(() => response.text());
    
    if (response.ok) {
      console.log(`✅ ${name}: Success`);
      return data;
    } else {
      console.log(`❌ ${name}: Failed (${response.status})`);
      console.log(`   Response:`, data);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test GET endpoints
  console.log('📋 Testing GET endpoints:');
  const courses = await testEndpoint('GET /api/courses', `${API_BASE}/courses`);
  const progress = await testEndpoint('GET /api/progress', `${API_BASE}/progress`);
  
  if (courses && courses.length > 0) {
    const courseId = courses[0].id;
    await testEndpoint(`GET /api/courses/${courseId}`, `${API_BASE}/courses/${courseId}`);
    
    // Test enrollment
    console.log('\n📝 Testing enrollment:');
    const enrollment = await testEndpoint(
      `POST /api/courses/${courseId}/enroll`,
      `${API_BASE}/courses/${courseId}/enroll`,
      { method: 'POST' }
    );
    
    if (enrollment) {
      console.log('   Enrolled successfully!');
      
      // Test unenrollment
      await testEndpoint(
        `DELETE /api/courses/${courseId}/enroll`,
        `${API_BASE}/courses/${courseId}/enroll`,
        { method: 'DELETE' }
      );
    }
  }
  
  // Test progress tracking
  console.log('\n📊 Testing progress tracking:');
  if (courses && courses.length > 0) {
    await testEndpoint(
      'POST /api/progress (session_start)',
      `${API_BASE}/progress`,
      {
        method: 'POST',
        body: JSON.stringify({
          type: 'session_start',
          data: {
            courseId: courses[0].id,
            totalSlides: 10,
            deviceInfo: { browser: 'test' },
          },
        }),
      }
    );
  }
  
  console.log('\n✨ Testing complete!');
}

runTests();
