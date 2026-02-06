import { unref, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./CommunityPageForm-CaiWfumP.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.communityPage.name} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Community pages", "Edit"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${__props.communityPage.slug}`)} class="govuk-link"${_scopeId}>Back to page</a>`);
          } else {
            return [
              createVNode("a", {
                href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}`,
                class: "govuk-link"
              }, "Back to page", 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Edit ${ssrInterpolate(__props.communityPage.name)}</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              "community-page": __props.communityPage,
              "city-base-url": __props.cityBaseUrl
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Edit " + toDisplayString(__props.communityPage.name), 1),
                createVNode(_sfc_main$2, {
                  "community-page": __props.communityPage,
                  "city-base-url": __props.cityBaseUrl
                }, null, 8, ["community-page", "city-base-url"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CommunityPages/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
