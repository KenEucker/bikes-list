import { ref, resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "UpdatePasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    const passwordInput = ref(null);
    const currentPasswordInput = ref(null);
    usePage().props.urls?.passwordUpdate ?? "/password";
    const form = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    const hasErrors = () => Object.keys(form.errors).length > 0;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="govuk-heading-l">Update Password</h2><p class="govuk-body"> Ensure your account is using a long, random password to stay secure. </p></header><form>`);
      if (hasErrors()) {
        _push(ssrRenderComponent(_component_gv_error_summary, { title: "There is a problem" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(form).errors, (message, field) => {
                _push2(ssrRenderComponent(_component_gv_error_link, {
                  key: field,
                  "target-id": field,
                  text: message
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(form).errors, (message, field) => {
                  return openBlock(), createBlock(_component_gv_error_link, {
                    key: field,
                    "target-id": field,
                    text: message
                  }, null, 8, ["target-id", "text"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_gv_input, {
        id: "current_password",
        ref_key: "currentPasswordInput",
        ref: currentPasswordInput,
        modelValue: unref(form).current_password,
        "onUpdate:modelValue": ($event) => unref(form).current_password = $event,
        label: "Current Password",
        type: "password",
        autocomplete: "current-password",
        "error-message": unref(form).errors.current_password
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "password",
        ref_key: "passwordInput",
        ref: passwordInput,
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        label: "New Password",
        type: "password",
        autocomplete: "new-password",
        "error-message": unref(form).errors.password
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "password_confirmation",
        modelValue: unref(form).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
        label: "Confirm Password",
        type: "password",
        autocomplete: "new-password",
        "error-message": unref(form).errors.password_confirmation
      }, null, _parent));
      _push(`<div class="govuk-button-group govuk-!-margin-top-6">`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "submit",
        variant: "primary",
        disabled: unref(form).processing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Save `);
          } else {
            return [
              createTextVNode(" Save ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).recentlySuccessful) {
        _push(`<p class="govuk-body govuk-!-margin-0"> Saved. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdatePasswordForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
