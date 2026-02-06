import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-CDzvrTlB.js";
import { E as EventForm } from "./EventForm-BFkN2HNX.js";
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
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
    errors: { type: Object, default: () => ({}) }
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
        submitting: submitting.value,
        "content-max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(EventForm, {
              event: null,
              guidelines: __props.guidelines,
              "managed-community-pages": __props.managedCommunityPages,
              audiences: __props.audiences,
              "default-audience-id": __props.defaultAudienceId,
              "event-tags": __props.eventTags,
              "city-base-url": __props.cityBaseUrl,
              old: __props.old,
              errors: __props.errors,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(EventForm, {
                event: null,
                guidelines: __props.guidelines,
                "managed-community-pages": __props.managedCommunityPages,
                audiences: __props.audiences,
                "default-audience-id": __props.defaultAudienceId,
                "event-tags": __props.eventTags,
                "city-base-url": __props.cityBaseUrl,
                old: __props.old,
                errors: __props.errors,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["guidelines", "managed-community-pages", "audiences", "default-audience-id", "event-tags", "city-base-url", "old", "errors", "onUpdate:processing"])
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
