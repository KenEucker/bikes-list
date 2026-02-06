import { unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$2 } from "./StatusTag-BeNLpE6N.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "PageShow",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    page: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – ${__props.page.name} – Dashboard`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Dashboard", "Community pages", __props.page.name]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard/pages`,
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to pages`);
                } else {
                  return [
                    createTextVNode("Back to pages")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
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
          } else {
            return [
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/dashboard/pages`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to pages")
                ]),
                _: 1
              }, 8, ["href"]),
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/dashboard`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Dashboard")
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.page.name)}</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              status: __props.page.state,
              class: "mt-2"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-6 flex gap-2 border-b border-border"${_scopeId}><!--[-->`);
            ssrRenderList(["Overview", "Profile", "Team", "For Sale", "Rides"], (t) => {
              _push2(`<button class="border-b-2 px-2 py-2 text-sm font-medium border-transparent text-muted"${_scopeId}>${ssrInterpolate(t)}</button>`);
            });
            _push2(`<!--]--></div><div class="mt-6"${_scopeId}><p class="text-muted"${_scopeId}>Overview and management for this community page. Profile, team, sales, and rides tabs can be wired to edit views.</p>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/community/${__props.page.slug}/edit`,
              class: "mt-4 inline-block text-primary underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Edit page`);
                } else {
                  return [
                    createTextVNode("Edit page")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.page.name), 1),
                createVNode(_sfc_main$2, {
                  status: __props.page.state,
                  class: "mt-2"
                }, null, 8, ["status"]),
                createVNode("div", { class: "mt-6 flex gap-2 border-b border-border" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(["Overview", "Profile", "Team", "For Sale", "Rides"], (t) => {
                    return createVNode("button", {
                      key: t,
                      class: "border-b-2 px-2 py-2 text-sm font-medium border-transparent text-muted"
                    }, toDisplayString(t), 1);
                  }), 64))
                ]),
                createVNode("div", { class: "mt-6" }, [
                  createVNode("p", { class: "text-muted" }, "Overview and management for this community page. Profile, team, sales, and rides tabs can be wired to edit views."),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/community/${__props.page.slug}/edit`,
                    class: "mt-4 inline-block text-primary underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Edit page")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/PageShow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
