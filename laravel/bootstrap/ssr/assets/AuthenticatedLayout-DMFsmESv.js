import { computed, resolveComponent, withCtx, unref, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./ApplicationLogo-D72Pm_U0.js";
import { _ as _sfc_main$1 } from "./ThemeToggle-Mk6IgKQe.js";
import { usePage, Link } from "@inertiajs/vue3";
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
                  _push3(ssrRenderComponent(_sfc_main$2, { "logo-class": "block h-9 w-auto object-contain text-fg" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2, { "logo-class": "block h-9 w-auto object-contain text-fg" })
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
                    createVNode(_sfc_main$2, { "logo-class": "block h-9 w-auto object-contain text-fg" })
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
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(`</li>`);
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: accountUrl.value,
              text: "Account"
            }, null, _parent2, _scopeId));
            _push2(`<li class="govuk-header__navigation-item"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: logoutUrl.value,
              method: "post",
              as: "button",
              class: "govuk-header__link border-0 bg-transparent font-inherit text-inherit cursor-pointer py-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign out `);
                } else {
                  return [
                    createTextVNode(" Sign out ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li>`);
          } else {
            return [
              createVNode(_component_gv_header_navigation_item, {
                href: dashboardUrl.value,
                active: isDashboard.value,
                text: "Dashboard"
              }, null, 8, ["href", "active"]),
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode(_sfc_main$1)
              ]),
              createVNode(_component_gv_header_navigation_item, {
                href: accountUrl.value,
                text: "Account"
              }, null, 8, ["href"]),
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode(unref(Link), {
                  href: logoutUrl.value,
                  method: "post",
                  as: "button",
                  class: "govuk-header__link border-0 bg-transparent font-inherit text-inherit cursor-pointer py-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Sign out ")
                  ]),
                  _: 1
                }, 8, ["href"])
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
