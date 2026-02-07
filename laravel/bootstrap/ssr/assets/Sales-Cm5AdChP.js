import { ref, resolveComponent, unref, withCtx, createTextVNode, createVNode, withDirectives, openBlock, createBlock, createCommentVNode, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import { _ as _sfc_main$2 } from "./ModerationQueue-B28swC-7.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "Sales",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    pendingSales: { type: Object, required: true },
    flaggedSales: { type: Object, required: true },
    publishedSales: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" },
    reasonCodes: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const tab = ref("pending");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
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
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: `${__props.cityBaseUrl}/moderation`,
              text: "Back to moderation"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_gv_header_navigation_item, {
                href: `${__props.cityBaseUrl}/moderation`,
                text: "Back to moderation"
              }, null, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Sales queue</h1><p class="mt-2 text-sm text-muted"${_scopeId}>Approve/publish, revert to draft, or remove. Every action requires a reason code.</p><ul class="govuk-tabs__list mt-4"${_scopeId}><li class="${ssrRenderClass([{ "govuk-tabs__list-item--selected": tab.value === "pending" }, "govuk-tabs__list-item"])}"${_scopeId}><button class="govuk-tabs__tab" type="button"${_scopeId}>Pending review</button></li><li class="${ssrRenderClass([{ "govuk-tabs__list-item--selected": tab.value === "published" }, "govuk-tabs__list-item"])}"${_scopeId}><button class="govuk-tabs__tab" type="button"${_scopeId}>Published</button></li><li class="${ssrRenderClass([{ "govuk-tabs__list-item--selected": tab.value === "flagged" }, "govuk-tabs__list-item"])}"${_scopeId}><button class="govuk-tabs__tab" type="button"${_scopeId}>Flagged</button></li></ul><section class="govuk-tabs__panel pt-4" style="${ssrRenderStyle(tab.value === "pending" ? null : { display: "none" })}"${_scopeId}><h2 class="govuk-heading-m"${_scopeId}>Pending review</h2>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.pendingSales.data || [],
              "entity-label": "sales",
              "title-key": "title",
              "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
              "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/approve`,
              "revert-url-fn": null,
              "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
              "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
              "status-value": "pending_review",
              "empty-message": "No pending sales.",
              "confirm-remove": true,
              "reason-codes": __props.reasonCodes
            }, null, _parent2, _scopeId));
            if (__props.pendingSales.next_page_url) {
              _push2(`<nav class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: __props.pendingSales.next_page_url,
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Next page`);
                  } else {
                    return [
                      createTextVNode("Next page")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</nav>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><section class="govuk-tabs__panel pt-4" style="${ssrRenderStyle(tab.value === "published" ? null : { display: "none" })}"${_scopeId}><h2 class="govuk-heading-m"${_scopeId}>Published (ongoing moderation)</h2>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.publishedSales.data || [],
              "entity-label": "sales",
              "title-key": "title",
              "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
              "approve-url-fn": null,
              "revert-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/revert`,
              "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
              "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
              "status-value": "published",
              "empty-message": "No published sales.",
              "reason-codes": __props.reasonCodes
            }, null, _parent2, _scopeId));
            if (__props.publishedSales.next_page_url) {
              _push2(`<nav class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: __props.publishedSales.next_page_url,
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Next page`);
                  } else {
                    return [
                      createTextVNode("Next page")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</nav>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><section class="govuk-tabs__panel pt-4" style="${ssrRenderStyle(tab.value === "flagged" ? null : { display: "none" })}"${_scopeId}><h2 class="govuk-heading-m"${_scopeId}>Flagged by users</h2>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.flaggedSales.data || [],
              "entity-label": "sales",
              "title-key": "title",
              "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
              "approve-url-fn": null,
              "revert-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/revert`,
              "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
              "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"} · ${item.flags_count ?? 0} flag(s)`,
              "status-value": "published",
              "empty-message": "No flagged sales.",
              "confirm-remove": true,
              "reason-codes": __props.reasonCodes
            }, null, _parent2, _scopeId));
            if (__props.flaggedSales.next_page_url) {
              _push2(`<nav class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: __props.flaggedSales.next_page_url,
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Next page`);
                  } else {
                    return [
                      createTextVNode("Next page")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</nav>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section></main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Sales queue"),
                createVNode("p", { class: "mt-2 text-sm text-muted" }, "Approve/publish, revert to draft, or remove. Every action requires a reason code."),
                createVNode("ul", { class: "govuk-tabs__list mt-4" }, [
                  createVNode("li", {
                    class: ["govuk-tabs__list-item", { "govuk-tabs__list-item--selected": tab.value === "pending" }]
                  }, [
                    createVNode("button", {
                      class: "govuk-tabs__tab",
                      type: "button",
                      onClick: ($event) => tab.value = "pending"
                    }, "Pending review", 8, ["onClick"])
                  ], 2),
                  createVNode("li", {
                    class: ["govuk-tabs__list-item", { "govuk-tabs__list-item--selected": tab.value === "published" }]
                  }, [
                    createVNode("button", {
                      class: "govuk-tabs__tab",
                      type: "button",
                      onClick: ($event) => tab.value = "published"
                    }, "Published", 8, ["onClick"])
                  ], 2),
                  createVNode("li", {
                    class: ["govuk-tabs__list-item", { "govuk-tabs__list-item--selected": tab.value === "flagged" }]
                  }, [
                    createVNode("button", {
                      class: "govuk-tabs__tab",
                      type: "button",
                      onClick: ($event) => tab.value = "flagged"
                    }, "Flagged", 8, ["onClick"])
                  ], 2)
                ]),
                withDirectives(createVNode("section", { class: "govuk-tabs__panel pt-4" }, [
                  createVNode("h2", { class: "govuk-heading-m" }, "Pending review"),
                  createVNode(_sfc_main$2, {
                    items: __props.pendingSales.data || [],
                    "entity-label": "sales",
                    "title-key": "title",
                    "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
                    "approve-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/approve`,
                    "revert-url-fn": null,
                    "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
                    "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
                    "status-value": "pending_review",
                    "empty-message": "No pending sales.",
                    "confirm-remove": true,
                    "reason-codes": __props.reasonCodes
                  }, null, 8, ["items", "show-url-fn", "approve-url-fn", "remove-url-fn", "subtitle-fn", "reason-codes"]),
                  __props.pendingSales.next_page_url ? (openBlock(), createBlock("nav", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode(unref(Link), {
                      href: __props.pendingSales.next_page_url,
                      class: "govuk-link"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Next page")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])) : createCommentVNode("", true)
                ], 512), [
                  [vShow, tab.value === "pending"]
                ]),
                withDirectives(createVNode("section", { class: "govuk-tabs__panel pt-4" }, [
                  createVNode("h2", { class: "govuk-heading-m" }, "Published (ongoing moderation)"),
                  createVNode(_sfc_main$2, {
                    items: __props.publishedSales.data || [],
                    "entity-label": "sales",
                    "title-key": "title",
                    "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
                    "approve-url-fn": null,
                    "revert-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/revert`,
                    "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
                    "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"}`,
                    "status-value": "published",
                    "empty-message": "No published sales.",
                    "reason-codes": __props.reasonCodes
                  }, null, 8, ["items", "show-url-fn", "revert-url-fn", "remove-url-fn", "subtitle-fn", "reason-codes"]),
                  __props.publishedSales.next_page_url ? (openBlock(), createBlock("nav", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode(unref(Link), {
                      href: __props.publishedSales.next_page_url,
                      class: "govuk-link"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Next page")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])) : createCommentVNode("", true)
                ], 512), [
                  [vShow, tab.value === "published"]
                ]),
                withDirectives(createVNode("section", { class: "govuk-tabs__panel pt-4" }, [
                  createVNode("h2", { class: "govuk-heading-m" }, "Flagged by users"),
                  createVNode(_sfc_main$2, {
                    items: __props.flaggedSales.data || [],
                    "entity-label": "sales",
                    "title-key": "title",
                    "show-url-fn": (item) => `${__props.cityBaseUrl}/for-sale/${item.id}`,
                    "approve-url-fn": null,
                    "revert-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/revert`,
                    "remove-url-fn": (item) => `${__props.cityBaseUrl}/moderation/sales/${item.id}/remove`,
                    "subtitle-fn": (item) => `By ${item.user?.name ?? "Unknown"} · ${item.flags_count ?? 0} flag(s)`,
                    "status-value": "published",
                    "empty-message": "No flagged sales.",
                    "confirm-remove": true,
                    "reason-codes": __props.reasonCodes
                  }, null, 8, ["items", "show-url-fn", "revert-url-fn", "remove-url-fn", "subtitle-fn", "reason-codes"]),
                  __props.flaggedSales.next_page_url ? (openBlock(), createBlock("nav", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode(unref(Link), {
                      href: __props.flaggedSales.next_page_url,
                      class: "govuk-link"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Next page")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])) : createCommentVNode("", true)
                ], 512), [
                  [vShow, tab.value === "flagged"]
                ])
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
