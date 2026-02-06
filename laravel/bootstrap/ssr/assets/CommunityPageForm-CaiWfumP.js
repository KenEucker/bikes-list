import { computed, watch, resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "CommunityPageForm",
  __ssrInlineRender: true,
  props: {
    communityPage: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  emits: ["update:processing"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isEdit = computed(() => !!props.communityPage);
    computed(
      () => isEdit.value ? `${props.cityBaseUrl}/community/${props.communityPage.slug}` : `${props.cityBaseUrl}/community`
    );
    const oldInput = props.old || {};
    const cp = props.communityPage || {};
    const form = useForm({
      type: oldInput.type ?? cp.type ?? "bike_shop",
      name: oldInput.name ?? cp.name ?? "",
      about: oldInput.about ?? cp.about ?? "",
      event_info: oldInput.event_info ?? cp.event_info ?? "",
      sales_info: oldInput.sales_info ?? cp.sales_info ?? "",
      contact_address: oldInput.contact_address ?? cp.contact_address ?? "",
      contact_email: oldInput.contact_email ?? cp.contact_email ?? "",
      contact_phone: oldInput.contact_phone ?? cp.contact_phone ?? ""
    });
    const hasErrors = () => Object.keys(form.errors).length > 0;
    watch(() => form.processing, (v) => emit("update:processing", v), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<form${ssrRenderAttrs(_attrs)}>`);
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
      if (!isEdit.value) {
        _push(ssrRenderComponent(_component_gv_select, {
          id: "type",
          modelValue: unref(form).type,
          "onUpdate:modelValue": ($event) => unref(form).type = $event,
          name: "type",
          label: "Type *",
          required: "",
          "error-message": unref(form).errors.type
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_gv_select_option, { value: "bike_shop" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Bike shop`);
                  } else {
                    return [
                      createTextVNode("Bike shop")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_gv_select_option, { value: "club" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Club`);
                  } else {
                    return [
                      createTextVNode("Club")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_gv_select_option, { value: "recurring_event" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Recurring event`);
                  } else {
                    return [
                      createTextVNode("Recurring event")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_gv_select_option, { value: "bike_shop" }, {
                  default: withCtx(() => [
                    createTextVNode("Bike shop")
                  ]),
                  _: 1
                }),
                createVNode(_component_gv_select_option, { value: "club" }, {
                  default: withCtx(() => [
                    createTextVNode("Club")
                  ]),
                  _: 1
                }),
                createVNode(_component_gv_select_option, { value: "recurring_event" }, {
                  default: withCtx(() => [
                    createTextVNode("Recurring event")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_gv_input, {
        id: "name",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        name: "name",
        label: "Name *",
        type: "text",
        required: "",
        "error-message": unref(form).errors.name,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "about",
        modelValue: unref(form).about,
        "onUpdate:modelValue": ($event) => unref(form).about = $event,
        name: "about",
        label: "About",
        rows: 4,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "event_info",
        modelValue: unref(form).event_info,
        "onUpdate:modelValue": ($event) => unref(form).event_info = $event,
        name: "event_info",
        label: "Event info",
        rows: 2,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "sales_info",
        modelValue: unref(form).sales_info,
        "onUpdate:modelValue": ($event) => unref(form).sales_info = $event,
        name: "sales_info",
        label: "Sales info",
        rows: 2,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "contact_address",
        modelValue: unref(form).contact_address,
        "onUpdate:modelValue": ($event) => unref(form).contact_address = $event,
        name: "contact_address",
        label: "Contact address",
        type: "text",
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "contact_email",
        modelValue: unref(form).contact_email,
        "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
        name: "contact_email",
        label: "Contact email",
        type: "email",
        "error-message": unref(form).errors.contact_email,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "contact_phone",
        modelValue: unref(form).contact_phone,
        "onUpdate:modelValue": ($event) => unref(form).contact_phone = $event,
        name: "contact_phone",
        label: "Contact phone",
        type: "text",
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(`<div class="govuk-button-group govuk-!-margin-top-6">`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "submit",
        variant: "primary",
        disabled: unref(form).processing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isEdit.value ? "Save" : "Submit")}`);
          } else {
            return [
              createTextVNode(toDisplayString(isEdit.value ? "Save" : "Submit"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a${ssrRenderAttr("href", isEdit.value ? `${__props.cityBaseUrl}/community/${__props.communityPage.slug}` : `${__props.cityBaseUrl}/community`)} class="govuk-link">Cancel</a></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Forms/CommunityPageForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
