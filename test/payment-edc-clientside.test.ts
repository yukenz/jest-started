import {describe, test} from '@jest/globals';
import {keccak256, stringToHex} from 'viem'
import {accessCard} from "../src/tap2payhelper.ts";
import {idrcAbi, idrcContract} from "../src/idrc-abi.ts";
import {backendHost, createClientFromPrivateKey} from "../src/create-client.ts";

// API yang digunakan untuk EDC
describe('Payment EDC Client Side', () => {

    test('Full Payment Scenario', async () => {

        /*
        * Testing Variable
        * */
        const cardUUID = "94a57839-b7ef-4ff7-a1d6-54d37315a635"
        const cardPIN = "1234"

        const hashCard = keccak256(stringToHex(cardUUID));
        const hashPin = keccak256(stringToHex(cardPIN));

        const paymentRequestResponse = await fetch(backendHost + "/api/v2/tap2pay/payment-request", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                hashCard,
                hashPin,
                merchantId: "0",
                merchantKey: "merchantKey0",
                terminalId: "0",
                terminalKey: "terminalKey0",
                paymentAmount: 20000
            })
        });


        const paymentRequestResult = await paymentRequestResponse.json() as {
            "fromAddress": string,
            "secretKey": string,
            "toAddress": string,
            "error"?: string;
        }
        console.log({paymentRequestResult})

        const cardPrivateKey = accessCard(cardUUID, cardPIN, paymentRequestResult.secretKey);
        const cardTestClient = createClientFromPrivateKey(cardPrivateKey);

        console.log({
            cardAddress: cardTestClient.account.address,
            cardPrivateKey: cardPrivateKey,
            cardPublicKey: cardTestClient.account.publicKey
        })

        const ethSignMessage = await cardTestClient.signMessage({message: `CARD_GASS_RECOVERY|${hashCard}|${hashPin}|0|merchantKey0|0|terminalKey0`});

        const cardGassRecoveryResponse = await fetch(backendHost + "/api/v2/tap2pay/card-gass-recovery", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
            },
            body: JSON.stringify({
                merchantId: "0",
                merchantKey: "merchantKey0",
                terminalId: "0",
                terminalKey: "terminalKey0",
                hashCard,
                hashPin,
                ethSignMessage,
                ownerAddress: paymentRequestResult.fromAddress,
                cardAddress: cardTestClient.account.address,
            })
        });

        const cardGassRecoveryResult = {
            statusCode: cardGassRecoveryResponse.status,
            statusMessage: cardGassRecoveryResponse.statusText
        }

        console.log({cardGassRecoveryResult})

        // Settle Payment / transferFrom
        const erc20TransferFromTrxHash = await cardTestClient.writeContract({
            address: idrcContract,
            abi: idrcAbi,
            functionName: 'transferFrom',
            args: [paymentRequestResult.fromAddress as `0x${string}`, paymentRequestResult.toAddress as `0x${string}`, BigInt(1000)]
        });

        console.log({erc20TransferFromTrxHash})
    })

});