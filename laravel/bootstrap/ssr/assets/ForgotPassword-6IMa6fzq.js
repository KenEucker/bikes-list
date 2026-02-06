import { resolveComponent, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createTextVNode, createCommentVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-B5FnYSTG.js";
import { useForm, Head } from "@inertiajs/vue3";
import "./ApplicationLogo-D72Pm_U0.js";
const _sfc_main = {
  __name: "ForgotPassword",
  __ssrInlineRender: true,
  props: {
    status: { type: String }
  },
  setup(__props) {
    const form = useForm({
      email: ""
    });
    const submit = () => {
      form.post(route("password.email"));
    };
    const hasErrors = () => Object.keys(form.errors).length > 0;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_button = resolveComponent("gv-button");
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Forgot Password" }, null, _parent2, _scopeId));
            _push2(`<p class="govuk-body"${_scopeId}> Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. </p>`);
            if (__props.status) {
              _push2(ssrRenderComponent(_component_gv_notification_banner, {
                type: "success",
                title: "Success"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-body"${_scopeId2}>${ssrInterpolate(__props.status)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "govuk-body" }, toDisplayString(__props.status), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form${_scopeId}>`);
            if (hasErrors()) {
              _push2(ssrRenderComponent(_component_gv_error_summary, { title: "There is a problem" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(unref(form).errors, (message, field) => {
                      _push3(ssrRenderComponent(_component_gv_error_link, {
                        key: field,
                        "target-id": field,
                        text: message
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
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
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              label: "Email",
              type: "email",
              autocomplete: "username",
              "error-message": unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`<div class="govuk-!-margin-top-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_button, {
              type: "submit",
              variant: "primary",
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Email Password Reset Link `);
                } else {
                  return [
                    createTextVNode(" Email Password Reset Link ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Forgot Password" }),
              createVNode("p", { class: "govuk-body" }, " Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. "),
              __props.status ? (openBlock(), createBlock(_component_gv_notification_banner, {
                key: 0,
                type: "success",
                title: "Success"
              }, {
                default: withCtx(() => [
                  createVNode("p", { class: "govuk-body" }, toDisplayString(__props.status), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                hasErrors() ? (openBlock(), createBlock(_component_gv_error_summary, {
                  key: 0,
                  title: "There is a problem"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(form).errors, (message, field) => {
                      return openBlock(), createBlock(_component_gv_error_link, {
                        key: field,
                        "target-id": field,
                        text: message
                      }, null, 8, ["target-id", "text"]);
                    }), 128))
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode(_component_gv_input, {
                  id: "email",
                  modelValue: unref(form).email,
                  "onUpdate:modelValue": ($event) => unref(form).email = $event,
                  label: "Email",
                  type: "email",
                  autocomplete: "username",
                  "error-message": unref(form).errors.email
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                createVNode("div", { class: "govuk-!-margin-top-6" }, [
                  createVNode(_component_gv_button, {
                    type: "submit",
                    variant: "primary",
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Email Password Reset Link ")
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ForgotPassword.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
