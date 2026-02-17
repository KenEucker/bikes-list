import { computed, ref, watch, resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString, createVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const contactEmailHint = "Potential buyers will contact you at this address using the BikesList email relay. Your email is not shown publicly.";
const _sfc_main = {
  __name: "SaleForm",
  __ssrInlineRender: true,
  props: {
    sale: { type: Object, default: null },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    fullBicycleOptions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    authUser: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  emits: ["update:processing"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const page = usePage();
    const isEdit = computed(() => !!props.sale);
    computed(() => isEdit.value ? "Edit sale" : "Add new sale");
    const submitUrl = computed(
      () => isEdit.value ? `${props.cityBaseUrl}/for-sale/${props.sale.id}` : `${props.cityBaseUrl}/for-sale`
    );
    const oldInput = props.old || {};
    const sale = props.sale || {};
    const initialUploadIds = sale.uploads && Array.isArray(sale.uploads) ? sale.uploads.map((u) => u.id) : [];
    const loggedInEmail = computed(() => props.authUser?.email ?? page.props.auth?.user?.email ?? "");
    const form = useForm({
      type: oldInput.type ?? sale.type ?? "full_bicycle",
      title: oldInput.title ?? sale.title ?? "",
      description: oldInput.description ?? sale.description ?? "",
      price: oldInput.price ?? sale.price ?? "",
      condition: oldInput.condition ?? sale.condition ?? "good",
      location_address: oldInput.location_address ?? sale.location_address ?? "",
      community_page_id: oldInput.community_page_id ?? sale.community_page_id ?? "",
      contact_email: oldInput.contact_email ?? sale.contact_email ?? loggedInEmail.value ?? "",
      serial_number: oldInput.serial_number ?? sale.serial_number ?? "",
      /* gv-checkbox is inverted: "checked" = false, "unchecked" = true. So we store the opposite of DB value for display, and flip back on submit. */
      serial_private: (() => {
        const dbPrivate = sale.serial_private === true || sale.serial_private === 1 || sale.serial_private === "1";
        if (oldInput.serial_private !== void 0 && oldInput.serial_private !== null && oldInput.serial_private !== "") {
          const oldPrivate = oldInput.serial_private !== "0" && oldInput.serial_private !== 0 && oldInput.serial_private !== false;
          return !oldPrivate;
        }
        return !dbPrivate;
      })(),
      frame_size: oldInput.frame_size ?? sale.frame_size ?? "",
      make: oldInput.make ?? sale.make ?? "",
      model: oldInput.model ?? sale.model ?? "",
      bicycle_type: oldInput.bicycle_type ?? sale.bicycle_type ?? "",
      wheel_size: oldInput.wheel_size ?? sale.wheel_size ?? "",
      frame_material: oldInput.frame_material ?? sale.frame_material ?? "",
      suspension: oldInput.suspension ?? sale.suspension ?? "",
      handlebar_type: oldInput.handlebar_type ?? sale.handlebar_type ?? "",
      electric_assist: oldInput.electric_assist ?? sale.electric_assist ?? "",
      submit_for_review: true,
      upload_ids: initialUploadIds
    });
    const uploadProcessing = ref(false);
    const uploadError = ref(null);
    async function onImageSelect(event) {
      const file = event.target?.files?.[0];
      if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) {
        uploadError.value = "File is too large. Max size is 10MB.";
        event.target.value = "";
        return;
      }
      uploadError.value = null;
      uploadProcessing.value = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const csrf = page.props?.csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        if (csrf) formData.append("_token", csrf);
        const res = await fetch("/api/uploads", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: formData
        });
        if (res.status === 413) {
          uploadError.value = "File is too large. Max size is 10MB.";
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          let message = data?.errors?.file?.[0] || data?.message || "Upload failed";
          if (message === "The file failed to upload.") {
            message = "The file failed to upload. It may be too large. Max size is 10MB.";
          }
          uploadError.value = message;
          return;
        }
        if (data.upload_id) {
          form.upload_ids = [...form.upload_ids || [], data.upload_id];
        }
      } finally {
        uploadProcessing.value = false;
        event.target.value = "";
      }
    }
    function removeUploadId(id) {
      form.upload_ids = (form.upload_ids || []).filter((uid) => uid !== id);
    }
    function conditionsList() {
      const c = props.conditions && typeof props.conditions === "object" && !Array.isArray(props.conditions) ? props.conditions : { new: "New", like_new: "Like new", good: "Good", fair: "Fair", poor: "Poor" };
      return Object.entries(c);
    }
    function submit(forReview) {
      form.serial_private = form.serial_private ? 0 : 1;
      if (isEdit.value) {
        form.put(submitUrl.value, { preserveScroll: true });
      } else {
        form.submit_for_review = forReview;
        form.post(submitUrl.value, { preserveScroll: true });
      }
    }
    const hasErrors = () => Object.keys(form.errors).length > 0;
    const isLoggedIn = computed(() => !!props.authUser);
    const contactEmailReadonly = computed(() => props.authUser != null);
    function optionEntries(key) {
      const opts = props.fullBicycleOptions?.[key];
      return opts && typeof opts === "object" && !Array.isArray(opts) ? Object.entries(opts) : [];
    }
    const accordionListingExpanded = ref(true);
    const accordionPostingExpanded = ref(true);
    watch(() => form.processing, (v) => emit("update:processing", v), { immediate: true });
    watch(
      loggedInEmail,
      (email) => {
        if (email && contactEmailReadonly.value && (!form.contact_email || form.contact_email === "")) {
          form.contact_email = email;
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_accordion = resolveComponent("gv-accordion");
      const _component_gv_accordion_section = resolveComponent("gv-accordion-section");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_checkbox = resolveComponent("gv-checkbox");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<form${ssrRenderAttrs(_attrs)} data-v-a0a2fd55>`);
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
      _push(`<div class="w-full max-w-5xl sale-form-grid" data-v-a0a2fd55><div class="sale-form-col sale-form-col-main" data-v-a0a2fd55>`);
      _push(ssrRenderComponent(_component_gv_accordion, { class: "govuk-!-width-full" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Listing details",
              id: "accordion-listing",
              expanded: accordionListingExpanded.value,
              "onUpdate:expanded": ($event) => accordionListingExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_select, {
                    id: "type",
                    modelValue: unref(form).type,
                    "onUpdate:modelValue": ($event) => unref(form).type = $event,
                    name: "type",
                    label: "Type",
                    required: "",
                    "error-message": unref(form).errors.type
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(__props.saleTypes, (config, key) => {
                          _push4(ssrRenderComponent(_component_gv_select_option, {
                            key,
                            value: key
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(config.label)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(config.label), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_input, {
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
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_textarea, {
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
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "price",
                    modelValue: unref(form).price,
                    "onUpdate:modelValue": ($event) => unref(form).price = $event,
                    name: "price",
                    label: "Price",
                    type: "number",
                    hint: "Use 0 for free.",
                    "error-message": unref(form).errors.price,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_select, {
                    id: "condition",
                    modelValue: unref(form).condition,
                    "onUpdate:modelValue": ($event) => unref(form).condition = $event,
                    name: "condition",
                    label: "Condition",
                    required: "",
                    "error-message": unref(form).errors.condition
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(conditionsList(), ([value, label]) => {
                          _push4(ssrRenderComponent(_component_gv_select_option, {
                            key: value,
                            value
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(label)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(label), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "location_address",
                    modelValue: unref(form).location_address,
                    "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                    name: "location_address",
                    label: "Location (optional)",
                    type: "text",
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  if (!isEdit.value) {
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "contact_email",
                      modelValue: unref(form).contact_email,
                      "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
                      name: "contact_email",
                      label: "Your email",
                      type: "email",
                      required: !isLoggedIn.value,
                      readonly: contactEmailReadonly.value,
                      hint: contactEmailHint,
                      "error-message": unref(form).errors.contact_email,
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.managedCommunityPages.length) {
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "community_page_id",
                      modelValue: unref(form).community_page_id,
                      "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                      name: "community_page_id",
                      label: "Post as (optional)",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`My personal sale`);
                              } else {
                                return [
                                  createTextVNode("My personal sale")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(__props.managedCommunityPages, (p) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: p.id,
                              value: String(p.id)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(p.name)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(p.name), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("My personal sale")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.managedCommunityPages, (p) => {
                              return openBlock(), createBlock(_component_gv_select_option, {
                                key: p.id,
                                value: String(p.id)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(p.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["value"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="govuk-form-group govuk-!-margin-top-4" data-v-a0a2fd55${_scopeId2}><label class="govuk-label" for="images" data-v-a0a2fd55${_scopeId2}>Images</label><p class="govuk-hint" data-v-a0a2fd55${_scopeId2}>JPEG, PNG, WebP or BMP. Max 10MB each. You can add up to several images.</p><input id="images" type="file" accept="image/jpeg,image/png,image/webp,image/bmp" class="govuk-file-upload"${ssrIncludeBooleanAttr(uploadProcessing.value) ? " disabled" : ""} data-v-a0a2fd55${_scopeId2}>`);
                  if (uploadError.value) {
                    _push3(`<p class="govuk-error-message govuk-!-margin-top-2" data-v-a0a2fd55${_scopeId2}>${ssrInterpolate(uploadError.value)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (uploadProcessing.value) {
                    _push3(`<p class="govuk-body govuk-!-margin-top-2" data-v-a0a2fd55${_scopeId2}>Uploading…</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(form).upload_ids && unref(form).upload_ids.length) {
                    _push3(`<ul class="govuk-list govuk-!-margin-top-2" data-v-a0a2fd55${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(form).upload_ids, (uid, idx) => {
                      _push3(`<li class="govuk-!-margin-bottom-1" data-v-a0a2fd55${_scopeId2}><span class="govuk-body-s" data-v-a0a2fd55${_scopeId2}>Image ${ssrInterpolate(idx + 1)}</span><button type="button" class="govuk-link govuk-body-s govuk-!-margin-left-2" data-v-a0a2fd55${_scopeId2}> Remove </button></li>`);
                    });
                    _push3(`<!--]--></ul>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_gv_select, {
                      id: "type",
                      modelValue: unref(form).type,
                      "onUpdate:modelValue": ($event) => unref(form).type = $event,
                      name: "type",
                      label: "Type",
                      required: "",
                      "error-message": unref(form).errors.type
                    }, {
                      default: withCtx(() => [
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_input, {
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
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_textarea, {
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
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "hint", "error-message"]),
                    createVNode(_component_gv_input, {
                      id: "price",
                      modelValue: unref(form).price,
                      "onUpdate:modelValue": ($event) => unref(form).price = $event,
                      name: "price",
                      label: "Price",
                      type: "number",
                      hint: "Use 0 for free.",
                      "error-message": unref(form).errors.price,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_select, {
                      id: "condition",
                      modelValue: unref(form).condition,
                      "onUpdate:modelValue": ($event) => unref(form).condition = $event,
                      name: "condition",
                      label: "Condition",
                      required: "",
                      "error-message": unref(form).errors.condition
                    }, {
                      default: withCtx(() => [
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_input, {
                      id: "location_address",
                      modelValue: unref(form).location_address,
                      "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                      name: "location_address",
                      label: "Location (optional)",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    !isEdit.value ? (openBlock(), createBlock(_component_gv_input, {
                      key: 0,
                      id: "contact_email",
                      modelValue: unref(form).contact_email,
                      "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
                      name: "contact_email",
                      label: "Your email",
                      type: "email",
                      required: !isLoggedIn.value,
                      readonly: contactEmailReadonly.value,
                      hint: contactEmailHint,
                      "error-message": unref(form).errors.contact_email,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "required", "readonly", "error-message"])) : createCommentVNode("", true),
                    __props.managedCommunityPages.length ? (openBlock(), createBlock(_component_gv_select, {
                      key: 1,
                      id: "community_page_id",
                      modelValue: unref(form).community_page_id,
                      "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                      name: "community_page_id",
                      label: "Post as (optional)",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("My personal sale")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.managedCommunityPages, (p) => {
                          return openBlock(), createBlock(_component_gv_select_option, {
                            key: p.id,
                            value: String(p.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(p.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["value"]);
                        }), 128))
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                    createVNode("div", { class: "govuk-form-group govuk-!-margin-top-4" }, [
                      createVNode("label", {
                        class: "govuk-label",
                        for: "images"
                      }, "Images"),
                      createVNode("p", { class: "govuk-hint" }, "JPEG, PNG, WebP or BMP. Max 10MB each. You can add up to several images."),
                      createVNode("input", {
                        id: "images",
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp,image/bmp",
                        class: "govuk-file-upload",
                        disabled: uploadProcessing.value,
                        onChange: onImageSelect
                      }, null, 40, ["disabled"]),
                      uploadError.value ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "govuk-error-message govuk-!-margin-top-2"
                      }, toDisplayString(uploadError.value), 1)) : createCommentVNode("", true),
                      uploadProcessing.value ? (openBlock(), createBlock("p", {
                        key: 1,
                        class: "govuk-body govuk-!-margin-top-2"
                      }, "Uploading…")) : createCommentVNode("", true),
                      unref(form).upload_ids && unref(form).upload_ids.length ? (openBlock(), createBlock("ul", {
                        key: 2,
                        class: "govuk-list govuk-!-margin-top-2"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).upload_ids, (uid, idx) => {
                          return openBlock(), createBlock("li", {
                            key: uid,
                            class: "govuk-!-margin-bottom-1"
                          }, [
                            createVNode("span", { class: "govuk-body-s" }, "Image " + toDisplayString(idx + 1), 1),
                            createVNode("button", {
                              type: "button",
                              class: "govuk-link govuk-body-s govuk-!-margin-left-2",
                              onClick: ($event) => removeUploadId(uid)
                            }, " Remove ", 8, ["onClick"])
                          ]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_gv_accordion_section, {
                heading: "Listing details",
                id: "accordion-listing",
                expanded: accordionListingExpanded.value,
                "onUpdate:expanded": ($event) => accordionListingExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_gv_select, {
                    id: "type",
                    modelValue: unref(form).type,
                    "onUpdate:modelValue": ($event) => unref(form).type = $event,
                    name: "type",
                    label: "Type",
                    required: "",
                    "error-message": unref(form).errors.type
                  }, {
                    default: withCtx(() => [
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
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_input, {
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
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_textarea, {
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
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "hint", "error-message"]),
                  createVNode(_component_gv_input, {
                    id: "price",
                    modelValue: unref(form).price,
                    "onUpdate:modelValue": ($event) => unref(form).price = $event,
                    name: "price",
                    label: "Price",
                    type: "number",
                    hint: "Use 0 for free.",
                    "error-message": unref(form).errors.price,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_select, {
                    id: "condition",
                    modelValue: unref(form).condition,
                    "onUpdate:modelValue": ($event) => unref(form).condition = $event,
                    name: "condition",
                    label: "Condition",
                    required: "",
                    "error-message": unref(form).errors.condition
                  }, {
                    default: withCtx(() => [
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
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_input, {
                    id: "location_address",
                    modelValue: unref(form).location_address,
                    "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                    name: "location_address",
                    label: "Location (optional)",
                    type: "text",
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  !isEdit.value ? (openBlock(), createBlock(_component_gv_input, {
                    key: 0,
                    id: "contact_email",
                    modelValue: unref(form).contact_email,
                    "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
                    name: "contact_email",
                    label: "Your email",
                    type: "email",
                    required: !isLoggedIn.value,
                    readonly: contactEmailReadonly.value,
                    hint: contactEmailHint,
                    "error-message": unref(form).errors.contact_email,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "required", "readonly", "error-message"])) : createCommentVNode("", true),
                  __props.managedCommunityPages.length ? (openBlock(), createBlock(_component_gv_select, {
                    key: 1,
                    id: "community_page_id",
                    modelValue: unref(form).community_page_id,
                    "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                    name: "community_page_id",
                    label: "Post as (optional)",
                    class: "govuk-!-width-full"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_gv_select_option, { value: "" }, {
                        default: withCtx(() => [
                          createTextVNode("My personal sale")
                        ]),
                        _: 1
                      }),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.managedCommunityPages, (p) => {
                        return openBlock(), createBlock(_component_gv_select_option, {
                          key: p.id,
                          value: String(p.id)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(p.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["value"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  createVNode("div", { class: "govuk-form-group govuk-!-margin-top-4" }, [
                    createVNode("label", {
                      class: "govuk-label",
                      for: "images"
                    }, "Images"),
                    createVNode("p", { class: "govuk-hint" }, "JPEG, PNG, WebP or BMP. Max 10MB each. You can add up to several images."),
                    createVNode("input", {
                      id: "images",
                      type: "file",
                      accept: "image/jpeg,image/png,image/webp,image/bmp",
                      class: "govuk-file-upload",
                      disabled: uploadProcessing.value,
                      onChange: onImageSelect
                    }, null, 40, ["disabled"]),
                    uploadError.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "govuk-error-message govuk-!-margin-top-2"
                    }, toDisplayString(uploadError.value), 1)) : createCommentVNode("", true),
                    uploadProcessing.value ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "govuk-body govuk-!-margin-top-2"
                    }, "Uploading…")) : createCommentVNode("", true),
                    unref(form).upload_ids && unref(form).upload_ids.length ? (openBlock(), createBlock("ul", {
                      key: 2,
                      class: "govuk-list govuk-!-margin-top-2"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).upload_ids, (uid, idx) => {
                        return openBlock(), createBlock("li", {
                          key: uid,
                          class: "govuk-!-margin-bottom-1"
                        }, [
                          createVNode("span", { class: "govuk-body-s" }, "Image " + toDisplayString(idx + 1), 1),
                          createVNode("button", {
                            type: "button",
                            class: "govuk-link govuk-body-s govuk-!-margin-left-2",
                            onClick: ($event) => removeUploadId(uid)
                          }, " Remove ", 8, ["onClick"])
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(form).type === "full_bicycle") {
        _push(`<div class="sale-form-col sale-form-col-posting" data-v-a0a2fd55>`);
        _push(ssrRenderComponent(_component_gv_accordion, { class: "govuk-!-width-full" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_gv_accordion_section, {
                heading: "Posting details",
                id: "accordion-posting",
                expanded: accordionPostingExpanded.value,
                "onUpdate:expanded": ($event) => accordionPostingExpanded.value = $event
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="govuk-hint govuk-!-margin-bottom-4" data-v-a0a2fd55${_scopeId2}>More information about the bike.</p>`);
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "frame_size",
                      modelValue: unref(form).frame_size,
                      "onUpdate:modelValue": ($event) => unref(form).frame_size = $event,
                      name: "frame_size",
                      label: "Frame size",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "make",
                      modelValue: unref(form).make,
                      "onUpdate:modelValue": ($event) => unref(form).make = $event,
                      name: "make",
                      label: "Make",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "model",
                      modelValue: unref(form).model,
                      "onUpdate:modelValue": ($event) => unref(form).model = $event,
                      name: "model",
                      label: "Model",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "serial_number",
                      modelValue: unref(form).serial_number,
                      "onUpdate:modelValue": ($event) => unref(form).serial_number = $event,
                      name: "serial_number",
                      label: "Serial number (optional, private by default)",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_checkbox, {
                      id: "serial_private",
                      modelValue: unref(form).serial_private,
                      "onUpdate:modelValue": ($event) => unref(form).serial_private = $event,
                      name: "serial_private",
                      label: "Keep serial private",
                      class: "govuk-!-margin-top-2"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "bicycle_type",
                      modelValue: unref(form).bicycle_type,
                      "onUpdate:modelValue": ($event) => unref(form).bicycle_type = $event,
                      name: "bicycle_type",
                      label: "Bicycle type",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("bicycle_type"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("bicycle_type"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "wheel_size",
                      modelValue: unref(form).wheel_size,
                      "onUpdate:modelValue": ($event) => unref(form).wheel_size = $event,
                      name: "wheel_size",
                      label: "Wheel size",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("wheel_size"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("wheel_size"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "frame_material",
                      modelValue: unref(form).frame_material,
                      "onUpdate:modelValue": ($event) => unref(form).frame_material = $event,
                      name: "frame_material",
                      label: "Frame material",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("frame_material"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("frame_material"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "suspension",
                      modelValue: unref(form).suspension,
                      "onUpdate:modelValue": ($event) => unref(form).suspension = $event,
                      name: "suspension",
                      label: "Suspension",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("suspension"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("suspension"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "handlebar_type",
                      modelValue: unref(form).handlebar_type,
                      "onUpdate:modelValue": ($event) => unref(form).handlebar_type = $event,
                      name: "handlebar_type",
                      label: "Handlebar type",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("handlebar_type"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("handlebar_type"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "electric_assist",
                      modelValue: unref(form).electric_assist,
                      "onUpdate:modelValue": ($event) => unref(form).electric_assist = $event,
                      name: "electric_assist",
                      label: "Electric assist",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`—`);
                              } else {
                                return [
                                  createTextVNode("—")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--[-->`);
                          ssrRenderList(optionEntries("electric_assist"), ([value, label]) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: value,
                              value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(label)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(label), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            createVNode(_component_gv_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("electric_assist"), ([value, label]) => {
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
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("p", { class: "govuk-hint govuk-!-margin-bottom-4" }, "More information about the bike."),
                      createVNode(_component_gv_input, {
                        id: "frame_size",
                        modelValue: unref(form).frame_size,
                        "onUpdate:modelValue": ($event) => unref(form).frame_size = $event,
                        name: "frame_size",
                        label: "Frame size",
                        type: "text",
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_input, {
                        id: "make",
                        modelValue: unref(form).make,
                        "onUpdate:modelValue": ($event) => unref(form).make = $event,
                        name: "make",
                        label: "Make",
                        type: "text",
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_input, {
                        id: "model",
                        modelValue: unref(form).model,
                        "onUpdate:modelValue": ($event) => unref(form).model = $event,
                        name: "model",
                        label: "Model",
                        type: "text",
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_input, {
                        id: "serial_number",
                        modelValue: unref(form).serial_number,
                        "onUpdate:modelValue": ($event) => unref(form).serial_number = $event,
                        name: "serial_number",
                        label: "Serial number (optional, private by default)",
                        type: "text",
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_checkbox, {
                        id: "serial_private",
                        modelValue: unref(form).serial_private,
                        "onUpdate:modelValue": ($event) => unref(form).serial_private = $event,
                        name: "serial_private",
                        label: "Keep serial private",
                        class: "govuk-!-margin-top-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "bicycle_type",
                        modelValue: unref(form).bicycle_type,
                        "onUpdate:modelValue": ($event) => unref(form).bicycle_type = $event,
                        name: "bicycle_type",
                        label: "Bicycle type",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("bicycle_type"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "wheel_size",
                        modelValue: unref(form).wheel_size,
                        "onUpdate:modelValue": ($event) => unref(form).wheel_size = $event,
                        name: "wheel_size",
                        label: "Wheel size",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("wheel_size"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "frame_material",
                        modelValue: unref(form).frame_material,
                        "onUpdate:modelValue": ($event) => unref(form).frame_material = $event,
                        name: "frame_material",
                        label: "Frame material",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("frame_material"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "suspension",
                        modelValue: unref(form).suspension,
                        "onUpdate:modelValue": ($event) => unref(form).suspension = $event,
                        name: "suspension",
                        label: "Suspension",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("suspension"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "handlebar_type",
                        modelValue: unref(form).handlebar_type,
                        "onUpdate:modelValue": ($event) => unref(form).handlebar_type = $event,
                        name: "handlebar_type",
                        label: "Handlebar type",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("handlebar_type"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_gv_select, {
                        id: "electric_assist",
                        modelValue: unref(form).electric_assist,
                        "onUpdate:modelValue": ($event) => unref(form).electric_assist = $event,
                        name: "electric_assist",
                        label: "Electric assist",
                        class: "govuk-!-width-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_gv_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("electric_assist"), ([value, label]) => {
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
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_gv_accordion_section, {
                  heading: "Posting details",
                  id: "accordion-posting",
                  expanded: accordionPostingExpanded.value,
                  "onUpdate:expanded": ($event) => accordionPostingExpanded.value = $event
                }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "govuk-hint govuk-!-margin-bottom-4" }, "More information about the bike."),
                    createVNode(_component_gv_input, {
                      id: "frame_size",
                      modelValue: unref(form).frame_size,
                      "onUpdate:modelValue": ($event) => unref(form).frame_size = $event,
                      name: "frame_size",
                      label: "Frame size",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_input, {
                      id: "make",
                      modelValue: unref(form).make,
                      "onUpdate:modelValue": ($event) => unref(form).make = $event,
                      name: "make",
                      label: "Make",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_input, {
                      id: "model",
                      modelValue: unref(form).model,
                      "onUpdate:modelValue": ($event) => unref(form).model = $event,
                      name: "model",
                      label: "Model",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_input, {
                      id: "serial_number",
                      modelValue: unref(form).serial_number,
                      "onUpdate:modelValue": ($event) => unref(form).serial_number = $event,
                      name: "serial_number",
                      label: "Serial number (optional, private by default)",
                      type: "text",
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_checkbox, {
                      id: "serial_private",
                      modelValue: unref(form).serial_private,
                      "onUpdate:modelValue": ($event) => unref(form).serial_private = $event,
                      name: "serial_private",
                      label: "Keep serial private",
                      class: "govuk-!-margin-top-2"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "bicycle_type",
                      modelValue: unref(form).bicycle_type,
                      "onUpdate:modelValue": ($event) => unref(form).bicycle_type = $event,
                      name: "bicycle_type",
                      label: "Bicycle type",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("bicycle_type"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "wheel_size",
                      modelValue: unref(form).wheel_size,
                      "onUpdate:modelValue": ($event) => unref(form).wheel_size = $event,
                      name: "wheel_size",
                      label: "Wheel size",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("wheel_size"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "frame_material",
                      modelValue: unref(form).frame_material,
                      "onUpdate:modelValue": ($event) => unref(form).frame_material = $event,
                      name: "frame_material",
                      label: "Frame material",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("frame_material"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "suspension",
                      modelValue: unref(form).suspension,
                      "onUpdate:modelValue": ($event) => unref(form).suspension = $event,
                      name: "suspension",
                      label: "Suspension",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("suspension"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "handlebar_type",
                      modelValue: unref(form).handlebar_type,
                      "onUpdate:modelValue": ($event) => unref(form).handlebar_type = $event,
                      name: "handlebar_type",
                      label: "Handlebar type",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("handlebar_type"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_gv_select, {
                      id: "electric_assist",
                      modelValue: unref(form).electric_assist,
                      "onUpdate:modelValue": ($event) => unref(form).electric_assist = $event,
                      name: "electric_assist",
                      label: "Electric assist",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("—")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(optionEntries("electric_assist"), ([value, label]) => {
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
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["expanded", "onUpdate:expanded"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sale-form-actions govuk-button-group govuk-!-margin-top-6" data-v-a0a2fd55>`);
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
        if (isLoggedIn.value) {
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
        } else {
          _push(`<!---->`);
        }
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
      _push(`<a${ssrRenderAttr("href", isEdit.value ? `${__props.cityBaseUrl}/for-sale/${unref(sale).id}` : `${__props.cityBaseUrl}/for-sale`)} class="govuk-link" data-v-a0a2fd55>Cancel</a></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Forms/SaleForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SaleForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a0a2fd55"]]);
export {
  SaleForm as S
};
