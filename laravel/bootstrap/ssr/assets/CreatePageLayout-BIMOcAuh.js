import { unref, withCtx, openBlock, createBlock, createVNode, createCommentVNode, toDisplayString, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
const _sfc_main = {
  __name: "CreatePageLayout",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    headTitle: { type: String, default: null },
    breadcrumb: { type: [String, Array], required: true },
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    backUrl: { type: String, required: true },
    backLabel: { type: String, default: "Back" },
    /** Show full-page loading overlay when true (e.g. form.processing) */
    submitting: { type: Boolean, default: false },
    footerNote: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.headTitle ?? __props.title
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: __props.breadcrumb
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", __props.backUrl)} class="govuk-link"${_scopeId}>${ssrInterpolate(__props.backLabel)}</a>`);
          } else {
            return [
              createVNode("a", {
                href: __props.backUrl,
                class: "govuk-link"
              }, toDisplayString(__props.backLabel), 9, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.submitting) {
              _push2(`<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page/90" aria-live="polite"${_scopeId}><div class="rounded-token-md border-2 border-primary bg-card px-8 py-6 shadow-lg"${_scopeId}><p class="text-lg font-medium text-fg"${_scopeId}>Creating…</p><p class="mt-2 text-sm text-muted"${_scopeId}>Please wait, you will be redirected.</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>${ssrInterpolate(__props.title)}</h1>`);
            ssrRenderSlot(_ctx.$slots, "before-form", {}, null, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            if (__props.footerNote) {
              _push2(`<p class="govuk-body govuk-!-margin-top-4"${_scopeId}>${ssrInterpolate(__props.footerNote)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              __props.submitting ? (openBlock(), createBlock("div", {
                key: 0,
                class: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-page/90",
                "aria-live": "polite"
              }, [
                createVNode("div", { class: "rounded-token-md border-2 border-primary bg-card px-8 py-6 shadow-lg" }, [
                  createVNode("p", { class: "text-lg font-medium text-fg" }, "Creating…"),
                  createVNode("p", { class: "mt-2 text-sm text-muted" }, "Please wait, you will be redirected.")
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, toDisplayString(__props.title), 1),
                renderSlot(_ctx.$slots, "before-form"),
                renderSlot(_ctx.$slots, "default"),
                __props.footerNote ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "govuk-body govuk-!-margin-top-4"
                }, toDisplayString(__props.footerNote), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/CreatePageLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
