import { computed, resolveComponent, withCtx, renderSlot, unref, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-CvaWB3EK.js";
import { _ as _sfc_main$2 } from "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "CityLayout",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    breadcrumb: { type: [String, Array], default: null }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const logo = page.props.logo || "/bikeslist.png";
    const appName = page.props.appName || "BikesList";
    const breadcrumbItems = computed(() => {
      if (props.breadcrumb == null) return [];
      return Array.isArray(props.breadcrumb) ? [...props.breadcrumb] : [props.breadcrumb];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header = resolveComponent("gv-header");
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      const _component_gv_breadcrumbs = resolveComponent("gv-breadcrumbs");
      const _component_gv_breadcrumb_item = resolveComponent("gv-breadcrumb-item");
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_header, {
              "service-name": __props.city.name,
              "service-url": __props.cityBaseUrl,
              "homepage-url": "/"
            }, {
              logo: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="govuk-header__logo"${_scopeId2}><a${ssrRenderAttr("href", __props.cityBaseUrl)} class="govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"${_scopeId2}><img${ssrRenderAttr("src", unref(logo))}${ssrRenderAttr("alt", unref(appName))} class="h-9 w-auto object-contain"${_scopeId2}><span class="govuk-header__product-name"${_scopeId2}>${ssrInterpolate(unref(appName))}</span></a></div>`);
                } else {
                  return [
                    createVNode("div", { class: "govuk-header__logo" }, [
                      createVNode("a", {
                        href: __props.cityBaseUrl,
                        class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
                      }, [
                        createVNode("img", {
                          src: unref(logo),
                          alt: unref(appName),
                          class: "h-9 w-auto object-contain"
                        }, null, 8, ["src", "alt"]),
                        createVNode("span", { class: "govuk-header__product-name" }, toDisplayString(unref(appName)), 1)
                      ], 8, ["href"])
                    ])
                  ];
                }
              }),
              navigation: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/listings`,
                    text: "Listings"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/events`,
                    text: "Events"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/community`,
                    text: "Community"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/search`,
                    text: "Search"
                  }, null, _parent3, _scopeId2));
                  if (unref(page).props.auth?.user) {
                    _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                      href: `${__props.cityBaseUrl}/listings/new`,
                      text: "New listing"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<li class="govuk-header__navigation-item"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$2, null, null, _parent3, _scopeId2));
                  _push3(`</li>`);
                  ssrRenderSlot(_ctx.$slots, "nav-right", {}, () => {
                    if (unref(page).props.auth?.user) {
                      _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                        href: `${__props.cityBaseUrl}/dashboard`,
                        text: "Dashboard"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(_component_gv_header_navigation_item, {
                        href: unref(page).props.urls?.signIn || "/account/sign-in",
                        text: "Sign in"
                      }, null, _parent3, _scopeId2));
                    }
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode(_component_gv_header_navigation_item, {
                      href: `${__props.cityBaseUrl}/listings`,
                      text: "Listings"
                    }, null, 8, ["href"]),
                    createVNode(_component_gv_header_navigation_item, {
                      href: `${__props.cityBaseUrl}/events`,
                      text: "Events"
                    }, null, 8, ["href"]),
                    createVNode(_component_gv_header_navigation_item, {
                      href: `${__props.cityBaseUrl}/community`,
                      text: "Community"
                    }, null, 8, ["href"]),
                    createVNode(_component_gv_header_navigation_item, {
                      href: `${__props.cityBaseUrl}/search`,
                      text: "Search"
                    }, null, 8, ["href"]),
                    unref(page).props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                      key: 0,
                      href: `${__props.cityBaseUrl}/listings/new`,
                      text: "New listing"
                    }, null, 8, ["href"])) : createCommentVNode("", true),
                    createVNode("li", { class: "govuk-header__navigation-item" }, [
                      createVNode(_sfc_main$2)
                    ]),
                    renderSlot(_ctx.$slots, "nav-right", {}, () => [
                      unref(page).props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                        key: 0,
                        href: `${__props.cityBaseUrl}/dashboard`,
                        text: "Dashboard"
                      }, null, 8, ["href"])) : (openBlock(), createBlock(_component_gv_header_navigation_item, {
                        key: 1,
                        href: unref(page).props.urls?.signIn || "/account/sign-in",
                        text: "Sign in"
                      }, null, 8, ["href"]))
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            if (breadcrumbItems.value.length) {
              _push2(`<div class="app-breadcrumbs govuk-width-container govuk-!-padding-top-3 govuk-!-padding-bottom-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_gv_breadcrumbs, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_gv_breadcrumb_item, { href: __props.cityBaseUrl }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.city.name)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.city.name), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<!--[-->`);
                    ssrRenderList(breadcrumbItems.value, (label, i) => {
                      _push3(ssrRenderComponent(_component_gv_breadcrumb_item, { key: i }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(label)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(label), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      createVNode(_component_gv_breadcrumb_item, { href: __props.cityBaseUrl }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.city.name), 1)
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      (openBlock(true), createBlock(Fragment, null, renderList(breadcrumbItems.value, (label, i) => {
                        return openBlock(), createBlock(_component_gv_breadcrumb_item, { key: i }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(label), 1)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_gv_header, {
                "service-name": __props.city.name,
                "service-url": __props.cityBaseUrl,
                "homepage-url": "/"
              }, {
                logo: withCtx(() => [
                  createVNode("div", { class: "govuk-header__logo" }, [
                    createVNode("a", {
                      href: __props.cityBaseUrl,
                      class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
                    }, [
                      createVNode("img", {
                        src: unref(logo),
                        alt: unref(appName),
                        class: "h-9 w-auto object-contain"
                      }, null, 8, ["src", "alt"]),
                      createVNode("span", { class: "govuk-header__product-name" }, toDisplayString(unref(appName)), 1)
                    ], 8, ["href"])
                  ])
                ]),
                navigation: withCtx(() => [
                  createVNode(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/listings`,
                    text: "Listings"
                  }, null, 8, ["href"]),
                  createVNode(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/events`,
                    text: "Events"
                  }, null, 8, ["href"]),
                  createVNode(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/community`,
                    text: "Community"
                  }, null, 8, ["href"]),
                  createVNode(_component_gv_header_navigation_item, {
                    href: `${__props.cityBaseUrl}/search`,
                    text: "Search"
                  }, null, 8, ["href"]),
                  unref(page).props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                    key: 0,
                    href: `${__props.cityBaseUrl}/listings/new`,
                    text: "New listing"
                  }, null, 8, ["href"])) : createCommentVNode("", true),
                  createVNode("li", { class: "govuk-header__navigation-item" }, [
                    createVNode(_sfc_main$2)
                  ]),
                  renderSlot(_ctx.$slots, "nav-right", {}, () => [
                    unref(page).props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                      key: 0,
                      href: `${__props.cityBaseUrl}/dashboard`,
                      text: "Dashboard"
                    }, null, 8, ["href"])) : (openBlock(), createBlock(_component_gv_header_navigation_item, {
                      key: 1,
                      href: unref(page).props.urls?.signIn || "/account/sign-in",
                      text: "Sign in"
                    }, null, 8, ["href"]))
                  ])
                ]),
                _: 3
              }, 8, ["service-name", "service-url"]),
              breadcrumbItems.value.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "app-breadcrumbs govuk-width-container govuk-!-padding-top-3 govuk-!-padding-bottom-2"
              }, [
                createVNode(_component_gv_breadcrumbs, null, {
                  default: withCtx(() => [
                    createVNode(_component_gv_breadcrumb_item, { href: __props.cityBaseUrl }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.city.name), 1)
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(breadcrumbItems.value, (label, i) => {
                      return openBlock(), createBlock(_component_gv_breadcrumb_item, { key: i }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(label), 1)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                })
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/CityLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
