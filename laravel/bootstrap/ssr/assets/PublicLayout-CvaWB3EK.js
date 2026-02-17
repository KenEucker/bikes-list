import { resolveComponent, mergeProps, unref, withCtx, renderSlot, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "PublicLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const logo = page.props.logo || "/bikeslist.png";
    const urls = page.props.urls || {};
    const homeUrl = urls.home || "/";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header = resolveComponent("gv-header");
      const _component_gv_footer = resolveComponent("gv-footer");
      const _component_gv_footer_meta = resolveComponent("gv-footer-meta");
      const _component_gv_footer_meta_item = resolveComponent("gv-footer-meta-item");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-page" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "header", {}, () => {
        _push(ssrRenderComponent(_component_gv_header, {
          "service-name": "Cities",
          "service-url": unref(homeUrl)
        }, {
          logo: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="govuk-header__logo"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(homeUrl),
                class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<img${ssrRenderAttr("src", unref(logo))} alt="BikesList" class="h-9 w-auto object-contain"${_scopeId2}><span class="govuk-header__product-name"${_scopeId2}>BikesList</span>`);
                  } else {
                    return [
                      createVNode("img", {
                        src: unref(logo),
                        alt: "BikesList",
                        class: "h-9 w-auto object-contain"
                      }, null, 8, ["src"]),
                      createVNode("span", { class: "govuk-header__product-name" }, "BikesList")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "govuk-header__logo" }, [
                  createVNode(unref(Link), {
                    href: unref(homeUrl),
                    class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
                  }, {
                    default: withCtx(() => [
                      createVNode("img", {
                        src: unref(logo),
                        alt: "BikesList",
                        class: "h-9 w-auto object-contain"
                      }, null, 8, ["src"]),
                      createVNode("span", { class: "govuk-header__product-name" }, "BikesList")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])
              ];
            }
          }),
          navigation: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav")
              ];
            }
          }),
          _: 3
        }, _parent));
      }, _push, _parent);
      _push(`<main class="govuk-width-container govuk-!-margin-top-6 flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_gv_footer, { class: "mt-auto" }, {
        meta: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_footer_meta, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_footer_meta_item, {
                    href: unref(urls).mainSite || unref(homeUrl)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Choose city`);
                      } else {
                        return [
                          createTextVNode("Choose city")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_footer_meta_item, {
                    href: unref(urls).terms || "/terms"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Terms`);
                      } else {
                        return [
                          createTextVNode("Terms")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_footer_meta_item, {
                    href: unref(urls).privacy || "/privacy"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Privacy`);
                      } else {
                        return [
                          createTextVNode("Privacy")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_gv_footer_meta_item, {
                      href: unref(urls).mainSite || unref(homeUrl)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Choose city")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode(_component_gv_footer_meta_item, {
                      href: unref(urls).terms || "/terms"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Terms")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode(_component_gv_footer_meta_item, {
                      href: unref(urls).privacy || "/privacy"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Privacy")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_gv_footer_meta, null, {
                default: withCtx(() => [
                  createVNode(_component_gv_footer_meta_item, {
                    href: unref(urls).mainSite || unref(homeUrl)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Choose city")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(_component_gv_footer_meta_item, {
                    href: unref(urls).terms || "/terms"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Terms")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(_component_gv_footer_meta_item, {
                    href: unref(urls).privacy || "/privacy"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Privacy")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                _: 1
              })
            ];
          }
        }),
        "content-licence": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Built with ❤️ from KenEucker. `);
          } else {
            return [
              createTextVNode(" Built with ❤️ from KenEucker. ")
            ];
          }
        }),
        copyright: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><img${ssrRenderAttr("src", unref(logo))} alt="BikesList" class="h-6 justify-center"${_scopeId}><span class="govuk-footer__copyright-text ml-2 justify-center"${_scopeId}> BikesList © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("img", {
                  src: unref(logo),
                  alt: "BikesList",
                  class: "h-6 justify-center"
                }, null, 8, ["src"]),
                createVNode("span", { class: "govuk-footer__copyright-text ml-2 justify-center" }, " BikesList © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/PublicLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
