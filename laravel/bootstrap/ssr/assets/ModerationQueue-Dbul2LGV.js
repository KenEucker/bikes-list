import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./StatusTag-BeNLpE6N.js";
import { useSSRContext } from "vue";
const _sfc_main = {
  __name: "ModerationQueue",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, required: true },
    entityLabel: { type: String, required: true },
    titleKey: { type: String, default: "title" },
    showUrlFn: { type: Function, required: true },
    approveUrlFn: { type: Function, default: null },
    removeUrlFn: { type: Function, required: true },
    revertUrlFn: { type: Function, default: null },
    subtitleFn: { type: Function, default: null },
    statusValue: { type: String, required: true },
    emptyMessage: { type: String, default: "No pending items." },
    confirmRemove: { type: Boolean, default: true },
    reasonCodes: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><ul class="mt-6 space-y-4"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<li class="rounded-token-md border border-border bg-card p-4"><a${ssrRenderAttr("href", __props.showUrlFn(item))} class="font-medium text-primary underline">${ssrInterpolate(item[__props.titleKey])}</a>`);
        if (__props.subtitleFn) {
          _push(`<p class="mt-1 text-sm text-muted">${ssrInterpolate(__props.subtitleFn(item))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$1, {
          status: __props.statusValue,
          class: "mt-2"
        }, null, _parent));
        _push(`<div class="mt-3 flex flex-wrap gap-2 items-end">`);
        if (__props.approveUrlFn) {
          _push(`<form${ssrRenderAttr("action", __props.approveUrlFn(item))} method="post" class="inline-flex flex-wrap gap-2 items-end"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Reason code</label><select name="reason_code" class="govuk-select govuk-!-width-auto" required><!--[-->`);
          ssrRenderList(__props.reasonCodes, (label, code) => {
            _push(`<option${ssrRenderAttr("value", code)}>${ssrInterpolate(label)}</option>`);
          });
          _push(`<!--]--></select></div><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Message (optional)</label><input type="text" name="relay_message" placeholder="Optional message to creator" class="govuk-input govuk-!-width-one-third" maxlength="2000"></div><button type="submit" class="govuk-button">${ssrInterpolate(__props.statusValue === "pending" || __props.statusValue === "pending_review" ? "Approve / Publish" : "Approve")}</button></form>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.revertUrlFn) {
          _push(`<form${ssrRenderAttr("action", __props.revertUrlFn(item))} method="post" class="inline-flex flex-wrap gap-2 items-end"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Reason</label><select name="reason_code" class="govuk-select govuk-!-width-auto" required><!--[-->`);
          ssrRenderList(__props.reasonCodes, (label, code) => {
            _push(`<option${ssrRenderAttr("value", code)}>${ssrInterpolate(label)}</option>`);
          });
          _push(`<!--]--></select></div><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Note to creator (required)</label><input type="text" name="moderation_note" placeholder="Required" class="govuk-input govuk-!-width-one-third" required maxlength="2000"></div><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Message (optional)</label><input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000"></div><button type="submit" class="govuk-button govuk-button--secondary">Revert to draft</button></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form${ssrRenderAttr("action", __props.removeUrlFn(item))} method="post" class="inline-flex flex-wrap gap-2 items-end"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Reason code</label><select name="reason_code" class="govuk-select govuk-!-width-auto" required><!--[-->`);
        ssrRenderList(__props.reasonCodes, (label, code) => {
          _push(`<option${ssrRenderAttr("value", code)}>${ssrInterpolate(label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="govuk-form-group govuk-!-margin-bottom-0"><label class="govuk-label govuk-label--s">Message (optional)</label><input type="text" name="relay_message" placeholder="Optional" class="govuk-input govuk-!-width-one-third" maxlength="2000"></div><button type="submit" class="govuk-button govuk-button--warning">Remove</button></form></div></li>`);
      });
      _push(`<!--]--></ul>`);
      if (!__props.items.length) {
        _push(`<p class="mt-6 text-muted">${ssrInterpolate(__props.emptyMessage)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ModerationQueue.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
