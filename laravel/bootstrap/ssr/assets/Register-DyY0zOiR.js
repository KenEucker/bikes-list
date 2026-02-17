import { resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, createVNode, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-B5FnYSTG.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./ApplicationLogo-D72Pm_U0.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  props: {
    submitUrl: { type: String, default: "" },
    signInUrl: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    const formSubmitUrl = () => props.submitUrl || (typeof window !== "undefined" ? window.location.origin + "/register" : "/register");
    const submit = () => {
      form.post(formSubmitUrl(), {
        onFinish: () => form.reset("password", "password_confirmation")
      });
    };
    const hasErrors = () => Object.keys(form.errors).length > 0;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_button = resolveComponent("gv-button");
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Register" }, null, _parent2, _scopeId));
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
              id: "name",
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              label: "Name",
              type: "text",
              autocomplete: "name",
              "error-message": unref(form).errors.name
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              label: "Email",
              type: "email",
              autocomplete: "username",
              "error-message": unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              label: "Password",
              type: "password",
              autocomplete: "new-password",
              "error-message": unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "password_confirmation",
              modelValue: unref(form).password_confirmation,
              "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
              label: "Confirm Password",
              type: "password",
              autocomplete: "new-password",
              "error-message": unref(form).errors.password_confirmation
            }, null, _parent2, _scopeId));
            _push2(`<div class="govuk-button-group govuk-!-margin-top-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: props.signInUrl || _ctx.$page.props.urls?.signIn || "/account/sign-in",
              class: "govuk-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Already registered? `);
                } else {
                  return [
                    createTextVNode(" Already registered? ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_button, {
              type: "submit",
              variant: "primary",
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign up `);
                } else {
                  return [
                    createTextVNode(" Sign up ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Register" }),
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
                  id: "name",
                  modelValue: unref(form).name,
                  "onUpdate:modelValue": ($event) => unref(form).name = $event,
                  label: "Name",
                  type: "text",
                  autocomplete: "name",
                  "error-message": unref(form).errors.name
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                createVNode(_component_gv_input, {
                  id: "email",
                  modelValue: unref(form).email,
                  "onUpdate:modelValue": ($event) => unref(form).email = $event,
                  label: "Email",
                  type: "email",
                  autocomplete: "username",
                  "error-message": unref(form).errors.email
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                createVNode(_component_gv_input, {
                  id: "password",
                  modelValue: unref(form).password,
                  "onUpdate:modelValue": ($event) => unref(form).password = $event,
                  label: "Password",
                  type: "password",
                  autocomplete: "new-password",
                  "error-message": unref(form).errors.password
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                createVNode(_component_gv_input, {
                  id: "password_confirmation",
                  modelValue: unref(form).password_confirmation,
                  "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                  label: "Confirm Password",
                  type: "password",
                  autocomplete: "new-password",
                  "error-message": unref(form).errors.password_confirmation
                }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                createVNode("div", { class: "govuk-button-group govuk-!-margin-top-6" }, [
                  createVNode(unref(Link), {
                    href: props.signInUrl || _ctx.$page.props.urls?.signIn || "/account/sign-in",
                    class: "govuk-link"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Already registered? ")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(_component_gv_button, {
                    type: "submit",
                    variant: "primary",
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Sign up ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
