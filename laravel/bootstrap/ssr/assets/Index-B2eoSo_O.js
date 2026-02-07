import { unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Community`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Community pages"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><div class="mb-6 flex flex-wrap items-center justify-between gap-4"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Shops &amp; clubs</h1>`);
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/community/new`,
                class: "govuk-button",
                role: "button"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add page`);
                  } else {
                    return [
                      createTextVNode("Add page")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border"${_scopeId}><!--[-->`);
            ssrRenderList(__props.pages.data, (page) => {
              _push2(`<li class="py-3"${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${page.slug}`)} class="font-medium text-fg underline hover:no-underline"${_scopeId}>${ssrInterpolate(page.name)}</a>`);
              if (page.about) {
                _push2(`<p class="mt-1 line-clamp-2 text-sm text-muted"${_scopeId}>${ssrInterpolate(page.about)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul>`);
            if (__props.pages.data.length === 0) {
              _push2(`<p class="govuk-body py-8 text-center text-muted"${_scopeId}>No community pages yet.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "mb-6 flex flex-wrap items-center justify-between gap-4" }, [
                  createVNode("h1", { class: "govuk-heading-l" }, "Shops & clubs"),
                  _ctx.$page.props.auth?.user ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `${__props.cityBaseUrl}/community/new`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add page")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                createVNode("ul", { class: "govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.pages.data, (page) => {
                    return openBlock(), createBlock("li", {
                      key: page.id,
                      class: "py-3"
                    }, [
                      createVNode("a", {
                        href: `${__props.cityBaseUrl}/community/${page.slug}`,
                        class: "font-medium text-fg underline hover:no-underline"
                      }, toDisplayString(page.name), 9, ["href"]),
                      page.about ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 line-clamp-2 text-sm text-muted"
                      }, toDisplayString(page.about), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]),
                __props.pages.data.length === 0 ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "govuk-body py-8 text-center text-muted"
                }, "No community pages yet.")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CommunityPages/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
