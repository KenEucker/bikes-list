import { ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CreatePageLayout-B0iRbSI_.js";
import { E as EventForm } from "./EventForm-B2F1HrtB.js";
import "./CityLayout-DXBkMg5Q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./SingleImageUpload-BYRoh2Mm.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.event.name} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Edit event",
        "head-title": `BikesList – ${__props.event.name} – Edit`,
        breadcrumb: "Edit event",
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        "back-url": `${__props.cityBaseUrl}/events/${__props.event.id}`,
        "back-label": "Back to event",
        submitting: submitting.value,
        "submitting-label": "Saving…",
        "content-max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(EventForm, {
              event: __props.event,
              guidelines: __props.guidelines,
              "managed-community-pages": __props.managedCommunityPages,
              audiences: __props.audiences,
              "default-audience-id": __props.defaultAudienceId,
              "event-tags": __props.eventTags,
              "city-base-url": __props.cityBaseUrl,
              errors: __props.errors,
              "onUpdate:processing": ($event) => submitting.value = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(EventForm, {
                event: __props.event,
                guidelines: __props.guidelines,
                "managed-community-pages": __props.managedCommunityPages,
                audiences: __props.audiences,
                "default-audience-id": __props.defaultAudienceId,
                "event-tags": __props.eventTags,
                "city-base-url": __props.cityBaseUrl,
                errors: __props.errors,
                "onUpdate:processing": ($event) => submitting.value = $event
              }, null, 8, ["event", "guidelines", "managed-community-pages", "audiences", "default-audience-id", "event-tags", "city-base-url", "errors", "onUpdate:processing"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Events/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
