import { computed, ref, watch, resolveComponent, withCtx, unref, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "EventForm",
  __ssrInlineRender: true,
  props: {
    event: { type: Object, default: null },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) }
  },
  emits: ["update:processing"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const page = usePage();
    const isEdit = computed(() => !!props.event);
    computed(
      () => isEdit.value ? `${props.cityBaseUrl}/events/${props.event.id}` : `${props.cityBaseUrl}/events`
    );
    const oldInput = props.old || {};
    const ev = props.event || {};
    const dt = (v) => v ? String(v).slice(0, 16) : "";
    const hasExistingEnd = !!(ev.ends_at || oldInput.ends_at);
    const useSpecificEndDate = ref(hasExistingEnd);
    const durationHours = ref(oldInput.duration_hours ?? "");
    const form = useForm({
      title: oldInput.title ?? ev.title ?? "",
      description: oldInput.description ?? ev.description ?? "",
      organizer_name: oldInput.organizer_name ?? ev.organizer_name ?? (page.props.auth?.user?.name ?? ""),
      organizer_email_hidden: oldInput.organizer_email_hidden === "1" || oldInput.organizer_email_hidden === true || ev.organizer_email_hidden === true,
      location_address: oldInput.location_address ?? ev.location_address ?? "",
      route_description: oldInput.route_description ?? ev.route_description ?? "",
      route_link: oldInput.route_link ?? ev.route_link ?? "",
      external_link: oldInput.external_link ?? ev.external_link ?? "",
      event_type: oldInput.event_type ?? ev.event_type ?? "",
      community_page_id: oldInput.community_page_id ?? ev.community_page_id ?? "",
      starts_at: oldInput.starts_at ?? dt(ev.starts_at) ?? "",
      ends_at: oldInput.ends_at ?? dt(ev.ends_at) ?? "",
      duration_hours: oldInput.duration_hours ?? "",
      timezone: oldInput.timezone ?? ev.timezone ?? (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""),
      is_recurring: oldInput.is_recurring === "1" || oldInput.is_recurring === true || ev.is_recurring === true,
      recurrence_ends_at: oldInput.recurrence_ends_at ?? (ev.recurrence_ends_at ? String(ev.recurrence_ends_at).slice(0, 10) : "") ?? "",
      tags: oldInput.tags ?? ev.tags ?? [],
      guidelines_accepted: oldInput.guidelines_accepted === "1" || oldInput.guidelines_accepted === true,
      guideline_ids: oldInput.guideline_ids ?? props.guidelines.map((g) => g.id)
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
    const hasErrors = () => Object.keys(form.errors).length > 0;
    watch(() => form.processing, (v) => emit("update:processing", v), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_error_summary = resolveComponent("gv-error-summary");
      const _component_gv_error_link = resolveComponent("gv-error-link");
      const _component_gv_input = resolveComponent("gv-input");
      const _component_gv_textarea = resolveComponent("gv-textarea");
      const _component_gv_checkbox = resolveComponent("gv-checkbox");
      const _component_gv_select = resolveComponent("gv-select");
      const _component_gv_select_option = resolveComponent("gv-select-option");
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
      _push(ssrRenderComponent(_component_gv_input, {
        id: "title",
        modelValue: unref(form).title,
        "onUpdate:modelValue": ($event) => unref(form).title = $event,
        name: "title",
        label: "Title *",
        type: "text",
        required: "",
        "error-message": unref(form).errors.title,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "description",
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        name: "description",
        label: "Description *",
        rows: 4,
        required: "",
        "error-message": unref(form).errors.description,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "organizer_name",
        modelValue: unref(form).organizer_name,
        "onUpdate:modelValue": ($event) => unref(form).organizer_name = $event,
        name: "organizer_name",
        label: "Organizer name *",
        type: "text",
        required: "",
        "error-message": unref(form).errors.organizer_name,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_checkbox, {
        id: "organizer_email_hidden",
        modelValue: unref(form).organizer_email_hidden,
        "onUpdate:modelValue": ($event) => unref(form).organizer_email_hidden = $event,
        name: "organizer_email_hidden",
        label: "Hide my email from public",
        class: "govuk-!-margin-top-4"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "location_address",
        modelValue: unref(form).location_address,
        "onUpdate:modelValue": ($event) => unref(form).location_address = $event,
        name: "location_address",
        label: "Location (optional)",
        type: "text",
        "error-message": unref(form).errors.location_address,
        class: "govuk-!-width-full"
      }, null, _parent));
      if (__props.managedCommunityPages.length) {
        _push(ssrRenderComponent(_component_gv_select, {
          id: "community_page_id",
          modelValue: unref(form).community_page_id,
          "onUpdate:modelValue": ($event) => unref(form).community_page_id = $event,
          name: "community_page_id",
          label: "Host as",
          class: "govuk-!-width-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_gv_select_option, { value: "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Me (personal)`);
                  } else {
                    return [
                      createTextVNode("Me (personal)")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--[-->`);
              ssrRenderList(__props.managedCommunityPages, (p) => {
                _push2(ssrRenderComponent(_component_gv_select_option, {
                  key: p.id,
                  value: p.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(p.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(p.name), 1)
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
                    createTextVNode("Me (personal)")
                  ]),
                  _: 1
                }),
                (openBlock(true), createBlock(Fragment, null, renderList(__props.managedCommunityPages, (p) => {
                  return openBlock(), createBlock(_component_gv_select_option, {
                    key: p.id,
                    value: p.id
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
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_gv_textarea, {
        id: "route_description",
        modelValue: unref(form).route_description,
        "onUpdate:modelValue": ($event) => unref(form).route_description = $event,
        name: "route_description",
        label: "Route description (optional)",
        rows: 2,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "route_link",
        modelValue: unref(form).route_link,
        "onUpdate:modelValue": ($event) => unref(form).route_link = $event,
        name: "route_link",
        label: "Route link URL (optional)",
        type: "url",
        placeholder: "https://...",
        "error-message": unref(form).errors.route_link,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "external_link",
        modelValue: unref(form).external_link,
        "onUpdate:modelValue": ($event) => unref(form).external_link = $event,
        name: "external_link",
        label: "External link (optional)",
        type: "url",
        "error-message": unref(form).errors.external_link,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_gv_input, {
        id: "event_type",
        modelValue: unref(form).event_type,
        "onUpdate:modelValue": ($event) => unref(form).event_type = $event,
        name: "event_type",
        label: "Event type (optional)",
        type: "text",
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(`<div class="govuk-form-group"><label class="govuk-label" for="starts_at">Starts at *</label>`);
      _push(ssrRenderComponent(_component_gv_input, {
        id: "starts_at",
        modelValue: unref(form).starts_at,
        "onUpdate:modelValue": ($event) => unref(form).starts_at = $event,
        name: "starts_at",
        type: "datetime-local",
        required: "",
        "error-message": unref(form).errors.starts_at,
        class: "govuk-!-width-full govuk-!-margin-bottom-2"
      }, null, _parent));
      _push(`</div><div class="govuk-form-group">`);
      _push(ssrRenderComponent(_component_gv_input, {
        id: "duration_hours",
        modelValue: durationHours.value,
        "onUpdate:modelValue": ($event) => durationHours.value = $event,
        name: "duration_hours",
        label: "Ride lasts for (hours, optional)",
        type: "number",
        min: "0",
        step: "0.5",
        placeholder: "e.g. 2 or 1.5",
        "error-message": unref(form).errors.duration_hours,
        class: "govuk-!-width-one-quarter"
      }, null, _parent));
      _push(`<p class="govuk-hint govuk-!-margin-top-1">Decimal allowed (e.g. 1.5 for 1 hour 30 min). If set, end time is calculated from start.</p></div><div class="govuk-form-group">`);
      _push(ssrRenderComponent(_component_gv_checkbox, {
        id: "use_specific_end_date",
        modelValue: useSpecificEndDate.value,
        "onUpdate:modelValue": ($event) => useSpecificEndDate.value = $event,
        name: "use_specific_end_date",
        label: "Set specific end date",
        class: "govuk-!-margin-bottom-2"
      }, null, _parent));
      _push(`<div class="govuk-!-margin-top-2" style="${ssrRenderStyle(useSpecificEndDate.value ? null : { display: "none" })}">`);
      _push(ssrRenderComponent(_component_gv_input, {
        id: "ends_at",
        modelValue: unref(form).ends_at,
        "onUpdate:modelValue": ($event) => unref(form).ends_at = $event,
        name: "ends_at",
        label: "Ride ends at (optional)",
        type: "datetime-local",
        "error-message": unref(form).errors.ends_at,
        class: "govuk-!-width-full"
      }, null, _parent));
      _push(`</div></div>`);
      if (!isEdit.value && __props.guidelines.length) {
        _push(`<div class="mt-4 rounded-token-md border border-border bg-card p-4"><h2 class="font-medium text-fg">Event community guidelines</h2><div class="mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none"><!--[-->`);
        ssrRenderList(__props.guidelines, (g) => {
          _push(`<div class="whitespace-pre-wrap">${ssrInterpolate(g.body)}</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isEdit.value && __props.guidelines.length) {
        _push(ssrRenderComponent(_component_gv_checkbox, {
          id: "guidelines_accepted",
          modelValue: unref(form).guidelines_accepted,
          "onUpdate:modelValue": ($event) => unref(form).guidelines_accepted = $event,
          name: "guidelines_accepted",
          label: "I agree to the event community guidelines above *",
          required: "",
          class: "govuk-!-margin-top-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="govuk-button-group govuk-!-margin-top-6">`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "submit",
        variant: "primary",
        disabled: unref(form).processing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isEdit.value ? "Save" : "Submit event")}`);
          } else {
            return [
              createTextVNode(toDisplayString(isEdit.value ? "Save" : "Submit event"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a${ssrRenderAttr("href", isEdit.value ? `${__props.cityBaseUrl}/events/${__props.event.id}` : `${__props.cityBaseUrl}/events`)} class="govuk-link">Cancel</a></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Forms/EventForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
