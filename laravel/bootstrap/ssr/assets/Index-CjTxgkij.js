import { unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    rides: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Rides`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Rides"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><div class="mb-6 flex flex-wrap items-center justify-between gap-4"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Rides</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/rides/new`,
              class: "govuk-button",
              role: "button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Add ride`);
                } else {
                  return [
                    createTextVNode("Add ride")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border"${_scopeId}><!--[-->`);
            ssrRenderList(__props.rides.data, (ride) => {
              _push2(`<li class="py-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/rides/${ride.id}`,
                class: "no-underline hover:underline block"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="font-medium text-fg"${_scopeId2}>${ssrInterpolate(ride.name)}</p><p class="text-sm text-muted"${_scopeId2}>${ssrInterpolate(ride.ends_at ? `${new Date(ride.starts_at).toLocaleString()} – ${new Date(ride.ends_at).toLocaleString()}` : new Date(ride.starts_at).toLocaleString())}</p>`);
                    if (ride.location) {
                      _push3(`<p class="text-sm text-muted"${_scopeId2}>${ssrInterpolate(ride.location)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("p", { class: "font-medium text-fg" }, toDisplayString(ride.name), 1),
                      createVNode("p", { class: "text-sm text-muted" }, toDisplayString(ride.ends_at ? `${new Date(ride.starts_at).toLocaleString()} – ${new Date(ride.ends_at).toLocaleString()}` : new Date(ride.starts_at).toLocaleString()), 1),
                      ride.location ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-muted"
                      }, toDisplayString(ride.location), 1)) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul>`);
            if (__props.rides.data.length === 0) {
              _push2(`<p class="govuk-body py-8 text-center text-muted"${_scopeId}>No upcoming rides.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "mb-6 flex flex-wrap items-center justify-between gap-4" }, [
                  createVNode("h1", { class: "govuk-heading-l" }, "Rides"),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/rides/new`,
                    class: "govuk-button",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add ride")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("ul", { class: "govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.rides.data, (ride) => {
                    return openBlock(), createBlock("li", {
                      key: ride.id,
                      class: "py-3"
                    }, [
                      createVNode(unref(Link), {
                        href: `${__props.cityBaseUrl}/rides/${ride.id}`,
                        class: "no-underline hover:underline block"
                      }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "font-medium text-fg" }, toDisplayString(ride.name), 1),
                          createVNode("p", { class: "text-sm text-muted" }, toDisplayString(ride.ends_at ? `${new Date(ride.starts_at).toLocaleString()} – ${new Date(ride.ends_at).toLocaleString()}` : new Date(ride.starts_at).toLocaleString()), 1),
                          ride.location ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-muted"
                          }, toDisplayString(ride.location), 1)) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 128))
                ]),
                __props.rides.data.length === 0 ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "govuk-body py-8 text-center text-muted"
                }, "No upcoming rides.")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Rides/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
