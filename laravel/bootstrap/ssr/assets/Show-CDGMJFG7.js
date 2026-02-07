import { computed, ref, resolveComponent, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
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
    sale: { type: Object, required: true },
    /** Serial number to show (only set when not private). Use this instead of sale.serial_number. */
    serial_number_display: { type: String, default: null },
    relayEmailAddress: { type: String, default: null },
    bikeIndexUrl: { type: String, default: "https://bikeindex.org/search" },
    saleTypes: { type: Object, required: true },
    homeUrl: { type: String, default: "/" },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const status = computed(() => page.props.status ?? page.props.flash?.status);
    const error = computed(() => page.props.flash?.error);
    const flagSubmitting = ref(false);
    const typeLabel = props.saleTypes[props.sale.type]?.label ?? props.sale.type;
    const mailtoSubject = `Re: Sale – ${props.sale.title} – ${props.sale.id}`;
    const opts = computed(() => props.saleTypes?.full_bicycle_options ?? {});
    const conditions = computed(() => props.saleTypes?.conditions ?? {});
    const postingDetailsRows = computed(() => {
      const s = props.sale;
      const rows = [];
      const add = (key, label, value) => {
        if (value != null && String(value).trim() !== "") rows.push({ key, label, value: String(value).trim() });
      };
      add("frame_size", "Frame size", s.frame_size);
      add("make", "Make", s.make);
      add("model", "Model", s.model);
      add("serial_number", "Serial number", props.serial_number_display ?? null);
      add("bicycle_type", "Bicycle type", opts.value.bicycle_type?.[s.bicycle_type] ?? s.bicycle_type);
      add("wheel_size", "Wheel size", opts.value.wheel_size?.[s.wheel_size] ?? s.wheel_size);
      add("frame_material", "Frame material", opts.value.frame_material?.[s.frame_material] ?? s.frame_material);
      add("suspension", "Suspension", opts.value.suspension?.[s.suspension] ?? s.suspension);
      add("handlebar_type", "Handlebar type", opts.value.handlebar_type?.[s.handlebar_type] ?? s.handlebar_type);
      add("electric_assist", "Electric assist", opts.value.electric_assist?.[s.electric_assist] ?? s.electric_assist);
      add("condition", "Condition", conditions.value[s.condition] ?? s.condition);
      return rows;
    });
    const flagUrl = `${props.cityBaseUrl}/for-sale/${props.sale.id}/flag`;
    function submitFlag() {
      flagSubmitting.value = true;
      router.post(flagUrl, {}, { preserveScroll: true, onFinish: () => {
        flagSubmitting.value = false;
      } });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.sale.title}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description"${ssrRenderAttr("content", __props.sale.description ? __props.sale.description.slice(0, 160) : `${__props.sale.title} – bike for sale in ${__props.city.name}.`)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", `BikesList – ${__props.sale.title}`)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.sale.description ? __props.sale.description.slice(0, 160) : `${__props.sale.title} – bike for sale in ${__props.city.name}.`)}${_scopeId}><meta property="og:url"${ssrRenderAttr("content", unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/for-sale/${__props.sale.id}`)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/for-sale/${__props.sale.id}`)}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: __props.sale.description ? __props.sale.description.slice(0, 160) : `${__props.sale.title} – bike for sale in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: `BikesList – ${__props.sale.title}`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.sale.description ? __props.sale.description.slice(0, 160) : `${__props.sale.title} – bike for sale in ${__props.city.name}.`
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/for-sale/${__props.sale.id}`
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: unref(page).props.seo?.currentUrl || `${__props.cityBaseUrl}/for-sale/${__props.sale.id}`
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: [{ label: "For Sale", href: `${__props.cityBaseUrl}/for-sale` }, __props.sale.title]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (status.value) {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                type: "success",
                title: "Success",
                class: "banner-notice border-t-0 rounded-none border-x-0 text-fg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body text-fg"${_scopeId2}>${ssrInterpolate(status.value)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body text-fg" }, toDisplayString(status.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: __props.sale.state === "pending_review",
              "resource-label": "sale"
            }, null, _parent2, _scopeId));
            _push2(`<div class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8"${_scopeId}>`);
            if (error.value) {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                title: "Error",
                class: "banner-notice mb-6 text-fg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body text-fg"${_scopeId2}>${ssrInterpolate(error.value)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body text-fg" }, toDisplayString(error.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.relayEmailAddress) {
              _push2(`<div class="mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(EmailRelayCard, {
                email: __props.relayEmailAddress,
                label: "Contact seller",
                note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                "mailto-subject": mailtoSubject
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.sale.title)}</h1><p class="mt-1 text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(typeLabel))} · ${ssrInterpolate(__props.sale.price != null ? `$${Number(__props.sale.price).toLocaleString()}` : "Free")}</p>`);
            if (__props.sale.uploads?.length) {
              _push2(`<div class="flex gap-2 mt-4 overflow-x-auto"${_scopeId}><!--[-->`);
              ssrRenderList(__props.sale.uploads, (u) => {
                _push2(`<!--[-->`);
                if (u.status === "ready" && u.lg_url) {
                  _push2(`<img${ssrRenderAttr("src", u.lg_url)}${ssrRenderAttr("alt", "Photo")} class="object-cover w-auto h-48 rounded"${_scopeId}>`);
                } else {
                  _push2(`<div class="flex items-center justify-center w-48 h-48 text-sm rounded shrink-0 bg-muted/30 text-muted"${_scopeId}>Processing…</div>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else if (__props.sale.attachments?.length) {
              _push2(`<div class="flex gap-2 mt-4 overflow-x-auto"${_scopeId}><!--[-->`);
              ssrRenderList(__props.sale.attachments, (att) => {
                _push2(`<img${ssrRenderAttr("src", att.url)}${ssrRenderAttr("alt", att.original_name)} class="object-cover w-auto h-48 rounded"${_scopeId}>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="flex items-center justify-center mt-4 rounded aspect-video bg-muted/30 text-muted"${_scopeId}>No photos</div>`);
            }
            _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><p class="whitespace-pre-wrap text-fg"${_scopeId}>${ssrInterpolate(__props.sale.description)}</p></div>`);
            if (__props.sale.type === "full_bicycle" && postingDetailsRows.value.length) {
              _push2(`<section class="mt-8 govuk-!-padding-4 border border-border rounded-token-md bg-card"${_scopeId}><h2 class="govuk-heading-m govuk-!-margin-top-0"${_scopeId}>Posting details</h2><dl class="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-0"${_scopeId}><!--[-->`);
              ssrRenderList(postingDetailsRows.value, (row) => {
                _push2(`<div class="govuk-summary-list__row"${_scopeId}><dt class="govuk-summary-list__key govuk-!-width-one-third"${_scopeId}>${ssrInterpolate(row.label)}</dt><dd class="govuk-summary-list__value"${_scopeId}>${ssrInterpolate(row.value)}</dd></div>`);
              });
              _push2(`<!--]--></dl></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.sale.type === "full_bicycle") {
              _push2(`<section class="p-4 mt-8 border rounded-token-md border-border bg-card"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Stolen bike check</h2><p class="mt-1 text-sm text-muted"${_scopeId}>Check if a bike has been reported stolen before buying.</p><a${ssrRenderAttr("href", __props.bikeIndexUrl)} target="_blank" rel="noopener noreferrer" class="inline-block mt-2 underline text-primary"${_scopeId}>Search on Bike Index</a></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="p-4 mt-8 border rounded-token-md border-border bg-card"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>Flag this listing</h2><p class="mt-1 text-sm text-muted"${_scopeId}>Something wrong with this listing? Flag it and moderators will review it. You don’t need an account.</p><form class="mt-3"${_scopeId}><button type="submit" class="px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90 disabled:opacity-50"${ssrIncludeBooleanAttr(flagSubmitting.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(flagSubmitting.value ? "Submitting…" : "Flag this listing")}</button></form></section><div class="flex flex-wrap gap-3 mt-8"${_scopeId}>`);
            if (_ctx.$page.props.auth.user && (__props.sale.user_id === _ctx.$page.props.auth.user.id || __props.sale.community_page_id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/for-sale/${__props.sale.id}/edit`,
                class: "px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90"
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
            if (_ctx.$page.props.auth.user && (__props.sale.user_id === _ctx.$page.props.auth.user.id || __props.sale.community_page_id)) {
              _push2(`<!--[-->`);
              if (__props.sale.state === "published") {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `${__props.cityBaseUrl}/for-sale/${__props.sale.id}/sold`,
                  method: "post",
                  as: "button",
                  class: "px-4 py-2 text-sm font-medium text-white rounded-md bg-amber-600 hover:bg-amber-700"
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
                class: "banner-notice border-t-0 rounded-none border-x-0 text-fg"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "govuk-body text-fg" }, toDisplayString(status.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(_sfc_main$2, {
                show: __props.sale.state === "pending_review",
                "resource-label": "sale"
              }, null, 8, ["show"]),
              createVNode("div", { class: "max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8" }, [
                error.value ? (openBlock(), createBlock(_component_gv_notification_banner, {
                  key: 0,
                  title: "Error",
                  class: "banner-notice mb-6 text-fg"
                }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "govuk-body text-fg" }, toDisplayString(error.value), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                __props.relayEmailAddress ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-4"
                }, [
                  createVNode(EmailRelayCard, {
                    email: __props.relayEmailAddress,
                    label: "Contact seller",
                    note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                    "mailto-subject": mailtoSubject
                  }, null, 8, ["email"])
                ])) : createCommentVNode("", true),
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.sale.title), 1),
                createVNode("p", { class: "mt-1 text-sm text-muted" }, toDisplayString(unref(typeLabel)) + " · " + toDisplayString(__props.sale.price != null ? `$${Number(__props.sale.price).toLocaleString()}` : "Free"), 1),
                __props.sale.uploads?.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex gap-2 mt-4 overflow-x-auto"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.sale.uploads, (u) => {
                    return openBlock(), createBlock(Fragment, {
                      key: u.id
                    }, [
                      u.status === "ready" && u.lg_url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: u.lg_url,
                        alt: "Photo",
                        class: "object-cover w-auto h-48 rounded"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center justify-center w-48 h-48 text-sm rounded shrink-0 bg-muted/30 text-muted"
                      }, "Processing…"))
                    ], 64);
                  }), 128))
                ])) : __props.sale.attachments?.length ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "flex gap-2 mt-4 overflow-x-auto"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.sale.attachments, (att) => {
                    return openBlock(), createBlock("img", {
                      key: att.id,
                      src: att.url,
                      alt: att.original_name,
                      class: "object-cover w-auto h-48 rounded"
                    }, null, 8, ["src", "alt"]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 4,
                  class: "flex items-center justify-center mt-4 rounded aspect-video bg-muted/30 text-muted"
                }, "No photos")),
                createVNode("div", { class: "mt-6 prose dark:prose-invert max-w-none" }, [
                  createVNode("p", { class: "whitespace-pre-wrap text-fg" }, toDisplayString(__props.sale.description), 1)
                ]),
                __props.sale.type === "full_bicycle" && postingDetailsRows.value.length ? (openBlock(), createBlock("section", {
                  key: 5,
                  class: "mt-8 govuk-!-padding-4 border border-border rounded-token-md bg-card"
                }, [
                  createVNode("h2", { class: "govuk-heading-m govuk-!-margin-top-0" }, "Posting details"),
                  createVNode("dl", { class: "govuk-summary-list govuk-summary-list--no-border govuk-!-margin-bottom-0" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(postingDetailsRows.value, (row) => {
                      return openBlock(), createBlock("div", {
                        key: row.key,
                        class: "govuk-summary-list__row"
                      }, [
                        createVNode("dt", { class: "govuk-summary-list__key govuk-!-width-one-third" }, toDisplayString(row.label), 1),
                        createVNode("dd", { class: "govuk-summary-list__value" }, toDisplayString(row.value), 1)
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.sale.type === "full_bicycle" ? (openBlock(), createBlock("section", {
                  key: 6,
                  class: "p-4 mt-8 border rounded-token-md border-border bg-card"
                }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Stolen bike check"),
                  createVNode("p", { class: "mt-1 text-sm text-muted" }, "Check if a bike has been reported stolen before buying."),
                  createVNode("a", {
                    href: __props.bikeIndexUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "inline-block mt-2 underline text-primary"
                  }, "Search on Bike Index", 8, ["href"])
                ])) : createCommentVNode("", true),
                createVNode("section", { class: "p-4 mt-8 border rounded-token-md border-border bg-card" }, [
                  createVNode("h2", { class: "text-lg font-semibold text-fg" }, "Flag this listing"),
                  createVNode("p", { class: "mt-1 text-sm text-muted" }, "Something wrong with this listing? Flag it and moderators will review it. You don’t need an account."),
                  createVNode("form", {
                    onSubmit: withModifiers(submitFlag, ["prevent"]),
                    class: "mt-3"
                  }, [
                    createVNode("button", {
                      type: "submit",
                      class: "px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90 disabled:opacity-50",
                      disabled: flagSubmitting.value
                    }, toDisplayString(flagSubmitting.value ? "Submitting…" : "Flag this listing"), 9, ["disabled"])
                  ], 32)
                ]),
                createVNode("div", { class: "flex flex-wrap gap-3 mt-8" }, [
                  _ctx.$page.props.auth.user && (__props.sale.user_id === _ctx.$page.props.auth.user.id || __props.sale.community_page_id) ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `${__props.cityBaseUrl}/for-sale/${__props.sale.id}/edit`,
                    class: "px-4 py-2 text-sm font-medium border rounded-token-md border-border bg-card text-fg hover:opacity-90"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Edit")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true),
                  _ctx.$page.props.auth.user && (__props.sale.user_id === _ctx.$page.props.auth.user.id || __props.sale.community_page_id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    __props.sale.state === "published" ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: `${__props.cityBaseUrl}/for-sale/${__props.sale.id}/sold`,
                      method: "post",
                      as: "button",
                      class: "px-4 py-2 text-sm font-medium text-white rounded-md bg-amber-600 hover:bg-amber-700"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Sales/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
