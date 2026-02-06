import { computed, ref, onMounted, resolveComponent, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-CvaWB3EK.js";
import { _ as _sfc_main$2 } from "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    cities: { type: Array, default: () => [] },
    grouped: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const urls = computed(() => page.props.urls || {});
    const mapRef = ref(null);
    const searchQuery = ref("");
    function cityUrl(slug) {
      if (typeof window === "undefined") return "#";
      const host = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      return `${window.location.protocol}//${slug}.${host}${port}`;
    }
    const filteredGrouped = computed(() => {
      const grouped = Array.isArray(props.grouped) ? props.grouped : [];
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return grouped;
      return grouped.map((grp) => ({
        ...grp,
        cities: (grp.cities || []).filter((c) => c.name && c.name.toLowerCase().includes(q) || c.slug && c.slug.toLowerCase().includes(q))
      })).filter((grp) => (grp.cities && grp.cities.length) > 0);
    });
    onMounted(async () => {
      if (typeof window === "undefined" || !mapRef.value) return;
      const cities = Array.isArray(props.cities) ? props.cities : [];
      const withCoords = cities.filter((c) => {
        if (!c || c.slug == null) return false;
        const lat = c.latitude != null ? Number(c.latitude) : NaN;
        const lng = c.longitude != null ? Number(c.longitude) : NaN;
        return !Number.isNaN(lat) && !Number.isNaN(lng);
      });
      const L = (await import("leaflet")).default;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
      });
      const map = L.map(mapRef.value).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      withCoords.forEach((city) => {
        const lat = Number(city.latitude);
        const lng = Number(city.longitude);
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<a href="${cityUrl(city.slug)}">${city.name || city.slug}</a>`);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_header_navigation_item = resolveComponent("gv-header-navigation-item");
      const _component_gv_input = resolveComponent("gv-input");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "BikesList – Cities" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="description" content="Choose a city to view local bike sales, rides, and community pages."${_scopeId}><meta property="og:title" content="BikesList – Cities"${_scopeId}><meta property="og:description" content="Choose a city to view local bike sales, rides, and community pages."${_scopeId}><meta property="og:url"${ssrRenderAttr("content", unref(page).props.seo?.currentUrl || unref(page).props.urls?.home || "/")}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", unref(page).props.seo?.currentUrl || unref(page).props.urls?.home || "/")}${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "description",
                content: "Choose a city to view local bike sales, rides, and community pages."
              }),
              createVNode("meta", {
                property: "og:title",
                content: "BikesList – Cities"
              }),
              createVNode("meta", {
                property: "og:description",
                content: "Choose a city to view local bike sales, rides, and community pages."
              }),
              createVNode("meta", {
                property: "og:url",
                content: unref(page).props.seo?.currentUrl || unref(page).props.urls?.home || "/"
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: unref(page).props.seo?.currentUrl || unref(page).props.urls?.home || "/"
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        nav: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<li class="govuk-header__navigation-item"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(`</li>`);
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: urls.value.terms || "/terms",
              text: "Terms"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
              href: urls.value.privacy || "/privacy",
              text: "Privacy"
            }, null, _parent2, _scopeId));
            if (_ctx.$page.props.auth?.user) {
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: urls.value.accountSettings || "/account/settings",
                text: "Account"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: urls.value.signIn || "/account/sign-in",
                text: "Sign in"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_gv_header_navigation_item, {
                href: urls.value.signUp || "/account/sign-up",
                text: "Sign up"
              }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
          } else {
            return [
              createVNode("li", { class: "govuk-header__navigation-item" }, [
                createVNode(_sfc_main$2)
              ]),
              createVNode(_component_gv_header_navigation_item, {
                href: urls.value.terms || "/terms",
                text: "Terms"
              }, null, 8, ["href"]),
              createVNode(_component_gv_header_navigation_item, {
                href: urls.value.privacy || "/privacy",
                text: "Privacy"
              }, null, 8, ["href"]),
              _ctx.$page.props.auth?.user ? (openBlock(), createBlock(_component_gv_header_navigation_item, {
                key: 0,
                href: urls.value.accountSettings || "/account/settings",
                text: "Account"
              }, null, 8, ["href"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode(_component_gv_header_navigation_item, {
                  href: urls.value.signIn || "/account/sign-in",
                  text: "Sign in"
                }, null, 8, ["href"]),
                createVNode(_component_gv_header_navigation_item, {
                  href: urls.value.signUp || "/account/sign-up",
                  text: "Sign up"
                }, null, 8, ["href"])
              ], 64))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"${_scopeId}><h1 class="govuk-heading-xl"${_scopeId}>BikesList</h1><p class="mt-2 text-muted"${_scopeId}>Choose a city to view sales, rides, and community pages.</p><div class="mt-8 max-w-md"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_gv_input, {
              id: "city-search",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event,
              label: "Search cities",
              type: "text",
              placeholder: "Type to filter...",
              class: "govuk-!-width-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-8 space-y-8"${_scopeId}><!--[-->`);
            ssrRenderList(filteredGrouped.value, (group, gIndex) => {
              _push2(`<!--[-->`);
              if (group.cities && group.cities.length) {
                _push2(`<section class="space-y-2"${_scopeId}><h2 class="text-lg font-semibold text-fg"${_scopeId}>${ssrInterpolate(group.country)}${ssrInterpolate(group.state_province ? ` → ${group.state_province}` : "")}</h2><ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
                ssrRenderList(group.cities, (city) => {
                  _push2(`<li${_scopeId}><a${ssrRenderAttr("href", cityUrl(city.slug))} class="block rounded-token-md border border-border bg-card px-4 py-2 shadow-sm transition hover:border-primary hover:shadow underline"${_scopeId}><span class="font-medium text-fg"${_scopeId}>${ssrInterpolate(city.name)}</span>`);
                  if (city.description) {
                    _push2(`<p class="mt-0.5 text-sm text-muted line-clamp-1"${_scopeId}>${ssrInterpolate(city.description)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</a></li>`);
                });
                _push2(`<!--]--></ul></section>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></div><div class="mt-10 h-[400px] w-full overflow-hidden rounded-token-md border border-border bg-card"${_scopeId}><div class="h-full w-full"${_scopeId}></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" }, [
                createVNode("h1", { class: "govuk-heading-xl" }, "BikesList"),
                createVNode("p", { class: "mt-2 text-muted" }, "Choose a city to view sales, rides, and community pages."),
                createVNode("div", { class: "mt-8 max-w-md" }, [
                  createVNode(_component_gv_input, {
                    id: "city-search",
                    modelValue: searchQuery.value,
                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                    label: "Search cities",
                    type: "text",
                    placeholder: "Type to filter...",
                    class: "govuk-!-width-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "mt-8 space-y-8" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredGrouped.value, (group, gIndex) => {
                    return openBlock(), createBlock(Fragment, { key: gIndex }, [
                      group.cities && group.cities.length ? (openBlock(), createBlock("section", {
                        key: 0,
                        class: "space-y-2"
                      }, [
                        createVNode("h2", { class: "text-lg font-semibold text-fg" }, toDisplayString(group.country) + toDisplayString(group.state_province ? ` → ${group.state_province}` : ""), 1),
                        createVNode("ul", { class: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(group.cities, (city) => {
                            return openBlock(), createBlock("li", {
                              key: city.id
                            }, [
                              createVNode("a", {
                                href: cityUrl(city.slug),
                                class: "block rounded-token-md border border-border bg-card px-4 py-2 shadow-sm transition hover:border-primary hover:shadow underline"
                              }, [
                                createVNode("span", { class: "font-medium text-fg" }, toDisplayString(city.name), 1),
                                city.description ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "mt-0.5 text-sm text-muted line-clamp-1"
                                }, toDisplayString(city.description), 1)) : createCommentVNode("", true)
                              ], 8, ["href"])
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ]),
                createVNode("div", { class: "mt-10 h-[400px] w-full overflow-hidden rounded-token-md border border-border bg-card" }, [
                  createVNode("div", {
                    ref_key: "mapRef",
                    ref: mapRef,
                    class: "h-full w-full"
                  }, null, 512)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
