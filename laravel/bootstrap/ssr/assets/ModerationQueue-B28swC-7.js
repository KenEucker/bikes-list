import { ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
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
    confirmRemove: { type: Boolean, default: false },
    reasonCodes: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><ul class="govuk-list mt-6" style="${ssrRenderStyle({ "list-style": "none", "padding-left": "0" })}"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<li class="govuk-!-margin-bottom-6 rounded-token-md border border-border bg-card p-4"><a${ssrRenderAttr("href", __props.showUrlFn(item))} class="govuk-link govuk-link--no-visited-state font-medium">${ssrInterpolate(item[__props.titleKey])}</a>`);
        if (__props.subtitleFn) {
          _push(`<p class="govuk-body-s govuk-!-margin-top-1 text-muted">${ssrInterpolate(__props.subtitleFn(item))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$1, {
          status: __props.statusValue,
          class: "govuk-!-margin-top-2"
        }, null, _parent));
        _push(`<div class="govuk-!-margin-top-4 flex flex-wrap items-end gap-3"><div class="govuk-form-group govuk-!-margin-bottom-0"><label${ssrRenderAttr("for", `reason-${item.id}`)} class="govuk-label govuk-label--s govuk-!-margin-bottom-1"> Reason code </label><select${ssrRenderAttr("id", `reason-${item.id}`)} class="govuk-select" style="${ssrRenderStyle({ "min-width": "14rem", "width": "14rem" })}"><option value="">Select reason</option><!--[-->`);
        ssrRenderList(__props.reasonCodes, (label, code) => {
          _push(`<option${ssrRenderAttr("value", code)}>${ssrInterpolate(label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="govuk-button-group govuk-!-margin-bottom-0 flex flex-wrap gap-2" style="${ssrRenderStyle({ "align-items": "flex-end" })}">`);
        if (__props.approveUrlFn) {
          _push(`<form${ssrRenderAttr("action", __props.approveUrlFn(item))} method="post" class="govuk-!-margin-0" style="${ssrRenderStyle({ "display": "inline-block", "margin-bottom": "0" })}"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><input type="hidden" name="reason_code" value=""><button type="submit" class="govuk-button govuk-!-margin-bottom-0">${ssrInterpolate(__props.statusValue === "pending" || __props.statusValue === "pending_review" ? "Approve / Publish" : "Approve")}</button></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form${ssrRenderAttr("action", __props.removeUrlFn(item))} method="post" class="govuk-!-margin-0" style="${ssrRenderStyle({ "display": "inline-block", "margin-bottom": "0" })}"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><input type="hidden" name="reason_code" value=""><button type="submit" class="govuk-button govuk-button--warning govuk-!-margin-bottom-0"> Remove </button></form>`);
        if (__props.revertUrlFn) {
          _push(`<form${ssrRenderAttr("action", __props.revertUrlFn(item))} method="post" class="govuk-!-margin-0 flex flex-wrap gap-3" style="${ssrRenderStyle({ "display": "inline-flex", "flex-wrap": "wrap", "align-items": "flex-end", "margin-bottom": "0" })}"><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}><input type="hidden" name="reason_code" value=""><button type="submit" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"> Revert to draft </button><div class="w-full govuk-!-margin-top-3" style="${ssrRenderStyle({ "min-width": "100%" })}"><label class="govuk-label govuk-label--s govuk-!-margin-bottom-1">Note to creator (required)</label><textarea name="moderation_note" class="govuk-textarea" rows="3" required maxlength="2000" placeholder="Required" style="${ssrRenderStyle({ "max-width": "28rem" })}"></textarea></div></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></li>`);
      });
      _push(`<!--]--></ul>`);
      if (!__props.items.length) {
        _push(`<p class="govuk-body text-muted govuk-!-margin-top-6">${ssrInterpolate(__props.emptyMessage)}</p>`);
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
