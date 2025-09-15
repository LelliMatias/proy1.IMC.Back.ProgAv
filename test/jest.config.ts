module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/src/main.ts',
        '<rootDir>/src/app.module.ts',
        '<rootDir>/src/data-source.ts',
        '<rootDir>/src/migrations/',
        '<rootDir>/src/module/imc/imc.module.ts',
    ],
};
