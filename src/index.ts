import { type Glyph, Networks, Client } from "colorglyph-sdk";
import { IRequest, IttyRouter, error, json, withParams } from 'itty-router'
import { paletteToBase64 } from './utils';

export interface Env {

}

const router = IttyRouter()

router
	.all('*', withParams)
	.get('/.well-known/apple-app-site-association', () => {
		return json({
			"webcredentials": {
				"apps": [
					"T4GBHCYB7P.com.example.apple-samplecode.ShinyT4GBHCYB7P",
					"T4GBHCYB7P.com.example.apple-samplecode.Food-TruckT4GBHCYB7P",
					"T4GBHCYB7P.io.colorglyph.app"
				]
			},
		}, {
			headers: {
				'access-control-allow-origin': '*',
				'content-type': 'text/plain'
			}
		})
	})
	.get('/:hash.png', async ({ hash }) => {
		const pubkey = 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE'
		const contractId = "CAMCM4WTWRM2UZBI7CEQE4HI2PZEAE3ZBDDNJTI3RB6CIZRJKRGXEHWK"
		const networkPassphrase = Networks.PUBLIC
		const rpcUrl = 'https://mainnet.stellar.validationcloud.io/v1/l2ADLNFEi0TT0loic8mjHnUmq5gmVQxT8a7iaWZqYUc'

		let width: number
		let palette: number[]

		const ColorglyphSDK = new Client({
			publicKey: pubkey,
			contractId,
			networkPassphrase,
			rpcUrl
		});

		let { result } = await ColorglyphSDK.glyph_get({
			hash_type: {
				tag: 'Glyph',
				values: [Buffer.from(hash, 'hex')]
			}
		})

		const glyph = result.unwrap().values[0] as Glyph

		width = glyph.width

		palette = new Array(glyph.length).fill(256 ** 3 - 1);

		for (const [_account, colors] of glyph.colors)
			for (const [color, indexes] of colors)
				for (const index of indexes as number[])
					palette.splice(index, 1, Number(color))

		const image = await paletteToBase64(palette, width, 32)

		return new Response(image, {
			headers: {
				'content-length': image.length.toString(),
				'content-type': 'image/png'
			}
		});
	})
	.all('*', () => error(404))

export default {
	fetch: (request: IRequest, ...args: any[]) =>
		router
			.fetch(request, ...args)
			.catch((err) => {
				console.error(err)
				return error(err)
			})
}