module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint", "prettier"],
  globals: {
    describe: "readonly",
    test: "readonly",
    expect: "readonly",
    jest: "readonly",
  },
  extends: [
    "standard",
    "standard-jsx",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "space-before-function-paren": 0,
    quotes: "off",
    semi: ["error", "always"],
    "prefer-const": "off",
    "react/display-name": "off",
    "react/jsx-curly-newline": "off",
    "spaced-comment": "off",
    "multiline-ternary": "off",
    // "no-use-before-define": ["error", { variables: true, functions: false }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "@typescript-eslint/member-delimiter-style": [
      0,
      {
        multiline: {
          delimiter: "none",
        },
        singleline: {
          delimiter: "none",
        },
      },
    ],
    "react/jsx-indent": ["off"],
    "react/prop-types": ["error", { ignore: ["children"] }],
    "react/no-unescaped-entities": ["off"],
    "react/no-children-prop": ["off"],
    "react/react-in-jsx-scope": ["off"],
  },
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: "0.53", // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { name: "Link", linkAttribute: "to" },
    ],
  },
};
