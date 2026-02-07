import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-Dbjn1LFb.js";
import { S as SaleForm } from "./SaleForm-C5KD2fKc.js";
import "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    sale: { type: Object, required: true },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    fullBicycleOptions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.sale.title} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Edit sale",
        "head-title": `BikesList – ${__props.sale.title} – Edit`,
        breadcrumb: [{ label: "For Sale", href: `${__props.cityBaseUrl}/for-sale` }, { label: __props.sale.title, href: `${__props.cityBaseUrl}/for-sale/${__props.sale.id}` }, "Edit"],
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        submitting: submitting.value,
        "submitting-label": "Saving…"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(SaleForm, {
              sale: __props.sale,
              "sale-types": __props.saleTypes,
              conditions: __props.conditions,
              "full-bicycle-options": __props.fullBicycleOptions,
              "managed-community-pages": __props.managedCommunityPages,
              "city-base-url": __props.cityBaseUrl,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(SaleForm, {
                sale: __props.sale,
                "sale-types": __props.saleTypes,
                conditions: __props.conditions,
                "full-bicycle-options": __props.fullBicycleOptions,
                "managed-community-pages": __props.managedCommunityPages,
                "city-base-url": __props.cityBaseUrl,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["sale", "sale-types", "conditions", "full-bicycle-options", "managed-community-pages", "city-base-url", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Sales/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
