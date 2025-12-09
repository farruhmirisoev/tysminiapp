import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _imports_0 } from './tyslogo-C9au9Osp.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AuthContainer",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-container" }, _attrs))} data-v-1f20bb49><div class="auth-content" data-v-1f20bb49><div class="auth-header" data-v-1f20bb49><img${ssrRenderAttr("src", _imports_0)} alt="TYS" class="auth-logo" data-v-1f20bb49><h2 class="auth-title" data-v-1f20bb49>${ssrInterpolate(__props.title)}</h2></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/AuthContainer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1f20bb49"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=AuthContainer-hvvudxXF.mjs.map
