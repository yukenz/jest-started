export const eip712abi = [{"type": "constructor", "inputs": [], "stateMutability": "nonpayable"}, {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [{"name": "fields", "type": "bytes1", "internalType": "bytes1"}, {
        "name": "name",
        "type": "string",
        "internalType": "string"
    }, {"name": "version", "type": "string", "internalType": "string"}, {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
    }, {"name": "verifyingContract", "type": "address", "internalType": "address"}, {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
    }, {"name": "extensions", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getSignerCardRequestPayment",
    "inputs": [{"name": "hashCard", "type": "bytes32", "internalType": "bytes32"}, {
        "name": "hashPin",
        "type": "bytes32",
        "internalType": "bytes32"
    }, {"name": "merchantId", "type": "string", "internalType": "string"}, {
        "name": "merchantKey",
        "type": "string",
        "internalType": "string"
    }, {"name": "terminalId", "type": "string", "internalType": "string"}, {
        "name": "terminalKey",
        "type": "string",
        "internalType": "string"
    }, {"name": "paymentAmount", "type": "uint256", "internalType": "uint256"}, {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
    }],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getSignerCardSelfService",
    "inputs": [{
        "name": "operation",
        "type": "uint8",
        "internalType": "enum EIP712Impl.CSSOperation"
    }, {"name": "hashCard", "type": "bytes32", "internalType": "bytes32"}, {
        "name": "hashPin",
        "type": "bytes32",
        "internalType": "bytes32"
    }, {"name": "signature", "type": "bytes", "internalType": "bytes"}],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
}, {"type": "event", "name": "EIP712DomainChanged", "inputs": [], "anonymous": false}, {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
}, {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [{"name": "str", "type": "string", "internalType": "string"}]
}] as const;