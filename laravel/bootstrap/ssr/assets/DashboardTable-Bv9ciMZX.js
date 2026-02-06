import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./StatusTag-BeNLpE6N.js";
const _sfc_main = {
  __name: "DashboardTable",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, required: true },
    columns: { type: Array, required: true },
    showUrlFn: { type: Function, required: true },
    editUrlFn: { type: Function, required: true },
    statusKey: { type: String, default: "state" }
  },
  setup(__props) {
    const props = __props;
    const cellValue = (item, col) => {
      if (col.key === props.statusKey) return null;
      return col.format ? col.format(item) : item[col.key] ?? "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_gv_table = resolveComponent("gv-table");
      const _component_gv_table_head = resolveComponent("gv-table-head");
      const _component_gv_table_row = resolveComponent("gv-table-row");
      const _component_gv_table_header = resolveComponent("gv-table-header");
      const _component_gv_table_body = resolveComponent("gv-table-body");
      const _component_gv_table_cell = resolveComponent("gv-table-cell");
      _push(ssrRenderComponent(_component_gv_table, mergeProps({ class: "govuk-!-margin-top-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_gv_table_head, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_gv_table_row, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(__props.columns, (col) => {
                          _push4(ssrRenderComponent(_component_gv_table_header, {
                            key: col.key,
                            class: col.key === "_actions" ? "govuk-table__header--numeric" : ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(col.label)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(col.label), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col) => {
                            return openBlock(), createBlock(_component_gv_table_header, {
                              key: col.key,
                              class: col.key === "_actions" ? "govuk-table__header--numeric" : ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(col.label), 1)
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_gv_table_row, null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col) => {
                          return openBlock(), createBlock(_component_gv_table_header, {
                            key: col.key,
                            class: col.key === "_actions" ? "govuk-table__header--numeric" : ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(col.label), 1)
                            ]),
                            _: 2
                          }, 1032, ["class"]);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_gv_table_body, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.items, (item) => {
                    _push3(ssrRenderComponent(_component_gv_table_row, {
                      key: item.id
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(__props.columns, (col, idx) => {
                            _push4(ssrRenderComponent(_component_gv_table_cell, {
                              key: col.key,
                              class: col.key === "_actions" ? "govuk-table__cell--numeric" : ""
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (col.key === "_actions") {
                                    _push5(`<a${ssrRenderAttr("href", __props.editUrlFn(item))} class="govuk-link"${_scopeId4}>Edit</a>`);
                                  } else if (idx === 0) {
                                    _push5(`<a${ssrRenderAttr("href", __props.showUrlFn(item))} class="govuk-link"${_scopeId4}>${ssrInterpolate(item[col.key])}</a>`);
                                  } else if (col.key === __props.statusKey) {
                                    _push5(ssrRenderComponent(_sfc_main$1, {
                                      status: item[__props.statusKey]
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!--[-->${ssrInterpolate(cellValue(item, col))}<!--]-->`);
                                  }
                                } else {
                                  return [
                                    col.key === "_actions" ? (openBlock(), createBlock("a", {
                                      key: 0,
                                      href: __props.editUrlFn(item),
                                      class: "govuk-link"
                                    }, "Edit", 8, ["href"])) : idx === 0 ? (openBlock(), createBlock("a", {
                                      key: 1,
                                      href: __props.showUrlFn(item),
                                      class: "govuk-link"
                                    }, toDisplayString(item[col.key]), 9, ["href"])) : col.key === __props.statusKey ? (openBlock(), createBlock(_sfc_main$1, {
                                      key: 2,
                                      status: item[__props.statusKey]
                                    }, null, 8, ["status"])) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                      createTextVNode(toDisplayString(cellValue(item, col)), 1)
                                    ], 64))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col, idx) => {
                              return openBlock(), createBlock(_component_gv_table_cell, {
                                key: col.key,
                                class: col.key === "_actions" ? "govuk-table__cell--numeric" : ""
                              }, {
                                default: withCtx(() => [
                                  col.key === "_actions" ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: __props.editUrlFn(item),
                                    class: "govuk-link"
                                  }, "Edit", 8, ["href"])) : idx === 0 ? (openBlock(), createBlock("a", {
                                    key: 1,
                                    href: __props.showUrlFn(item),
                                    class: "govuk-link"
                                  }, toDisplayString(item[col.key]), 9, ["href"])) : col.key === __props.statusKey ? (openBlock(), createBlock(_sfc_main$1, {
                                    key: 2,
                                    status: item[__props.statusKey]
                                  }, null, 8, ["status"])) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                    createTextVNode(toDisplayString(cellValue(item, col)), 1)
                                  ], 64))
                                ]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                      return openBlock(), createBlock(_component_gv_table_row, {
                        key: item.id
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col, idx) => {
                            return openBlock(), createBlock(_component_gv_table_cell, {
                              key: col.key,
                              class: col.key === "_actions" ? "govuk-table__cell--numeric" : ""
                            }, {
                              default: withCtx(() => [
                                col.key === "_actions" ? (openBlock(), createBlock("a", {
                                  key: 0,
                                  href: __props.editUrlFn(item),
                                  class: "govuk-link"
                                }, "Edit", 8, ["href"])) : idx === 0 ? (openBlock(), createBlock("a", {
                                  key: 1,
                                  href: __props.showUrlFn(item),
                                  class: "govuk-link"
                                }, toDisplayString(item[col.key]), 9, ["href"])) : col.key === __props.statusKey ? (openBlock(), createBlock(_sfc_main$1, {
                                  key: 2,
                                  status: item[__props.statusKey]
                                }, null, 8, ["status"])) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                  createTextVNode(toDisplayString(cellValue(item, col)), 1)
                                ], 64))
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_gv_table_head, null, {
                default: withCtx(() => [
                  createVNode(_component_gv_table_row, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col) => {
                        return openBlock(), createBlock(_component_gv_table_header, {
                          key: col.key,
                          class: col.key === "_actions" ? "govuk-table__header--numeric" : ""
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(col.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["class"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_gv_table_body, null, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                    return openBlock(), createBlock(_component_gv_table_row, {
                      key: item.id
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.columns, (col, idx) => {
                          return openBlock(), createBlock(_component_gv_table_cell, {
                            key: col.key,
                            class: col.key === "_actions" ? "govuk-table__cell--numeric" : ""
                          }, {
                            default: withCtx(() => [
                              col.key === "_actions" ? (openBlock(), createBlock("a", {
                                key: 0,
                                href: __props.editUrlFn(item),
                                class: "govuk-link"
                              }, "Edit", 8, ["href"])) : idx === 0 ? (openBlock(), createBlock("a", {
                                key: 1,
                                href: __props.showUrlFn(item),
                                class: "govuk-link"
                              }, toDisplayString(item[col.key]), 9, ["href"])) : col.key === __props.statusKey ? (openBlock(), createBlock(_sfc_main$1, {
                                key: 2,
                                status: item[__props.statusKey]
                              }, null, 8, ["status"])) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                createTextVNode(toDisplayString(cellValue(item, col)), 1)
                              ], 64))
                            ]),
                            _: 2
                          }, 1032, ["class"]);
                        }), 128))
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DashboardTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
