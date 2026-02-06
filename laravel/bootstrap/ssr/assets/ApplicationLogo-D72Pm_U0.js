import { mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
const logoUrl = "/build/assets/bikeslist-yDx5LxAM.png";
const _sfc_main = {
  __name: "ApplicationLogo",
  __ssrInlineRender: true,
  props: {
    logoClass: {
      type: String,
      default: "h-20 w-20 object-contain"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<img${ssrRenderAttrs(mergeProps({
        src: unref(logoUrl),
        alt: "BikesList logo",
        class: __props.logoClass
      }, _attrs))}>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ApplicationLogo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
