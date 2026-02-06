import { reactive, computed, resolveComponent, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, withKeys, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const page = usePage();
    page.props.urls || {};
    const props = __props;
    const form = reactive({
      q: props.filters.q ?? "",
      type: props.filters.type ?? "",
      min_price: props.filters.min_price ?? "",
      max_price: props.filters.max_price ?? ""
    });
    const listingTypeOptions = computed(() => {
      return Object.entries(props.listingTypes).filter(
        ([, config]) => config && typeof config === "object" && config.label
      );
    });
    function search() {
      const url = `${props.cityBaseUrl}/listings`;
      router.get(url, {
        q: form.q || void 0,
        type: form.type || void 0,
        min_price: form.min_price || void 0,
        max_price: form.max_price || void 0
      }, { preserveState: true });
    }
    function saveSearchUrl() {
      const params = new URLSearchParams({
        save: "1",
        city_id: props.city.id,
        name: `${props.city.name} – ${form.q || "Listings"}`,
        ...form.q && { "query[q]": form.q },
        ...form.type && { "query[type]": form.type },
        ...form.min_price && { "query[min_price]": form.min_price },
        ...form.max_price && { "query[max_price]": form.max_price }
      });
      return (props.homeUrl || "").replace(/\/$/, "") + "/account/saved-searches?" + params.toString();
    }
    function listingThumbUrl(listing) {
      const u = listing.uploads?.[0];
      if (u && (u.lg_url || u.sm_url)) return u.lg_url || u.sm_url;
      return listing.attachments?.[0]?.url ?? null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
      const _component_gv_button = resolveComponent("gv-button");
      const _component_gv_pagination = resolveComponent("gv-pagination");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Listings`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Listings"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                text: "Profile"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: _ctx.$page.props.urls?.signIn || "/account/sign-in",
                text: "Log in"
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              _ctx.$page.props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                key: 0,
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                text: "Profile"
              }, null, 8, ["href"])) : (openBlock(), createBlock(_component_gv_header_navigation_item, {
                key: 1,
                href: _ctx.$page.props.urls?.signIn || "/account/sign-in",
                text: "Log in"
              }, null, 8, ["href"]))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><div class="mb-6 grid gap-4 rounded-token-md border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"${_scopeId}><div class="min-w-0 col-span-full"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "search-q",
              modelValue: form.q,
              "onUpdate:modelValue": ($event) => form.q = $event,
              label: "Search",
              type: "text",
              placeholder: "Keywords...",
              class: "govuk-!-width-full",
              onKeyup: search
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="min-w-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_select, {
              id: "search-type",
              modelValue: form.type,
              "onUpdate:modelValue": ($event) => form.type = $event,
              label: "Type",
              class: "govuk-!-width-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`All`);
                      } else {
                        return [
                          createTextVNode("All")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<!--[-->`);
                  ssrRenderList(listingTypeOptions.value, ([key, config]) => {
                    _push3(ssrRenderComponent(_component_gv_select_option, {
                      key,
                      value: key
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(config.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(config.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    createVNode(_component_gv_select_option, { value: "" }, {
                      default: withCtx(() => [
                        createTextVNode("All")
                      ]),
                      _: 1
                    }),
                    (openBlock(true), createBlock(Fragment, null, renderList(listingTypeOptions.value, ([key, config]) => {
                      return openBlock(), createBlock(_component_gv_select_option, {
                        key,
                        value: key
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(config.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="min-w-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "search-min-price",
              modelValue: form.min_price,
              "onUpdate:modelValue": ($event) => form.min_price = $event,
              label: "Min $",
              type: "number",
              inputmode: "decimal",
              class: "govuk-!-width-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="min-w-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "search-max-price",
              modelValue: form.max_price,
              "onUpdate:modelValue": ($event) => form.max_price = $event,
              label: "Max $",
              type: "number",
              inputmode: "decimal",
              class: "govuk-!-width-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="govuk-button-group min-w-0 sm:col-span-2 lg:col-span-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_button, {
              type: "button",
              variant: "primary",
              onClick: search
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Search`);
                } else {
                  return [
                    createTextVNode("Search")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: saveSearchUrl(),
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Save search`);
                  } else {
                    return [
                      createTextVNode("Save search")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="mb-6 flex flex-wrap items-center justify-between gap-4"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Listings</h1>`);
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/listings/new`,
                class: "govuk-button",
                role: "button"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`New listing`);
                  } else {
                    return [
                      createTextVNode("New listing")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border"${_scopeId}><!--[-->`);
            ssrRenderList(__props.listings.data, (listing) => {
              _push2(`<li class="py-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/listings/${listing.id}`,
                class: "flex items-center gap-4 no-underline hover:underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="w-16 h-16 shrink-0 rounded-token-sm overflow-hidden bg-muted flex items-center justify-center text-muted text-xs"${_scopeId2}>`);
                    if (listingThumbUrl(listing)) {
                      _push3(`<img${ssrRenderAttr("src", listingThumbUrl(listing))} alt="" class="w-full h-full object-cover"${_scopeId2}>`);
                    } else {
                      _push3(`<span${_scopeId2}>No photo</span>`);
                    }
                    _push3(`</div><div class="min-w-0 flex-1"${_scopeId2}><p class="font-medium text-fg truncate"${_scopeId2}>${ssrInterpolate(listing.title)}</p><p class="text-sm text-muted"${_scopeId2}>${ssrInterpolate(__props.listingTypes[listing.type]?.label || listing.type)} · ${ssrInterpolate(listing.price != null ? `$${Number(listing.price).toLocaleString()}` : "Free")}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-16 h-16 shrink-0 rounded-token-sm overflow-hidden bg-muted flex items-center justify-center text-muted text-xs" }, [
                        listingThumbUrl(listing) ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: listingThumbUrl(listing),
                          alt: "",
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, "No photo"))
                      ]),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "font-medium text-fg truncate" }, toDisplayString(listing.title), 1),
                        createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.listingTypes[listing.type]?.label || listing.type) + " · " + toDisplayString(listing.price != null ? `$${Number(listing.price).toLocaleString()}` : "Free"), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul>`);
            if (__props.listings.data.length === 0) {
              _push2(`<div class="py-12 text-center text-muted"${_scopeId}>No listings found.</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.listings.prev_page_url || __props.listings.next_page_url) {
              _push2(ssrRenderComponent(_component_gv_pagination, {
                variant: "block",
                "current-page": __props.listings.current_page,
                "previous-href": __props.listings.prev_page_url || void 0,
                "next-href": __props.listings.next_page_url || void 0,
                "link-component": unref(Link),
                class: "govuk-!-margin-top-6"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "mb-6 grid gap-4 rounded-token-md border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end" }, [
                  createVNode("div", { class: "min-w-0 col-span-full" }, [
                    createVNode(_component_gv_input, {
                      id: "search-q",
                      modelValue: form.q,
                      "onUpdate:modelValue": ($event) => form.q = $event,
                      label: "Search",
                      type: "text",
                      placeholder: "Keywords...",
                      class: "govuk-!-width-full",
                      onKeyup: withKeys(search, ["enter"])
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode(_component_gv_select, {
                      id: "search-type",
                      modelValue: form.type,
                      "onUpdate:modelValue": ($event) => form.type = $event,
                      label: "Type",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("All")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(listingTypeOptions.value, ([key, config]) => {
                          return openBlock(), createBlock(_component_gv_select_option, {
                            key,
                            value: key
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(config.label), 1)
                            ]),
                            _: 2
                          }, 1032, ["value"]);
                        }), 128))
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode(_component_gv_input, {
                      id: "search-min-price",
                      modelValue: form.min_price,
                      "onUpdate:modelValue": ($event) => form.min_price = $event,
                      label: "Min $",
                      type: "number",
                      inputmode: "decimal",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode(_component_gv_input, {
                      id: "search-max-price",
                      modelValue: form.max_price,
                      "onUpdate:modelValue": ($event) => form.max_price = $event,
                      label: "Max $",
                      type: "number",
                      inputmode: "decimal",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "govuk-button-group min-w-0 sm:col-span-2 lg:col-span-1" }, [
                    createVNode(_component_gv_button, {
                      type: "button",
                      variant: "primary",
                      onClick: search
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Search")
                      ]),
                      _: 1
                    }),
                    _ctx.$page.props.auth?.user ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: saveSearchUrl(),
                      class: "govuk-link"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Save search")
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "mb-6 flex flex-wrap items-center justify-between gap-4" }, [
                  createVNode("h1", { class: "govuk-heading-l" }, "Listings"),
                  _ctx.$page.props.auth?.user ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `${__props.cityBaseUrl}/listings/new`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("New listing")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                createVNode("ul", { class: "govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.listings.data, (listing) => {
                    return openBlock(), createBlock("li", {
                      key: listing.id,
                      class: "py-3"
                    }, [
                      createVNode(unref(Link), {
                        href: `${__props.cityBaseUrl}/listings/${listing.id}`,
                        class: "flex items-center gap-4 no-underline hover:underline"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "w-16 h-16 shrink-0 rounded-token-sm overflow-hidden bg-muted flex items-center justify-center text-muted text-xs" }, [
                            listingThumbUrl(listing) ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: listingThumbUrl(listing),
                              alt: "",
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, "No photo"))
                          ]),
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("p", { class: "font-medium text-fg truncate" }, toDisplayString(listing.title), 1),
                            createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.listingTypes[listing.type]?.label || listing.type) + " · " + toDisplayString(listing.price != null ? `$${Number(listing.price).toLocaleString()}` : "Free"), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 128))
                ]),
                __props.listings.data.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "py-12 text-center text-muted"
                }, "No listings found.")) : createCommentVNode("", true),
                __props.listings.prev_page_url || __props.listings.next_page_url ? (openBlock(), createBlock(_component_gv_pagination, {
                  key: 1,
                  variant: "block",
                  "current-page": __props.listings.current_page,
                  "previous-href": __props.listings.prev_page_url || void 0,
                  "next-href": __props.listings.next_page_url || void 0,
                  "link-component": unref(Link),
                  class: "govuk-!-margin-top-6"
                }, null, 8, ["current-page", "previous-href", "next-href", "link-component"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
