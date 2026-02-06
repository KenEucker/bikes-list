import { resolveComponent, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "ModerationQueue",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, required: true },
    entityLabel: { type: String, required: true },
    titleKey: { type: String, default: "title" },
    showUrlFn: { type: Function, required: true },
    approveUrlFn: { type: Function, required: true },
    removeUrlFn: { type: Function, required: true },
    subtitleFn: { type: Function, default: null },
    statusValue: { type: String, required: true },
    emptyMessage: { type: String, default: "No pending items." },
    confirmRemove: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<!--[--><ul class="mt-6 space-y-4"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<li class="rounded-token-md border border-border bg-card p-4"><a${ssrRenderAttr("href", __props.showUrlFn(item))} class="font-medium text-primary underline">${ssrInterpolate(item[__props.titleKey])}</a>`);
        if (__props.subtitleFn) {
          _push(`<p class="mt-1 text-sm text-muted">${ssrInterpolate(__props.subtitleFn(item))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$1, {
          status: __props.statusValue,
          class: "mt-2"
        }, null, _parent));
        _push(`<div class="mt-3 govuk-button-group">`);
        _push(ssrRenderComponent(unref(Link), {
          href: __props.approveUrlFn(item),
          method: "post",
          as: "button",
          class: "govuk-button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.statusValue === "pending" ? "Approve" : "Approve / Publish")}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.statusValue === "pending" ? "Approve" : "Approve / Publish"), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<form${ssrRenderAttr("action", __props.removeUrlFn(item))} method="post" class="inline govuk-!-display-inline"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><input type="text" name="note" required placeholder="Reason (required)" class="govuk-input govuk-!-width-one-third govuk-!-margin-right-2">`);
        _push(ssrRenderComponent(_component_gv_button, {
          type: "submit",
          variant: "warning"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Remove`);
            } else {
              return [
                createTextVNode("Remove")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</form></div></li>`);
      });
      _push(`<!--]--></ul>`);
      if (!__props.items.length) {
        _push(`<p class="mt-6 text-muted">${ssrInterpolate(__props.emptyMessage)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ModerationQueue.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
