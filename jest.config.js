export default {
  transform: { "^.+\\.js$": "babel-jest" },
  globals: {
    jest: {
      useESM: true,
    },
  },
};
