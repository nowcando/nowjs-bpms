module.exports = {
    "globals": {
        "ts-jest": {
            "tsConfig": "./config/tsconfig.test.json"
        }
    },
    "collectCoverageFrom": [
        "src/**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!src/bpms-old/**",
        "!src/bpms2/**"
    ],
    "verbose": true,
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testRegex": "(\\.(test|spec))\\.(ts|tsx)$",
    "testPathIgnorePatterns":[
        "test/bpms\\-old"],
    "modulePathIgnorePatterns": ["test/bpms\\-old"],
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "/test/",
        "/lib/",
        "/dist/",
        "/src/bpms-old",
        "/src/bpms2"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 90,
            "functions": 90,
            "lines": 90,
            "statements": 90
        }
    }
}