
const axios = require('axios')

const API_BASE = 'https://api.sfox.com'
let FEE_BUFFER = null

function create_headers() {
    return {
        'Authorization': 'Bearer ' + process.env.SFOX_API_KEY,
        'Content-Type': 'application/json',
    }
}

async function get_withdrawal_fee() {
    if (!process.env.SFOX_API_KEY) {
        throw new Error('SFOX_API_KEY must be set')
    }
    const request = '/v1/withdraw-fee/btc'
    const body = {
        request,
    }
    const headers = create_headers()
    const { data } = await axios.get(`${API_BASE}${request}`, { headers }).catch(err => {
        console.log(err)
        throw new Error(err)
    })
    FEE_BUFFER = data.fee
    console.log(`SFOX withdrawal fee is ${FEE_BUFFER} BTC`)
}

async function get_btc_balance() {
    if (!process.env.SFOX_API_KEY) {
        throw new Error('SFOX_API_KEY must be set')
    }
    const request = '/v1/user/balance'
    const body = {
        request,
    }
    const headers = create_headers()
    const { data } = await axios.get(`${API_BASE}${request}`, { headers }).catch(err => {
        console.log(err)
        throw new Error(err)
    })
    const btc_balance = data.find(({ currency }) => currency === 'btc')
    return btc_balance.available
}

async function withdraw({ amount_btc }) {
    if (!process.env.SFOX_API_KEY) {
        throw new Error('SFOX_API_KEY must be set')
    }
    if (!process.env.SFOX_WITHDRAWAL_ADDRESS) {
        throw new Error('SFOX_WITHDRAWAL_ADDRESS must be set ')
    }
    // if (!FEE_BUFFER) {
    //     await get_withdrawal_fee()
    // }
    const currency = 'btc'
    const request = '/v1/user/withdraw'
    const address = process.env.SFOX_WITHDRAWAL_ADDRESS
    // const amount = (amount_btc - FEE_BUFFER).toFixed(8)
    const amount = amount_btc.toFixed(8)
    const body = {
        currency, address, amount
    }
    // console.log(body)
    const headers = create_headers()
    const { data } = await axios.post(`${API_BASE}${request}`, body, { headers }).catch(err => {
        console.log(err.message)
        throw new Error(err)
    })
    console.log(data)
}

async function get_deposit_address() {
    if (!process.env.SFOX_DEPOSIT_ADDRESS) {
        throw new Error('SFOX_DEPOSIT_ADDRESS must be set')
    }
    return process.env.SFOX_DEPOSIT_ADDRESS
}

module.exports = {
    get_btc_balance,
    withdraw,
    get_deposit_address
}