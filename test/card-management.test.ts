import {describe, test} from '@jest/globals';
import {createTestClient, http, keccak256, publicActions, stringToHex, walletActions} from 'viem'
import {foundry} from 'viem/chains'
import {privateKeyToAccount} from "viem/accounts";
import {eip712abi} from "../src/eip712abi.ts";
import {domain, types} from "../src/eip712-walle.ts";

// API yang digunakan untuk web Card Management
describe('Card Management', () => {

    // Mendapatkan card yang sudah didaftarkan
    test('Query Card', async () => {

        /*
        * Testing Variable
        * */
        const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

        /*
        * Testing Component
        * */
        const testClient = createTestClient({
            account,
            chain: foundry,
            mode: 'anvil',
            transport: http(),
        })
            .extend(publicActions)
            .extend(walletActions)


        const signature = await account.signMessage({message: "CARD_QUERY"})

        console.log({signature})

        /*
       * Validate EIP712 to Backend
       * */
        const cardListResponse = await fetch("http://localhost:8080/api/v2/tap2pay/cards", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'application/json',
            },
            body: signature
        });

        const responseText = await cardListResponse.text();

        console.log({result: cardListResponse.statusText, responseText})
    })

    // Mendaftarkan card
    test('Register Card', async () => {

        /*
        * Testing Variable
        * */
        const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
        const cardUUID = "94a57839-b7ef-4ff7-a1d6-54d37315a635"
        const cardPIN = "1234"


        /*
        * Testing Component
        * */
        const testClient = createTestClient({
            account,
            chain: foundry,
            mode: 'anvil',
            transport: http(),
        })
            .extend(publicActions)
            .extend(walletActions)


        /*
        * Testing Sign EIP712
        * */
        const message = {
            operation: 0,
            hashCard: keccak256(stringToHex(cardUUID)),
            hashPin: keccak256(stringToHex(cardPIN)),
        } satisfies {
            operation: number;
            hashCard: `0x${string}`;
            hashPin: `0x${string}`;
        };

        const signature = await account.signTypedData({
            domain,
            types,
            primaryType: 'CardSelfService',
            message: message,
        })
        console.log({signature})

        const recoveredAddress = await testClient.readContract({
            address: domain.verifyingContract,
            abi: eip712abi,
            functionName: 'getSignerCardSelfService',
            args: [message.operation, message.hashCard, message.hashPin, signature],
        })

        console.log({
            recoveredAddress,
            signaerAddress: account.address
        })

        expect(recoveredAddress).toEqual(account.address)

        /*
       * Validate EIP712 to Backend
       * */
        const cardRegisterResponse = await fetch("http://localhost:8080/api/v2/tap2pay/card-register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            body: JSON.stringify({
                signerAddress: account.address,
                hashCard: message.hashCard,
                hashPin: message.hashPin,
                ethSignMessage: signature
            })
        });

        const responseText = await cardRegisterResponse.text();

        console.log({result: cardRegisterResponse.statusText, responseText})
    })

    // Mengakses card
    // API ini mengembalikan secret key yang digunakan untuk build wallet Viem di Clien Side
    test('Access Card', async () => {

        /*
        * Testing Variable
        * */
        const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
        const cardUUID = "94a57839-b7ef-4ff7-a1d6-54d37315a635"
        const cardPIN = "1234"


        /*
        * Testing Component
        * */
        const testClient = createTestClient({
            account,
            chain: foundry,
            mode: 'anvil',
            transport: http(),
        })
            .extend(publicActions)
            .extend(walletActions)


        /*
        * Testing Sign EIP712
        * */
        const message = {
            operation: 1,
            hashCard: keccak256(stringToHex(cardUUID)),
            hashPin: keccak256(stringToHex(cardPIN)),
        } satisfies {
            operation: number;
            hashCard: `0x${string}`;
            hashPin: `0x${string}`;
        };

        const signature = await account.signTypedData({
            domain,
            types,
            primaryType: 'CardSelfService',
            message: message,
        })
        console.log({signature})

        const recoveredAddress = await testClient.readContract({
            address: domain.verifyingContract,
            abi: eip712abi,
            functionName: 'getSignerCardSelfService',
            args: [message.operation, message.hashCard, message.hashPin, signature],
        })

        console.log({
            recoveredAddress,
            signaerAddress: account.address
        })

        expect(recoveredAddress).toEqual(account.address)

        /*
       * Validate EIP712 to Backend
       * */
        const cardAccessResponse = await fetch("http://localhost:8080/api/v2/tap2pay/card-access", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
            },
            body: JSON.stringify({
                signerAddress: account.address,
                hashCard: message.hashCard,
                hashPin: message.hashPin,
                ethSignMessage: signature
            })
        });

        const hsmKey = await cardAccessResponse.text();
        console.log({hsmKey})

    })
});