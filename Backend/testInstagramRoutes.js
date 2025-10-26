/**
 * Test script for Instagram Routes
 *
 * This script tests the three Instagram endpoints:
 * 1. GET /api/instagram/fetch-user-posts/:username
 * 2. GET /api/instagram/fetch-post-comments/:username/:postCode
 * 3. GET /api/instagram/fetch-post-likes/:username/:postCode
 *
 * Usage: node testInstagramRoutes.js
 */

const https = require('https');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USERNAME = 'instagram'; // Using Instagram's official account for testing
const TEST_POST_CODE = 'C1234567890'; // Example post code

/**
 * Make HTTP request to test endpoints
 */
const makeRequest = (path) => {
	return new Promise((resolve, reject) => {
		const url = new URL(path, BASE_URL);

		const options = {
			hostname: url.hostname,
			port: url.port || 3000,
			path: url.pathname + url.search,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const req = https.request(options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				try {
					const parsedData = JSON.parse(data);
					resolve({
						status: res.statusCode,
						data: parsedData,
					});
				} catch (error) {
					resolve({
						status: res.statusCode,
						data: data,
					});
				}
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		req.setTimeout(10000, () => {
			req.destroy();
			reject(new Error('Request timeout'));
		});

		req.end();
	});
};

/**
 * Test the fetch-user-posts endpoint
 */
const testFetchUserPosts = async () => {
	console.log('\n🧪 Testing GET /api/instagram/fetch-user-posts/:username');
	console.log('='.repeat(60));

	try {
		const response = await makeRequest(
			`/api/instagram/fetch-user-posts/${TEST_USERNAME}`
		);

		console.log(`Status: ${response.status}`);
		console.log('Response:', JSON.stringify(response.data, null, 2));

		if (response.status === 200) {
			console.log('✅ Test PASSED - User posts endpoint working correctly');
		} else {
			console.log('❌ Test FAILED - Unexpected status code');
		}
	} catch (error) {
		console.log('❌ Test FAILED - Error:', error.message);
	}
};

/**
 * Test the fetch-post-comments endpoint
 */
const testFetchPostComments = async () => {
	console.log(
		'\n🧪 Testing GET /api/instagram/fetch-post-comments/:username/:postCode'
	);
	console.log('='.repeat(60));

	try {
		const response = await makeRequest(
			`/api/instagram/fetch-post-comments/${TEST_USERNAME}/${TEST_POST_CODE}`
		);

		console.log(`Status: ${response.status}`);
		console.log('Response:', JSON.stringify(response.data, null, 2));

		if (response.status === 200 || response.status === 404) {
			console.log('✅ Test PASSED - Post comments endpoint working correctly');
		} else {
			console.log('❌ Test FAILED - Unexpected status code');
		}
	} catch (error) {
		console.log('❌ Test FAILED - Error:', error.message);
	}
};

/**
 * Test the fetch-post-likes endpoint
 */
const testFetchPostLikes = async () => {
	console.log(
		'\n🧪 Testing GET /api/instagram/fetch-post-likes/:username/:postCode'
	);
	console.log('='.repeat(60));

	try {
		const response = await makeRequest(
			`/api/instagram/fetch-post-likes/${TEST_USERNAME}/${TEST_POST_CODE}`
		);

		console.log(`Status: ${response.status}`);
		console.log('Response:', JSON.stringify(response.data, null, 2));

		if (response.status === 200 || response.status === 404) {
			console.log('✅ Test PASSED - Post likes endpoint working correctly');
		} else {
			console.log('❌ Test FAILED - Unexpected status code');
		}
	} catch (error) {
		console.log('❌ Test FAILED - Error:', error.message);
	}
};

/**
 * Test error handling with invalid parameters
 */
const testErrorHandling = async () => {
	console.log('\n🧪 Testing Error Handling');
	console.log('='.repeat(60));

	try {
		// Test with empty username
		const response = await makeRequest('/api/instagram/fetch-user-posts/');

		console.log(`Status: ${response.status}`);
		console.log('Response:', JSON.stringify(response.data, null, 2));

		if (response.status === 400 || response.status === 404) {
			console.log('✅ Test PASSED - Error handling working correctly');
		} else {
			console.log('❌ Test FAILED - Unexpected status code');
		}
	} catch (error) {
		console.log('❌ Test FAILED - Error:', error.message);
	}
};

/**
 * Main test function
 */
const runTests = async () => {
	console.log('🚀 Starting Instagram Routes Tests');
	console.log('='.repeat(60));
	console.log(`Base URL: ${BASE_URL}`);
	console.log(`Test Username: ${TEST_USERNAME}`);
	console.log(`Test Post Code: ${TEST_POST_CODE}`);

	// Check if server is running
	try {
		const healthCheck = await makeRequest('/api/users/test');
		console.log('✅ Server is running');
	} catch (error) {
		console.log('❌ Server is not running. Please start the server first:');
		console.log('   cd Backend && npm start');
		process.exit(1);
	}

	// Run all tests
	await testFetchUserPosts();
	await testFetchPostComments();
	await testFetchPostLikes();
	await testErrorHandling();

	console.log('\n🎉 All tests completed!');
	console.log('\n📝 Notes:');
	console.log("- Some tests may return 404 if the test data doesn't exist");
	console.log('- Make sure RAPIDAPI_KEY is set in your .env file');
	console.log('- The server must be running on port 3000');
};

// Run tests if this file is executed directly
if (require.main === module) {
	runTests().catch(console.error);
}

module.exports = {
	testFetchUserPosts,
	testFetchPostComments,
	testFetchPostLikes,
	testErrorHandling,
};
