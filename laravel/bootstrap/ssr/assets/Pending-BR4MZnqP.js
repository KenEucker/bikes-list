import { unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./StatusTag-BeNLpE6N.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Pending",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    listings: { type: Array, default: () => [] },
    events: { type: Array, default: () => [] },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Pending`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Dashboard", "Pending"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard`,
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Dashboard`);
                } else {
                  return [
                    createTextVNode("Dashboard")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Account`);
                } else {
                  return [
                    createTextVNode("Account")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/dashboard`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Dashboard")
                ]),
                _: 1
              }, 8, ["href"]),
              createVNode(unref(Link), {
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Account")
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>Pending review</h1><p class="mt-2 text-sm text-muted"${_scopeId}>These items will be published or approved automatically if not reviewed by a moderator.</p>`);
            if (__props.listings.length) {
              _push2(`<section class="mt-6"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Listings</h2><ul class="mt-2 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listings, (listing) => {
                _push2(`<li class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/listings/${listing.id}`)} class="font-medium text-primary underline"${_scopeId}>${ssrInterpolate(listing.title)}</a>`);
                _push2(ssrRenderComponent(_sfc_main$2, { status: "pending_review" }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.events.length) {
              _push2(`<section class="mt-6"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Events</h2><ul class="mt-2 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.events, (event) => {
                _push2(`<li class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/events/${event.id}`)} class="font-medium text-primary underline"${_scopeId}>${ssrInterpolate(event.title)}</a>`);
                _push2(ssrRenderComponent(_sfc_main$2, { status: "pending_review" }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.pages.length) {
              _push2(`<section class="mt-6"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Community pages</h2><ul class="mt-2 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.pages, (page) => {
                _push2(`<li class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${page.slug}`)} class="font-medium text-primary underline"${_scopeId}>${ssrInterpolate(page.name)}</a>`);
                _push2(ssrRenderComponent(_sfc_main$2, { status: "pending" }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (!__props.listings.length && !__props.events.length && !__props.pages.length) {
              _push2(`<p class="mt-6 text-muted"${_scopeId}>No pending items.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, "Pending review"),
                createVNode("p", { class: "mt-2 text-sm text-muted" }, "These items will be published or approved automatically if not reviewed by a moderator."),
                __props.listings.length ? (openBlock(), createBlock("section", {
                  key: 0,
                  class: "mt-6"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Listings"),
                  createVNode("ul", { class: "mt-2 space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.listings, (listing) => {
                      return openBlock(), createBlock("li", {
                        key: listing.id,
                        class: "flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/listings/${listing.id}`,
                          class: "font-medium text-primary underline"
                        }, toDisplayString(listing.title), 9, ["href"]),
                        createVNode(_sfc_main$2, { status: "pending_review" })
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.events.length ? (openBlock(), createBlock("section", {
                  key: 1,
                  class: "mt-6"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Events"),
                  createVNode("ul", { class: "mt-2 space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.events, (event) => {
                      return openBlock(), createBlock("li", {
                        key: event.id,
                        class: "flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/events/${event.id}`,
                          class: "font-medium text-primary underline"
                        }, toDisplayString(event.title), 9, ["href"]),
                        createVNode(_sfc_main$2, { status: "pending_review" })
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.pages.length ? (openBlock(), createBlock("section", {
                  key: 2,
                  class: "mt-6"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Community pages"),
                  createVNode("ul", { class: "mt-2 space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.pages, (page) => {
                      return openBlock(), createBlock("li", {
                        key: page.id,
                        class: "flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/community/${page.slug}`,
                          class: "font-medium text-primary underline"
                        }, toDisplayString(page.name), 9, ["href"]),
                        createVNode(_sfc_main$2, { status: "pending" })
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                !__props.listings.length && !__props.events.length && !__props.pages.length ? (openBlock(), createBlock("p", {
                  key: 3,
                  class: "mt-6 text-muted"
                }, "No pending items.")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Pending.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
