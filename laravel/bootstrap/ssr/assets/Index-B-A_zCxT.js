import { resolveComponent, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    moderatedCities: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" }
  },
  setup(__props) {
    function cityModUrl(slug) {
      const host = typeof window !== "undefined" ? window.location.host : "";
      const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
      const port = typeof window !== "undefined" && window.location.port ? ":" + window.location.port : "";
      return `${protocol}//${slug}.${host}${port}/moderation`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Moderation`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Moderation"
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.moderatedCities.length > 1) {
              _push2(`<li class="govuk-header__navigation-item"${_scopeId}><select class="govuk-select govuk-!-width-auto"${ssrRenderAttr("value", __props.city.slug)}${_scopeId}><!--[-->`);
              ssrRenderList(__props.moderatedCities, (c) => {
                _push2(`<option${ssrRenderAttr("value", c.slug)}${_scopeId}>${ssrInterpolate(c.name)}</option>`);
              });
              _push2(`<!--]--></select></li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: __props.cityBaseUrl,
              text: "Back to city"
            }, null, _parent2, _scopeId));
          } else {
            return [
              __props.moderatedCities.length > 1 ? (openBlock(), createBlock("li", {
                key: 0,
                class: "govuk-header__navigation-item"
              }, [
                createVNode("select", {
                  class: "govuk-select govuk-!-width-auto",
                  value: __props.city.slug,
                  onChange: (e) => _ctx.window.location.href = cityModUrl(e.target.value)
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.moderatedCities, (c) => {
                    return openBlock(), createBlock("option", {
                      key: c.id,
                      value: c.slug
                    }, toDisplayString(c.name), 9, ["value"]);
                  }), 128))
                ], 40, ["value", "onChange"])
              ])) : createCommentVNode("", true),
              createVNode(_component_gv_header_navigation_item, {
                href: __props.cityBaseUrl,
                text: "Back to city"
              }, null, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Moderation</h1><p class="govuk-body"${_scopeId}>Review and approve or remove pending content.</p><div class="govuk-button-group govuk-!-margin-top-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation/sales`,
              class: "govuk-button",
              role: "button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sales queue`);
                } else {
                  return [
                    createTextVNode("Sales queue")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation/rides`,
              class: "govuk-button",
              role: "button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Rides queue`);
                } else {
                  return [
                    createTextVNode("Rides queue")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation/pages`,
              class: "govuk-button",
              role: "button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Pages queue`);
                } else {
                  return [
                    createTextVNode("Pages queue")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Moderation"),
                createVNode("p", { class: "govuk-body" }, "Review and approve or remove pending content."),
                createVNode("div", { class: "govuk-button-group govuk-!-margin-top-6" }, [
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/moderation/sales`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Sales queue")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/moderation/rides`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Rides queue")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/moderation/pages`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Pages queue")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Moderation/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
