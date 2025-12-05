module.exports = {
  displayName: 'in-messages',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/in-messages',
  moduleNameMapper: {
    '^@lib/domain/(.*)$': '<rootDir>/../domain/src/$1',
    '^@lib/out-messages/(.*)$': '<rootDir>/../out-messages/src/$1',
  },
};
