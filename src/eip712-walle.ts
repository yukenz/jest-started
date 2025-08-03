export const domain = {
    name: 'Walle',
    version: '1',
    chainId: 31337,
    verifyingContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
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