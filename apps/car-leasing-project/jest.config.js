module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@lib/domain/(.*)$': '<rootDir>/../../libs/domain/src/$1',
    '^@lib/in-cron/(.*)$': '<rootDir>/../../libs/in-cron/src/$1',
    '^@lib/in-messages/(.*)$': '<rootDir>/../../libs/in-messages/src/$1',
    '^@lib/in-rest/(.*)$': '<rootDir>/../../libs/in-rest/src/$1',
    '^@lib/out-messages/(.*)$': '<rootDir>/../../libs/out-messages/src/$1',
    '^@lib/out-mongoose/(.*)$': '<rootDir>/../../libs/out-mongoose/src/$1',
    '^src/(.*)$': '<rootDir>/$1'
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json'
    }
  }
};
