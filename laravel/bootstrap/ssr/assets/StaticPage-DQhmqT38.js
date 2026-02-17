import { resolveComponent, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-CvaWB3EK.js";
import { _ as _sfc_main$2 } from "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "StaticPage",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    content: { type: String, default: "" }
  },
  setup(__props) {
    const page = usePage();
    const urls = page.props.urls || {};
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: __props.title }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        nav: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<li class="govuk-header__navigation-item"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(`</li>`);
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: unref(urls).home || "/",
              text: "Home"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: unref(urls).terms || "/terms",
              text: "Terms"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: unref(urls).privacy || "/privacy",
              text: "Privacy"
            }, null, _parent2, _scopeId));
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: unref(urls).accountSettings || "/account/settings",
                text: "Account"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: unref(urls).signIn || "/account/sign-in",
                text: "Sign in"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: unref(urls).signUp || "/account/sign-up",
                text: "Sign up"
              }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
          } else {
            return [
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode(_sfc_main$2)
              ]),
              createVNode(_component_gv_header_navigation_item, {
                href: unref(urls).home || "/",
                text: "Home"
              }, null, 8, ["href"]),
              createVNode(_component_gv_header_navigation_item, {
                href: unref(urls).terms || "/terms",
                text: "Terms"
              }, null, 8, ["href"]),
              createVNode(_component_gv_header_navigation_item, {
                href: unref(urls).privacy || "/privacy",
                text: "Privacy"
              }, null, 8, ["href"]),
              _ctx.$page.props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                key: 0,
                href: unref(urls).accountSettings || "/account/settings",
                text: "Account"
              }, null, 8, ["href"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode(_component_gv_header_navigation_item, {
                  href: unref(urls).signIn || "/account/sign-in",
                  text: "Sign in"
                }, null, 8, ["href"]),
                createVNode(_component_gv_header_navigation_item, {
                  href: unref(urls).signUp || "/account/sign-up",
                  text: "Sign up"
                }, null, 8, ["href"])
              ], 64))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-xl"${_scopeId}>${ssrInterpolate(__props.title)}</h1><p class="mt-4 text-muted"${_scopeId}>${ssrInterpolate(__props.content || "Placeholder. Replace with your content.")}</p>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(urls).home || "/",
              class: "mt-8 inline-block text-primary underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to home`);
                } else {
                  return [
                    createTextVNode("Back to home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-xl" }, toDisplayString(__props.title), 1),
                createVNode("p", { class: "mt-4 text-muted" }, toDisplayString(__props.content || "Placeholder. Replace with your content."), 1),
                createVNode(unref(Link), {
                  href: unref(urls).home || "/",
                  class: "mt-8 inline-block text-primary underline"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Back to home")
                  ]),
                  _: 1
                }, 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Legal/StaticPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
