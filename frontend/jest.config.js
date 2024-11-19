module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Use babel-jest to transform JavaScript
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios)/)" // Include axios for transformation
    ],
    testEnvironment: "jsdom", // Ensure the environment supports DOM testing
  };
  