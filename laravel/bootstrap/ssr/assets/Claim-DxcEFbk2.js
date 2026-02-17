import { ref, resolveComponent, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./CityLayout-DAwKR0fz.js";
import "./PublicLayout-CvaWB3EK.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Claim",
  __ssrInlineRender: true,
  props: {
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true }
  },
  setup(__props) {
    const form = ref({ message: "" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `BikesList – Claim ${__props.communityPage.name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        city: __props.city,
        "city-base-url": __props.cityBaseUrl,
        breadcrumb: ["Community pages", "Claim"]
      }, {
        "nav-right": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a${ssrRenderAttr("href", `${__props.cityBaseUrl}/community/${__props.communityPage.slug}`)} class="govuk-link"${_scopeId}>Back to page</a>`);
          } else {
            return [
              createVNode("a", {
                href: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}`,
                class: "govuk-link"
              }, "Back to page", 8, ["href"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-l"${_scopeId}>Claim this page</h1><p class="govuk-body"${_scopeId}>Request to manage &quot;${ssrInterpolate(__props.communityPage.name)}&quot;. Your message will be sent to city moderators.</p><form${ssrRenderAttr("action", `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/claim`)} method="post" class="mt-6 space-y-4"${_scopeId}><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_textarea, {
              id: "message",
              modelValue: form.value.message,
              "onUpdate:modelValue": ($event) => form.value.message = $event,
              name: "message",
              label: "Message *",
              rows: 4,
              required: "",
              placeholder: "Explain your connection to this organization...",
              class: "govuk-!-width-full"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_button, { type: "submit" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Submit claim`);
                } else {
                  return [
                    createTextVNode("Submit claim")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-l" }, "Claim this page"),
                createVNode("p", { class: "govuk-body" }, 'Request to manage "' + toDisplayString(__props.communityPage.name) + '". Your message will be sent to city moderators.', 1),
                createVNode("form", {
                  action: `${__props.cityBaseUrl}/community/${__props.communityPage.slug}/claim`,
                  method: "post",
                  class: "mt-6 space-y-4"
                }, [
                  createVNode("input", {
                    type: "hidden",
                    name: "_token",
                    value: _ctx.$page.props.csrf_token
                  }, null, 8, ["value"]),
                  createVNode(_component_gv_textarea, {
                    id: "message",
                    modelValue: form.value.message,
                    "onUpdate:modelValue": ($event) => form.value.message = $event,
                    name: "message",
                    label: "Message *",
                    rows: 4,
                    required: "",
                    placeholder: "Explain your connection to this organization...",
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_gv_button, { type: "submit" }, {
                    default: withCtx(() => [
                      createTextVNode("Submit claim")
                    ]),
                    _: 1
                  })
                ], 8, ["action"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CommunityPages/Claim.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
