import { ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
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
    const encodedEmail = computed(() => encodeURIComponent(props.email));
    const encodedSubject = computed(() => encodeURIComponent(props.mailtoSubject || ""));
    const webmailLinks = computed(() => [
      { name: "Gmail", url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail.value}&su=${encodedSubject.value}` },
      { name: "Yahoo Mail", url: `https://compose.mail.yahoo.com/?to=${encodedEmail.value}&subject=${encodedSubject.value}` },
      { name: "Outlook", url: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail.value}&subject=${encodedSubject.value}` },
      { name: "AOL Mail", url: `https://mail.aol.com/webmail-std/en-us/send?to=${encodedEmail.value}&subject=${encodedSubject.value}` }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_button = resolveComponent("gv-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden border rounded-token-md border-border bg-card" }, _attrs))} data-v-8365bbe7><button type="button" class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left text-fg hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"${ssrRenderAttr("aria-expanded", expanded.value)} data-v-8365bbe7><span data-v-8365bbe7>${ssrInterpolate(__props.label)}</span><span class="text-muted" aria-hidden="true" data-v-8365bbe7>${ssrInterpolate(expanded.value ? "▼" : "▶")}</span></button><div class="px-4 py-4 border-t border-border" style="${ssrRenderStyle(expanded.value ? null : { display: "none" })}" data-v-8365bbe7>`);
      if (__props.note) {
        _push(`<p class="text-sm text-muted" data-v-8365bbe7>${ssrInterpolate(__props.note)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="email-relay-row" data-v-8365bbe7><code class="email-relay-address" data-v-8365bbe7>${ssrInterpolate(__props.email)}</code>`);
      _push(ssrRenderComponent(_component_gv_button, {
        type: "button",
        variant: "primary",
        class: "email-relay-copy",
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
      _push(`</div><p class="govuk-body-s govuk-!-margin-top-3 govuk-!-margin-bottom-1" data-v-8365bbe7>Reply via webmail:</p><ul class="govuk-list govuk-list--inline" data-v-8365bbe7><li class="govuk-!-display-inline" data-v-8365bbe7><a${ssrRenderAttr("href", mailtoHref.value)} class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener" data-v-8365bbe7>Email App</a><span class="govuk-!-margin-left-1 govuk-!-margin-right-1" aria-hidden="true" data-v-8365bbe7>|</span></li><!--[-->`);
      ssrRenderList(webmailLinks.value, (link, i) => {
        _push(`<li class="govuk-!-display-inline" data-v-8365bbe7><a${ssrRenderAttr("href", link.url)} class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener" data-v-8365bbe7>${ssrInterpolate(link.name)}</a>`);
        if (i < webmailLinks.value.length - 1) {
          _push(`<span class="govuk-!-margin-left-1 govuk-!-margin-right-1" aria-hidden="true" data-v-8365bbe7>|</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/EmailRelayCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EmailRelayCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8365bbe7"]]);
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
          class: "pending-review-banner rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
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
  EmailRelayCard as E,
  _sfc_main as _
};
