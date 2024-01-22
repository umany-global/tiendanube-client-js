import RESTClient from '@umany-global/rest-client-js';

const defaultUserAgent = 'Umany (dev@umany.global)';


export default class TiendanubeClient {

	#client;
	#authClient;

	constructor ( config = {} ) {

		this.#client = new RESTClient(
			Object.assign( 
				config, 
				{ 
					baseUrl: "https://api.tiendanube.com/" + ( config.version ?? 'v1' ),
				}
			)
		);

		this.#authClient = new RESTClient(
			Object.assign( 
				config, 
				{ 
					baseUrl: 'https://www.tiendanube.com/apps/authorize/token',
				}
			)
		);

	}

	// params.id - order identifier
	// params.store_id - shop identifier
	// options.auth - access token
	getOrderById ( params, options = {} ) {

		return this.#client.get({
			path: '/'+params.store_id+'/orders/'+params.id,
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});
	}

	// params.id - shop identifier
	// options.auth - access token
	getStore ( id, options = {} ) {

		return this.#client.get({
			path: '/'+id+'/store',
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});
	}

	// params.store_id - shop identifier
	// options.auth - access token
	createWebhook ( params, options = {} ) {

		return this.#client.post({
			path: '/'+params.store_id+'/webhooks',
			data: {
				event: params.event,
				url: params.url,
			},
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});

	}

	// store_id - shop identifier
	// options.auth - access token
	getWebhooks ( store_id, options = {} ) {

		return this.#client.get({
			path: '/'+store_id+'/webhooks',
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});
	}


	// params.id - webhook identifier
	// params.store_id - shop identifier
	// options.auth - access token
	deleteWebhook ( params, options = {} ) {

		return this.#client.post({
			path: '/'+params.store_id+'/webhooks/'+params.id,
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});

	}


	// params.store_id - shop identifier
	// params.src - source url for the script
	// params.event - tiendanube event identifier
	// params.where - tiendanube flow identifier
	// options.auth - access token
	addScript ( params, options = {} ) {

		return this.#client.post({
			path: '/'+params.store_id+'/scripts',
			data: {
				src: params.src,
				event: params.event,
				where: params.where,
			},
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});

	}


	// params.id - script identifier
	// params.store_id - shop identifier
	// options.auth - access token
	removeScript ( params, options = {} ) {

		return this.#client.post({
			path: '/'+params.store_id+'/scripts/'+params.id,
			auth: options.auth,
			headers: {
				'User-Agent': config.userAgent ?? defaultUserAgent,
			},
		});

	}


	getAccessToken ( params, options = {} ) {

		return new Promise ( ( resolve, reject ) => {

			// verify if authorization code is present before calling the API
			if ( params.code ) {

				this.#authClient.post({
					path: '/apps/authorize/token',
					data: {
						client_id: params.clientId,
						client_secret: params.clientSecret,
						grant_type: 'authorization_code',
						code: params.code,
					},
					timeout: options.timeout ?? 0,
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

}