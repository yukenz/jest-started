import {describe, test} from '@jest/globals';
import {keccak256, stringToHex} from 'viem'
import {privateKeyToAccount} from "viem/accounts";
import {accessCard} from "../src/tap2payhelper.ts";
import {backendHost} from "../src/create-client.ts";

// API yang digunakan untuk EDC
describe('Payment EDC', () => {

    // Digunakan untuk mendapatkan secret key, yang mana untuk build wallet di Viem
    test('Payment Request', async () => {

        /*
        * Testing Variable
        * */
        const cardUUID = "94a57839-b7ef-4ff7-a1d6-54d37315a635"
        const cardPIN = "1234"

        const paymentRequestResponse = await fetch(backendHost + "/api/v2/tap2pay/payment-request", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                hashCard: keccak256(stringToHex(cardUUID)),
                hashPin: keccak256(stringToHex(cardPIN)),
                merchantId: "0",
                merchantKey: "merchantKey0",
                terminalId: "0",
                terminalKey: "terminalKey0",
                paymentAmount: 20000
            })
        });


        const response = await paymentRequestResponse.json() as {
            "fromAddress": string,
            "secretKey": string,
            "error"?: string;
        }

        const privateKey = accessCard(cardUUID, cardPIN, response.secretKey);
        const account = privateKeyToAccount(privateKey);

        console.log({
            address: account.address,
            pivateKey: privateKey,
            secretKey : response.secretKey
        })
    })

});