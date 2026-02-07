import { computed, ref, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, withDirectives, vModelText, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-DMFsmESv.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import "./ApplicationLogo-D72Pm_U0.js";
import "./ThemeToggle-Mk6IgKQe.js";
const _sfc_main = {
  __name: "SavedSearches",
  __ssrInlineRender: true,
  props: {
    savedSearches: {
      type: Array,
      required: true
    },
    prefill: {
      type: Object,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const urls = computed(() => page.props.urls || {});
    const savedSearchesBaseUrl = () => urls.value.savedSearches || "/account/saved-searches";
    const showForm = ref(!!props.prefill);
    const form = ref({
      city_id: props.prefill?.city_id ?? "",
      name: props.prefill?.name ?? "",
      query: props.prefill?.query ?? { q: "", type: "", min_price: "", max_price: "" }
    });
    function searchUrl(search) {
      const base = `${window.location.protocol}//${search.city.slug}.${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
      const params = new URLSearchParams(search.query || {}).toString();
      return `${base}/for-sale${params ? "?" + params : ""}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Saved searches" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="text-xl font-semibold leading-tight text-fg"${_scopeId}>Saved searches</h2>`);
          } else {
            return [
              createVNode("h2", { class: "text-xl font-semibold leading-tight text-fg" }, "Saved searches")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl sm:px-6 lg:px-8"${_scopeId}><p class="mb-4 text-sm text-muted"${_scopeId}>Searches you save from a city For Sale page appear here. No alerts in v1.</p>`);
            if (showForm.value || __props.prefill) {
              _push2(`<div class="mb-6 rounded-lg border border-border bg-card p-4"${_scopeId}><h3 class="font-medium text-fg"${_scopeId}>Add saved search</h3><form${ssrRenderAttr("action", savedSearchesBaseUrl())} method="post" class="mt-3 space-y-2"${_scopeId}><input type="hidden" name="_token"${ssrRenderAttr("value", _ctx.$page.props.csrf_token)}${_scopeId}><input type="hidden" name="city_id"${ssrRenderAttr("value", form.value.city_id)}${_scopeId}><input type="hidden" name="query[q]"${ssrRenderAttr("value", form.value.query.q)}${_scopeId}><input type="hidden" name="query[type]"${ssrRenderAttr("value", form.value.query.type)}${_scopeId}><input type="hidden" name="query[min_price]"${ssrRenderAttr("value", form.value.query.min_price)}${_scopeId}><input type="hidden" name="query[max_price]"${ssrRenderAttr("value", form.value.query.max_price)}${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-fg"${_scopeId}>Name</label><input${ssrRenderAttr("value", form.value.name)} type="text" name="name" required class="mt-1 block w-full rounded-md border-border bg-input text-fg shadow-sm"${_scopeId}></div><button type="submit" class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"${_scopeId}>Save</button>`);
              if (__props.prefill) {
                _push2(`<button type="button" class="ml-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-fg hover:opacity-90"${_scopeId}>Cancel</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</form></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<ul class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.savedSearches, (search) => {
              _push2(`<li class="flex items-center justify-between rounded-lg border border-border bg-card p-4"${_scopeId}><div${_scopeId}><a${ssrRenderAttr("href", searchUrl(search))} class="font-medium text-primary hover:opacity-90"${_scopeId}>${ssrInterpolate(search.name)}</a><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(search.city?.name)}</p></div><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: savedSearchesBaseUrl() + "/" + search.id,
                method: "delete",
                as: "button",
                class: "text-sm text-danger hover:opacity-90"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Delete`);
                  } else {
                    return [
                      createTextVNode("Delete")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></li>`);
            });
            _push2(`<!--]--></ul>`);
            if (__props.savedSearches.length === 0) {
              _push2(`<p class="text-muted"${_scopeId}>No saved searches. Save a search from a city For Sale page.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "py-12" }, [
                createVNode("div", { class: "mx-auto max-w-7xl sm:px-6 lg:px-8" }, [
                  createVNode("p", { class: "mb-4 text-sm text-muted" }, "Searches you save from a city For Sale page appear here. No alerts in v1."),
                  showForm.value || __props.prefill ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-6 rounded-lg border border-border bg-card p-4"
                  }, [
                    createVNode("h3", { class: "font-medium text-fg" }, "Add saved search"),
                    createVNode("form", {
                      action: savedSearchesBaseUrl(),
                      method: "post",
                      class: "mt-3 space-y-2"
                    }, [
                      createVNode("input", {
                        type: "hidden",
                        name: "_token",
                        value: _ctx.$page.props.csrf_token
                      }, null, 8, ["value"]),
                      createVNode("input", {
                        type: "hidden",
                        name: "city_id",
                        value: form.value.city_id
                      }, null, 8, ["value"]),
                      createVNode("input", {
                        type: "hidden",
                        name: "query[q]",
                        value: form.value.query.q
                      }, null, 8, ["value"]),
                      createVNode("input", {
                        type: "hidden",
                        name: "query[type]",
                        value: form.value.query.type
                      }, null, 8, ["value"]),
                      createVNode("input", {
                        type: "hidden",
                        name: "query[min_price]",
                        value: form.value.query.min_price
                      }, null, 8, ["value"]),
                      createVNode("input", {
                        type: "hidden",
                        name: "query[max_price]",
                        value: form.value.query.max_price
                      }, null, 8, ["value"]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-fg" }, "Name"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => form.value.name = $event,
                          type: "text",
                          name: "name",
                          required: "",
                          class: "mt-1 block w-full rounded-md border-border bg-input text-fg shadow-sm"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.value.name]
                        ])
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"
                      }, "Save"),
                      __props.prefill ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "ml-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-fg hover:opacity-90",
                        onClick: ($event) => {
                          showForm.value = false;
                          form.value = { city_id: "", name: "", query: {} };
                        }
                      }, "Cancel", 8, ["onClick"])) : createCommentVNode("", true)
                    ], 8, ["action"])
                  ])) : createCommentVNode("", true),
                  createVNode("ul", { class: "space-y-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.savedSearches, (search) => {
                      return openBlock(), createBlock("li", {
                        key: search.id,
                        class: "flex items-center justify-between rounded-lg border border-border bg-card p-4"
                      }, [
                        createVNode("div", null, [
                          createVNode("a", {
                            href: searchUrl(search),
                            class: "font-medium text-primary hover:opacity-90"
                          }, toDisplayString(search.name), 9, ["href"]),
                          createVNode("p", { class: "text-sm text-muted" }, toDisplayString(search.city?.name), 1)
                        ]),
                        createVNode("div", { class: "flex gap-2" }, [
                          createVNode(unref(Link), {
                            href: savedSearchesBaseUrl() + "/" + search.id,
                            method: "delete",
                            as: "button",
                            class: "text-sm text-danger hover:opacity-90"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Delete")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]);
                    }), 128))
                  ]),
                  __props.savedSearches.length === 0 ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-muted"
                  }, "No saved searches. Save a search from a city For Sale page.")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/SavedSearches.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
