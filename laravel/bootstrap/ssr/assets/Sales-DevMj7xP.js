import { unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$2 } from "./ModerationQueue-H0PObq6f.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "Sales",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    sales: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Moderation – For Sale`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Moderation", "For Sale"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation`,
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to moderation`);
                } else {
                  return [
                    createTextVNode("Back to moderation")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/moderation`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to moderation")
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Pending sales</h1><p class="mt-2 text-sm text-muted"${_scopeId}>Approve/publish or remove with a note. Actions will be implemented via backend.</p>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.sales.data || [],
              "entity-label": "sales",
              "title-key": "title",
              "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
              "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/approve`,
              "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
              "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
              "status-value": "pending_review",
              "empty-message": "No pending sales.",
              "confirm-remove": true
            }, null, _parent2, _scopeId));
            _push2(`</main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Pending sales"),
                createVNode("p", { class: "mt-2 text-sm text-muted" }, "Approve/publish or remove with a note. Actions will be implemented via backend."),
                createVNode(_sfc_main$2, {
                  items: __props.sales.data || [],
                  "entity-label": "sales",
                  "title-key": "title",
                  "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
                  "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/approve`,
                  "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
                  "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
                  "status-value": "pending_review",
                  "empty-message": "No pending sales.",
                  "confirm-remove": true
                }, null, 8, ["items", "show-url-fn", "approve-url-fn", "remove-url-fn", "subtitle-fn"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Moderation/Sales.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
