import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./EventForm-CGQwea8q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.event.title} – Edit`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Edit event"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/events/${__props.event.id}`)} class="govuk-link"${_scopeId}>Back to event</a>`);
          } else {
            return [
              createVNode("a", {
                href: `${__props.cityBaseUrl}/events/${__props.event.id}`,
                class: "govuk-link"
              }, "Back to event", 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Edit event</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              event: __props.event,
              guidelines: __props.guidelines,
              "managed-community-pages": _ctx.managedCommunityPages,
              "event-tags": __props.eventTags,
              "city-base-url": __props.cityBaseUrl
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Edit event"),
                createVNode(_sfc_main$2, {
                  event: __props.event,
                  guidelines: __props.guidelines,
                  "managed-community-pages": _ctx.managedCommunityPages,
                  "event-tags": __props.eventTags,
                  "city-base-url": __props.cityBaseUrl
                }, null, 8, ["event", "guidelines", "managed-community-pages", "event-tags", "city-base-url"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Events/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
