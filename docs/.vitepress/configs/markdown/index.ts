import mdItCustomAttrs from "markdown-it-custom-attrs";
export const markdown = {
  lineNumbers: true,
  config: (md) => {
    // use more markdown-it plugins!
    md.use(mdItCustomAttrs, "image", {
      "data-fancybox": "gallery",
    });
  },
};
