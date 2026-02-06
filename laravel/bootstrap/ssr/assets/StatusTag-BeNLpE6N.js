import { resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = {
  __name: "StatusTag",
  __ssrInlineRender: true,
  props: {
    status: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const labels = {
      draft: "Draft",
      pending_review: "Pending review",
      pending: "Pending",
      published: "Published",
      sold: "Sold",
      expired: "Expired",
      removed: "Removed",
      approved: "Approved"
    };
    const colourMap = {
      draft: "grey",
      pending_review: "yellow",
      pending: "yellow",
      published: "green",
      sold: "blue",
      expired: "grey",
      removed: "red",
      approved: "green"
    };
    const label = labels[props.status] ?? props.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const colour = colourMap[props.status] ?? "grey";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_tag = resolveComponent("gv-tag");
      _push(ssrRenderComponent(_component_gv_tag, mergeProps({ colour: unref(colour) }, _ctx.$attrs, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(label))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(label)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/StatusTag.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
