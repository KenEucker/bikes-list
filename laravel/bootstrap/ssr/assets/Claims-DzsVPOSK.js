import { unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Claims",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    claims: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: "/" },
    reasonCodes: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – Moderation – Claim requests`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Moderation", "Claim requests"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/moderation`,
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to moderation`);
                } else {
                  return [
                    createTextVNode("Back to moderation")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/moderation`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to moderation")
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Claim requests</h1><p class="mt-2 text-sm text-muted"${_scopeId}>Approve or reject community page claim requests. Every action requires a reason code.</p><ul class="mt-6 space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.claims.data || [], (claim) => {
              _push2(`<li class="rounded-token-md border border-border bg-card p-4"${_scopeId}><p class="font-medium"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/community/${claim.community_page?.slug}`,
                class: "text-primary underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(claim.community_page?.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(claim.community_page?.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</p><p class="mt-1 text-sm text-muted"${_scopeId}>Claimed by ${ssrInterpolate(claim.user?.name ?? "Unknown")}</p>`);
              if (claim.message) {
                _push2(`<p class="mt-2 text-sm"${_scopeId}>${ssrInterpolate(claim.message)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="mt-3 flex flex-wrap gap-2 items-end"${_scopeId}><form${ssrRenderAttr("action", `${__props.cityBaseUrl}/moderation/claims/${claim.id}/approve`)} method="post" class="inline-flex flex-wrap gap-2 items-end"${_scopeId}><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}${_scopeId}><div class="govuk-form-group govuk-!-margin-bottom-0"${_scopeId}><label class="govuk-label govuk-label--s"${_scopeId}>Reason code</label><select name="reason_code" class="govuk-select govuk-!-width-auto" required${_scopeId}><!--[-->`);
              ssrRenderList(__props.reasonCodes, (label, code) => {
                _push2(`<option${ssrRenderAttr("value", code)}${_scopeId}>${ssrInterpolate(label)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="govuk-form-group govuk-!-margin-bottom-0"${_scopeId}><label class="govuk-label govuk-label--s"${_scopeId}>Message (optional)</label><input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000"${_scopeId}></div><button type="submit" class="govuk-button"${_scopeId}>Approve claim</button></form><form${ssrRenderAttr("action", `${__props.cityBaseUrl}/moderation/claims/${claim.id}/reject`)} method="post" class="inline-flex flex-wrap gap-2 items-end"${_scopeId}><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}${_scopeId}><div class="govuk-form-group govuk-!-margin-bottom-0"${_scopeId}><label class="govuk-label govuk-label--s"${_scopeId}>Reason code</label><select name="reason_code" class="govuk-select govuk-!-width-auto" required${_scopeId}><!--[-->`);
              ssrRenderList(__props.reasonCodes, (label, code) => {
                _push2(`<option${ssrRenderAttr("value", code)}${_scopeId}>${ssrInterpolate(label)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="govuk-form-group govuk-!-margin-bottom-0"${_scopeId}><label class="govuk-label govuk-label--s"${_scopeId}>Message (optional)</label><input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000"${_scopeId}></div><button type="submit" class="govuk-button govuk-button--warning"${_scopeId}>Reject</button></form></div></li>`);
            });
            _push2(`<!--]--></ul>`);
            if (!(__props.claims.data || []).length) {
              _push2(`<p class="mt-6 text-muted"${_scopeId}>No pending claim requests.</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.claims.next_page_url) {
              _push2(`<nav class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: __props.claims.next_page_url,
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Next page`);
                  } else {
                    return [
                      createTextVNode("Next page")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</nav>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Claim requests"),
                createVNode("p", { class: "mt-2 text-sm text-muted" }, "Approve or reject community page claim requests. Every action requires a reason code."),
                createVNode("ul", { class: "mt-6 space-y-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.claims.data || [], (claim) => {
                    return openBlock(), createBlock("li", {
                      key: claim.id,
                      class: "rounded-token-md border border-border bg-card p-4"
                    }, [
                      createVNode("p", { class: "font-medium" }, [
                        createVNode(unref(Link), {
                          href: `${__props.cityBaseUrl}/community/${claim.community_page?.slug}`,
                          class: "text-primary underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(claim.community_page?.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["href"])
                      ]),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, "Claimed by " + toDisplayString(claim.user?.name ?? "Unknown"), 1),
                      claim.message ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-2 text-sm"
                      }, toDisplayString(claim.message), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "mt-3 flex flex-wrap gap-2 items-end" }, [
                        createVNode("form", {
                          action: `${__props.cityBaseUrl}/moderation/claims/${claim.id}/approve`,
                          method: "post",
                          class: "inline-flex flex-wrap gap-2 items-end"
                        }, [
                          createVNode("input", {
                            type: "hidden",
                            name: "_token",
                            value: _ctx.$page.props.csrf_token
                          }, null, 8, ["value"]),
                          createVNode("div", { class: "govuk-form-group govuk-!-margin-bottom-0" }, [
                            createVNode("label", { class: "govuk-label govuk-label--s" }, "Reason code"),
                            createVNode("select", {
                              name: "reason_code",
                              class: "govuk-select govuk-!-width-auto",
                              required: ""
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.reasonCodes, (label, code) => {
                                return openBlock(), createBlock("option", {
                                  key: code,
                                  value: code
                                }, toDisplayString(label), 9, ["value"]);
                              }), 128))
                            ])
                          ]),
                          createVNode("div", { class: "govuk-form-group govuk-!-margin-bottom-0" }, [
                            createVNode("label", { class: "govuk-label govuk-label--s" }, "Message (optional)"),
                            createVNode("input", {
                              type: "text",
                              name: "relay_message",
                              placeholder: "Optional",
                              class: "govuk-input govuk-!-width-one-third",
                              maxlength: "2000"
                            })
                          ]),
                          createVNode("button", {
                            type: "submit",
                            class: "govuk-button"
                          }, "Approve claim")
                        ], 8, ["action"]),
                        createVNode("form", {
                          action: `${__props.cityBaseUrl}/moderation/claims/${claim.id}/reject`,
                          method: "post",
                          class: "inline-flex flex-wrap gap-2 items-end",
                          onSubmit: withModifiers((e) => _ctx.confirm("Reject this claim?") && e.target.submit(), ["prevent"])
                        }, [
                          createVNode("input", {
                            type: "hidden",
                            name: "_token",
                            value: _ctx.$page.props.csrf_token
                          }, null, 8, ["value"]),
                          createVNode("div", { class: "govuk-form-group govuk-!-margin-bottom-0" }, [
                            createVNode("label", { class: "govuk-label govuk-label--s" }, "Reason code"),
                            createVNode("select", {
                              name: "reason_code",
                              class: "govuk-select govuk-!-width-auto",
                              required: ""
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.reasonCodes, (label, code) => {
                                return openBlock(), createBlock("option", {
                                  key: code,
                                  value: code
                                }, toDisplayString(label), 9, ["value"]);
                              }), 128))
                            ])
                          ]),
                          createVNode("div", { class: "govuk-form-group govuk-!-margin-bottom-0" }, [
                            createVNode("label", { class: "govuk-label govuk-label--s" }, "Message (optional)"),
                            createVNode("input", {
                              type: "text",
                              name: "relay_message",
                              placeholder: "Optional",
                              class: "govuk-input govuk-!-width-one-third",
                              maxlength: "2000"
                            })
                          ]),
                          createVNode("button", {
                            type: "submit",
                            class: "govuk-button govuk-button--warning"
                          }, "Reject")
                        ], 40, ["action", "onSubmit"])
                      ])
                    ]);
                  }), 128))
                ]),
                !(__props.claims.data || []).length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-6 text-muted"
                }, "No pending claim requests.")) : createCommentVNode("", true),
                __props.claims.next_page_url ? (openBlock(), createBlock("nav", {
                  key: 1,
                  class: "mt-4"
                }, [
                  createVNode(unref(Link), {
                    href: __props.claims.next_page_url,
                    class: "govuk-link"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Next page")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Moderation/Claims.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
