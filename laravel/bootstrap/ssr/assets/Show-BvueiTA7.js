import { computed, resolveComponent, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$2, a as _sfc_main$3 } from "./PendingReviewBanner-DzSTeKTU.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    ride: { type: Object, required: true },
    rideTags: { type: Object, default: () => ({}) },
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
        title: `BikesList – ${__props.ride.name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Rides", __props.ride.name]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/rides`)} class="govuk-link"${_scopeId}>Back to rides</a>`);
            if (_ctx.$page.props.auth.user && (__props.ride.user_id === _ctx.$page.props.auth.user.id || __props.ride.community_page_id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `${__props.cityBaseUrl}/rides/${__props.ride.id}/edit`,
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
                href: `${__props.cityBaseUrl}/rides`,
                class: "govuk-link"
              }, "Back to rides", 8, ["href"]),
              _ctx.$page.props.auth.user && (__props.ride.user_id === _ctx.$page.props.auth.user.id || __props.ride.community_page_id) ? (openBlock(), createBlock(unref(Link), {
                key: 0,
                href: `${__props.cityBaseUrl}/rides/${__props.ride.id}/edit`,
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
              show: __props.ride.state === "pending_review",
              "resource-label": "ride"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="text-2xl font-bold text-fg"${_scopeId}>${ssrInterpolate(__props.ride.name)}</h1><p class="mt-2 text-muted"${_scopeId}>${ssrInterpolate(__props.ride.ends_at ? `${new Date(__props.ride.starts_at).toLocaleString()} – ${new Date(__props.ride.ends_at).toLocaleString()}` : new Date(__props.ride.starts_at).toLocaleString())}</p>`);
            if (__props.ride.organizer_name) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Organizer: ${ssrInterpolate(__props.ride.organizer_name)}${ssrInterpolate(__props.ride.organizer_email_hidden ? " (contact via relay below)" : "")}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.audience?.name) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Audience: ${ssrInterpolate(__props.ride.audience.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.tags && __props.ride.tags.length && Object.keys(__props.rideTags).length) {
              _push2(`<div class="mt-1 flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.ride.tags, (slug) => {
                _push2(`<span class="rounded bg-muted px-2 py-0.5 text-xs text-fg"${_scopeId}>${ssrInterpolate(__props.rideTags[slug] || slug)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.uploads && __props.ride.uploads.length && __props.ride.uploads[0].lg_url) {
              _push2(`<img${ssrRenderAttr("src", __props.ride.uploads[0].lg_url)} alt="" class="mt-4 max-h-64 w-full object-cover rounded"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-6 prose dark:prose-invert max-w-none"${_scopeId}><p class="whitespace-pre-wrap text-fg"${_scopeId}>${ssrInterpolate(__props.ride.description)}</p></div>`);
            if (__props.ride.time_details) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.ride.time_details)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.location_name) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>Location: ${ssrInterpolate(__props.ride.location_name)}${ssrInterpolate(__props.ride.location_address ? ` – ${__props.ride.location_address}` : "")}</p>`);
            } else if (__props.ride.location_address) {
              _push2(`<p class="mt-4 text-sm text-muted"${_scopeId}>Address: ${ssrInterpolate(__props.ride.location_address)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.location_details) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.ride.location_details)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.route_length) {
              _push2(`<p class="mt-2 text-sm text-muted"${_scopeId}>Length of ride: ${ssrInterpolate(__props.ride.route_length)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.is_loop) {
              _push2(`<p class="mt-1 text-sm text-muted"${_scopeId}>Loop ride (ends at start).</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.route_description) {
              _push2(`<p class="mt-2 text-sm text-muted"${_scopeId}>Route: ${ssrInterpolate(__props.ride.route_description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.ride.route_link) {
              _push2(`<a${ssrRenderAttr("href", __props.ride.route_link)} target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-primary underline"${_scopeId}>View route link</a>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.organizerRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                email: __props.organizerRelayEmail,
                label: "Contact organizer",
                note: "Copy the address below and use your own email client. Your address is never shown to the recipient.",
                "mailto-subject": `Re: Ride – ${__props.ride.name} – ${__props.ride.id}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.moderatorRelayEmail) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                email: __props.moderatorRelayEmail,
                label: "Report this ride",
                note: "Email the city moderators. Include the subject so they can identify the item.",
                "mailto-subject": `Report: Ride – ${__props.ride.name} – ${__props.ride.id}`
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
                show: __props.ride.state === "pending_review",
                "resource-label": "ride"
              }, null, 8, ["show"]),
              createVNode("div", { class: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "text-2xl font-bold text-fg" }, toDisplayString(__props.ride.name), 1),
                createVNode("p", { class: "mt-2 text-muted" }, toDisplayString(__props.ride.ends_at ? `${new Date(__props.ride.starts_at).toLocaleString()} – ${new Date(__props.ride.ends_at).toLocaleString()}` : new Date(__props.ride.starts_at).toLocaleString()), 1),
                __props.ride.organizer_name ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-1 text-sm text-muted"
                }, "Organizer: " + toDisplayString(__props.ride.organizer_name) + toDisplayString(__props.ride.organizer_email_hidden ? " (contact via relay below)" : ""), 1)) : createCommentVNode("", true),
                __props.ride.audience?.name ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-1 text-sm text-muted"
                }, "Audience: " + toDisplayString(__props.ride.audience.name), 1)) : createCommentVNode("", true),
                __props.ride.tags && __props.ride.tags.length && Object.keys(__props.rideTags).length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-1 flex flex-wrap gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.ride.tags, (slug) => {
                    return openBlock(), createBlock("span", {
                      key: slug,
                      class: "rounded bg-muted px-2 py-0.5 text-xs text-fg"
                    }, toDisplayString(__props.rideTags[slug] || slug), 1);
                  }), 128))
                ])) : createCommentVNode("", true),
                __props.ride.uploads && __props.ride.uploads.length && __props.ride.uploads[0].lg_url ? (openBlock(), createBlock("img", {
                  key: 3,
                  src: __props.ride.uploads[0].lg_url,
                  alt: "",
                  class: "mt-4 max-h-64 w-full object-cover rounded"
                }, null, 8, ["src"])) : createCommentVNode("", true),
                createVNode("div", { class: "mt-6 prose dark:prose-invert max-w-none" }, [
                  createVNode("p", { class: "whitespace-pre-wrap text-fg" }, toDisplayString(__props.ride.description), 1)
                ]),
                __props.ride.time_details ? (openBlock(), createBlock("p", {
                  key: 4,
                  class: "mt-4 text-sm text-muted"
                }, toDisplayString(__props.ride.time_details), 1)) : createCommentVNode("", true),
                __props.ride.location_name ? (openBlock(), createBlock("p", {
                  key: 5,
                  class: "mt-4 text-sm text-muted"
                }, "Location: " + toDisplayString(__props.ride.location_name) + toDisplayString(__props.ride.location_address ? ` – ${__props.ride.location_address}` : ""), 1)) : __props.ride.location_address ? (openBlock(), createBlock("p", {
                  key: 6,
                  class: "mt-4 text-sm text-muted"
                }, "Address: " + toDisplayString(__props.ride.location_address), 1)) : createCommentVNode("", true),
                __props.ride.location_details ? (openBlock(), createBlock("p", {
                  key: 7,
                  class: "mt-1 text-sm text-muted"
                }, toDisplayString(__props.ride.location_details), 1)) : createCommentVNode("", true),
                __props.ride.route_length ? (openBlock(), createBlock("p", {
                  key: 8,
                  class: "mt-2 text-sm text-muted"
                }, "Length of ride: " + toDisplayString(__props.ride.route_length), 1)) : createCommentVNode("", true),
                __props.ride.is_loop ? (openBlock(), createBlock("p", {
                  key: 9,
                  class: "mt-1 text-sm text-muted"
                }, "Loop ride (ends at start).")) : createCommentVNode("", true),
                __props.ride.route_description ? (openBlock(), createBlock("p", {
                  key: 10,
                  class: "mt-2 text-sm text-muted"
                }, "Route: " + toDisplayString(__props.ride.route_description), 1)) : createCommentVNode("", true),
                __props.ride.route_link ? (openBlock(), createBlock("a", {
                  key: 11,
                  href: __props.ride.route_link,
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
                    "mailto-subject": `Re: Ride – ${__props.ride.name} – ${__props.ride.id}`
                  }, null, 8, ["email", "mailto-subject"])
                ])) : createCommentVNode("", true),
                __props.moderatorRelayEmail ? (openBlock(), createBlock("div", {
                  key: 13,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$3, {
                    email: __props.moderatorRelayEmail,
                    label: "Report this ride",
                    note: "Email the city moderators. Include the subject so they can identify the item.",
                    "mailto-subject": `Report: Ride – ${__props.ride.name} – ${__props.ride.id}`
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Rides/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
