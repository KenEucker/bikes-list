import { onMounted, onUnmounted, computed, ref, mergeProps, useSSRContext, unref, withCtx, renderSlot, resolveComponent, createTextVNode, createVNode, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderStyle, ssrRenderClass, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./ApplicationLogo-D72Pm_U0.js";
import { Link, usePage } from "@inertiajs/vue3";
import { _ as _sfc_main$3 } from "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main$2 = {
  __name: "Dropdown",
  __ssrInlineRender: true,
  props: {
    align: {
      type: String,
      default: "right"
    },
    width: {
      type: String,
      default: "48"
    },
    contentClasses: {
      type: String,
      default: "py-1 bg-card border border-border"
    }
  },
  setup(__props) {
    const props = __props;
    const closeOnEscape = (e) => {
      if (open.value && e.key === "Escape") {
        open.value = false;
      }
    };
    onMounted(() => document.addEventListener("keydown", closeOnEscape));
    onUnmounted(() => document.removeEventListener("keydown", closeOnEscape));
    const widthClass = computed(() => {
      return {
        48: "w-48"
      }[props.width.toString()];
    });
    const alignmentClasses = computed(() => {
      if (props.align === "left") {
        return "ltr:origin-top-left rtl:origin-top-right start-0";
      } else if (props.align === "right") {
        return "ltr:origin-top-right rtl:origin-top-left end-0";
      } else {
        return "origin-top";
      }
    });
    const open = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><div>`);
      ssrRenderSlot(_ctx.$slots, "trigger", {}, null, _push, _parent);
      _push(`</div><div class="fixed inset-0 z-40" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"></div><div class="${ssrRenderClass([[widthClass.value, alignmentClasses.value], "absolute z-50 mt-2 rounded-md shadow-lg"])}" style="${ssrRenderStyle([
        { "display": "none" },
        open.value ? null : { display: "none" }
      ])}"><div class="${ssrRenderClass([__props.contentClasses, "rounded-md ring-1 ring-border"])}">`);
      ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dropdown.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "DropdownLink",
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: "block w-full px-4 py-2 text-start text-sm leading-5 text-fg transition duration-150 ease-in-out hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
      }, _attrs), {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DropdownLink.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "AuthenticatedLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const urls = computed(() => page.props.urls || {});
    const dashboardUrl = computed(() => urls.value.dashboard || (typeof window !== "undefined" ? window.location.origin + "/dashboard" : "/dashboard"));
    const isDashboard = computed(() => (page.url || "").startsWith("/dashboard"));
    const accountUrl = computed(() => urls.value.accountSettings || "/account/settings");
    const logoutUrl = computed(() => urls.value.logout || "/logout");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header = resolveComponent("gv-header");
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="min-h-screen bg-page">`);
      _push(ssrRenderComponent(_component_gv_header, {
        "service-name": "BikesList",
        "service-url": dashboardUrl.value,
        "homepage-url": "/"
      }, {
        logo: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="govuk-header__logo"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: dashboardUrl.value,
              class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, { "logo-class": "block h-9 w-auto object-contain text-fg" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4, { "logo-class": "block h-9 w-auto object-contain text-fg" })
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
                  href: dashboardUrl.value,
                  class: "govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline"
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$4, { "logo-class": "block h-9 w-auto object-contain text-fg" })
                  ]),
                  _: 1
                }, 8, ["href"])
              ])
            ];
          }
        }),
        navigation: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: dashboardUrl.value,
              active: isDashboard.value,
              text: "Dashboard"
            }, null, _parent2, _scopeId));
            _push2(`<li class="govuk-header__navigation-item"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
            _push2(`</li><li class="govuk-header__navigation-item"${_scopeId}><div class="relative"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              align: "right",
              width: "48"
            }, {
              trigger: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="inline-flex rounded-md"${_scopeId2}><button type="button" class="govuk-header__link inline-flex items-center"${_scopeId2}>${ssrInterpolate(_ctx.$page.props.auth?.user?.name ?? "Account")} <svg class="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"${_scopeId2}><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"${_scopeId2}></path></svg></button></span>`);
                } else {
                  return [
                    createVNode("span", { class: "inline-flex rounded-md" }, [
                      createVNode("button", {
                        type: "button",
                        class: "govuk-header__link inline-flex items-center"
                      }, [
                        createTextVNode(toDisplayString(_ctx.$page.props.auth?.user?.name ?? "Account") + " ", 1),
                        (openBlock(), createBlock("svg", {
                          class: "-me-0.5 ms-2 h-4 w-4",
                          xmlns: "http://www.w3.org/2000/svg",
                          viewBox: "0 0 20 20",
                          fill: "currentColor"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ])
                    ])
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$1, { href: accountUrl.value }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Profile `);
                      } else {
                        return [
                          createTextVNode(" Profile ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$1, {
                    href: logoutUrl.value,
                    method: "post",
                    as: "button"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Log Out `);
                      } else {
                        return [
                          createTextVNode(" Log Out ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$1, { href: accountUrl.value }, {
                      default: withCtx(() => [
                        createTextVNode(" Profile ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode(_sfc_main$1, {
                      href: logoutUrl.value,
                      method: "post",
                      as: "button"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Log Out ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></li>`);
          } else {
            return [
              createVNode(_component_gv_header_navigation_item, {
                href: dashboardUrl.value,
                active: isDashboard.value,
                text: "Dashboard"
              }, null, 8, ["href", "active"]),
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode(_sfc_main$3)
              ]),
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode("div", { class: "relative" }, [
                  createVNode(_sfc_main$2, {
                    align: "right",
                    width: "48"
                  }, {
                    trigger: withCtx(() => [
                      createVNode("span", { class: "inline-flex rounded-md" }, [
                        createVNode("button", {
                          type: "button",
                          class: "govuk-header__link inline-flex items-center"
                        }, [
                          createTextVNode(toDisplayString(_ctx.$page.props.auth?.user?.name ?? "Account") + " ", 1),
                          (openBlock(), createBlock("svg", {
                            class: "-me-0.5 ms-2 h-4 w-4",
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 20 20",
                            fill: "currentColor"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                              "clip-rule": "evenodd"
                            })
                          ]))
                        ])
                      ])
                    ]),
                    content: withCtx(() => [
                      createVNode(_sfc_main$1, { href: accountUrl.value }, {
                        default: withCtx(() => [
                          createTextVNode(" Profile ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode(_sfc_main$1, {
                        href: logoutUrl.value,
                        method: "post",
                        as: "button"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Log Out ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (_ctx.$slots.header) {
        _push(`<header class="bg-card border-b border-border shadow-sm"><div class="govuk-width-container govuk-!-padding-top-6 govuk-!-padding-bottom-6">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</div></header>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AuthenticatedLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
