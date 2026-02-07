import { resolveComponent, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$5 } from "./AuthenticatedLayout-DMFsmESv.js";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import _sfc_main$4 from "./DeleteUserForm-b2HRqkfd.js";
import _sfc_main$3 from "./UpdatePasswordForm-DCKS0zlb.js";
import _sfc_main$2 from "./UpdateProfileInformationForm-Bi-qP6LZ.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import "./ApplicationLogo-D72Pm_U0.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./PublicLayout-CvaWB3EK.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    },
    error: {
      type: String
    },
    city: {
      type: Object,
      default: null
    },
    cityBaseUrl: {
      type: String,
      default: null
    },
    socialAccounts: {
      type: Array,
      default: () => []
    },
    linkedProviders: {
      type: Array,
      default: () => []
    },
    supportedSocialProviders: {
      type: Array,
      default: () => ["google", "discord"]
    },
    canDisconnectSocial: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const savedSearchesUrl = page.props.urls?.savedSearches || "#";
    const authSocialDisconnectBase = page.props.urls?.authSocialDisconnect || "/account/settings/social";
    const authGoogleRedirect = page.props.urls?.authGoogleRedirect || "";
    const authDiscordRedirect = page.props.urls?.authDiscordRedirect || "";
    const useCityLayout = (p) => p.city && p.cityBaseUrl;
    const socialRedirectUrl = (provider) => {
      if (provider === "google") return authGoogleRedirect;
      if (provider === "discord") return authDiscordRedirect;
      return "#";
    };
    const disconnectUrl = (provider) => `${authSocialDisconnectBase}/${provider}/disconnect`;
    const disconnect = (provider) => {
      router.post(disconnectUrl(provider), {}, { preserveScroll: true });
    };
    const isLinked = (provider) => props.linkedProviders.includes(provider);
    const socialAccountFor = (provider) => props.socialAccounts.find((a) => a.provider === provider);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      if (useCityLayout({ city: __props.city, cityBaseUrl: __props.cityBaseUrl })) {
        _push(ssrRenderComponent(_sfc_main$1, {
          city: __props.city,
          "city-base-url": __props.cityBaseUrl,
          breadcrumb: "Account settings"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Account settings</h1>`);
              if (__props.error) {
                _push2(ssrRenderComponent(_component_gv_notification_banner, {
                  type: "error",
                  title: "Error",
                  class: "mb-4"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<p class="govuk-body"${_scopeId2}>${ssrInterpolate(__props.error)}</p>`);
                    } else {
                      return [
                        createVNode("p", { class: "govuk-body" }, toDisplayString(__props.error), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                "must-verify-email": __props.mustVerifyEmail,
                status: __props.status,
                class: "max-w-xl"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}><h3 class="text-lg font-medium text-fg"${_scopeId}>Connected accounts</h3><p class="mt-1 text-sm text-muted"${_scopeId}>Link Google or Discord to sign in with one click.</p><div class="mt-4 space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.supportedSocialProviders, (provider) => {
                _push2(`<div class="flex flex-wrap items-center gap-3 rounded border border-border p-3"${_scopeId}><span class="font-medium capitalize"${_scopeId}>${ssrInterpolate(provider)}</span>`);
                if (isLinked(provider)) {
                  _push2(`<!--[-->`);
                  if (socialAccountFor(provider)?.provider_email) {
                    _push2(`<span class="text-sm text-muted"${_scopeId}>${ssrInterpolate(socialAccountFor(provider).provider_email)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (socialAccountFor(provider)?.avatar_url) {
                    _push2(`<img${ssrRenderAttr("src", socialAccountFor(provider).avatar_url)}${ssrRenderAttr("alt", provider)} class="h-8 w-8 rounded-full"${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (__props.canDisconnectSocial) {
                    _push2(`<button type="button" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"${_scopeId}> Disconnect </button>`);
                  } else {
                    _push2(`<span class="text-sm text-amber-600"${_scopeId}> Add a password or another connected account before disconnecting. </span>`);
                  }
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<a${ssrRenderAttr("href", socialRedirectUrl(provider))} class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"${_scopeId}> Connect </a>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, { class: "max-w-xl" }, null, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}><h3 class="text-lg font-medium text-fg"${_scopeId}>Saved searches</h3><p class="mt-1 text-sm text-muted"${_scopeId}>View and manage your saved sale searches.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(savedSearchesUrl),
                class: "mt-2 inline-block text-sm font-medium text-primary hover:opacity-90"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Manage saved searches`);
                  } else {
                    return [
                      createTextVNode("Manage saved searches")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$4, { class: "max-w-xl" }, null, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "py-12" }, [
                  createVNode("div", { class: "mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8" }, [
                    createVNode("h1", { class: "govuk-heading-l" }, "Account settings"),
                    __props.error ? (openBlock(), createBlock(_component_gv_notification_banner, {
                      key: 0,
                      type: "error",
                      title: "Error",
                      class: "mb-4"
                    }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "govuk-body" }, toDisplayString(__props.error), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$2, {
                        "must-verify-email": __props.mustVerifyEmail,
                        status: __props.status,
                        class: "max-w-xl"
                      }, null, 8, ["must-verify-email", "status"])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode("h3", { class: "text-lg font-medium text-fg" }, "Connected accounts"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, "Link Google or Discord to sign in with one click."),
                      createVNode("div", { class: "mt-4 space-y-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.supportedSocialProviders, (provider) => {
                          return openBlock(), createBlock("div", {
                            key: provider,
                            class: "flex flex-wrap items-center gap-3 rounded border border-border p-3"
                          }, [
                            createVNode("span", { class: "font-medium capitalize" }, toDisplayString(provider), 1),
                            isLinked(provider) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              socialAccountFor(provider)?.provider_email ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-sm text-muted"
                              }, toDisplayString(socialAccountFor(provider).provider_email), 1)) : createCommentVNode("", true),
                              socialAccountFor(provider)?.avatar_url ? (openBlock(), createBlock("img", {
                                key: 1,
                                src: socialAccountFor(provider).avatar_url,
                                alt: provider,
                                class: "h-8 w-8 rounded-full"
                              }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                              __props.canDisconnectSocial ? (openBlock(), createBlock("button", {
                                key: 2,
                                type: "button",
                                class: "govuk-button govuk-button--secondary govuk-!-margin-bottom-0",
                                onClick: ($event) => disconnect(provider)
                              }, " Disconnect ", 8, ["onClick"])) : (openBlock(), createBlock("span", {
                                key: 3,
                                class: "text-sm text-amber-600"
                              }, " Add a password or another connected account before disconnecting. "))
                            ], 64)) : (openBlock(), createBlock("a", {
                              key: 1,
                              href: socialRedirectUrl(provider),
                              class: "govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                            }, " Connect ", 8, ["href"]))
                          ]);
                        }), 128))
                      ])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$3, { class: "max-w-xl" })
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode("h3", { class: "text-lg font-medium text-fg" }, "Saved searches"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, "View and manage your saved sale searches."),
                      createVNode(unref(Link), {
                        href: unref(savedSearchesUrl),
                        class: "mt-2 inline-block text-sm font-medium text-primary hover:opacity-90"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Manage saved searches")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$4, { class: "max-w-xl" })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_sfc_main$5, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-xl font-semibold leading-tight text-fg"${_scopeId}> Profile </h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-xl font-semibold leading-tight text-fg" }, " Profile ")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8"${_scopeId}>`);
              if (__props.error) {
                _push2(ssrRenderComponent(_component_gv_notification_banner, {
                  type: "error",
                  title: "Error",
                  class: "mb-4"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<p class="govuk-body"${_scopeId2}>${ssrInterpolate(__props.error)}</p>`);
                    } else {
                      return [
                        createVNode("p", { class: "govuk-body" }, toDisplayString(__props.error), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                "must-verify-email": __props.mustVerifyEmail,
                status: __props.status,
                class: "max-w-xl"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}><h3 class="text-lg font-medium text-fg"${_scopeId}>Connected accounts</h3><p class="mt-1 text-sm text-muted"${_scopeId}>Link Google or Discord to sign in with one click.</p><div class="mt-4 space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.supportedSocialProviders, (provider) => {
                _push2(`<div class="flex flex-wrap items-center gap-3 rounded border border-border p-3"${_scopeId}><span class="font-medium capitalize"${_scopeId}>${ssrInterpolate(provider)}</span>`);
                if (isLinked(provider)) {
                  _push2(`<!--[-->`);
                  if (socialAccountFor(provider)?.provider_email) {
                    _push2(`<span class="text-sm text-muted"${_scopeId}>${ssrInterpolate(socialAccountFor(provider).provider_email)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (socialAccountFor(provider)?.avatar_url) {
                    _push2(`<img${ssrRenderAttr("src", socialAccountFor(provider).avatar_url)}${ssrRenderAttr("alt", provider)} class="h-8 w-8 rounded-full"${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (__props.canDisconnectSocial) {
                    _push2(`<button type="button" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"${_scopeId}> Disconnect </button>`);
                  } else {
                    _push2(`<span class="text-sm text-amber-600"${_scopeId}> Add a password or another connected account before disconnecting. </span>`);
                  }
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<a${ssrRenderAttr("href", socialRedirectUrl(provider))} class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"${_scopeId}> Connect </a>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, { class: "max-w-xl" }, null, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}><h3 class="text-lg font-medium text-fg"${_scopeId}>Saved searches</h3><p class="mt-1 text-sm text-muted"${_scopeId}>View and manage your saved sale searches.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(savedSearchesUrl),
                class: "mt-2 inline-block text-sm font-medium text-primary hover:opacity-90"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Manage saved searches`);
                  } else {
                    return [
                      createTextVNode("Manage saved searches")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$4, { class: "max-w-xl" }, null, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "py-12" }, [
                  createVNode("div", { class: "mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8" }, [
                    __props.error ? (openBlock(), createBlock(_component_gv_notification_banner, {
                      key: 0,
                      type: "error",
                      title: "Error",
                      class: "mb-4"
                    }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "govuk-body" }, toDisplayString(__props.error), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$2, {
                        "must-verify-email": __props.mustVerifyEmail,
                        status: __props.status,
                        class: "max-w-xl"
                      }, null, 8, ["must-verify-email", "status"])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode("h3", { class: "text-lg font-medium text-fg" }, "Connected accounts"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, "Link Google or Discord to sign in with one click."),
                      createVNode("div", { class: "mt-4 space-y-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.supportedSocialProviders, (provider) => {
                          return openBlock(), createBlock("div", {
                            key: provider,
                            class: "flex flex-wrap items-center gap-3 rounded border border-border p-3"
                          }, [
                            createVNode("span", { class: "font-medium capitalize" }, toDisplayString(provider), 1),
                            isLinked(provider) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              socialAccountFor(provider)?.provider_email ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-sm text-muted"
                              }, toDisplayString(socialAccountFor(provider).provider_email), 1)) : createCommentVNode("", true),
                              socialAccountFor(provider)?.avatar_url ? (openBlock(), createBlock("img", {
                                key: 1,
                                src: socialAccountFor(provider).avatar_url,
                                alt: provider,
                                class: "h-8 w-8 rounded-full"
                              }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                              __props.canDisconnectSocial ? (openBlock(), createBlock("button", {
                                key: 2,
                                type: "button",
                                class: "govuk-button govuk-button--secondary govuk-!-margin-bottom-0",
                                onClick: ($event) => disconnect(provider)
                              }, " Disconnect ", 8, ["onClick"])) : (openBlock(), createBlock("span", {
                                key: 3,
                                class: "text-sm text-amber-600"
                              }, " Add a password or another connected account before disconnecting. "))
                            ], 64)) : (openBlock(), createBlock("a", {
                              key: 1,
                              href: socialRedirectUrl(provider),
                              class: "govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
                            }, " Connect ", 8, ["href"]))
                          ]);
                        }), 128))
                      ])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$3, { class: "max-w-xl" })
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode("h3", { class: "text-lg font-medium text-fg" }, "Saved searches"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, "View and manage your saved sale searches."),
                      createVNode(unref(Link), {
                        href: unref(savedSearchesUrl),
                        class: "mt-2 inline-block text-sm font-medium text-primary hover:opacity-90"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Manage saved searches")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                      createVNode(_sfc_main$4, { class: "max-w-xl" })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
