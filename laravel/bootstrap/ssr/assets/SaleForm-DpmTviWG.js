import { computed, ref, watch, resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr } from "vue/server-renderer";
import { useForm, usePage } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "SaleForm",
  __ssrInlineRender: true,
  props: {
    sale: { type: Object, default: null },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  emits: ["update:processing"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const isEdit = computed(() => !!props.sale);
    computed(() => isEdit.value ? "Edit sale" : "Add new sale");
    const submitUrl = computed(
      () => isEdit.value ? `${props.cityBaseUrl}/for-sale/${props.sale.id}` : `${props.cityBaseUrl}/for-sale`
    );
    const oldInput = props.old || {};
    const sale = props.sale || {};
    const initialUploadIds = sale.uploads && Array.isArray(sale.uploads) ? sale.uploads.map((u) => u.id) : [];
    const form = useForm({
      type: oldInput.type ?? sale.type ?? "full_bicycle",
      title: oldInput.title ?? sale.title ?? "",
      description: oldInput.description ?? sale.description ?? "",
      price: oldInput.price ?? sale.price ?? "",
      condition: oldInput.condition ?? sale.condition ?? "good",
      location_address: oldInput.location_address ?? sale.location_address ?? "",
      community_page_id: oldInput.community_page_id ?? sale.community_page_id ?? "",
      serial_number: oldInput.serial_number ?? sale.serial_number ?? "",
      serial_private: oldInput.serial_private !== "0" && oldInput.serial_private !== 0 && sale.serial_private !== false,
      submit_for_review: true,
      upload_ids: initialUploadIds
    });
    const uploadProcessing = ref(false);
    const uploadError = ref(null);
    usePage();
    function conditionsList() {
      const c = props.conditions && typeof props.conditions === "object" && !Array.isArray(props.conditions) ? props.conditions : { new: "New", like_new: "Like new", good: "Good", fair: "Fair", poor: "Poor" };
      return Object.entries(c);
    }
    function submit(forReview) {
      if (isEdit.value) {
        form.put(submitUrl.value, { preserveScroll: true });
      } else {
        form.submit_for_review = forReview;
        form.post(submitUrl.value, { preserveScroll: true });
      }
    }
    const hasErrors = () => Object.keys(form.errors).length > 0;
    watch(() => form.processing, (v) => emit("update:processing", v), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_checkbox = resolveComponent("gv-checkbox");
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
      _push(ssrRenderComponent(_component_gv_select, {
        id: "type",
        modelValue: unref(form).type,
        "onUpdate:modelValue": ($event) => unref(form).type = $event,
        name: "type",
        label: "Type",
        required: "",
        "error-message": unref(form).errors.type
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.saleTypes, (config, key) => {
              _push2(ssrRenderComponent(_component_gv_select_option, {
                key,
                value: key
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(config.label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(config.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.saleTypes, (config, key) => {
                return openBlock(), createBlock(_component_gv_select_option, {
                  key,
                  value: key
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(config.label), 1)
                  ]),
                  _: 2
                }, 1032, ["value"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "title",
        modelValue: unref(form).title,
        "onUpdate:modelValue": ($event) => unref(form).title = $event,
        name: "title",
        label: "Title (6–80 characters)",
        type: "text",
        maxlength: "80",
        required: "",
        "error-message": unref(form).errors.title,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "description",
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        name: "description",
        label: "Description (at least 20 characters)",
        rows: 4,
        required: "",
        hint: `${(unref(form).description || "").length} characters (minimum 20)`,
        "error-message": unref(form).errors.description,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "price",
        modelValue: unref(form).price,
        "onUpdate:modelValue": ($event) => unref(form).price = $event,
        name: "price",
        label: "Price",
        type: "number",
        hint: "Use 0 for free.",
        "error-message": unref(form).errors.price,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_select, {
        id: "condition",
        modelValue: unref(form).condition,
        "onUpdate:modelValue": ($event) => unref(form).condition = $event,
        name: "condition",
        label: "Condition",
        required: "",
        "error-message": unref(form).errors.condition
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(conditionsList(), ([value, label]) => {
              _push2(ssrRenderComponent(_component_gv_select_option, {
                key: value,
                value
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(conditionsList(), ([value, label]) => {
                return openBlock(), createBlock(_component_gv_select_option, {
                  key: value,
                  value
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(label), 1)
                  ]),
                  _: 2
                }, 1032, ["value"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).type === "full_bicycle") {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_gv_input, {
          id: "serial_number",
          modelValue: unref(form).serial_number,
          "onUpdate:modelValue": ($event) => unref(form).serial_number = $event,
          name: "serial_number",
          label: "Serial number (optional, private by default)",
          type: "text",
          class: "govuk-!-width-full"
        }, null, _parent));
        _push(ssrRenderComponent(_component_gv_checkbox, {
          id: "serial_private",
          modelValue: unref(form).serial_private,
          "onUpdate:modelValue": ($event) => unref(form).serial_private = $event,
          name: "serial_private",
          label: "Keep serial private",
          class: "govuk-!-margin-top-4"
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_gv_input, {
        id: "location_address",
        modelValue: unref(form).location_address,
        "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
        name: "location_address",
        label: "Location (optional)",
        type: "text",
        class: "govuk-!-width-full"
      }, null, _parent));
      if (__props.managedCommunityPages.length) {
        _push(ssrRenderComponent(_component_gv_select, {
          id: "community_page_id",
          modelValue: unref(form).community_page_id,
          "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
          name: "community_page_id",
          label: "Post as (optional)",
          class: "govuk-!-width-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`My personal sale`);
                  } else {
                    return [
                      createTextVNode("My personal sale")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--[-->`);
              ssrRenderList(__props.managedCommunityPages, (page) => {
                _push2(ssrRenderComponent(_component_gv_select_option, {
                  key: page.id,
                  value: String(page.id)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(page.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(page.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                createVNode(_component_gv_select_option, { value: "" }, {
                  default: withCtx(() => [
                    createTextVNode("My personal sale")
                  ]),
                  _: 1
                }),
                (openBlock(true), createBlock(Fragment, null, renderList(__props.managedCommunityPages, (page) => {
                  return openBlock(), createBlock(_component_gv_select_option, {
                    key: page.id,
                    value: String(page.id)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(page.name), 1)
                    ]),
                    _: 2
                  }, 1032, ["value"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="govuk-form-group govuk-!-margin-top-4"><label class="govuk-label" for="images">Images</label><p class="govuk-hint">JPEG, PNG, WebP or BMP. Max 10MB each. You can add up to several images.</p><input id="images" type="file" accept="image/jpeg,image/png,image/webp,image/bmp" class="govuk-file-upload"${ssrIncludeBooleanAttr(uploadProcessing.value) ? " disabled" : ""}>`);
      if (uploadError.value) {
        _push(`<p class="govuk-error-message govuk-!-margin-top-2">${ssrInterpolate(uploadError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (uploadProcessing.value) {
        _push(`<p class="govuk-body govuk-!-margin-top-2">Uploading…</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).upload_ids && unref(form).upload_ids.length) {
        _push(`<ul class="govuk-list govuk-!-margin-top-2"><!--[-->`);
        ssrRenderList(unref(form).upload_ids, (uid, idx) => {
          _push(`<li class="govuk-!-margin-bottom-1"><span class="govuk-body-s">Image ${ssrInterpolate(idx + 1)}</span><button type="button" class="govuk-link govuk-body-s govuk-!-margin-left-2"> Remove </button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="govuk-button-group govuk-!-margin-top-6">`);
      if (!isEdit.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_gv_button, {
          type: "submit",
          variant: "primary",
          disabled: unref(form).processing
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Submit for review `);
            } else {
              return [
                createTextVNode(" Submit for review ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_gv_button, {
          type: "button",
          variant: "secondary",
          disabled: unref(form).processing,
          onClick: ($event) => submit(false)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Save draft `);
            } else {
              return [
                createTextVNode(" Save draft ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
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
      }
      _push(`<a${ssrRenderAttr("href", isEdit.value ? `${__props.cityBaseUrl}/for-sale/${unref(sale).id}` : `${__props.cityBaseUrl}/for-sale`)} class="govuk-link">Cancel</a></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Forms/SaleForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
