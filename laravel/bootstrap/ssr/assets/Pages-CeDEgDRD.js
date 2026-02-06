import { unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./StatusTag-BeNLpE6N.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Pages",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – My community pages`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Dashboard", "Community pages"]
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
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>My community pages</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/community/new`,
              class: "mt-4 inline-block govuk-button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`New page`);
                } else {
                  return [
                    createTextVNode("New page")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<ul class="mt-6 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.pages, (page) => {
              _push2(`<li class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/dashboard/pages/${page.slug}`)} class="font-medium text-primary underline"${_scopeId}>${ssrInterpolate(page.name)}</a>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                status: page.state
              }, null, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "My community pages"),
                createVNode(unref(Link), {
                  href: `${__props.cityBaseUrl}/community/new`,
                  class: "mt-4 inline-block govuk-button"
                }, {
                  default: withCtx(() => [
                    createTextVNode("New page")
                  ]),
                  _: 1
                }, 8, ["href"]),
                createVNode("ul", { class: "mt-6 space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.pages, (page) => {
                    return openBlock(), createBlock("li", {
                      key: page.id,
                      class: "flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2"
                    }, [
                      createVNode("a", {
                        href: `${__props.cityBaseUrl}/dashboard/pages/${page.slug}`,
                        class: "font-medium text-primary underline"
                      }, toDisplayString(page.name), 9, ["href"]),
                      createVNode(_sfc_main$2, {
                        status: page.state
                      }, null, 8, ["status"])
                    ]);
                  }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Pages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
