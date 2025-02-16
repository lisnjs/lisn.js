export default {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.js",
  },
};
