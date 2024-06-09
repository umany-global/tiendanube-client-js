import RESTClient 				from '@umany-global/rest-client-js';
import UnauthorizedException 	from '@umany-global/http-exceptions-js';

export default class TiendanubeClient {

	#client;
	#authClient;
	#clientId;
	#clientSecret;
	#delay;

	constructor ( config = {} ) {

		this.#clientId 		= config.clientId;
		this.#clientSecret 	= config.clientSecret;
		this.#delay			= config.delay ?? 500;

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
	getOrder ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/orders/'+params.id,
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			}).then( response => {

				return response.data;

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

		}).then( response => {

			return response.data;
			
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

		}).then( response => {

			return response.data;
			
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

		}).then( response => {

			return response.data;
			
		});

	}


	// id - webhook identifier
	// store_id - shop identifier
	// options.auth - access token
	updateWebhook ( params, attributes, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/webhooks/'+params.id,
				data: {
					event: attributes.event,
					url: attributes.url,
				},
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		}).then( response => {

			return response.data;
			
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

		}).then( response => {

			return response.data;
			
		});

	}


	// store_id - shop identifier
	// options.auth - access token
	getScripts ( params, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/scripts',
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		}).then( response => {

			return response.data;
			
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

		}).then( response => {

			return response.data;
			
		});

	}


	// id - script id
	// store_id - shop identifier
	// options.auth - access token
	updateScript ( params, attributes, options = {} ) {

		return this.#avoidRateLimit().then( () => {

			return this.#client.get({
				path: '/'+params.store_id+'/scripts/'+params.id,
				data: {
					src: attributes.src,
					event: attributes.event,
					where: attributes.where,
				},
				headers: {
					'Authentication': 'bearer ' + options.auth,
				},
			});

		}).then( response => {

			return response.data;
			
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

		}).then( response => {

			return response.data;
			
		});

	}


	getAccessToken ( params = {} ) {

		return new Promise ( ( resolve, reject ) => {

			try {

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
					}).then( response => {

						resolve( response.data );

					}).catch( err => {

						reject( err );
					});

				}
				else {

					reject( new UnauthorizedException );
				}
			}
			catch ( err ) {

				reject( err );
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
						this.#delay + 1
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