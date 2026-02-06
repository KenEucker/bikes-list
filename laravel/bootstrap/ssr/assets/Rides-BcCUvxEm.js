import { unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-BqIhNtPZ.js";
import { _ as _sfc_main$2 } from "./DashboardTable-Bv9ciMZX.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
import "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "Rides",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    rides: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const columns = [
      { key: "name", label: "Name" },
      { key: "starts_at", label: "Date", format: (r) => r.starts_at ? new Date(r.starts_at).toLocaleDateString() : "" },
      { key: "state", label: "Status" },
      { key: "_actions", label: "Actions" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – ${__props.city.name} – My rides`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Dashboard", "Rides"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: `${__props.cityBaseUrl}/dashboard`,
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Dashboard`);
                } else {
                  return [
                    createTextVNode("Dashboard")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
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
            return [
              createVNode(unref(Link), {
                href: `${__props.cityBaseUrl}/dashboard`,
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Dashboard")
                ]),
                _: 1
              }, 8, ["href"]),
              createVNode(unref(Link), {
                href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
                class: "govuk-link"
              }, {
                default: withCtx(() => [
                  createTextVNode("Account")
                ]),
                _: 1
              }, 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>My rides</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              items: __props.rides.data || [],
              columns,
              "show-url-fn": (item) => `${__props.cityBaseUrl}/rides/${item.id}`,
              "edit-url-fn": (item) => `${__props.cityBaseUrl}/rides/${item.id}/edit`,
              "status-key": "state"
            }, null, _parent2, _scopeId));
            _push2(`</main>`);
          } else {
            return [
              createVNode("main", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "My rides"),
                createVNode(_sfc_main$2, {
                  items: __props.rides.data || [],
                  columns,
                  "show-url-fn": (item) => `${__props.cityBaseUrl}/rides/${item.id}`,
                  "edit-url-fn": (item) => `${__props.cityBaseUrl}/rides/${item.id}/edit`,
                  "status-key": "state"
                }, null, 8, ["items", "show-url-fn", "edit-url-fn"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Rides.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
