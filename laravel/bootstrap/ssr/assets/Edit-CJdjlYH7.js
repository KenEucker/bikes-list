import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-B0iRbSI_.js";
import { _ as _sfc_main$2 } from "./ListingForm-BdlvDjLn.js";
import "./CityLayout-DXBkMg5Q.js";
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
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.listing.title} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Edit listing",
        "head-title": `BikesList – ${__props.listing.title} – Edit`,
        breadcrumb: "Edit listing",
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        "back-url": `${__props.cityBaseUrl}/listings/${__props.listing.id}`,
        "back-label": "Back to listing",
        submitting: submitting.value,
        "submitting-label": "Saving…"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              listing: __props.listing,
              "listing-types": __props.listingTypes,
              conditions: __props.conditions,
              "managed-community-pages": __props.managedCommunityPages,
              "city-base-url": __props.cityBaseUrl,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                listing: __props.listing,
                "listing-types": __props.listingTypes,
                conditions: __props.conditions,
                "managed-community-pages": __props.managedCommunityPages,
                "city-base-url": __props.cityBaseUrl,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["listing", "listing-types", "conditions", "managed-community-pages", "city-base-url", "onUpdate:processing"])
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
