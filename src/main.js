import Client from '@umany/service-sdk-js';


export default class TiendanubeClient {


	constructor ( config ) {

		config.baseUrl = "https://api.tiendanube.com/" + ( config.version ?? 'v1' );

		super ( config );
	}


	post ( params ) {

		return this.#transform( params ).then( t_params => {

			return this.#request( t_params );

		});

	}


	get ( params ) { 

		return this.#transform( params ).then( t_params => {

			return this.#request( t_params );

		});
	}


	patch ( params ) {

		return this.#transform( params ).then( t_params => {

			return this.#request( t_params );

		});
	}


	delete ( params ) {

		return this.#transform( params ).then( t_params => {

			return this.#request( t_params );

		});
	}


	put ( params ) {

		return this.#transform( params ).then( t_params => {

			return this.#request( t_params );

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


	#transform ( params ) {

		return Promise( resolve => {

			params.headers['User-Agent'] = 'umany (dev@umany.global)';

			resolve( params );
		});
	}

}