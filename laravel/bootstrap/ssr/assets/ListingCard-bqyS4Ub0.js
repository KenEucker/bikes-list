import { computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "ListingCard",
  __ssrInlineRender: true,
  props: {
    listing: { type: Object, required: true },
    listingTypeLabel: { type: String, default: "" },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const listingThumbUrl = computed(() => {
      const listing = props.listing;
      const firstUpload = listing.uploads?.[0];
      if (firstUpload?.status === "ready" && (firstUpload.lg_url || firstUpload.sm_url)) {
        return firstUpload.lg_url || firstUpload.sm_url;
      }
      return listing.attachments?.[0]?.url ?? null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: __props.url,
        class: "block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
      }, _attrs))}>`);
      if (listingThumbUrl.value) {
        _push(`<div class="mb-2 aspect-video w-full overflow-hidden rounded-token-sm bg-muted/30"><img${ssrRenderAttr("src", listingThumbUrl.value)}${ssrRenderAttr("alt", __props.listing.title)} class="h-full w-full object-cover"></div>`);
      } else {
        _push(`<div class="mb-2 aspect-video w-full rounded-token-sm bg-muted/30 flex items-center justify-center text-muted text-sm">No photo</div>`);
      }
      _push(`<h3 class="font-medium text-fg line-clamp-1">${ssrInterpolate(__props.listing.title)}</h3><p class="mt-0.5 text-sm text-muted">${ssrInterpolate(__props.listingTypeLabel || __props.listing.type)} · ${ssrInterpolate(__props.listing.price != null ? `$${Number(__props.listing.price).toLocaleString()}` : "Free")}</p>`);
      if (__props.showStatus && __props.listing.state) {
        _push(`<div class="mt-2">`);
        _push(ssrRenderComponent(_sfc_main$1, {
          status: __props.listing.state
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</a>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListingCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
