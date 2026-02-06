import { computed, resolveComponent, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DXBkMg5Q.js";
import { _ as _sfc_main$2, a as _sfc_main$3 } from "./PendingReviewBanner-3VzMr-JQ.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    eventTags: { type: Object, default: () => ({}) },
    organizerRelayEmail: { type: String, default: null },
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
        title: `BikesList – ${__props.event.name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Events", __props.event.name]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/events`)} class="govuk-link"${_scopeId}>Back to events</a>`);
            if (_ctx.$page.props.auth.user && (__props.event.user_id === _ctx.$page.props.auth.user.id || __props.event.community_page_id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/events/${__props.event.id}/edit`,
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
              createVNode("a", {
                href: `${__props.cityBaseUrl}/events`,
                class: "govuk-link"
              }, "Back to events", 8, ["href"]),
              _ctx.$page.props.auth.user && (__props.event.user_id === _ctx.$page.props.auth.user.id || __props.event.community_page_id) ? (openBlock(), createBlock(unref(Link), {
                key: 0,
                href: `${__props.cityBaseUrl}/events/${__props.event.id}/edit`,
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
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: __props.event.state === "pending_review",
              "resource-label": "event"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.event.name)}</h1><p class="mt-2 text-muted"${_scopeId}>${ssrInterpolate(__props.event.ends_at ? `${new Date(__props.event.starts_at).toLocaleString()} – ${new Date(__props.event.ends_at).toLocaleString()}` : new Date(__props.event.starts_at).toLocaleString())}</p>`);
            if (__props.event.organizer_name) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Organizer: ${ssrInterpolate(__props.event.organizer_name)}${ssrInterpolate(__props.event.organizer_email_hidden ? " (contact via relay below)" : "")}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.audience?.name) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Audience: ${ssrInterpolate(__props.event.audience.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.tags && __props.event.tags.length && Object.keys(__props.eventTags).length) {
              _push2(`<div class="mt-1 flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.event.tags, (slug) => {
                _push2(`<span class="rounded bg-muted px-2 py-0.5 text-xs text-fg"${_scopeId}>${ssrInterpolate(__props.eventTags[slug] || slug)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.uploads && __props.event.uploads.length && __props.event.uploads[0].lg_url) {
              _push2(`<img${ssrRenderAttr("src", __props.event.uploads[0].lg_url)} alt="" class="mt-4 max-h-64 w-full object-cover rounded"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><p class="whitespace-pre-wrap text-fg"${_scopeId}>${ssrInterpolate(__props.event.description)}</p></div>`);
            if (__props.event.time_details) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.event.time_details)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.location_name) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>Location: ${ssrInterpolate(__props.event.location_name)}${ssrInterpolate(__props.event.location_address ? ` – ${__props.event.location_address}` : "")}</p>`);
            } else if (__props.event.location_address) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>Address: ${ssrInterpolate(__props.event.location_address)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.location_details) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.event.location_details)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.route_length) {
              _push2(`<p class="mt-2 text-sm text-muted"${_scopeId}>Length of ride: ${ssrInterpolate(__props.event.route_length)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.is_loop) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Loop ride (ends at start).</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.route_description) {
              _push2(`<p class="mt-2 text-sm text-muted"${_scopeId}>Route: ${ssrInterpolate(__props.event.route_description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.route_link) {
              _push2(`<a${ssrRenderAttr("href", __props.event.route_link)} target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-primary underline"${_scopeId}>View route link</a>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.organizerRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                email: __props.organizerRelayEmail,
                label: "Contact organizer",
                note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                "mailto-subject": `Re: Event – ${__props.event.name} – ${__props.event.id}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.moderatorRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                email: __props.moderatorRelayEmail,
                label: "Report this event",
                note: "Email the city moderators. Include the subject so they can identify the item.",
                "mailto-subject": `Report: Event – ${__props.event.name} – ${__props.event.id}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
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
              createVNode(_sfc_main$2, {
                show: __props.event.state === "pending_review",
                "resource-label": "event"
              }, null, 8, ["show"]),
              createVNode("div", { class: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.event.name), 1),
                createVNode("p", { class: "mt-2 text-muted" }, toDisplayString(__props.event.ends_at ? `${new Date(__props.event.starts_at).toLocaleString()} – ${new Date(__props.event.ends_at).toLocaleString()}` : new Date(__props.event.starts_at).toLocaleString()), 1),
                __props.event.organizer_name ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-1 text-sm text-muted"
                }, "Organizer: " + toDisplayString(__props.event.organizer_name) + toDisplayString(__props.event.organizer_email_hidden ? " (contact via relay below)" : ""), 1)) : createCommentVNode("", true),
                __props.event.audience?.name ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-1 text-sm text-muted"
                }, "Audience: " + toDisplayString(__props.event.audience.name), 1)) : createCommentVNode("", true),
                __props.event.tags && __props.event.tags.length && Object.keys(__props.eventTags).length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-1 flex flex-wrap gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.event.tags, (slug) => {
                    return openBlock(), createBlock("span", {
                      key: slug,
                      class: "rounded bg-muted px-2 py-0.5 text-xs text-fg"
                    }, toDisplayString(__props.eventTags[slug] || slug), 1);
                  }), 128))
                ])) : createCommentVNode("", true),
                __props.event.uploads && __props.event.uploads.length && __props.event.uploads[0].lg_url ? (openBlock(), createBlock("img", {
                  key: 3,
                  src: __props.event.uploads[0].lg_url,
                  alt: "",
                  class: "mt-4 max-h-64 w-full object-cover rounded"
                }, null, 8, ["src"])) : createCommentVNode("", true),
                createVNode("div", { class: "mt-6 prose dark:prose-invert max-w-none" }, [
                  createVNode("p", { class: "whitespace-pre-wrap text-fg" }, toDisplayString(__props.event.description), 1)
                ]),
                __props.event.time_details ? (openBlock(), createBlock("p", {
                  key: 4,
                  class: "mt-4 text-sm text-muted"
                }, toDisplayString(__props.event.time_details), 1)) : createCommentVNode("", true),
                __props.event.location_name ? (openBlock(), createBlock("p", {
                  key: 5,
                  class: "mt-4 text-sm text-muted"
                }, "Location: " + toDisplayString(__props.event.location_name) + toDisplayString(__props.event.location_address ? ` – ${__props.event.location_address}` : ""), 1)) : __props.event.location_address ? (openBlock(), createBlock("p", {
                  key: 6,
                  class: "mt-4 text-sm text-muted"
                }, "Address: " + toDisplayString(__props.event.location_address), 1)) : createCommentVNode("", true),
                __props.event.location_details ? (openBlock(), createBlock("p", {
                  key: 7,
                  class: "mt-1 text-sm text-muted"
                }, toDisplayString(__props.event.location_details), 1)) : createCommentVNode("", true),
                __props.event.route_length ? (openBlock(), createBlock("p", {
                  key: 8,
                  class: "mt-2 text-sm text-muted"
                }, "Length of ride: " + toDisplayString(__props.event.route_length), 1)) : createCommentVNode("", true),
                __props.event.is_loop ? (openBlock(), createBlock("p", {
                  key: 9,
                  class: "mt-1 text-sm text-muted"
                }, "Loop ride (ends at start).")) : createCommentVNode("", true),
                __props.event.route_description ? (openBlock(), createBlock("p", {
                  key: 10,
                  class: "mt-2 text-sm text-muted"
                }, "Route: " + toDisplayString(__props.event.route_description), 1)) : createCommentVNode("", true),
                __props.event.route_link ? (openBlock(), createBlock("a", {
                  key: 11,
                  href: __props.event.route_link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "mt-2 block text-sm text-primary underline"
                }, "View route link", 8, ["href"])) : createCommentVNode("", true),
                __props.organizerRelayEmail ? (openBlock(), createBlock("div", {
                  key: 12,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$3, {
                    email: __props.organizerRelayEmail,
                    label: "Contact organizer",
                    note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                    "mailto-subject": `Re: Event – ${__props.event.name} – ${__props.event.id}`
                  }, null, 8, ["email", "mailto-subject"])
                ])) : createCommentVNode("", true),
                __props.moderatorRelayEmail ? (openBlock(), createBlock("div", {
                  key: 13,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$3, {
                    email: __props.moderatorRelayEmail,
                    label: "Report this event",
                    note: "Email the city moderators. Include the subject so they can identify the item.",
                    "mailto-subject": `Report: Event – ${__props.event.name} – ${__props.event.id}`
                  }, null, 8, ["email", "mailto-subject"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Events/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
