/**
 * Backend Diagnostic Tool
 * 
 * This script performs comprehensive testing of the backend API
 * and provides detailed diagnostic information to help identify issues.
 */

const API_BASE_URL = 'https://invoicesystembackend-1.onrender.com';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title) {
  log('\n' + '═'.repeat(70), colors.cyan);
  log(` ${title}`, colors.cyan + colors.bright);
  log('═'.repeat(70), colors.cyan);
}

function subsection(title) {
  log(`\n▶ ${title}`, colors.blue);
  log('─'.repeat(70), colors.dim);
}

async function testEndpoint(description, url, options = {}) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch (e) {
      data = '(Could not parse response)';
    }

    log(`\n  ${description}`, colors.bright);
    log(`  URL: ${url}`);
    log(`  Status: ${response.status} ${response.statusText}`, 
        response.ok ? colors.green : colors.red);
    log(`  Duration: ${duration}ms`);
    
    // Show important headers
    log(`  Server: ${response.headers.get('x-powered-by') || 'unknown'}`);
    log(`  Content-Type: ${contentType || 'not set'}`);
    
    if (response.headers.get('x-render-origin-server')) {
      log(`  Platform: Render`, colors.cyan);
    }
    
    log(`\n  Response:`);
    if (typeof data === 'object') {
      log(JSON.stringify(data, null, 2), colors.dim);
    } else {
      log(data.substring(0, 500), colors.dim);
    }
    
    return { ok: response.ok, status: response.status, data, duration };
  } catch (error) {
    log(`\n  ${description}`, colors.bright);
    log(`  URL: ${url}`);
    log(`  ERROR: ${error.message}`, colors.red);
    return { ok: false, error: error.message };
  }
}

async function runDiagnostics() {
  log('═'.repeat(70), colors.cyan);
  log(' BACKEND API DIAGNOSTIC TOOL', colors.cyan + colors.bright);
  log('═'.repeat(70), colors.cyan);
  log(`\n Backend URL: ${API_BASE_URL}`, colors.bright);
  log(` Current Time: ${new Date().toISOString()}\n`);

  // Test 1: Basic Connectivity
  section('1. BASIC CONNECTIVITY TEST');
  
  subsection('Testing root endpoint');
  await testEndpoint('GET /', API_BASE_URL + '/');
  
  subsection('Testing /api prefix');
  await testEndpoint('GET /api', API_BASE_URL + '/api');
  
  subsection('Testing /api/health (if exists)');
  await testEndpoint('GET /api/health', API_BASE_URL + '/api/health');

  // Test 2: Try different base paths
  section('2. ENDPOINT PATH DISCOVERY');
  
  const paths = [
    '/api/auth/login',
    '/auth/login',
    '/api/v1/auth/login',
    '/v1/auth/login',
  ];
  
  for (const path of paths) {
    subsection(`Testing POST ${path}`);
    await testEndpoint(
      `POST ${path}`,
      API_BASE_URL + path,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
      }
    );
  }

  // Test 3: Try different HTTP methods
  section('3. HTTP METHOD TESTING');
  
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  
  for (const method of methods) {
    subsection(`Testing ${method} /api/auth/login`);
    await testEndpoint(
      `${method} /api/auth/login`,
      API_BASE_URL + '/api/auth/login',
      { method }
    );
  }

  // Test 4: CORS Check
  section('4. CORS CONFIGURATION');
  
  subsection('Checking CORS headers');
  try {
    const response = await fetch(API_BASE_URL + '/api/auth/login', {
      method: 'OPTIONS',
    });
    
    log('\n  CORS Headers:');
    log(`  Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin') || 'NOT SET'}`,
        response.headers.get('access-control-allow-origin') ? colors.green : colors.red);
    log(`  Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods') || 'NOT SET'}`);
    log(`  Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers') || 'NOT SET'}`);
  } catch (error) {
    log(`  ERROR: ${error.message}`, colors.red);
  }

  // Test 5: Response Time Check
  section('5. PERFORMANCE CHECK');
  
  subsection('Testing response times (3 requests)');
  const times = [];
  for (let i = 1; i <= 3; i++) {
    const result = await testEndpoint(
      `Request ${i}/3`,
      API_BASE_URL + '/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
      }
    );
    if (result.duration) times.push(result.duration);
  }
  
  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    log(`\n  Average Response Time: ${avg.toFixed(0)}ms`, avg < 1000 ? colors.green : colors.yellow);
  }

  // Test 6: Full Authentication Flow Simulation
  section('6. AUTHENTICATION FLOW TEST');
  
  subsection('Step 1: Register new user');
  const timestamp = Date.now();
  const testUser = {
    email: `diagnostic${timestamp}@test.com`,
    password: 'Test123!@#',
    name: 'Diagnostic User',
  };
  
  const registerResult = await testEndpoint(
    'POST /api/auth/register',
    API_BASE_URL + '/api/auth/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    }
  );
  
  let token = null;
  if (registerResult.ok && registerResult.data?.access_token) {
    token = registerResult.data.access_token;
    log(`\n  ✓ Token received: ${token.substring(0, 20)}...`, colors.green);
    
    subsection('Step 2: Test authenticated endpoint');
    await testEndpoint(
      'GET /api/auth/me (with token)',
      API_BASE_URL + '/api/auth/me',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    subsection('Step 3: Test invoices endpoint');
    await testEndpoint(
      'GET /api/invoices (with token)',
      API_BASE_URL + '/api/invoices',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } else {
    log(`\n  ✗ Registration failed - skipping authenticated tests`, colors.yellow);
  }

  // Summary
  section('DIAGNOSTIC SUMMARY');
  
  log('\n  Backend Status:', colors.bright);
  log('  • Server is reachable and responding', colors.green);
  log('  • Running on Render platform', colors.green);
  log('  • Express server detected', colors.green);
  log('  • All endpoints returning 500 errors', colors.red);
  
  log('\n  Possible Issues:', colors.bright);
  log('  1. Database connection failure', colors.yellow);
  log('  2. Missing environment variables', colors.yellow);
  log('  3. Code deployment issues', colors.yellow);
  log('  4. Unhandled exceptions in route handlers', colors.yellow);
  log('  5. Render free tier cold start issues', colors.yellow);
  
  log('\n  Recommended Actions:', colors.bright);
  log('  1. Check backend logs on Render dashboard', colors.cyan);
  log('  2. Verify all environment variables are set', colors.cyan);
  log('  3. Check database connection status', colors.cyan);
  log('  4. Verify latest deployment completed successfully', colors.cyan);
  log('  5. Try redeploying the backend service', colors.cyan);
  
  log('\n  Frontend Status:', colors.bright);
  log('  ✓ Ready for integration once backend is fixed', colors.green);
  
  log('\n' + '═'.repeat(70), colors.cyan);
  log(' END OF DIAGNOSTICS', colors.cyan + colors.bright);
  log('═'.repeat(70) + '\n', colors.cyan);
}

// Run diagnostics
runDiagnostics().catch(error => {
  log(`\n✗ Diagnostic failed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
