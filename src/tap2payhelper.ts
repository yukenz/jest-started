import {keccak256, toHex} from "viem";

export function accessCard(uuid: string, pin: string, secretKey: string) {
    return keccak256(toHex(uuid.concat(pin, secretKey)))
}