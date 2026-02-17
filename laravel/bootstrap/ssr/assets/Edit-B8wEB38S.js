import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-Dbjn1LFb.js";
import { _ as _sfc_main$2 } from "./CommunityPageForm-DGstdxUB.js";
import "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./SingleImageUpload-BYRoh2Mm.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.communityPage.name} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: `Edit ${__props.communityPage.name}`,
        "head-title": `BikesList – ${__props.communityPage.name} – Edit`,
        breadcrumb: [{ label: "Community", href: `${__props.cityBaseUrl}/community` }, { label: __props.communityPage.name, href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}` }, "Edit"],
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        submitting: submitting.value,
        "submitting-label": "Saving…"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              "community-page": __props.communityPage,
              "city-base-url": __props.cityBaseUrl,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                "community-page": __props.communityPage,
                "city-base-url": __props.cityBaseUrl,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["community-page", "city-base-url", "onUpdate:processing"])
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
