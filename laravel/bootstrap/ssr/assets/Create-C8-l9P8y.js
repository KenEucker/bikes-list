import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-BIMOcAuh.js";
import { _ as _sfc_main$2 } from "./EventForm-CGQwea8q.js";
import "./CityLayout-DXBkMg5Q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – New event`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "New event",
        "head-title": `BikesList – ${__props.city.name} – New event`,
        breadcrumb: "New event",
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        "back-url": `${__props.cityBaseUrl}/events`,
        "back-label": "Back to events",
        submitting: submitting.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              event: null,
              guidelines: __props.guidelines,
              "managed-community-pages": __props.managedCommunityPages,
              "event-tags": __props.eventTags,
              "city-base-url": __props.cityBaseUrl,
              old: __props.old,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                event: null,
                guidelines: __props.guidelines,
                "managed-community-pages": __props.managedCommunityPages,
                "event-tags": __props.eventTags,
                "city-base-url": __props.cityBaseUrl,
                old: __props.old,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["guidelines", "managed-community-pages", "event-tags", "city-base-url", "old", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Events/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
