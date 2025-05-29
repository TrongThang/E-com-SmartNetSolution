// test-sse.js
const EventSource = require('eventsource');
const axios = require('axios');

// Test configuration
const API_URL = 'http://localhost:8888';
const TEST_SERIAL = 'TEST123';
const TEST_EMPLOYEE = 'EMP001';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Helper function to print colored messages
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test cases
async function runTests() {
    log('\n=== Starting SSE Test ===\n', 'cyan');

    // Test 1: Connect to SSE
    log('Test 1: Testing SSE Connection...', 'yellow');
    try {
        const eventSource = new EventSource(`${API_URL}/api/sse/events`);
        
        eventSource.onopen = () => {
            log('✓ SSE Connection established successfully', 'green');
        };

        eventSource.onerror = (error) => {
            log('✗ SSE Connection failed', 'red');
            console.error(error);
            process.exit(1);
        };

        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 2: Send test update
        log('\nTest 2: Testing Production Update...', 'yellow');
        try {
            const updateData = {
                device_serial: TEST_SERIAL,
                stage: 'assembly',
                status: 'in_progress',
                employee_id: TEST_EMPLOYEE
            };

            // Listen for the update
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'update_stage' && data.device_serial === TEST_SERIAL) {
                    log('✓ Received production update:', 'green');
                    console.log(data);
                }
            };

            // Send the update
            await axios.patch(`${API_URL}/api/production-tracking/update-serial`, updateData);
            log('✓ Update request sent', 'green');

            // Wait for update to be processed
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            log('✗ Failed to send test update', 'red');
            console.error(error);
        }

        // Cleanup
        log('\n=== Test Summary ===', 'cyan');
        log('All tests completed. Closing connection...', 'yellow');
        eventSource.close();
        log('Connection closed.', 'green');

    } catch (error) {
        log('✗ Test failed', 'red');
        console.error(error);
        process.exit(1);
    }
}

// Run the tests
runTests().catch(error => {
    log('✗ Test script failed', 'red');
    console.error(error);
    process.exit(1);
});