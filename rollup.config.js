import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    name: "i10010n",
    file: "index.js",
    format: "umd"
  },
  plugins: [
    babel({
      presets: [["env", { modules: false }]]
    })
  ]
};
