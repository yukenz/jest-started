import {createDefaultPreset} from "ts-jest";
import type {Config} from 'jest'

const tsJestTransformCfg = createDefaultPreset().transform;

let config = {
    testEnvironment: "node",
    testTimeout: 1000000,
    setupFiles: ["<rootDir>/jest.setup.ts"],
    transform: {
        ...tsJestTransformCfg,
    },

} satisfies Config;

export default config;