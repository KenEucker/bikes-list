import { unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    moderatedCities: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" },
    newItems: { type: Array, default: () => [] }
  },
  setup(__props) {
    function cityModUrl(slug) {
      if (typeof window === "undefined") return "";
      const host = window.location.host;
      const protocol = window.location.protocol;
      const port = window.location.port ? ":" + window.location.port : "";
      const baseHost = host.replace(/^[^.]+\./, "") || host;
      return `${protocol}//${slug}.${baseHost}${port}/moderation`;
    }
    function goToCityModeration(slug) {
      const url = cityModUrl(slug);
      if (url && typeof window !== "undefined") window.location.href = url;
    }
    function formatDate(iso) {
      if (!iso) return "";
      try {
        const d = new Date(iso);
        return d.toLocaleDateString(void 0, { dateStyle: "short" });
      } catch {
        return iso;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Moderation`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: "Moderation"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8"${_scopeId}>`);
            if (__props.moderatedCities.length > 1) {
              _push2(`<div class="govuk-!-margin-bottom-6"${_scopeId}><label class="govuk-label govuk-label--s" for="moderation-city-select"${_scopeId}>Change City</label><select id="moderation-city-select" class="govuk-select govuk-!-width-auto"${ssrRenderAttr("value", __props.city.slug)}${_scopeId}><!--[-->`);
              ssrRenderList(__props.moderatedCities, (c) => {
                _push2(`<option${ssrRenderAttr("value", c.slug)}${_scopeId}>${ssrInterpolate(c.name)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="govuk-heading-l"${_scopeId}>Moderation</h1><p class="govuk-body"${_scopeId}>Review and approve or remove pending content.</p>`);
            if (__props.newItems.length) {
              _push2(`<section class="govuk-!-margin-top-6 govuk-!-margin-bottom-6"${_scopeId}><h2 class="govuk-heading-m"${_scopeId}>New items (created in the last 7 days)</h2><ul class="govuk-list govuk-list--bullet"${_scopeId}><!--[-->`);
              ssrRenderList(__props.newItems, (item) => {
                _push2(`<li class="govuk-!-margin-bottom-1"${_scopeId}><a${ssrRenderAttr("href", item.url)} class="govuk-link"${_scopeId}>${ssrInterpolate(item.title)}</a><span class="text-muted text-sm govuk-!-margin-left-2"${_scopeId}>${ssrInterpolate(item.type)} · ${ssrInterpolate(formatDate(item.created_at))}</span><a${ssrRenderAttr("href", item.queue_url)} class="govuk-link govuk-link--no-visited-state govuk-!-margin-left-2"${_scopeId}>→ queue</a></li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="govuk-button-group govuk-!-margin-top-6"${_scopeId}>`);
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
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation/claims`,
              class: "govuk-button govuk-button--secondary",
              role: "button"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Claim requests`);
                } else {
                  return [
                    createTextVNode("Claim requests")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8" }, [
                __props.moderatedCities.length > 1 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "govuk-!-margin-bottom-6"
                }, [
                  createVNode("label", {
                    class: "govuk-label govuk-label--s",
                    for: "moderation-city-select"
                  }, "Change City"),
                  createVNode("select", {
                    id: "moderation-city-select",
                    class: "govuk-select govuk-!-width-auto",
                    value: __props.city.slug,
                    onChange: (e) => goToCityModeration(e.target?.value)
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.moderatedCities, (c) => {
                      return openBlock(), createBlock("option", {
                        key: c.id,
                        value: c.slug
                      }, toDisplayString(c.name), 9, ["value"]);
                    }), 128))
                  ], 40, ["value", "onChange"])
                ])) : createCommentVNode("", true),
                createVNode("h1", { class: "govuk-heading-l" }, "Moderation"),
                createVNode("p", { class: "govuk-body" }, "Review and approve or remove pending content."),
                __props.newItems.length ? (openBlock(), createBlock("section", {
                  key: 1,
                  class: "govuk-!-margin-top-6 govuk-!-margin-bottom-6"
                }, [
                  createVNode("h2", { class: "govuk-heading-m" }, "New items (created in the last 7 days)"),
                  createVNode("ul", { class: "govuk-list govuk-list--bullet" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.newItems, (item) => {
                      return openBlock(), createBlock("li", {
                        key: `${item.type}-${item.id}`,
                        class: "govuk-!-margin-bottom-1"
                      }, [
                        createVNode("a", {
                          href: item.url,
                          class: "govuk-link"
                        }, toDisplayString(item.title), 9, ["href"]),
                        createVNode("span", { class: "text-muted text-sm govuk-!-margin-left-2" }, toDisplayString(item.type) + " · " + toDisplayString(formatDate(item.created_at)), 1),
                        createVNode("a", {
                          href: item.queue_url,
                          class: "govuk-link govuk-link--no-visited-state govuk-!-margin-left-2"
                        }, "→ queue", 8, ["href"])
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
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
                  }, 8, ["href"]),
                  createVNode(unref(Link), {
                    href: `${__props.cityBaseUrl}/moderation/claims`,
                    class: "govuk-button govuk-button--secondary",
                    role: "button"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Claim requests")
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
