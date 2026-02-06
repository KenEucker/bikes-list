import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-B0iRbSI_.js";
import { _ as _sfc_main$2 } from "./ListingForm-BdlvDjLn.js";
import "./CityLayout-DXBkMg5Q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – New listing`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "New listing",
        "head-title": `BikesList – ${__props.city.name} – New listing`,
        breadcrumb: "New listing",
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        "back-url": `${__props.cityBaseUrl}/listings`,
        "back-label": "Back to listings",
        submitting: submitting.value,
        "footer-note": "Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator."
      }, {
        "before-form": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="govuk-body"${_scopeId}>Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).</p>`);
          } else {
            return [
              createVNode("p", { class: "govuk-body" }, "Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              listing: null,
              "listing-types": __props.listingTypes,
              conditions: __props.conditions,
              "managed-community-pages": __props.managedCommunityPages,
              "city-base-url": __props.cityBaseUrl,
              old: __props.old,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                listing: null,
                "listing-types": __props.listingTypes,
                conditions: __props.conditions,
                "managed-community-pages": __props.managedCommunityPages,
                "city-base-url": __props.cityBaseUrl,
                old: __props.old,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["listing-types", "conditions", "managed-community-pages", "city-base-url", "old", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
