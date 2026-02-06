import { unref, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Dpz59RfP.js";
import _sfc_main$4 from "./DeleteUserForm-b2HRqkfd.js";
import _sfc_main$3 from "./UpdatePasswordForm-DCKS0zlb.js";
import _sfc_main$2 from "./UpdateProfileInformationForm-Bi-qP6LZ.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import "./ApplicationLogo-D72Pm_U0.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const savedSearchesUrl = usePage().props.urls?.savedSearches || "#";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
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
            _push2(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8"${_scopeId}><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              "must-verify-email": __props.mustVerifyEmail,
              status: __props.status,
              class: "max-w-xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, { class: "max-w-xl" }, null, _parent2, _scopeId));
            _push2(`</div><div class="bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8"${_scopeId}><h3 class="text-lg font-medium text-fg"${_scopeId}>Saved searches</h3><p class="mt-1 text-sm text-muted"${_scopeId}>View and manage your saved listing searches.</p>`);
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
                  createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                    createVNode(_sfc_main$2, {
                      "must-verify-email": __props.mustVerifyEmail,
                      status: __props.status,
                      class: "max-w-xl"
                    }, null, 8, ["must-verify-email", "status"])
                  ]),
                  createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                    createVNode(_sfc_main$3, { class: "max-w-xl" })
                  ]),
                  createVNode("div", { class: "bg-card border border-border p-4 shadow sm:rounded-lg sm:p-8" }, [
                    createVNode("h3", { class: "text-lg font-medium text-fg" }, "Saved searches"),
                    createVNode("p", { class: "mt-1 text-sm text-muted" }, "View and manage your saved listing searches."),
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
