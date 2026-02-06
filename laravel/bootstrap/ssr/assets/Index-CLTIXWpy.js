import { resolveComponent, unref, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" },
    counts: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Dashboard`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Dashboard"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
              text: "Account"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_gv_header_navigation_item, {
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                text: "Account"
              }, null, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Dashboard</h1><div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard/sales`,
              class: "rounded-token-md border border-border bg-card p-4 no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium text-fg"${_scopeId2}>For Sale</span><p class="mt-1 text-2xl font-semibold text-muted"${_scopeId2}>${ssrInterpolate(__props.counts.sales ?? 0)}</p>`);
                } else {
                  return [
                    createVNode("span", { class: "font-medium text-fg" }, "For Sale"),
                    createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.sales ?? 0), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard/rides`,
              class: "rounded-token-md border border-border bg-card p-4 no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium text-fg"${_scopeId2}>Rides</span><p class="mt-1 text-2xl font-semibold text-muted"${_scopeId2}>${ssrInterpolate(__props.counts.rides ?? 0)}</p>`);
                } else {
                  return [
                    createVNode("span", { class: "font-medium text-fg" }, "Rides"),
                    createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.rides ?? 0), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard/pending`,
              class: "rounded-token-md border border-border bg-card p-4 no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium text-fg"${_scopeId2}>Pending</span><p class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400"${_scopeId2}>${ssrInterpolate((__props.counts.pendingSales ?? 0) + (__props.counts.pendingRides ?? 0) + (__props.counts.pendingPages ?? 0))}</p>`);
                } else {
                  return [
                    createVNode("span", { class: "font-medium text-fg" }, "Pending"),
                    createVNode("p", { class: "mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400" }, toDisplayString((__props.counts.pendingSales ?? 0) + (__props.counts.pendingRides ?? 0) + (__props.counts.pendingPages ?? 0)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard/pages`,
              class: "rounded-token-md border border-border bg-card p-4 no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-medium text-fg"${_scopeId2}>Community pages</span><p class="mt-1 text-2xl font-semibold text-muted"${_scopeId2}>${ssrInterpolate(__props.counts.pages ?? 0)}</p>`);
                } else {
                  return [
                    createVNode("span", { class: "font-medium text-fg" }, "Community pages"),
                    createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.pages ?? 0), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Dashboard"),
                createVNode("div", { class: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, [
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/dashboard/sales`,
                    class: "rounded-token-md border border-border bg-card p-4 no-underline"
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "font-medium text-fg" }, "For Sale"),
                      createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.sales ?? 0), 1)
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/dashboard/rides`,
                    class: "rounded-token-md border border-border bg-card p-4 no-underline"
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "font-medium text-fg" }, "Rides"),
                      createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.rides ?? 0), 1)
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/dashboard/pending`,
                    class: "rounded-token-md border border-border bg-card p-4 no-underline"
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "font-medium text-fg" }, "Pending"),
                      createVNode("p", { class: "mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400" }, toDisplayString((__props.counts.pendingSales ?? 0) + (__props.counts.pendingRides ?? 0) + (__props.counts.pendingPages ?? 0)), 1)
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/dashboard/pages`,
                    class: "rounded-token-md border border-border bg-card p-4 no-underline"
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "font-medium text-fg" }, "Community pages"),
                      createVNode("p", { class: "mt-1 text-2xl font-semibold text-muted" }, toDisplayString(__props.counts.pages ?? 0), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
