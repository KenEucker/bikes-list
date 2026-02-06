import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-B0iRbSI_.js";
import { _ as _sfc_main$2 } from "./CommunityPageForm-DhM93zZO.js";
import "./CityLayout-DXBkMg5Q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./SingleImageUpload-BYRoh2Mm.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – New community page`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "New community page",
        "head-title": `BikesList – ${__props.city.name} – New community page`,
        breadcrumb: "New page",
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        "back-url": `${__props.cityBaseUrl}/community`,
        "back-label": "Back to community",
        submitting: submitting.value,
        "footer-note": "Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              "community-page": null,
              "city-base-url": __props.cityBaseUrl,
              old: __props.old,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                "community-page": null,
                "city-base-url": __props.cityBaseUrl,
                old: __props.old,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["city-base-url", "old", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CommunityPages/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
