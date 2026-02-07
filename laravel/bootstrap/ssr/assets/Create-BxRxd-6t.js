import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-Dbjn1LFb.js";
import { S as SaleForm } from "./SaleForm-D-dsVq4H.js";
import "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    fullBicycleOptions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    authUser: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Add new sale`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Add new sale",
        "head-title": `BikesList – ${__props.city.name} – Add new sale`,
        breadcrumb: [{ label: "For Sale", href: `${__props.cityBaseUrl}/for-sale` }, "Add new sale"],
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
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
            _push2(ssrRenderComponent(SaleForm, {
              sale: null,
              "sale-types": __props.saleTypes,
              conditions: __props.conditions,
              "full-bicycle-options": __props.fullBicycleOptions,
              "managed-community-pages": __props.managedCommunityPages,
              "auth-user": __props.authUser,
              "city-base-url": __props.cityBaseUrl,
              old: __props.old,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(SaleForm, {
                sale: null,
                "sale-types": __props.saleTypes,
                conditions: __props.conditions,
                "full-bicycle-options": __props.fullBicycleOptions,
                "managed-community-pages": __props.managedCommunityPages,
                "auth-user": __props.authUser,
                "city-base-url": __props.cityBaseUrl,
                old: __props.old,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["sale-types", "conditions", "full-bicycle-options", "managed-community-pages", "auth-user", "city-base-url", "old", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Sales/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
