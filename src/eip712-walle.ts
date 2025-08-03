export const domain = {
    name: 'Walle',
    version: '1',
    chainId: 31337,
    verifyingContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
} as const

export const types = {
    CardSelfService: [
        {name: "operation", type: "uint8"},
        {name: "hashCard", type: "bytes32"},
        {name: "hashPin", type: "bytes32"},
    ],
    CardRequestPayment: [
        {name: "hashCard", type: "bytes32"},
        {name: "hashPin", type: "bytes32"},
        {name: "merchantId", type: "string"},
        {name: "merchantKey", type: "string"},
        {name: "terminalId", type: "string"},
        {name: "terminalKey", type: "string"},
        {name: "paymentAmount", type: "uint256"},
    ],
} as const