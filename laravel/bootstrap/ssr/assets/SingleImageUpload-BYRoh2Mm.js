import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "SingleImageUpload",
  __ssrInlineRender: true,
  props: {
    /** Array of 0 or 1 upload id (v-model) */
    modelValue: { type: Array, default: () => [] },
    label: { type: String, default: "Image (optional, one image)" },
    hint: { type: String, default: "JPEG, PNG, WebP or BMP. Max 10MB." },
    inputId: { type: String, default: "single_image_upload" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    usePage();
    const uploadProcessing = ref(false);
    const uploadError = ref(null);
    const hasImage = computed(() => Array.isArray(props.modelValue) && props.modelValue.length > 0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "govuk-form-group govuk-!-margin-top-4" }, _attrs))}><label class="govuk-label"${ssrRenderAttr("for", __props.inputId)}>${ssrInterpolate(__props.label)}</label>`);
      if (__props.hint) {
        _push(`<p class="govuk-hint">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("id", __props.inputId)} type="file" accept="image/jpeg,image/png,image/webp,image/bmp" class="govuk-file-upload"${ssrIncludeBooleanAttr(uploadProcessing.value) ? " disabled" : ""}>`);
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
      if (hasImage.value) {
        _push(`<p class="govuk-body govuk-!-margin-top-2"><button type="button" class="govuk-link govuk-body-s">Remove image</button></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SingleImageUpload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
