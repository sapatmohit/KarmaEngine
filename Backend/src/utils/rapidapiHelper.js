const https = require('https');

/**
 * Utility function to make requests to RapidAPI Instagram scraper endpoints
 * Uses native https module as requested
 *
 * @param {string} path - The API endpoint path (e.g., '/userposts/?username_or_id=instagram')
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<Object>} - Parsed JSON response from the API
 * @throws {Error} - If API request fails or returns invalid response
 */
const fetchFromRapidAPI = (path, retries = 3) => {
	return new Promise((resolve, reject) => {
		// Validate environment variable
		if (!process.env.RAPIDAPI_KEY) {
			reject(new Error('RAPIDAPI_KEY environment variable is not set'));
			return;
		}

		// Construct the full URL
		const baseUrl = 'instagram-scraper-20251.p.rapidapi.com';
		const fullPath = path.startsWith('/') ? path : `/${path}`;

		// Request options
		const options = {
			hostname: baseUrl,
			port: 443,
			path: fullPath,
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'instagram-scraper-20251.p.rapidapi.com',
				'x-rapidapi-key': process.env.RAPIDAPI_KEY,
				'User-Agent': 'KarmaEngine/1.0',
			},
		};

		console.log(`Making RapidAPI request to: ${baseUrl}${fullPath}`);

		// Make the HTTPS request
		const req = https.request(options, (res) => {
			let data = '';

			// Collect response data
			res.on('data', (chunk) => {
				data += chunk;
			});

			// Handle response completion
			res.on('end', () => {
				try {
					// Check for HTTP errors
					if (res.statusCode < 200 || res.statusCode >= 300) {
						console.error(
							`RapidAPI request failed with status: ${res.statusCode}`
						);
						console.error(`Response: ${data}`);
						
						// Retry on 5xx errors
						if (res.statusCode >= 500 && retries > 0) {
							console.log(`Retrying... (${retries} attempts left)`);
							setTimeout(() => {
								fetchFromRapidAPI(path, retries - 1)
									.then(resolve)
									.catch(reject);
							}, 1000); // Wait 1 second before retry
							return;
						}
						
						reject(
							new Error(
								`API request failed with status ${res.statusCode}: ${data}`
							)
						);
						return;
					}

					// Parse JSON response
					const parsedData = JSON.parse(data);
					console.log(
						`RapidAPI request successful. Response size: ${data.length} bytes`
					);
					resolve(parsedData);
				} catch (parseError) {
					console.error('Failed to parse RapidAPI response:', parseError);
					console.error('Raw response:', data);
					reject(
						new Error(`Failed to parse API response: ${parseError.message}`)
					);
				}
			});
		});

		// Handle request errors
		req.on('error', (error) => {
			console.error('RapidAPI request error:', error);
			// Provide more specific error messages
			if (error.code === 'ECONNRESET') {
				// Retry on connection reset
				if (retries > 0) {
					console.log(`Retrying... (${retries} attempts left)`);
					setTimeout(() => {
						fetchFromRapidAPI(path, retries - 1)
							.then(resolve)
							.catch(reject);
					}, 1000); // Wait 1 second before retry
					return;
				}
				reject(new Error('Connection reset by server after multiple attempts. This might be due to network issues or server overload.'));
			} else if (error.code === 'ENOTFOUND') {
				reject(new Error('DNS lookup failed. Please check your internet connection.'));
			} else {
				reject(new Error(`Network error: ${error.message}`));
			}
		});

		// Set timeout to prevent hanging requests (increased to 60 seconds)
		req.setTimeout(60000, () => {
			req.destroy();
			// Retry on timeout
			if (retries > 0) {
				console.log(`Retrying... (${retries} attempts left)`);
				setTimeout(() => {
					fetchFromRapidAPI(path, retries - 1)
						.then(resolve)
						.catch(reject);
				}, 1000); // Wait 1 second before retry
				return;
			}
			reject(new Error('Request timeout after 60 seconds after multiple attempts. The server might be slow or unreachable.'));
		});

		// Send the request
		req.end();
	});
};

module.exports = {
	fetchFromRapidAPI,
};