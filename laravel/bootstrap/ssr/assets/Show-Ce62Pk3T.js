import { computed, mergeProps, useSSRContext, ref, resolveComponent, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, withModifiers, withDirectives, vShow } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$3 } from "./SaleCard-C99lGHmL.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./StatusTag-BeNLpE6N.js";
const _sfc_main$1 = {
  __name: "CityCalendarList",
  __ssrInlineRender: true,
  props: {
    rides: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const groupedByDay = computed(() => {
      const map = /* @__PURE__ */ new Map();
      const rides = props.rides ?? [];
      for (const ride of rides) {
        const start = ride.starts_at ? new Date(ride.starts_at) : null;
        const dayKey = start ? start.toDateString() : "date-unknown";
        if (!map.has(dayKey)) map.set(dayKey, { label: start ? start.toLocaleDateString(void 0, { weekday: "long", month: "short", day: "numeric" }) : "Date TBA", rides: [] });
        map.get(dayKey).rides.push(ride);
      }
      return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><!--[-->`);
      ssrRenderList(groupedByDay.value, (group) => {
        _push(`<section class="space-y-2"><h3 class="text-sm font-semibold uppercase tracking text-muted">${ssrInterpolate(group.label)}</h3><ul class="space-y-2"><!--[-->`);
        ssrRenderList(group.rides ?? [], (ride) => {
          _push(`<li class="flex items-baseline gap-2">`);
          ssrRenderSlot(_ctx.$slots, "ride", { ride }, () => {
            _push(`<a${ssrRenderAttr("href", ride.url)} class="font-medium text-primary underline">${ssrInterpolate(ride.name)}</a><span class="text-sm text-muted">${ssrInterpolate(ride.starts_at ? new Date(ride.starts_at).toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : "")}</span>`);
          }, _push, _parent);
          _push(`</li>`);
        });
        _push(`<!--]--></ul></section>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/CityCalendarList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true },
    upcomingRides: { type: Array, default: () => [] },
    featuredPages: { type: Array, default: () => [] },
    salesPreview: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const searchQuery = ref("");
    function safeArray(val) {
      if (val == null) return [];
      return Array.isArray(val) ? val : [];
    }
    const upcomingRidesSafe = computed(() => {
      const p = page.props;
      return safeArray(p.upcomingRides ?? p.upcoming_rides);
    });
    const featuredPagesSafe = computed(() => safeArray(page.props.featuredPages ?? page.props.featured_pages));
    const salesPreviewSafe = computed(() => safeArray(page.props.salesPreview ?? page.props.sales_preview));
    function submitSearch() {
      const q = searchQuery.value.trim();
      const origin = typeof window !== "undefined" ? window.location.origin : props.cityBaseUrl;
      const base = origin.replace(/\/$/, "");
      const url = q ? `${base}/search?q=${encodeURIComponent(q)}` : `${base}/search`;
      router.visit(url);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.city.description || `Bike sales, rides, and community in ${__props.city.name}.`)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `BikesList – ${__props.city.name}`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.city.description || `Bike sales, rides, and community in ${__props.city.name}.`)}${_scopeId}><meta property="og:url"${ssrRenderAttr("content", unref(page).props.seo?.currentUrl || __props.cityBaseUrl)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", unref(page).props.seo?.currentUrl || __props.cityBaseUrl)}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.city.description || `Bike sales, rides, and community in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: `BikesList – ${__props.city.name}`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.city.description || `Bike sales, rides, and community in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: unref(page).props.seo?.currentUrl || __props.cityBaseUrl
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: unref(page).props.seo?.currentUrl || __props.cityBaseUrl
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8 space-y-10"${_scopeId}><h1 class="govuk-heading-xl"${_scopeId}>${ssrInterpolate(__props.city.name)}</h1>`);
            if (__props.city.description) {
              _push2(`<p class="text-muted"${_scopeId}>${ssrInterpolate(__props.city.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (upcomingRidesSafe.value.length > 0) {
              _push2(`<section class="space-y-4"${_scopeId}><h2 class="text-xl font-semibold text-fg"${_scopeId}>Upcoming rides this month</h2>`);
              _push2(ssrRenderComponent(_sfc_main$1, { rides: upcomingRidesSafe.value }, null, _parent2, _scopeId));
              _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/rides`)} class="inline-block text-sm text-primary underline"${_scopeId}>View all rides</a></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (featuredPagesSafe.value.length > 0) {
              _push2(`<section class="space-y-4"${_scopeId}><h2 class="text-xl font-semibold text-fg"${_scopeId}>Featured community pages</h2><ul class="grid gap-4 sm:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(featuredPagesSafe.value, (p) => {
                _push2(`<li${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${p.slug}`)} class="block rounded-token-md border border-border bg-card p-4 shadow-sm hover:border-primary hover:shadow underline"${_scopeId}><span class="font-medium text-fg"${_scopeId}>${ssrInterpolate(p.name)}</span></a></li>`);
              });
              _push2(`<!--]--></ul><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community`)} class="inline-block text-sm text-primary underline"${_scopeId}>View all community pages</a></section>`);
            } else {
              _push2(`<section class="space-y-2"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community`)} class="inline-block text-lg font-medium text-primary underline"${_scopeId}>Community pages</a></section>`);
            }
            _push2(`<section class="space-y-2"${_scopeId}><h2 class="govuk-heading-l"${_scopeId}>Search</h2><form${ssrRenderAttr("action", `${__props.cityBaseUrl}/search`)} method="get" class="flex max-w-xl flex-wrap gap-2"${_scopeId}><div class="min-w-0 flex-1 basis-40"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "city-search",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event,
              label: "Search sales, rides, and pages",
              type: "search",
              placeholder: "Search...",
              autocomplete: "off",
              class: "govuk-!-width-full"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_gv_button, {
              style: searchQuery.value.trim().length > 0 ? null : { display: "none" },
              type: "submit",
              variant: "primary",
              class: "shrink-0"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Search `);
                } else {
                  return [
                    createTextVNode(" Search ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form></section><section class="space-y-4"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-4"${_scopeId}><h2 class="text-xl font-semibold text-fg"${_scopeId}>For Sale</h2>`);
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/for-sale/new`,
                class: "govuk-button",
                role: "button"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add new sale`);
                  } else {
                    return [
                      createTextVNode("Add new sale")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (salesPreviewSafe.value.length > 0) {
              _push2(`<div${_scopeId}><ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
              ssrRenderList(salesPreviewSafe.value, (sale) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$3, {
                  sale,
                  url: `${__props.cityBaseUrl}/for-sale/${sale.id}`,
                  "show-status": false
                }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/for-sale`)} class="inline-block text-sm font-medium text-primary underline"${_scopeId}>View all for sale</a></div>`);
            } else {
              _push2(`<p class="text-muted"${_scopeId}>No items for sale yet.</p>`);
            }
            _push2(`</section><a${ssrRenderAttr("href", __props.homeUrl)} class="inline-block text-muted underline hover:text-fg"${_scopeId}>Back to cities</a></div>`);
          } else {
            return [
              createVNode("div", { class: "govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8 space-y-10" }, [
                createVNode("h1", { class: "govuk-heading-xl" }, toDisplayString(__props.city.name), 1),
                __props.city.description ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-muted"
                }, toDisplayString(__props.city.description), 1)) : createCommentVNode("", true),
                upcomingRidesSafe.value.length > 0 ? (openBlock(), createBlock("section", {
                  key: 1,
                  class: "space-y-4"
                }, [
                  createVNode("h2", { class: "text-xl font-semibold text-fg" }, "Upcoming rides this month"),
                  createVNode(_sfc_main$1, { rides: upcomingRidesSafe.value }, null, 8, ["rides"]),
                  createVNode("a", {
                    href: `${__props.cityBaseUrl}/rides`,
                    class: "inline-block text-sm text-primary underline"
                  }, "View all rides", 8, ["href"])
                ])) : createCommentVNode("", true),
                featuredPagesSafe.value.length > 0 ? (openBlock(), createBlock("section", {
                  key: 2,
                  class: "space-y-4"
                }, [
                  createVNode("h2", { class: "text-xl font-semibold text-fg" }, "Featured community pages"),
                  createVNode("ul", { class: "grid gap-4 sm:grid-cols-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(featuredPagesSafe.value, (p) => {
                      return openBlock(), createBlock("li", {
                        key: p.id
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/community/${p.slug}`,
                          class: "block rounded-token-md border border-border bg-card p-4 shadow-sm hover:border-primary hover:shadow underline"
                        }, [
                          createVNode("span", { class: "font-medium text-fg" }, toDisplayString(p.name), 1)
                        ], 8, ["href"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("a", {
                    href: `${__props.cityBaseUrl}/community`,
                    class: "inline-block text-sm text-primary underline"
                  }, "View all community pages", 8, ["href"])
                ])) : (openBlock(), createBlock("section", {
                  key: 3,
                  class: "space-y-2"
                }, [
                  createVNode("a", {
                    href: `${__props.cityBaseUrl}/community`,
                    class: "inline-block text-lg font-medium text-primary underline"
                  }, "Community pages", 8, ["href"])
                ])),
                createVNode("section", { class: "space-y-2" }, [
                  createVNode("h2", { class: "govuk-heading-l" }, "Search"),
                  createVNode("form", {
                    action: `${__props.cityBaseUrl}/search`,
                    method: "get",
                    class: "flex max-w-xl flex-wrap gap-2",
                    onSubmit: withModifiers(submitSearch, ["prevent"])
                  }, [
                    createVNode("div", { class: "min-w-0 flex-1 basis-40" }, [
                      createVNode(_component_gv_input, {
                        id: "city-search",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                        label: "Search sales, rides, and pages",
                        type: "search",
                        placeholder: "Search...",
                        autocomplete: "off",
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    withDirectives(createVNode(_component_gv_button, {
                      type: "submit",
                      variant: "primary",
                      class: "shrink-0"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Search ")
                      ]),
                      _: 1
                    }, 512), [
                      [vShow, searchQuery.value.trim().length > 0]
                    ])
                  ], 40, ["action"])
                ]),
                createVNode("section", { class: "space-y-4" }, [
                  createVNode("div", { class: "flex flex-wrap items-center justify-between gap-4" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-fg" }, "For Sale"),
                    _ctx.$page.props.auth?.user ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: `${__props.cityBaseUrl}/for-sale/new`,
                      class: "govuk-button",
                      role: "button"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add new sale")
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
                  ]),
                  salesPreviewSafe.value.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("ul", { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(salesPreviewSafe.value, (sale) => {
                        return openBlock(), createBlock("li", {
                          key: sale.id
                        }, [
                          createVNode(_sfc_main$3, {
                            sale,
                            url: `${__props.cityBaseUrl}/for-sale/${sale.id}`,
                            "show-status": false
                          }, null, 8, ["sale", "url"])
                        ]);
                      }), 128))
                    ]),
                    createVNode("a", {
                      href: `${__props.cityBaseUrl}/for-sale`,
                      class: "inline-block text-sm font-medium text-primary underline"
                    }, "View all for sale", 8, ["href"])
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-muted"
                  }, "No items for sale yet."))
                ]),
                createVNode("a", {
                  href: __props.homeUrl,
                  class: "inline-block text-muted underline hover:text-fg"
                }, "Back to cities", 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/City/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
