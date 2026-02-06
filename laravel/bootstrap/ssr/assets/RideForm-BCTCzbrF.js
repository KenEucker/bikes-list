import { computed, ref, watch, resolveComponent, withCtx, openBlock, createBlock, Fragment, renderList, unref, createTextVNode, toDisplayString, createVNode, createCommentVNode, withDirectives, vShow, nextTick, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./SingleImageUpload-BYRoh2Mm.js";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  __name: "RideForm",
  __ssrInlineRender: true,
  props: {
    ride: { type: Object, default: null },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    rideTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
    /** Server-side validation errors (from redirect after failed submit). Used to show errors and expand accordions. */
    errors: { type: Object, default: () => ({}) }
  },
  emits: ["update:processing"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const page = usePage();
    const isEdit = computed(() => !!props.ride);
    const isGuest = computed(() => !page.props.auth?.user);
    const submitUrl = computed(
      () => isEdit.value ? `${props.cityBaseUrl}/rides/${props.ride.id}` : `${props.cityBaseUrl}/rides`
    );
    const oldInput = props.old || {};
    const r = props.ride || {};
    const dt = (v) => v ? String(v).slice(0, 16) : "";
    const hasExistingEnd = !!(r.ends_at || oldInput.ends_at);
    const useSpecificEndDate = ref(hasExistingEnd);
    const durationHours = ref(oldInput.duration_hours ?? "");
    const initialUploadIds = r.uploads && Array.isArray(r.uploads) && r.uploads.length ? [r.uploads[0].id] : [];
    const form = useForm({
      name: oldInput.name ?? r.name ?? "",
      description: oldInput.description ?? r.description ?? "",
      audience_id: oldInput.audience_id ?? r.audience_id ?? (props.defaultAudienceId != null ? String(props.defaultAudienceId) : ""),
      tags: oldInput.tags ?? r.tags ?? [],
      organizer_name: oldInput.organizer_name ?? r.organizer_name ?? (page.props.auth?.user?.name ?? ""),
      organizer_email: oldInput.organizer_email ?? r.organizer_email ?? (page.props.auth?.user?.email ?? ""),
      organizer_email_hidden: oldInput.organizer_email_hidden === "1" || oldInput.organizer_email_hidden === true || r.organizer_email_hidden === true,
      location_name: oldInput.location_name ?? r.location_name ?? "",
      location_address: oldInput.location_address ?? r.location_address ?? "",
      location_details: oldInput.location_details ?? r.location_details ?? "",
      route_description: oldInput.route_description ?? r.route_description ?? "",
      route_link: oldInput.route_link ?? r.route_link ?? "",
      route_length: oldInput.route_length ?? r.route_length ?? "",
      is_loop: oldInput.is_loop === "1" || oldInput.is_loop === true || r.is_loop === true,
      external_link: oldInput.external_link ?? r.external_link ?? "",
      community_page_id: oldInput.community_page_id ?? r.community_page_id ?? "",
      starts_at: oldInput.starts_at ?? dt(r.starts_at) ?? "",
      ends_at: oldInput.ends_at ?? dt(r.ends_at) ?? "",
      duration_hours: oldInput.duration_hours ?? "",
      timezone: oldInput.timezone ?? r.timezone ?? (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""),
      time_details: oldInput.time_details ?? r.time_details ?? "",
      is_recurring: oldInput.is_recurring === "1" || oldInput.is_recurring === true || r.is_recurring === true,
      recurrence_ends_at: oldInput.recurrence_ends_at ?? (r.recurrence_ends_at ? String(r.recurrence_ends_at).slice(0, 10) : "") ?? "",
      guidelines_accepted: oldInput.guidelines_accepted === "1" || oldInput.guidelines_accepted === true,
      guideline_ids: oldInput.guideline_ids ?? props.guidelines.map((g) => g.id),
      upload_ids: initialUploadIds
    });
    function computeEndFromDuration() {
      const start = form.starts_at;
      const hours = parseFloat(durationHours.value);
      if (!start || Number.isNaN(hours) || hours <= 0) return;
      const d = new Date(start);
      if (Number.isNaN(d.getTime())) return;
      d.setTime(d.getTime() + hours * 60 * 60 * 1e3);
      form.ends_at = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") + "T" + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }
    watch([() => form.starts_at, durationHours], () => {
      if (!useSpecificEndDate.value && durationHours.value) computeEndFromDuration();
    }, { immediate: true });
    function submit() {
      form.duration_hours = durationHours.value || null;
      form.audience_id = form.audience_id || null;
      form.community_page_id = form.community_page_id || null;
      if (useSpecificEndDate.value) {
        form.ends_at = form.ends_at || null;
      } else {
        const hours = parseFloat(durationHours.value);
        if (form.starts_at && !Number.isNaN(hours) && hours > 0) {
          computeEndFromDuration();
        } else {
          form.ends_at = null;
        }
      }
      accordionDescriptionExpanded.value = true;
      accordionDatetimeExpanded.value = true;
      accordionLocationExpanded.value = true;
      accordionRideExpanded.value = true;
      accordionContactExpanded.value = true;
      accordionAgreementsExpanded.value = true;
      nextTick(() => {
        if (isEdit.value) {
          form.put(submitUrl.value, { preserveScroll: true });
        } else {
          form.post(submitUrl.value, { preserveScroll: true });
        }
      });
    }
    const effectiveErrors = computed(() => {
      const serverErrors = props.errors && typeof props.errors === "object" ? props.errors : {};
      const formErrs = form.errors || {};
      const formErrorKeys = Object.keys(formErrs);
      const raw = formErrorKeys.length > 0 ? formErrs : serverErrors;
      if (Object.keys(raw).length === 0) return {};
      const out = {};
      for (const [key, val] of Object.entries(raw)) {
        out[key] = Array.isArray(val) ? val[0] : val;
      }
      return out;
    });
    const hasErrors = () => Object.keys(effectiveErrors.value).length > 0;
    const accordionDescriptionExpanded = ref(true);
    const accordionDatetimeExpanded = ref(true);
    const accordionLocationExpanded = ref(true);
    const accordionRideExpanded = ref(true);
    const accordionContactExpanded = ref(true);
    const accordionAgreementsExpanded = ref(true);
    watch(() => form.processing, (v) => emit("update:processing", v), { immediate: true });
    function toggleTag(slug) {
      const tags = [...form.tags || []];
      const idx = tags.indexOf(slug);
      if (idx >= 0) tags.splice(idx, 1);
      else tags.push(slug);
      form.tags = tags;
    }
    const rideTagsList = computed(() => Object.entries(props.rideTags || {}));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_accordion = resolveComponent("gv-accordion");
      const _component_gv_accordion_section = resolveComponent("gv-accordion-section");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
      const _component_gv_checkbox = resolveComponent("gv-checkbox");
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<form${ssrRenderAttrs(_attrs)} data-v-15417b87>`);
      if (hasErrors()) {
        _push(ssrRenderComponent(_component_gv_error_summary, { title: "There is a problem" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(effectiveErrors.value, (message, field) => {
                _push2(ssrRenderComponent(_component_gv_error_link, {
                  key: field,
                  "target-id": field,
                  text: message
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(effectiveErrors.value, (message, field) => {
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
      _push(`<div class="ride-form-accordion-wrapper w-full max-w-4xl" data-v-15417b87>`);
      _push(ssrRenderComponent(_component_gv_accordion, { class: "govuk-!-width-full" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Description",
              id: "accordion-description",
              expanded: accordionDescriptionExpanded.value,
              "onUpdate:expanded": ($event) => accordionDescriptionExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "name",
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    name: "name",
                    label: "Ride name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.name,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_textarea, {
                    id: "description",
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    name: "description",
                    label: "Description *",
                    rows: 4,
                    required: "",
                    "error-message": effectiveErrors.value.description,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  if (Object.keys(__props.audiences).length) {
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "audience_id",
                      modelValue: unref(form).audience_id,
                      "onUpdate:modelValue": ($event) => unref(form).audience_id = $event,
                      name: "audience_id",
                      label: "Audience",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(__props.audiences, (label, id) => {
                            _push4(ssrRenderComponent(_component_gv_select_option, {
                              key: id,
                              value: String(id)
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
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.audiences, (label, id) => {
                              return openBlock(), createBlock(_component_gv_select_option, {
                                key: id,
                                value: String(id)
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
                    _push3(`<!---->`);
                  }
                  if (rideTagsList.value.length) {
                    _push3(`<div class="govuk-form-group" data-v-15417b87${_scopeId2}><label class="govuk-label" data-v-15417b87${_scopeId2}>Tags (optional)</label><div class="govuk-checkboxes govuk-checkboxes--small" data-v-15417b87${_scopeId2}><!--[-->`);
                    ssrRenderList(rideTagsList.value, ([slug, label]) => {
                      _push3(`<div class="govuk-checkboxes__item" data-v-15417b87${_scopeId2}><input${ssrRenderAttr("id", `tag-${slug}`)} type="checkbox" class="govuk-checkboxes__input"${ssrIncludeBooleanAttr((unref(form).tags || []).includes(slug)) ? " checked" : ""} data-v-15417b87${_scopeId2}><label${ssrRenderAttr("for", `tag-${slug}`)} class="govuk-label govuk-checkboxes__label" data-v-15417b87${_scopeId2}>${ssrInterpolate(label)}</label></div>`);
                    });
                    _push3(`<!--]--></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(page).props.auth?.user) {
                    _push3(ssrRenderComponent(_sfc_main$1, {
                      modelValue: unref(form).upload_ids,
                      "onUpdate:modelValue": ($event) => unref(form).upload_ids = $event,
                      "input-id": "ride_image",
                      label: "Ride image (optional, one image)",
                      hint: "JPEG, PNG, WebP or BMP. Max 10MB."
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_gv_input, {
                      id: "name",
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      name: "name",
                      label: "Ride name *",
                      type: "text",
                      required: "",
                      "error-message": effectiveErrors.value.name,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_textarea, {
                      id: "description",
                      modelValue: unref(form).description,
                      "onUpdate:modelValue": ($event) => unref(form).description = $event,
                      name: "description",
                      label: "Description *",
                      rows: 4,
                      required: "",
                      "error-message": effectiveErrors.value.description,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    Object.keys(__props.audiences).length ? (openBlock(), createBlock(_component_gv_select, {
                      key: 0,
                      id: "audience_id",
                      modelValue: unref(form).audience_id,
                      "onUpdate:modelValue": ($event) => unref(form).audience_id = $event,
                      name: "audience_id",
                      label: "Audience",
                      class: "govuk-!-width-full"
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.audiences, (label, id) => {
                          return openBlock(), createBlock(_component_gv_select_option, {
                            key: id,
                            value: String(id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(label), 1)
                            ]),
                            _: 2
                          }, 1032, ["value"]);
                        }), 128))
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                    rideTagsList.value.length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "govuk-form-group"
                    }, [
                      createVNode("label", { class: "govuk-label" }, "Tags (optional)"),
                      createVNode("div", { class: "govuk-checkboxes govuk-checkboxes--small" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(rideTagsList.value, ([slug, label]) => {
                          return openBlock(), createBlock("div", {
                            key: slug,
                            class: "govuk-checkboxes__item"
                          }, [
                            createVNode("input", {
                              id: `tag-${slug}`,
                              type: "checkbox",
                              class: "govuk-checkboxes__input",
                              checked: (unref(form).tags || []).includes(slug),
                              onChange: ($event) => toggleTag(slug)
                            }, null, 40, ["id", "checked", "onChange"]),
                            createVNode("label", {
                              for: `tag-${slug}`,
                              class: "govuk-label govuk-checkboxes__label"
                            }, toDisplayString(label), 9, ["for"])
                          ]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true),
                    unref(page).props.auth?.user ? (openBlock(), createBlock(_sfc_main$1, {
                      key: 2,
                      modelValue: unref(form).upload_ids,
                      "onUpdate:modelValue": ($event) => unref(form).upload_ids = $event,
                      "input-id": "ride_image",
                      label: "Ride image (optional, one image)",
                      hint: "JPEG, PNG, WebP or BMP. Max 10MB."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Date and time",
              id: "accordion-datetime",
              expanded: accordionDatetimeExpanded.value,
              "onUpdate:expanded": ($event) => accordionDatetimeExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="govuk-form-group" data-v-15417b87${_scopeId2}><label class="govuk-label" for="starts_at" data-v-15417b87${_scopeId2}>Starts at *</label>`);
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "starts_at",
                    modelValue: unref(form).starts_at,
                    "onUpdate:modelValue": ($event) => unref(form).starts_at = $event,
                    name: "starts_at",
                    type: "datetime-local",
                    required: "",
                    "error-message": effectiveErrors.value.starts_at,
                    class: "govuk-!-width-full govuk-!-margin-bottom-2"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="govuk-form-group" data-v-15417b87${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "duration_hours",
                    modelValue: durationHours.value,
                    "onUpdate:modelValue": ($event) => durationHours.value = $event,
                    name: "duration_hours",
                    label: "Ride duration (hours, optional)",
                    type: "number",
                    min: "0",
                    step: "0.5",
                    placeholder: "e.g. 2 or 1.5",
                    "error-message": unref(form).errors.duration_hours,
                    class: "govuk-!-width-one-quarter"
                  }, null, _parent3, _scopeId2));
                  _push3(`<p class="govuk-hint govuk-!-margin-top-1" data-v-15417b87${_scopeId2}>Decimal allowed (e.g. 1.5 for 1 hour 30 min). If set, end time is calculated from start.</p></div><div class="govuk-form-group" data-v-15417b87${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_gv_checkbox, {
                    id: "use_specific_end_date",
                    modelValue: useSpecificEndDate.value,
                    "onUpdate:modelValue": ($event) => useSpecificEndDate.value = $event,
                    name: "use_specific_end_date",
                    label: "Set specific end date",
                    class: "govuk-!-margin-bottom-2"
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="govuk-!-margin-top-2" style="${ssrRenderStyle(useSpecificEndDate.value ? null : { display: "none" })}" data-v-15417b87${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "ends_at",
                    modelValue: unref(form).ends_at,
                    "onUpdate:modelValue": ($event) => unref(form).ends_at = $event,
                    name: "ends_at",
                    label: "Ends at (optional)",
                    type: "datetime-local",
                    "error-message": effectiveErrors.value.ends_at,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(ssrRenderComponent(_component_gv_textarea, {
                    id: "time_details",
                    modelValue: unref(form).time_details,
                    "onUpdate:modelValue": ($event) => unref(form).time_details = $event,
                    name: "time_details",
                    label: "Time details (optional)",
                    rows: 2,
                    hint: "Keep it short. Example: Meet at 5pm, ride starts at 530pm.",
                    "error-message": unref(form).errors.time_details,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "govuk-form-group" }, [
                      createVNode("label", {
                        class: "govuk-label",
                        for: "starts_at"
                      }, "Starts at *"),
                      createVNode(_component_gv_input, {
                        id: "starts_at",
                        modelValue: unref(form).starts_at,
                        "onUpdate:modelValue": ($event) => unref(form).starts_at = $event,
                        name: "starts_at",
                        type: "datetime-local",
                        required: "",
                        "error-message": effectiveErrors.value.starts_at,
                        class: "govuk-!-width-full govuk-!-margin-bottom-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                    ]),
                    createVNode("div", { class: "govuk-form-group" }, [
                      createVNode(_component_gv_input, {
                        id: "duration_hours",
                        modelValue: durationHours.value,
                        "onUpdate:modelValue": ($event) => durationHours.value = $event,
                        name: "duration_hours",
                        label: "Ride duration (hours, optional)",
                        type: "number",
                        min: "0",
                        step: "0.5",
                        placeholder: "e.g. 2 or 1.5",
                        "error-message": unref(form).errors.duration_hours,
                        class: "govuk-!-width-one-quarter"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                      createVNode("p", { class: "govuk-hint govuk-!-margin-top-1" }, "Decimal allowed (e.g. 1.5 for 1 hour 30 min). If set, end time is calculated from start.")
                    ]),
                    createVNode("div", { class: "govuk-form-group" }, [
                      createVNode(_component_gv_checkbox, {
                        id: "use_specific_end_date",
                        modelValue: useSpecificEndDate.value,
                        "onUpdate:modelValue": ($event) => useSpecificEndDate.value = $event,
                        name: "use_specific_end_date",
                        label: "Set specific end date",
                        class: "govuk-!-margin-bottom-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      withDirectives(createVNode("div", { class: "govuk-!-margin-top-2" }, [
                        createVNode(_component_gv_input, {
                          id: "ends_at",
                          modelValue: unref(form).ends_at,
                          "onUpdate:modelValue": ($event) => unref(form).ends_at = $event,
                          name: "ends_at",
                          label: "Ends at (optional)",
                          type: "datetime-local",
                          "error-message": effectiveErrors.value.ends_at,
                          class: "govuk-!-width-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                      ], 512), [
                        [vShow, useSpecificEndDate.value]
                      ])
                    ]),
                    createVNode(_component_gv_textarea, {
                      id: "time_details",
                      modelValue: unref(form).time_details,
                      "onUpdate:modelValue": ($event) => unref(form).time_details = $event,
                      name: "time_details",
                      label: "Time details (optional)",
                      rows: 2,
                      hint: "Keep it short. Example: Meet at 5pm, ride starts at 530pm.",
                      "error-message": unref(form).errors.time_details,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Location",
              id: "accordion-location",
              expanded: accordionLocationExpanded.value,
              "onUpdate:expanded": ($event) => accordionLocationExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "location_name",
                    modelValue: unref(form).location_name,
                    "onUpdate:modelValue": ($event) => unref(form).location_name = $event,
                    name: "location_name",
                    label: "Location name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.location_name,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "location_address",
                    modelValue: unref(form).location_address,
                    "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                    name: "location_address",
                    label: "Address *",
                    type: "text",
                    required: "",
                    hint: "You can enter 'TBA' if the address is not yet known. A mapable address is encouraged.",
                    "error-message": unref(form).errors.location_address,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_textarea, {
                    id: "location_details",
                    modelValue: unref(form).location_details,
                    "onUpdate:modelValue": ($event) => unref(form).location_details = $event,
                    name: "location_details",
                    label: "Location details (optional)",
                    rows: 2,
                    "error-message": effectiveErrors.value.location_details,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_gv_input, {
                      id: "location_name",
                      modelValue: unref(form).location_name,
                      "onUpdate:modelValue": ($event) => unref(form).location_name = $event,
                      name: "location_name",
                      label: "Location name *",
                      type: "text",
                      required: "",
                      "error-message": effectiveErrors.value.location_name,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_input, {
                      id: "location_address",
                      modelValue: unref(form).location_address,
                      "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                      name: "location_address",
                      label: "Address *",
                      type: "text",
                      required: "",
                      hint: "You can enter 'TBA' if the address is not yet known. A mapable address is encouraged.",
                      "error-message": unref(form).errors.location_address,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_textarea, {
                      id: "location_details",
                      modelValue: unref(form).location_details,
                      "onUpdate:modelValue": ($event) => unref(form).location_details = $event,
                      name: "location_details",
                      label: "Location details (optional)",
                      rows: 2,
                      "error-message": effectiveErrors.value.location_details,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Ride details",
              id: "accordion-ride",
              expanded: accordionRideExpanded.value,
              "onUpdate:expanded": ($event) => accordionRideExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "route_length",
                    modelValue: unref(form).route_length,
                    "onUpdate:modelValue": ($event) => unref(form).route_length = $event,
                    name: "route_length",
                    label: "Length of ride (optional)",
                    type: "text",
                    placeholder: "e.g. 10 miles",
                    "error-message": unref(form).errors.route_length,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_textarea, {
                    id: "route_description",
                    modelValue: unref(form).route_description,
                    "onUpdate:modelValue": ($event) => unref(form).route_description = $event,
                    name: "route_description",
                    label: "Route description (optional)",
                    rows: 2,
                    "error-message": effectiveErrors.value.route_description,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "route_link",
                    modelValue: unref(form).route_link,
                    "onUpdate:modelValue": ($event) => unref(form).route_link = $event,
                    name: "route_link",
                    label: "Route link URL (optional)",
                    type: "url",
                    placeholder: "https://...",
                    "error-message": unref(form).errors.route_link,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_gv_checkbox, {
                    id: "is_loop",
                    modelValue: unref(form).is_loop,
                    "onUpdate:modelValue": ($event) => unref(form).is_loop = $event,
                    name: "is_loop",
                    label: "Ride is a loop",
                    class: "govuk-!-margin-top-4"
                  }, null, _parent3, _scopeId2));
                  _push3(`<p class="govuk-hint govuk-!-margin-top-1" data-v-15417b87${_scopeId2}>Does your ride end at the same location where it began?</p>`);
                } else {
                  return [
                    createVNode(_component_gv_input, {
                      id: "route_length",
                      modelValue: unref(form).route_length,
                      "onUpdate:modelValue": ($event) => unref(form).route_length = $event,
                      name: "route_length",
                      label: "Length of ride (optional)",
                      type: "text",
                      placeholder: "e.g. 10 miles",
                      "error-message": unref(form).errors.route_length,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_textarea, {
                      id: "route_description",
                      modelValue: unref(form).route_description,
                      "onUpdate:modelValue": ($event) => unref(form).route_description = $event,
                      name: "route_description",
                      label: "Route description (optional)",
                      rows: 2,
                      "error-message": effectiveErrors.value.route_description,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_input, {
                      id: "route_link",
                      modelValue: unref(form).route_link,
                      "onUpdate:modelValue": ($event) => unref(form).route_link = $event,
                      name: "route_link",
                      label: "Route link URL (optional)",
                      type: "url",
                      placeholder: "https://...",
                      "error-message": unref(form).errors.route_link,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode(_component_gv_checkbox, {
                      id: "is_loop",
                      modelValue: unref(form).is_loop,
                      "onUpdate:modelValue": ($event) => unref(form).is_loop = $event,
                      name: "is_loop",
                      label: "Ride is a loop",
                      class: "govuk-!-margin-top-4"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("p", { class: "govuk-hint govuk-!-margin-top-1" }, "Does your ride end at the same location where it began?")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_accordion_section, {
              heading: "Contact",
              id: "accordion-contact",
              expanded: accordionContactExpanded.value,
              "onUpdate:expanded": ($event) => accordionContactExpanded.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "organizer_name",
                    modelValue: unref(form).organizer_name,
                    "onUpdate:modelValue": ($event) => unref(form).organizer_name = $event,
                    name: "organizer_name",
                    label: "Organizer name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.organizer_name,
                    class: "govuk-!-width-full"
                  }, null, _parent3, _scopeId2));
                  if (isGuest.value) {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(_component_gv_input, {
                      id: "organizer_email",
                      modelValue: unref(form).organizer_email,
                      "onUpdate:modelValue": ($event) => unref(form).organizer_email = $event,
                      name: "organizer_email",
                      label: "Your email address *",
                      type: "email",
                      required: "",
                      "error-message": unref(form).errors.organizer_email,
                      class: "govuk-!-width-full"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="govuk-body govuk-!-margin-top-2" data-v-15417b87${_scopeId2}> Your email is required so we can contact you about this ride. You can choose to hide it from the public ride page below. </p><!--]-->`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_gv_checkbox, {
                    id: "organizer_email_hidden",
                    modelValue: unref(form).organizer_email_hidden,
                    "onUpdate:modelValue": ($event) => unref(form).organizer_email_hidden = $event,
                    name: "organizer_email_hidden",
                    label: "Hide my email from the public ride page",
                    class: "govuk-!-margin-top-4"
                  }, null, _parent3, _scopeId2));
                  if (__props.managedCommunityPages.length) {
                    _push3(ssrRenderComponent(_component_gv_select, {
                      id: "community_page_id",
                      modelValue: unref(form).community_page_id,
                      "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                      name: "community_page_id",
                      label: "Host as",
                      class: "govuk-!-width-full govuk-!-margin-top-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Me (personal)`);
                              } else {
                                return [
                                  createTextVNode("Me (personal)")
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
                                createTextVNode("Me (personal)")
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
                  _push3(ssrRenderComponent(_component_gv_input, {
                    id: "external_link",
                    modelValue: unref(form).external_link,
                    "onUpdate:modelValue": ($event) => unref(form).external_link = $event,
                    name: "external_link",
                    label: "External link (optional)",
                    type: "url",
                    "error-message": effectiveErrors.value.external_link,
                    class: "govuk-!-width-full govuk-!-margin-top-4"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_gv_input, {
                      id: "organizer_name",
                      modelValue: unref(form).organizer_name,
                      "onUpdate:modelValue": ($event) => unref(form).organizer_name = $event,
                      name: "organizer_name",
                      label: "Organizer name *",
                      type: "text",
                      required: "",
                      "error-message": effectiveErrors.value.organizer_name,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    isGuest.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(_component_gv_input, {
                        id: "organizer_email",
                        modelValue: unref(form).organizer_email,
                        "onUpdate:modelValue": ($event) => unref(form).organizer_email = $event,
                        name: "organizer_email",
                        label: "Your email address *",
                        type: "email",
                        required: "",
                        "error-message": unref(form).errors.organizer_email,
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                      createVNode("p", { class: "govuk-body govuk-!-margin-top-2" }, " Your email is required so we can contact you about this ride. You can choose to hide it from the public ride page below. ")
                    ], 64)) : createCommentVNode("", true),
                    createVNode(_component_gv_checkbox, {
                      id: "organizer_email_hidden",
                      modelValue: unref(form).organizer_email_hidden,
                      "onUpdate:modelValue": ($event) => unref(form).organizer_email_hidden = $event,
                      name: "organizer_email_hidden",
                      label: "Hide my email from the public ride page",
                      class: "govuk-!-margin-top-4"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    __props.managedCommunityPages.length ? (openBlock(), createBlock(_component_gv_select, {
                      key: 1,
                      id: "community_page_id",
                      modelValue: unref(form).community_page_id,
                      "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                      name: "community_page_id",
                      label: "Host as",
                      class: "govuk-!-width-full govuk-!-margin-top-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_gv_select_option, { value: "" }, {
                          default: withCtx(() => [
                            createTextVNode("Me (personal)")
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
                    createVNode(_component_gv_input, {
                      id: "external_link",
                      modelValue: unref(form).external_link,
                      "onUpdate:modelValue": ($event) => unref(form).external_link = $event,
                      name: "external_link",
                      label: "External link (optional)",
                      type: "url",
                      "error-message": effectiveErrors.value.external_link,
                      class: "govuk-!-width-full govuk-!-margin-top-4"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (!isEdit.value && __props.guidelines.length) {
              _push2(ssrRenderComponent(_component_gv_accordion_section, {
                heading: "Agreements",
                id: "accordion-agreements",
                expanded: accordionAgreementsExpanded.value,
                "onUpdate:expanded": ($event) => accordionAgreementsExpanded.value = $event
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="rounded-token-md border border-border bg-card p-4" data-v-15417b87${_scopeId2}><h2 class="font-medium text-fg" data-v-15417b87${_scopeId2}>Ride community guidelines</h2><div class="mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none" data-v-15417b87${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.guidelines, (g) => {
                      _push3(`<div class="whitespace-pre-wrap" data-v-15417b87${_scopeId2}>${ssrInterpolate(g.body)}</div>`);
                    });
                    _push3(`<!--]--></div></div>`);
                    _push3(ssrRenderComponent(_component_gv_checkbox, {
                      id: "guidelines_accepted",
                      modelValue: unref(form).guidelines_accepted,
                      "onUpdate:modelValue": ($event) => unref(form).guidelines_accepted = $event,
                      name: "guidelines_accepted",
                      label: "I agree to the ride community guidelines above *",
                      required: "",
                      class: "govuk-!-margin-top-4"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("div", { class: "rounded-token-md border border-border bg-card p-4" }, [
                        createVNode("h2", { class: "font-medium text-fg" }, "Ride community guidelines"),
                        createVNode("div", { class: "mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.guidelines, (g) => {
                            return openBlock(), createBlock("div", {
                              key: g.id,
                              class: "whitespace-pre-wrap"
                            }, toDisplayString(g.body), 1);
                          }), 128))
                        ])
                      ]),
                      createVNode(_component_gv_checkbox, {
                        id: "guidelines_accepted",
                        modelValue: unref(form).guidelines_accepted,
                        "onUpdate:modelValue": ($event) => unref(form).guidelines_accepted = $event,
                        name: "guidelines_accepted",
                        label: "I agree to the ride community guidelines above *",
                        required: "",
                        class: "govuk-!-margin-top-4"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_gv_accordion_section, {
                heading: "Description",
                id: "accordion-description",
                expanded: accordionDescriptionExpanded.value,
                "onUpdate:expanded": ($event) => accordionDescriptionExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_gv_input, {
                    id: "name",
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    name: "name",
                    label: "Ride name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.name,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_textarea, {
                    id: "description",
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    name: "description",
                    label: "Description *",
                    rows: 4,
                    required: "",
                    "error-message": effectiveErrors.value.description,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  Object.keys(__props.audiences).length ? (openBlock(), createBlock(_component_gv_select, {
                    key: 0,
                    id: "audience_id",
                    modelValue: unref(form).audience_id,
                    "onUpdate:modelValue": ($event) => unref(form).audience_id = $event,
                    name: "audience_id",
                    label: "Audience",
                    class: "govuk-!-width-full"
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.audiences, (label, id) => {
                        return openBlock(), createBlock(_component_gv_select_option, {
                          key: id,
                          value: String(id)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(label), 1)
                          ]),
                          _: 2
                        }, 1032, ["value"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  rideTagsList.value.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "govuk-form-group"
                  }, [
                    createVNode("label", { class: "govuk-label" }, "Tags (optional)"),
                    createVNode("div", { class: "govuk-checkboxes govuk-checkboxes--small" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(rideTagsList.value, ([slug, label]) => {
                        return openBlock(), createBlock("div", {
                          key: slug,
                          class: "govuk-checkboxes__item"
                        }, [
                          createVNode("input", {
                            id: `tag-${slug}`,
                            type: "checkbox",
                            class: "govuk-checkboxes__input",
                            checked: (unref(form).tags || []).includes(slug),
                            onChange: ($event) => toggleTag(slug)
                          }, null, 40, ["id", "checked", "onChange"]),
                          createVNode("label", {
                            for: `tag-${slug}`,
                            class: "govuk-label govuk-checkboxes__label"
                          }, toDisplayString(label), 9, ["for"])
                        ]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  unref(page).props.auth?.user ? (openBlock(), createBlock(_sfc_main$1, {
                    key: 2,
                    modelValue: unref(form).upload_ids,
                    "onUpdate:modelValue": ($event) => unref(form).upload_ids = $event,
                    "input-id": "ride_image",
                    label: "Ride image (optional, one image)",
                    hint: "JPEG, PNG, WebP or BMP. Max 10MB."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"]),
              createVNode(_component_gv_accordion_section, {
                heading: "Date and time",
                id: "accordion-datetime",
                expanded: accordionDatetimeExpanded.value,
                "onUpdate:expanded": ($event) => accordionDatetimeExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "govuk-form-group" }, [
                    createVNode("label", {
                      class: "govuk-label",
                      for: "starts_at"
                    }, "Starts at *"),
                    createVNode(_component_gv_input, {
                      id: "starts_at",
                      modelValue: unref(form).starts_at,
                      "onUpdate:modelValue": ($event) => unref(form).starts_at = $event,
                      name: "starts_at",
                      type: "datetime-local",
                      required: "",
                      "error-message": effectiveErrors.value.starts_at,
                      class: "govuk-!-width-full govuk-!-margin-bottom-2"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                  ]),
                  createVNode("div", { class: "govuk-form-group" }, [
                    createVNode(_component_gv_input, {
                      id: "duration_hours",
                      modelValue: durationHours.value,
                      "onUpdate:modelValue": ($event) => durationHours.value = $event,
                      name: "duration_hours",
                      label: "Ride duration (hours, optional)",
                      type: "number",
                      min: "0",
                      step: "0.5",
                      placeholder: "e.g. 2 or 1.5",
                      "error-message": unref(form).errors.duration_hours,
                      class: "govuk-!-width-one-quarter"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode("p", { class: "govuk-hint govuk-!-margin-top-1" }, "Decimal allowed (e.g. 1.5 for 1 hour 30 min). If set, end time is calculated from start.")
                  ]),
                  createVNode("div", { class: "govuk-form-group" }, [
                    createVNode(_component_gv_checkbox, {
                      id: "use_specific_end_date",
                      modelValue: useSpecificEndDate.value,
                      "onUpdate:modelValue": ($event) => useSpecificEndDate.value = $event,
                      name: "use_specific_end_date",
                      label: "Set specific end date",
                      class: "govuk-!-margin-bottom-2"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    withDirectives(createVNode("div", { class: "govuk-!-margin-top-2" }, [
                      createVNode(_component_gv_input, {
                        id: "ends_at",
                        modelValue: unref(form).ends_at,
                        "onUpdate:modelValue": ($event) => unref(form).ends_at = $event,
                        name: "ends_at",
                        label: "Ends at (optional)",
                        type: "datetime-local",
                        "error-message": effectiveErrors.value.ends_at,
                        class: "govuk-!-width-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                    ], 512), [
                      [vShow, useSpecificEndDate.value]
                    ])
                  ]),
                  createVNode(_component_gv_textarea, {
                    id: "time_details",
                    modelValue: unref(form).time_details,
                    "onUpdate:modelValue": ($event) => unref(form).time_details = $event,
                    name: "time_details",
                    label: "Time details (optional)",
                    rows: 2,
                    hint: "Keep it short. Example: Meet at 5pm, ride starts at 530pm.",
                    "error-message": unref(form).errors.time_details,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"]),
              createVNode(_component_gv_accordion_section, {
                heading: "Location",
                id: "accordion-location",
                expanded: accordionLocationExpanded.value,
                "onUpdate:expanded": ($event) => accordionLocationExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_gv_input, {
                    id: "location_name",
                    modelValue: unref(form).location_name,
                    "onUpdate:modelValue": ($event) => unref(form).location_name = $event,
                    name: "location_name",
                    label: "Location name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.location_name,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_input, {
                    id: "location_address",
                    modelValue: unref(form).location_address,
                    "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
                    name: "location_address",
                    label: "Address *",
                    type: "text",
                    required: "",
                    hint: "You can enter 'TBA' if the address is not yet known. A mapable address is encouraged.",
                    "error-message": unref(form).errors.location_address,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_textarea, {
                    id: "location_details",
                    modelValue: unref(form).location_details,
                    "onUpdate:modelValue": ($event) => unref(form).location_details = $event,
                    name: "location_details",
                    label: "Location details (optional)",
                    rows: 2,
                    "error-message": effectiveErrors.value.location_details,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"]),
              createVNode(_component_gv_accordion_section, {
                heading: "Ride details",
                id: "accordion-ride",
                expanded: accordionRideExpanded.value,
                "onUpdate:expanded": ($event) => accordionRideExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_gv_input, {
                    id: "route_length",
                    modelValue: unref(form).route_length,
                    "onUpdate:modelValue": ($event) => unref(form).route_length = $event,
                    name: "route_length",
                    label: "Length of ride (optional)",
                    type: "text",
                    placeholder: "e.g. 10 miles",
                    "error-message": unref(form).errors.route_length,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_textarea, {
                    id: "route_description",
                    modelValue: unref(form).route_description,
                    "onUpdate:modelValue": ($event) => unref(form).route_description = $event,
                    name: "route_description",
                    label: "Route description (optional)",
                    rows: 2,
                    "error-message": effectiveErrors.value.route_description,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_input, {
                    id: "route_link",
                    modelValue: unref(form).route_link,
                    "onUpdate:modelValue": ($event) => unref(form).route_link = $event,
                    name: "route_link",
                    label: "Route link URL (optional)",
                    type: "url",
                    placeholder: "https://...",
                    "error-message": unref(form).errors.route_link,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  createVNode(_component_gv_checkbox, {
                    id: "is_loop",
                    modelValue: unref(form).is_loop,
                    "onUpdate:modelValue": ($event) => unref(form).is_loop = $event,
                    name: "is_loop",
                    label: "Ride is a loop",
                    class: "govuk-!-margin-top-4"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("p", { class: "govuk-hint govuk-!-margin-top-1" }, "Does your ride end at the same location where it began?")
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"]),
              createVNode(_component_gv_accordion_section, {
                heading: "Contact",
                id: "accordion-contact",
                expanded: accordionContactExpanded.value,
                "onUpdate:expanded": ($event) => accordionContactExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_gv_input, {
                    id: "organizer_name",
                    modelValue: unref(form).organizer_name,
                    "onUpdate:modelValue": ($event) => unref(form).organizer_name = $event,
                    name: "organizer_name",
                    label: "Organizer name *",
                    type: "text",
                    required: "",
                    "error-message": effectiveErrors.value.organizer_name,
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                  isGuest.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(_component_gv_input, {
                      id: "organizer_email",
                      modelValue: unref(form).organizer_email,
                      "onUpdate:modelValue": ($event) => unref(form).organizer_email = $event,
                      name: "organizer_email",
                      label: "Your email address *",
                      type: "email",
                      required: "",
                      "error-message": unref(form).errors.organizer_email,
                      class: "govuk-!-width-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"]),
                    createVNode("p", { class: "govuk-body govuk-!-margin-top-2" }, " Your email is required so we can contact you about this ride. You can choose to hide it from the public ride page below. ")
                  ], 64)) : createCommentVNode("", true),
                  createVNode(_component_gv_checkbox, {
                    id: "organizer_email_hidden",
                    modelValue: unref(form).organizer_email_hidden,
                    "onUpdate:modelValue": ($event) => unref(form).organizer_email_hidden = $event,
                    name: "organizer_email_hidden",
                    label: "Hide my email from the public ride page",
                    class: "govuk-!-margin-top-4"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  __props.managedCommunityPages.length ? (openBlock(), createBlock(_component_gv_select, {
                    key: 1,
                    id: "community_page_id",
                    modelValue: unref(form).community_page_id,
                    "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
                    name: "community_page_id",
                    label: "Host as",
                    class: "govuk-!-width-full govuk-!-margin-top-4"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_gv_select_option, { value: "" }, {
                        default: withCtx(() => [
                          createTextVNode("Me (personal)")
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
                  createVNode(_component_gv_input, {
                    id: "external_link",
                    modelValue: unref(form).external_link,
                    "onUpdate:modelValue": ($event) => unref(form).external_link = $event,
                    name: "external_link",
                    label: "External link (optional)",
                    type: "url",
                    "error-message": effectiveErrors.value.external_link,
                    class: "govuk-!-width-full govuk-!-margin-top-4"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-message"])
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"]),
              !isEdit.value && __props.guidelines.length ? (openBlock(), createBlock(_component_gv_accordion_section, {
                key: 0,
                heading: "Agreements",
                id: "accordion-agreements",
                expanded: accordionAgreementsExpanded.value,
                "onUpdate:expanded": ($event) => accordionAgreementsExpanded.value = $event
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "rounded-token-md border border-border bg-card p-4" }, [
                    createVNode("h2", { class: "font-medium text-fg" }, "Ride community guidelines"),
                    createVNode("div", { class: "mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.guidelines, (g) => {
                        return openBlock(), createBlock("div", {
                          key: g.id,
                          class: "whitespace-pre-wrap"
                        }, toDisplayString(g.body), 1);
                      }), 128))
                    ])
                  ]),
                  createVNode(_component_gv_checkbox, {
                    id: "guidelines_accepted",
                    modelValue: unref(form).guidelines_accepted,
                    "onUpdate:modelValue": ($event) => unref(form).guidelines_accepted = $event,
                    name: "guidelines_accepted",
                    label: "I agree to the ride community guidelines above *",
                    required: "",
                    class: "govuk-!-margin-top-4"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }, 8, ["expanded", "onUpdate:expanded"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="govuk-button-group govuk-!-margin-top-6" data-v-15417b87>`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "button",
        variant: "primary",
        disabled: unref(form).processing,
        onClick: submit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isEdit.value ? "Save" : "Submit ride")}`);
          } else {
            return [
              createTextVNode(toDisplayString(isEdit.value ? "Save" : "Submit ride"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a${ssrRenderAttr("href", isEdit.value ? `${__props.cityBaseUrl}/rides/${__props.ride.id}` : `${__props.cityBaseUrl}/rides`)} class="govuk-link" data-v-15417b87>Cancel</a></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Forms/RideForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RideForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15417b87"]]);
export {
  RideForm as R
};
