const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: "",
  target: "browser@es6",
  output: "dist/$name.js",
  useTypescriptCompiler: true,
  plugins: [WebIndexPlugin()],
});
fuse
  .bundle("app")
  .instructions(" > index.js")
fuse.run();