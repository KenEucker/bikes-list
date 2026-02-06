import { ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main$1 = {
  __name: "EmailRelayCard",
  __ssrInlineRender: true,
  props: {
    email: { type: String, required: true },
    label: { type: String, default: "Contact" },
    note: { type: String, default: "" },
    mailtoSubject: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const expanded = ref(false);
    const copied = ref(false);
    async function copy() {
      if (!props.email) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(props.email);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = props.email;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } catch (err) {
        console.warn("Copy failed:", err);
      }
    }
    const mailtoHref = computed(() => {
      const subject = props.mailtoSubject ? `?subject=${encodeURIComponent(props.mailtoSubject)}` : "";
      return `mailto:${encodeURIComponent(props.email)}${subject}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-token-md border border-border bg-card overflow-hidden" }, _attrs))}><button type="button" class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"${ssrRenderAttr("aria-expanded", expanded.value)}><span>${ssrInterpolate(__props.label)}</span><span class="text-muted" aria-hidden="true">${ssrInterpolate(expanded.value ? "▼" : "▶")}</span></button><div class="border-t border-border px-4 py-4" style="${ssrRenderStyle(expanded.value ? null : { display: "none" })}">`);
      if (__props.note) {
        _push(`<p class="text-sm text-muted">${ssrInterpolate(__props.note)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-2 flex flex-wrap items-center gap-2"><code class="flex-1 min-w-0 rounded-token-sm bg-muted/30 px-2 py-1.5 text-sm text-fg">${ssrInterpolate(__props.email)}</code>`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "button",
        variant: "primary",
        title: copied.value ? "Copied to clipboard" : "Copy address",
        onClick: copy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(copied.value ? "Copied!" : "Copy")}`);
          } else {
            return [
              createTextVNode(toDisplayString(copied.value ? "Copied!" : "Copy"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a${ssrRenderAttr("href", mailtoHref.value)} class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener"> Email </a></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/EmailRelayCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "PendingReviewBanner",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean, default: false },
    /** e.g. "sale", "ride", "page" — used in copy */
    resourceLabel: { type: String, default: "item" }
  },
  setup(__props) {
    const props = __props;
    const message = computed(
      () => `This ${props.resourceLabel} is pending review. It is not visible to the public yet. A moderator will review it; when approved, it will be published.`
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_notification_banner = resolveComponent("gv-notification-banner");
      if (__props.show) {
        _push(ssrRenderComponent(_component_gv_notification_banner, mergeProps({
          type: "warning",
          title: "Pending review",
          class: "rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="govuk-body"${_scopeId}>${ssrInterpolate(message.value)}</p>`);
            } else {
              return [
                createVNode("p", { class: "govuk-body" }, toDisplayString(message.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PendingReviewBanner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$1 as a
};
