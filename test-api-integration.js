/**
 * API Integration Test Script
 * 
 * This script tests the backend API endpoints to ensure proper communication
 * between the frontend and backend.
 */

const API_BASE_URL = 'https://invoicesystembackend-1.onrender.com/api';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(name, method, endpoint, body = null, headers = {}) {
  log(`\nTesting: ${name}`, colors.cyan);
  log(`${method} ${API_BASE_URL}${endpoint}`, colors.blue);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (response.ok) {
      log(`✓ SUCCESS (${response.status})`, colors.green);
      log(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: true, data, status: response.status };
    } else {
      log(`✗ FAILED (${response.status})`, colors.yellow);
      log(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('='.repeat(60), colors.cyan);
  log('INVOICING FRONTEND - BACKEND API INTEGRATION TEST', colors.cyan);
  log('='.repeat(60), colors.cyan);
  log(`\nBackend URL: ${API_BASE_URL}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Test 1: Register a new user
  log('\n' + '='.repeat(60), colors.cyan);
  log('TEST 1: User Registration', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  const timestamp = Date.now();
  const testUser = {
    email: `testuser${timestamp}@example.com`,
    password: 'Password123!',
    name: 'Test User',
  };

  const registerResult = await testEndpoint(
    'Register New User',
    'POST',
    '/auth/register',
    testUser
  );
  results.total++;
  if (registerResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }

  let authToken = null;
  if (registerResult.success && registerResult.data.access_token) {
    authToken = registerResult.data.access_token;
    log(`\nAuth token received: ${authToken.substring(0, 20)}...`, colors.green);
  }

  // Test 2: Login with the created user
  log('\n' + '='.repeat(60), colors.cyan);
  log('TEST 2: User Login', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  const loginResult = await testEndpoint(
    'Login',
    'POST',
    '/auth/login',
    {
      email: testUser.email,
      password: testUser.password,
    }
  );
  results.total++;
  if (loginResult.success) {
    results.passed++;
    if (loginResult.data.access_token) {
      authToken = loginResult.data.access_token;
      log(`\nUpdated auth token: ${authToken.substring(0, 20)}...`, colors.green);
    }
  } else {
    results.failed++;
  }

  // Test 3: Get current user info
  if (authToken) {
    log('\n' + '='.repeat(60), colors.cyan);
    log('TEST 3: Get Current User', colors.cyan);
    log('='.repeat(60), colors.cyan);
    
    const meResult = await testEndpoint(
      'Get Current User',
      'GET',
      '/auth/me',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    results.total++;
    if (meResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    log('\n⚠ Skipping authenticated tests - no auth token available', colors.yellow);
  }

  // Test 4: Get invoices list
  if (authToken) {
    log('\n' + '='.repeat(60), colors.cyan);
    log('TEST 4: Get Invoices List', colors.cyan);
    log('='.repeat(60), colors.cyan);
    
    const invoicesResult = await testEndpoint(
      'Get Invoices',
      'GET',
      '/invoices',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    results.total++;
    if (invoicesResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Test 5: Login with invalid credentials (should fail)
  log('\n' + '='.repeat(60), colors.cyan);
  log('TEST 5: Login with Invalid Credentials (Expected to Fail)', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  const invalidLoginResult = await testEndpoint(
    'Login with Invalid Credentials',
    'POST',
    '/auth/login',
    {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    }
  );
  results.total++;
  // This test should fail, so we consider it passed if it returns an error
  if (!invalidLoginResult.success && invalidLoginResult.status >= 400) {
    results.passed++;
    log('✓ Correctly rejected invalid credentials', colors.green);
  } else {
    results.failed++;
    log('✗ Should have rejected invalid credentials', colors.red);
  }

  // Test 6: Access protected endpoint without auth (should fail)
  log('\n' + '='.repeat(60), colors.cyan);
  log('TEST 6: Access Protected Endpoint Without Auth (Expected to Fail)', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  const unauthResult = await testEndpoint(
    'Get Invoices Without Auth',
    'GET',
    '/invoices'
  );
  results.total++;
  // This test should fail, so we consider it passed if it returns 401
  if (!unauthResult.success && unauthResult.status === 401) {
    results.passed++;
    log('✓ Correctly rejected unauthenticated request', colors.green);
  } else {
    results.failed++;
    log('✗ Should have rejected unauthenticated request with 401', colors.red);
  }

  // Print summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('TEST SUMMARY', colors.cyan);
  log('='.repeat(60), colors.cyan);
  log(`Total Tests: ${results.total}`);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  log('='.repeat(60) + '\n', colors.cyan);

  if (results.failed === 0) {
    log('🎉 All tests passed! Backend integration is working correctly.', colors.green);
  } else {
    log('⚠ Some tests failed. Please review the results above.', colors.yellow);
  }
}

// Run the tests
runTests().catch(error => {
  log(`\n✗ Test suite failed: ${error.message}`, colors.red);
  process.exit(1);
});
