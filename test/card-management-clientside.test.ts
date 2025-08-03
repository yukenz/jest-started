import {describe, test} from '@jest/globals';
import {createTestClient, http, keccak256, publicActions, stringToHex, walletActions} from 'viem'
import {foundry} from 'viem/chains'
import {privateKeyToAccount} from "viem/accounts";
import {eip712abi} from "../src/eip712abi.ts";
import {domain, types} from "../src/eip712-walle.ts";
import {accessCard} from "../src/tap2payhelper.ts";
import {idrcAbi, idrcContract} from "../src/idrc-abi.ts";

// API yang digunakan untuk web Card Management
describe('Card Management Client Side', () => {


    test('Give Allowance To Card', async () => {

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
        console.log({
            signature,
            ...message
        })

        const recoveredAddress = await testClient.readContract({
            address: domain.verifyingContract,
            abi: eip712abi,
            functionName: 'getSignerCardSelfService',
            args: [message.operation, message.hashCard, message.hashPin, signature],
        })

        console.log({
            recoveredAddress,
            signerAddress: account.address
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

        const secretKey = await cardAccessResponse.text();
        console.log({hsmKey: secretKey})

        const privateKey = accessCard(cardUUID, cardPIN, secretKey);
        const cardAccount = privateKeyToAccount(privateKey);

        console.log({
            cardAddress: cardAccount.address,
            cardPrivateKey: privateKey,
            cardPublicKey: cardAccount.publicKey
        })

        // Give Allowance
        const erc20ApproveTrxHash = await testClient.writeContract({
            address: idrcContract,
            abi: idrcAbi,
            functionName: 'approve',
            args: [cardAccount.address, BigInt(1_000_000)]
        });

        console.log({erc20ApproveTrxHash})

    })


});