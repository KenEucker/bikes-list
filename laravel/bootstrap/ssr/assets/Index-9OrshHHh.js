import { mergeProps, useSSRContext, ref, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, toDisplayString, renderList, vShow } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$4 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$5 } from "./SaleCard-C99lGHmL.js";
import { _ as _sfc_main$3 } from "./StatusTag-BeNLpE6N.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main$2 = {
  __name: "RideCard",
  __ssrInlineRender: true,
  props: {
    ride: { type: Object, required: true },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: __props.url,
        class: "block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
      }, _attrs))}><h3 class="font-medium text-fg line-clamp-1">${ssrInterpolate(__props.ride.name)}</h3><p class="mt-0.5 text-sm text-muted">${ssrInterpolate(__props.ride.starts_at ? new Date(__props.ride.starts_at).toLocaleDateString() : "")} ${ssrInterpolate(__props.ride.starts_at ? new Date(__props.ride.starts_at).toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : "")}</p>`);
      if (__props.showStatus && __props.ride.state) {
        _push(`<div class="mt-2">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          status: __props.ride.state
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</a>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/RideCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "PageCard",
  __ssrInlineRender: true,
  props: {
    page: { type: Object, required: true },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: __props.url,
        class: "block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
      }, _attrs))}><h3 class="font-medium text-fg line-clamp-1">${ssrInterpolate(__props.page.name)}</h3>`);
      if (__props.page.type) {
        _push(`<p class="mt-0.5 text-sm text-muted">${ssrInterpolate(__props.page.type)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showStatus && __props.page.state) {
        _push(`<div class="mt-2">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          status: __props.page.state
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</a>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PageCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    query: { type: String, default: "" },
    tab: { type: String, default: "sales" },
    sales: { type: Array, default: () => [] },
    rides: { type: Array, default: () => [] },
    pages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const q = ref(props.query);
    const currentTab = ref(props.tab);
    function doSearch() {
      router.get(
        `${props.cityBaseUrl}/search`,
        { q: q.value || void 0, tab: currentTab.value },
        { preserveState: true }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Search`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Search"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", __props.cityBaseUrl)} class="govuk-link"${_scopeId}>Back to city</a>`);
          } else {
            return [
              createVNode("a", {
                href: __props.cityBaseUrl,
                class: "govuk-link"
              }, "Back to city", 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>Search</h1><form class="mt-4 flex flex-wrap gap-2"${_scopeId}><div class="min-w-0 flex-1 basis-40"${_scopeId}><input${ssrRenderAttr("value", q.value)} type="search" placeholder="Search sales, rides, pages..." class="block w-full min-w-0 rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"${_scopeId}></div><button type="submit" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 shrink-0"${_scopeId}> Search </button></form><div class="mt-6 flex gap-4 border-b border-border"${_scopeId}><button type="button" class="${ssrRenderClass([currentTab.value === "sales" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg", "border-b-2 px-2 py-2 text-sm font-medium"])}"${_scopeId}> For Sale </button><button type="button" class="${ssrRenderClass([currentTab.value === "rides" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg", "border-b-2 px-2 py-2 text-sm font-medium"])}"${_scopeId}> Rides </button><button type="button" class="${ssrRenderClass([currentTab.value === "pages" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg", "border-b-2 px-2 py-2 text-sm font-medium"])}"${_scopeId}> Pages </button></div><div class="mt-6"${_scopeId}><div class="space-y-4" style="${ssrRenderStyle(currentTab.value === "sales" ? null : { display: "none" })}"${_scopeId}>`);
            if (!__props.query) {
              _push2(`<p class="text-muted"${_scopeId}>Enter a search term and click Search.</p>`);
            } else {
              _push2(`<!--[--><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.sales.length)} result(s)</p><ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.sales, (sale) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$5, {
                  sale,
                  url: `${__props.cityBaseUrl}/for-sale/${sale.id}`,
                  "show-status": false
                }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><!--]-->`);
            }
            _push2(`</div><div class="space-y-4" style="${ssrRenderStyle(currentTab.value === "rides" ? null : { display: "none" })}"${_scopeId}>`);
            if (!__props.query) {
              _push2(`<p class="text-muted"${_scopeId}>Enter a search term and click Search.</p>`);
            } else {
              _push2(`<!--[--><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.rides.length)} result(s)</p><ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.rides, (ride) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  ride,
                  url: `${__props.cityBaseUrl}/rides/${ride.id}`,
                  "show-status": false
                }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><!--]-->`);
            }
            _push2(`</div><div class="space-y-4" style="${ssrRenderStyle(currentTab.value === "pages" ? null : { display: "none" })}"${_scopeId}>`);
            if (!__props.query) {
              _push2(`<p class="text-muted"${_scopeId}>Enter a search term and click Search.</p>`);
            } else {
              _push2(`<!--[--><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.pages.length)} result(s)</p><ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.pages, (page) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$1, {
                  page,
                  url: `${__props.cityBaseUrl}/community/${page.slug}`,
                  "show-status": false
                }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><!--]-->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, "Search"),
                createVNode("form", {
                  class: "mt-4 flex flex-wrap gap-2",
                  onSubmit: withModifiers(doSearch, ["prevent"])
                }, [
                  createVNode("div", { class: "min-w-0 flex-1 basis-40" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => q.value = $event,
                      type: "search",
                      placeholder: "Search sales, rides, pages...",
                      class: "block w-full min-w-0 rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, q.value]
                    ])
                  ]),
                  createVNode("button", {
                    type: "submit",
                    class: "rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 shrink-0"
                  }, " Search ")
                ], 32),
                createVNode("div", { class: "mt-6 flex gap-4 border-b border-border" }, [
                  createVNode("button", {
                    type: "button",
                    class: ["border-b-2 px-2 py-2 text-sm font-medium", currentTab.value === "sales" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg"],
                    onClick: ($event) => currentTab.value = "sales"
                  }, " For Sale ", 10, ["onClick"]),
                  createVNode("button", {
                    type: "button",
                    class: ["border-b-2 px-2 py-2 text-sm font-medium", currentTab.value === "rides" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg"],
                    onClick: ($event) => currentTab.value = "rides"
                  }, " Rides ", 10, ["onClick"]),
                  createVNode("button", {
                    type: "button",
                    class: ["border-b-2 px-2 py-2 text-sm font-medium", currentTab.value === "pages" ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg"],
                    onClick: ($event) => currentTab.value = "pages"
                  }, " Pages ", 10, ["onClick"])
                ]),
                createVNode("div", { class: "mt-6" }, [
                  withDirectives(createVNode("div", { class: "space-y-4" }, [
                    !__props.query ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-muted"
                    }, "Enter a search term and click Search.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.sales.length) + " result(s)", 1),
                      createVNode("ul", { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.sales, (sale) => {
                          return openBlock(), createBlock("li", {
                            key: sale.id
                          }, [
                            createVNode(_sfc_main$5, {
                              sale,
                              url: `${__props.cityBaseUrl}/for-sale/${sale.id}`,
                              "show-status": false
                            }, null, 8, ["sale", "url"])
                          ]);
                        }), 128))
                      ])
                    ], 64))
                  ], 512), [
                    [vShow, currentTab.value === "sales"]
                  ]),
                  withDirectives(createVNode("div", { class: "space-y-4" }, [
                    !__props.query ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-muted"
                    }, "Enter a search term and click Search.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.rides.length) + " result(s)", 1),
                      createVNode("ul", { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.rides, (ride) => {
                          return openBlock(), createBlock("li", {
                            key: ride.id
                          }, [
                            createVNode(_sfc_main$2, {
                              ride,
                              url: `${__props.cityBaseUrl}/rides/${ride.id}`,
                              "show-status": false
                            }, null, 8, ["ride", "url"])
                          ]);
                        }), 128))
                      ])
                    ], 64))
                  ], 512), [
                    [vShow, currentTab.value === "rides"]
                  ]),
                  withDirectives(createVNode("div", { class: "space-y-4" }, [
                    !__props.query ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-muted"
                    }, "Enter a search term and click Search.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.pages.length) + " result(s)", 1),
                      createVNode("ul", { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.pages, (page) => {
                          return openBlock(), createBlock("li", {
                            key: page.id
                          }, [
                            createVNode(_sfc_main$1, {
                              page,
                              url: `${__props.cityBaseUrl}/community/${page.slug}`,
                              "show-status": false
                            }, null, 8, ["page", "url"])
                          ]);
                        }), 128))
                      ])
                    ], 64))
                  ], 512), [
                    [vShow, currentTab.value === "pages"]
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Search/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
