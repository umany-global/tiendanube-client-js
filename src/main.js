import RESTClient from '@umany-global/rest-client-js';

export default class TiendanubeClient {

	#client;
	#authClient;
	#clientId;
	#clientSecret;
	#delay;

	constructor ( config = {} ) {

		this.#clientId 		= config.clientId;
		this.#clientSecret 	= config.clientSecret;
		this.#delay			= config.delay ?? 1000;

		this.#client = new RESTClient({
			...( config ), 
			...({ 
				baseUrl: "https://api.tiendanube.com/" + ( config.version ?? 'v1' ),
				baseHeaders: {
					'User-Agent': 'Umany (contact@umany.global)',
				},
			}),
		});

		this.#authClient = new RESTClient({
			...( config ), 
			...({ 
				baseUrl: 'https://www.tiendanube.com',
			}),
		});

	}

	// params.id - order identifier
	// params.store_id - shop identifier
	// options.auth - access token
	getOrderById ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/orders/'+params.id,
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}

	// params.id - shop identifier
	// options.auth - access token
	getStore ( id, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+id+'/store',
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}

	// params.store_id - shop identifier
	// options.auth - access token
	createWebhook ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.post({
				path: '/'+params.store_id+'/webhooks',
				data: {
					event: params.event,
					url: params.url,
				},
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}

	// store_id - shop identifier
	// options.auth - access token
	getWebhooks ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/webhooks',
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}


	// params.id - webhook identifier
	// params.store_id - shop identifier
	// options.auth - access token
	deleteWebhook ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.post({
				path: '/'+params.store_id+'/webhooks/'+params.id,
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}


	// params.store_id - shop identifier
	// params.src - source url for the script
	// params.event - tiendanube event identifier
	// params.where - tiendanube flow identifier
	// options.auth - access token
	addScript ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.post({
				path: '/'+params.store_id+'/scripts',
				data: {
					src: params.src,
					event: params.event,
					where: params.where,
				},
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}


	// params.id - script identifier
	// params.store_id - shop identifier
	// options.auth - access token
	removeScript ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.post({
				path: '/'+params.store_id+'/scripts/'+params.id,
				auth: options.auth,
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		});

	}


	getAccessToken ( params = {} ) {

		return new Promise ( ( resolve, reject ) => {

			// verify if authorization code is present before calling the API
			if ( params.code ) {

				this.#authClient.post({
					path: '/apps/authorize/token',
					data: {
						client_id: params.clientId ?? this.#clientId,
						client_secret: params.clientSecret ?? this.#clientSecret,
						grant_type: 'authorization_code',
						code: params.code,
					},
					timeout: params.timeout ?? 60000,
				}).then( data => {

					resolve( data );

				}).catch( err => {

					reject( err );
				});

			}
			else {

				reject( new Error('Param required: code') );
			}
		});

	}


	#avoidRateLimit ( ) {

		return new Promise ( resolve => {

			try {

				// check if requestDelay param was set
				if ( this.#delay ) {

					// delay api call
					setTimeout( 
						() => {

							resolve()
						},
						this.#delay
					);
				}
				else {

					// do nothing
					resolve();
				}

			}
			catch ( err ) {

				reject( err );
			}

		});
	}

}