import { computed, resolveComponent, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import { _ as _sfc_main$2, E as EmailRelayCard } from "./PendingReviewBanner-B1VUICoC.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    moderatorRelayEmail: { type: String, default: "" },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const page = usePage();
    const status = computed(() => page.props.status ?? page.props.flash?.status);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.communityPage.name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: [{ label: "Community", href: `${__props.cityBaseUrl}/community` }, __props.communityPage.name]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.$page.props.auth.user && __props.communityPage.managers?.some((m) => m.id === _ctx.$page.props.auth.user.id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/edit`,
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Edit`);
                  } else {
                    return [
                      createTextVNode("Edit")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              _ctx.$page.props.auth.user && __props.communityPage.managers?.some((m) => m.id === _ctx.$page.props.auth.user.id) ? (openBlock(), createBlock(unref(Link), {
                key: 0,
                href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/edit`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Edit")
                ]),
                _: 1
              }, 8, ["href"])) : createCommentVNode("", true)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: __props.communityPage.state === "pending",
              "resource-label": "page"
            }, null, _parent2, _scopeId));
            if (status.value) {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                type: "success",
                title: "Success",
                class: "rounded-none border-x-0 border-t-0"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body"${_scopeId2}>${ssrInterpolate(status.value)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body" }, toDisplayString(status.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.communityPage.name)}</h1>`);
            if (__props.communityPage.uploads?.length && __props.communityPage.uploads[0].lg_url) {
              _push2(`<img${ssrRenderAttr("src", __props.communityPage.uploads[0].lg_url)} alt="" class="mt-4 max-h-64 w-full object-cover rounded"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.about) {
              _push2(`<div class="mt-4 prose dark:prose-invert max-w-none"${_scopeId}><h2 class="text-lg font-semibold"${_scopeId}>About</h2><p class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.communityPage.about)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.event_info) {
              _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><h2 class="text-lg font-semibold"${_scopeId}>Event info</h2><p class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.communityPage.event_info)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.sales_info) {
              _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><h2 class="text-lg font-semibold"${_scopeId}>Sales info</h2><p class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.communityPage.sales_info)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.contact_address || __props.communityPage.contact_email || __props.communityPage.contact_phone) {
              _push2(`<div class="mt-6"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Contact</h2>`);
              if (__props.communityPage.contact_address) {
                _push2(`<p class="text-muted"${_scopeId}>${ssrInterpolate(__props.communityPage.contact_address)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.communityPage.contact_email) {
                _push2(`<p class="text-muted"${_scopeId}>${ssrInterpolate(__props.communityPage.contact_email)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.communityPage.contact_phone) {
                _push2(`<p class="text-muted"${_scopeId}>${ssrInterpolate(__props.communityPage.contact_phone)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.sales?.length) {
              _push2(`<section class="mt-8"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>For Sale</h2><ul class="mt-2 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.communityPage.sales, (sale) => {
                _push2(`<li${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/for-sale/${sale.id}`)} class="text-primary underline"${_scopeId}>${ssrInterpolate(sale.title)}</a></li>`);
              });
              _push2(`<!--]--></ul><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/for-sale?type=`)} class="mt-2 inline-block text-sm text-primary underline"${_scopeId}>View all sales from this page</a></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.communityPage.rides?.length) {
              _push2(`<section class="mt-8"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Rides</h2><ul class="mt-2 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.communityPage.rides, (ride) => {
                _push2(`<li${_scopeId}><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/rides/${ride.id}`)} class="text-primary underline"${_scopeId}>${ssrInterpolate(ride.name)}</a><span class="text-sm text-muted"${_scopeId}> – ${ssrInterpolate(new Date(ride.starts_at).toLocaleDateString())}</span></li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.moderatorRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(EmailRelayCard, {
                email: __props.moderatorRelayEmail,
                label: "Report this page",
                note: "Email the city moderators. Include the subject so they can identify the item.",
                "mailto-subject": `Report: Page – ${__props.communityPage.name} – ${__props.communityPage.slug}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$page.props.auth.user && !__props.communityPage.managers?.some((m) => m.id === _ctx.$page.props.auth.user.id)) {
              _push2(`<div class="mt-8 rounded-token-md border border-border bg-card p-4"${_scopeId}><p class="text-sm font-medium text-fg"${_scopeId}>Claim this page</p><p class="mt-1 text-sm text-muted"${_scopeId}>If you represent this organization, you can request to manage this page.</p><a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/claim`)} class="mt-2 inline-block rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline"${_scopeId}>Claim this page</a></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(_sfc_main$2, {
                show: __props.communityPage.state === "pending",
                "resource-label": "page"
              }, null, 8, ["show"]),
              status.value ? (openBlock(), createBlock(_component_gv_notification_banner, {
                key: 0,
                type: "success",
                title: "Success",
                class: "rounded-none border-x-0 border-t-0"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "govuk-body" }, toDisplayString(status.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode("div", { class: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.communityPage.name), 1),
                __props.communityPage.uploads?.length && __props.communityPage.uploads[0].lg_url ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.communityPage.uploads[0].lg_url,
                  alt: "",
                  class: "mt-4 max-h-64 w-full object-cover rounded"
                }, null, 8, ["src"])) : createCommentVNode("", true),
                __props.communityPage.about ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-4 prose dark:prose-invert max-w-none"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold" }, "About"),
                  createVNode("p", { class: "whitespace-pre-wrap" }, toDisplayString(__props.communityPage.about), 1)
                ])) : createCommentVNode("", true),
                __props.communityPage.event_info ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-6 prose dark:prose-invert max-w-none"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold" }, "Event info"),
                  createVNode("p", { class: "whitespace-pre-wrap" }, toDisplayString(__props.communityPage.event_info), 1)
                ])) : createCommentVNode("", true),
                __props.communityPage.sales_info ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "mt-6 prose dark:prose-invert max-w-none"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold" }, "Sales info"),
                  createVNode("p", { class: "whitespace-pre-wrap" }, toDisplayString(__props.communityPage.sales_info), 1)
                ])) : createCommentVNode("", true),
                __props.communityPage.contact_address || __props.communityPage.contact_email || __props.communityPage.contact_phone ? (openBlock(), createBlock("div", {
                  key: 4,
                  class: "mt-6"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Contact"),
                  __props.communityPage.contact_address ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-muted"
                  }, toDisplayString(__props.communityPage.contact_address), 1)) : createCommentVNode("", true),
                  __props.communityPage.contact_email ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-muted"
                  }, toDisplayString(__props.communityPage.contact_email), 1)) : createCommentVNode("", true),
                  __props.communityPage.contact_phone ? (openBlock(), createBlock("p", {
                    key: 2,
                    class: "text-muted"
                  }, toDisplayString(__props.communityPage.contact_phone), 1)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                __props.communityPage.sales?.length ? (openBlock(), createBlock("section", {
                  key: 5,
                  class: "mt-8"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "For Sale"),
                  createVNode("ul", { class: "mt-2 space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.communityPage.sales, (sale) => {
                      return openBlock(), createBlock("li", {
                        key: sale.id
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/for-sale/${sale.id}`,
                          class: "text-primary underline"
                        }, toDisplayString(sale.title), 9, ["href"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("a", {
                    href: `${__props.cityBaseUrl}/for-sale?type=`,
                    class: "mt-2 inline-block text-sm text-primary underline"
                  }, "View all sales from this page", 8, ["href"])
                ])) : createCommentVNode("", true),
                __props.communityPage.rides?.length ? (openBlock(), createBlock("section", {
                  key: 6,
                  class: "mt-8"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Rides"),
                  createVNode("ul", { class: "mt-2 space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.communityPage.rides, (ride) => {
                      return openBlock(), createBlock("li", {
                        key: ride.id
                      }, [
                        createVNode("a", {
                          href: `${__props.cityBaseUrl}/rides/${ride.id}`,
                          class: "text-primary underline"
                        }, toDisplayString(ride.name), 9, ["href"]),
                        createVNode("span", { class: "text-sm text-muted" }, " – " + toDisplayString(new Date(ride.starts_at).toLocaleDateString()), 1)
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.moderatorRelayEmail ? (openBlock(), createBlock("div", {
                  key: 7,
                  class: "mt-8"
                }, [
                  createVNode(EmailRelayCard, {
                    email: __props.moderatorRelayEmail,
                    label: "Report this page",
                    note: "Email the city moderators. Include the subject so they can identify the item.",
                    "mailto-subject": `Report: Page – ${__props.communityPage.name} – ${__props.communityPage.slug}`
                  }, null, 8, ["email", "mailto-subject"])
                ])) : createCommentVNode("", true),
                _ctx.$page.props.auth.user && !__props.communityPage.managers?.some((m) => m.id === _ctx.$page.props.auth.user.id) ? (openBlock(), createBlock("div", {
                  key: 8,
                  class: "mt-8 rounded-token-md border border-border bg-card p-4"
                }, [
                  createVNode("p", { class: "text-sm font-medium text-fg" }, "Claim this page"),
                  createVNode("p", { class: "mt-1 text-sm text-muted" }, "If you represent this organization, you can request to manage this page."),
                  createVNode("a", {
                    href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/claim`,
                    class: "mt-2 inline-block rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline"
                  }, "Claim this page", 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CommunityPages/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
