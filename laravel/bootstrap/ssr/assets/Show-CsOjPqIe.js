import { computed, resolveComponent, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2 } from "./EmailRelayCard-DRXJMFyo.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    relayEmailAddress: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: "" },
    bikeIndexUrl: { type: String, default: "https://bikeindex.org/search" },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const status = computed(() => page.props.status ?? page.props.flash?.status);
    const error = computed(() => page.props.flash?.error);
    const typeLabel = props.listingTypes[props.listing.type]?.label ?? props.listing.type;
    const mailtoSubject = `Re: Listing – ${props.listing.title} – ${props.listing.id}`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.listing.title}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.listing.description ? __props.listing.description.slice(0, 160) : `${__props.listing.title} – bike listing in ${__props.city.name}.`)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `BikesList – ${__props.listing.title}`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.listing.description ? __props.listing.description.slice(0, 160) : `${__props.listing.title} – bike listing in ${__props.city.name}.`)}${_scopeId}><meta property="og:url"${ssrRenderAttr("content", unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/listings/${__props.listing.id}`)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/listings/${__props.listing.id}`)}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.listing.description ? __props.listing.description.slice(0, 160) : `${__props.listing.title} – bike listing in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: `BikesList – ${__props.listing.title}`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.listing.description ? __props.listing.description.slice(0, 160) : `${__props.listing.title} – bike listing in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/listings/${__props.listing.id}`
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/listings/${__props.listing.id}`
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Listings", __props.listing.title]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/listings`)} class="govuk-link"${_scopeId}>Back to listings</a>`);
            if (_ctx.$page.props.auth.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Account`);
                  } else {
                    return [
                      createTextVNode("Account")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.$page.props.urls?.signIn || "/account/sign-in",
                class: "govuk-link"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Sign in`);
                  } else {
                    return [
                      createTextVNode("Sign in")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              createVNode("a", {
                href: `${__props.cityBaseUrl}/listings`,
                class: "govuk-link"
              }, "Back to listings", 8, ["href"]),
              _ctx.$page.props.auth.user ? (openBlock(), createBlock(unref(Link), {
                key: 0,
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Account")
                ]),
                _: 1
              }, 8, ["href"])) : (openBlock(), createBlock(unref(Link), {
                key: 1,
                href: _ctx.$page.props.urls?.signIn || "/account/sign-in",
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Sign in")
                ]),
                _: 1
              }, 8, ["href"]))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
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
            if (__props.listing.state === "pending_review") {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                type: "warning",
                title: "Pending review",
                class: "rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body"${_scopeId2}>This listing is pending review. It is not visible to the public yet. A moderator will review it; if approved, it will be published automatically. You can still edit or remove it.</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body" }, "This listing is pending review. It is not visible to the public yet. A moderator will review it; if approved, it will be published automatically. You can still edit or remove it.")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}>`);
            if (error.value) {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                title: "Error",
                class: "mb-6"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body"${_scopeId2}>${ssrInterpolate(error.value)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body" }, toDisplayString(error.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.listing.title)}</h1><p class="mt-1 text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(typeLabel))} · ${ssrInterpolate(__props.listing.price != null ? `$${Number(__props.listing.price).toLocaleString()}` : "Free")}</p>`);
            if (__props.listing.uploads?.length) {
              _push2(`<div class="mt-4 flex gap-2 overflow-x-auto"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.uploads, (u) => {
                _push2(`<!--[-->`);
                if (u.status === "ready" && u.lg_url) {
                  _push2(`<img${ssrRenderAttr("src", u.lg_url)}${ssrRenderAttr("alt", "Photo")} class="h-48 w-auto rounded object-cover"${_scopeId}>`);
                } else {
                  _push2(`<div class="h-48 w-48 shrink-0 rounded bg-muted/30 flex items-center justify-center text-muted text-sm"${_scopeId}>Processing…</div>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else if (__props.listing.attachments?.length) {
              _push2(`<div class="mt-4 flex gap-2 overflow-x-auto"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.attachments, (att) => {
                _push2(`<img${ssrRenderAttr("src", att.url)}${ssrRenderAttr("alt", att.original_name)} class="h-48 w-auto rounded object-cover"${_scopeId}>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="mt-4 aspect-video rounded bg-muted/30 flex items-center justify-center text-muted"${_scopeId}>No photos</div>`);
            }
            _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><p class="whitespace-pre-wrap text-fg"${_scopeId}>${ssrInterpolate(__props.listing.description)}</p></div>`);
            if (__props.relayEmailAddress) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                email: __props.relayEmailAddress,
                label: "Contact seller",
                note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                "mailto-subject": mailtoSubject
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.listing.type === "full_bicycle") {
              _push2(`<section class="mt-8 rounded-token-md border border-border bg-card p-4"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Stolen bike check</h2><p class="mt-1 text-sm text-muted"${_scopeId}>Check if a bike has been reported stolen before buying.</p><a${ssrRenderAttr("href", __props.bikeIndexUrl)} target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-primary underline"${_scopeId}>Search on Bike Index</a></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.moderatorRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                email: __props.moderatorRelayEmail,
                label: "Report this listing",
                note: "Email the city moderators. Include the subject so they can identify the item.",
                "mailto-subject": `Report: Listing – ${__props.listing.title} – ${__props.listing.id}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-8 flex flex-wrap gap-3"${_scopeId}>`);
            if (_ctx.$page.props.auth.user && (__props.listing.user_id === _ctx.$page.props.auth.user.id || __props.listing.community_page_id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/listings/${__props.listing.id}/edit`,
                class: "rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90"
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
            if (_ctx.$page.props.auth.user && (__props.listing.user_id === _ctx.$page.props.auth.user.id || __props.listing.community_page_id)) {
              _push2(`<!--[-->`);
              if (__props.listing.state === "published") {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `${__props.cityBaseUrl}/listings/${__props.listing.id}/sold`,
                  method: "post",
                  as: "button",
                  class: "rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Mark sold`);
                    } else {
                      return [
                        createTextVNode("Mark sold")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
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
              __props.listing.state === "pending_review" ? (openBlock(), createBlock(_component_gv_notification_banner, {
                key: 1,
                type: "warning",
                title: "Pending review",
                class: "rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "govuk-body" }, "This listing is pending review. It is not visible to the public yet. A moderator will review it; if approved, it will be published automatically. You can still edit or remove it.")
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode("div", { class: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" }, [
                error.value ? (openBlock(), createBlock(_component_gv_notification_banner, {
                  key: 0,
                  title: "Error",
                  class: "mb-6"
                }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "govuk-body" }, toDisplayString(error.value), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.listing.title), 1),
                createVNode("p", { class: "mt-1 text-sm text-muted" }, toDisplayString(unref(typeLabel)) + " · " + toDisplayString(__props.listing.price != null ? `$${Number(__props.listing.price).toLocaleString()}` : "Free"), 1),
                __props.listing.uploads?.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-4 flex gap-2 overflow-x-auto"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.uploads, (u) => {
                    return openBlock(), createBlock(Fragment, {
                      key: u.id
                    }, [
                      u.status === "ready" && u.lg_url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: u.lg_url,
                        alt: "Photo",
                        class: "h-48 w-auto rounded object-cover"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "h-48 w-48 shrink-0 rounded bg-muted/30 flex items-center justify-center text-muted text-sm"
                      }, "Processing…"))
                    ], 64);
                  }), 128))
                ])) : __props.listing.attachments?.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-4 flex gap-2 overflow-x-auto"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.attachments, (att) => {
                    return openBlock(), createBlock("img", {
                      key: att.id,
                      src: att.url,
                      alt: att.original_name,
                      class: "h-48 w-auto rounded object-cover"
                    }, null, 8, ["src", "alt"]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 3,
                  class: "mt-4 aspect-video rounded bg-muted/30 flex items-center justify-center text-muted"
                }, "No photos")),
                createVNode("div", { class: "mt-6 prose dark:prose-invert max-w-none" }, [
                  createVNode("p", { class: "whitespace-pre-wrap text-fg" }, toDisplayString(__props.listing.description), 1)
                ]),
                __props.relayEmailAddress ? (openBlock(), createBlock("div", {
                  key: 4,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$2, {
                    email: __props.relayEmailAddress,
                    label: "Contact seller",
                    note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                    "mailto-subject": mailtoSubject
                  }, null, 8, ["email"])
                ])) : createCommentVNode("", true),
                __props.listing.type === "full_bicycle" ? (openBlock(), createBlock("section", {
                  key: 5,
                  class: "mt-8 rounded-token-md border border-border bg-card p-4"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Stolen bike check"),
                  createVNode("p", { class: "mt-1 text-sm text-muted" }, "Check if a bike has been reported stolen before buying."),
                  createVNode("a", {
                    href: __props.bikeIndexUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "mt-2 inline-block text-primary underline"
                  }, "Search on Bike Index", 8, ["href"])
                ])) : createCommentVNode("", true),
                __props.moderatorRelayEmail ? (openBlock(), createBlock("div", {
                  key: 6,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$2, {
                    email: __props.moderatorRelayEmail,
                    label: "Report this listing",
                    note: "Email the city moderators. Include the subject so they can identify the item.",
                    "mailto-subject": `Report: Listing – ${__props.listing.title} – ${__props.listing.id}`
                  }, null, 8, ["email", "mailto-subject"])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "mt-8 flex flex-wrap gap-3" }, [
                  _ctx.$page.props.auth.user && (__props.listing.user_id === _ctx.$page.props.auth.user.id || __props.listing.community_page_id) ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `${__props.cityBaseUrl}/listings/${__props.listing.id}/edit`,
                    class: "rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Edit")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true),
                  _ctx.$page.props.auth.user && (__props.listing.user_id === _ctx.$page.props.auth.user.id || __props.listing.community_page_id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    __props.listing.state === "published" ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: `${__props.cityBaseUrl}/listings/${__props.listing.id}/sold`,
                      method: "post",
                      as: "button",
                      class: "rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Mark sold")
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
                  ], 64)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
