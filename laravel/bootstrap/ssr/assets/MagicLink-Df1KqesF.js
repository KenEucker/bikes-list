import { unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "MagicLink",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Magic link" }, null, _parent));
      _push(`<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4"><div class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"><h1 class="text-xl font-semibold text-gray-900 dark:text-white">Magic link</h1><p class="mt-2 text-sm text-gray-600 dark:text-gray-400"> Request a sign-in link to be sent to your email. This feature can be configured later. </p>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.$page.props.urls?.accountSettings || "/account/settings",
        class: "mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to account settings `);
          } else {
            return [
              createTextVNode(" Back to account settings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Account/MagicLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
