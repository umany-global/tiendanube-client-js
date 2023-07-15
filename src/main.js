import ServiceSDKBase 			from '@umany/service-sdk-js';
import axios 					from 'axios';
import { UnautorizedException } from '@umany/http-exceptions-js';


export default class TiendanubeClient extends ServiceSDKBase {

	#conf;

	constructor ( config = {} ) {
	
		super( 
			Object.assign( 
				config, 
				{ 
					baseUrl: "https://api.tiendanube.com/" + ( config.version ?? 'v1' ),
				}
			)
		);

		this.#conf = config;
	}


	post ( params ) {

		return this.#transform( params ).then( t_params => {

			return super.post( t_params );

		});

	}


	get ( params ) { 

		return this.#transform( params ).then( t_params => {

			return super.get( t_params );

		});
	}


	patch ( params ) {

		return this.#transform( params ).then( t_params => {

			return super.patch( t_params );

		});
	}


	delete ( params ) {

		return this.#transform( params ).then( t_params => {

			return super.delete( t_params );

		});
	}


	put ( params ) {

		return this.#transform( params ).then( t_params => {

			return super.put( t_params );

		});
	}


	getOrderById ( id ) {

		return this.get({
			path: '/orders/'+id,
		});
	}


	getStore ( ) {

		return this.get({
			path: '/store',
		});
	}


	createWebhook ( data ) {

		return this.post({
			path: '/webhooks',
			data,
		});

	}


	deleteWebhook ( id ) {

		return this.post({
			path: '/webhooks/'+id,
		});

	}


	addScript ( data ) {

		this.post({
			path: '/scripts',
			data,
		});

	}


	removeScript ( id ) {

		return this.post({
			path: '/scripts/'+id,
		});

	}


	getAccessToken ( authorization_code, options = {} ) {

		return new Promise ( ( resolve, reject ) => {

			// verify if authorization code is present before calling the API
			if ( req.query.code ) {

				axios({
					baseURL: 'https://www.tiendanube.com',
					method: 'POST',
					url: '/apps/authorize/token',
					responseType: 'json',
					responseEncoding: 'utf8',
					headers: {
						'Content-Type': 'application/json',
					},
					data: {
						client_id: this.#conf.clientId ?? options.clientId,
						client_secret: this.#conf.clientSecret ?? options.clientSecret,
						grant_type: 'authorization_code',
						code: authorization_code,
					},
					timeout: 0,
				}).then( response => {

					resolve( response.data );

				}).catch( err => {

					if ( 
						err.response?.status == 401
						|| err.response?.status == 403
					) 
					{
						reject( new UnautorizedException );
					}
					else {

						reject( err );
					}
				});

			}
			else {

				reject( new UnautorizedException );
			}
		});


	}


	#transform ( params ) {

		return Promise( resolve => {

			// add umany as user-agent
			params.headers['User-Agent'] = 'umany (dev@umany.global)';

			resolve( params );
		});
	}

}