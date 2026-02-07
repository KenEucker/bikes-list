import { unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$2 } from "./ModerationQueue-Dbul2LGV.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "Pages",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    reasonCodes: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Moderation – Pages`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Moderation", "Pages"]
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
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Pending community pages</h1><p class="mt-2 text-sm text-muted"${_scopeId}>Approve or remove. Every action requires a reason code.</p>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.pages.data || [],
              "entity-label": "pages",
              "title-key": "name",
              "show-url-fn": (item) => `${__props.cityBaseUrl}/community/${item.slug}`,
              "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/pages/${item.id}/approve`,
              "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/pages/${item.id}/remove`,
              "subtitle-fn": (item) => `By ${item.created_by_user?.name ?? "Unknown"}`,
              "status-value": "pending",
              "empty-message": "No pending pages.",
              "reason-codes": __props.reasonCodes
            }, null, _parent2, _scopeId));
            _push2(`</main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Pending community pages"),
                createVNode("p", { class: "mt-2 text-sm text-muted" }, "Approve or remove. Every action requires a reason code."),
                createVNode(_sfc_main$2, {
                  items: __props.pages.data || [],
                  "entity-label": "pages",
                  "title-key": "name",
                  "show-url-fn": (item) => `${__props.cityBaseUrl}/community/${item.slug}`,
                  "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/pages/${item.id}/approve`,
                  "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/pages/${item.id}/remove`,
                  "subtitle-fn": (item) => `By ${item.created_by_user?.name ?? "Unknown"}`,
                  "status-value": "pending",
                  "empty-message": "No pending pages.",
                  "reason-codes": __props.reasonCodes
                }, null, 8, ["items", "show-url-fn", "approve-url-fn", "remove-url-fn", "subtitle-fn", "reason-codes"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Moderation/Pages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
