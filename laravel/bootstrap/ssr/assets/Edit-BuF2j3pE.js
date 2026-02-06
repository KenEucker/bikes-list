import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./ListingForm-BdlvDjLn.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.listing.title} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Edit listing"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/listings/${__props.listing.id}`)} class="govuk-link"${_scopeId}>Back to listing</a>`);
          } else {
            return [
              createVNode("a", {
                href: `${__props.cityBaseUrl}/listings/${__props.listing.id}`,
                class: "govuk-link"
              }, "Back to listing", 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Edit listing</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              listing: __props.listing,
              "listing-types": __props.listingTypes,
              conditions: __props.conditions,
              "managed-community-pages": __props.managedCommunityPages,
              "city-base-url": __props.cityBaseUrl
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Edit listing"),
                createVNode(_sfc_main$2, {
                  listing: __props.listing,
                  "listing-types": __props.listingTypes,
                  conditions: __props.conditions,
                  "managed-community-pages": __props.managedCommunityPages,
                  "city-base-url": __props.cityBaseUrl
                }, null, 8, ["listing", "listing-types", "conditions", "managed-community-pages", "city-base-url"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
