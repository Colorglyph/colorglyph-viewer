import { type Glyph, Networks, Client } from "colorglyph-sdk";
import { paletteToBase64 } from '../src/utils';

const pubkey = 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE'
const contractId = "CAMCM4WTWRM2UZBI7CEQE4HI2PZEAE3ZBDDNJTI3RB6CIZRJKRGXEHWK"
const hash = '9eb925d1fe9970fc0e2e93ad1b4c8c1e92136600f9aac84b89dda44814d188cb'
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

const glyph = result.unwrap().values[0] as Glyph;

width = glyph.width

palette = new Array(glyph.length).fill(256 ** 3 - 1);

for (const [_account, colors] of glyph.colors)
    for (const [color, indexes] of colors)
        for (const index of indexes as number[])
            palette.splice(index, 1, Number(color))

const image = await paletteToBase64(palette, width, 32)

console.log(Buffer.from(image).toString('base64'));
