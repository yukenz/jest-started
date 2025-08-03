import {foundry, liskSepolia} from "viem/chains";
import {Account, createTestClient, createWalletClient, http, publicActions, walletActions} from "viem";
import {privateKeyToAccount} from "viem/accounts";

function createLiskClient(
    account: Account
) {
    return createWalletClient({
        account,
        chain: liskSepolia,
        transport: http("https://rpc.sepolia-api.lisk.com")
    }).extend(publicActions)
}

function createAnvilClient(
    account: Account
) {
    return createTestClient({
        account,
        chain: foundry,
        mode: 'anvil',
        transport: http("http://localhost:8545"),
    })
        .extend(publicActions)
        .extend(walletActions)
}

export function createClient(account: Account) {
    return createAnvilClient(account);
}

export function createClientFromPrivateKey(account: `0x${string}`) {
    const accountObj = privateKeyToAccount(account);
    return createAnvilClient(accountObj);
}

export const backendHost = "http://localhost:8080";