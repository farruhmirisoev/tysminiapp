import { _ as __nuxt_component_0 } from './AuthContainer-hvvudxXF.mjs';
import { defineComponent, ref, computed, resolveDirective, mergeProps, withCtx, unref, createVNode, toDisplayString, withModifiers, createTextVNode, withDirectives, vModelText, createBlock, createCommentVNode, openBlock, Transition, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrGetDirectiveProps, ssrGetDynamicModelProps, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { l as useRoute, h as useRouter, g as useAuthStore, c as useI18n, u as useHead } from './server.mjs';
import { mask, tokens } from 'maska';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './tyslogo-C9au9Osp.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import 'lodash-es/sortBy.js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const INTERVAL = 180;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[username]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const { t } = useI18n();
    const smsCode = ref("");
    const interval = ref(INTERVAL);
    const username = computed(() => route.params.username);
    const formattedPhone = computed(
      () => mask(username.value, "+998(##)###-##-##", tokens)
    );
    const resending = computed(() => authStore.resending);
    const handleActivate = async () => {
      try {
        await authStore.activate(username.value, smsCode.value);
        await router.push("/signin");
      } catch (error) {
        console.error("[Activate] Activation failed:", error);
      }
    };
    const handleResend = async () => {
      try {
        await authStore.resendCode(username.value);
        interval.value = INTERVAL;
      } catch (error) {
        console.error("[Activate] Resend code failed:", error);
      }
    };
    useHead({
      title: t("auth.activate")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthContainer = __nuxt_component_0;
      const _directive_maska = resolveDirective("maska");
      let _temp0;
      _push(ssrRenderComponent(_component_AuthContainer, mergeProps({
        title: _ctx.$t("auth.activate")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="auth-info-text" data-v-13816cb4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.smsSent", { phone: formattedPhone.value }))}</div><form class="auth-form" data-v-13816cb4${_scopeId}><label class="auth-label" data-v-13816cb4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.smsCode"))} * <input${ssrRenderAttrs((_temp0 = mergeProps({
              value: smsCode.value,
              class: "auth-input",
              maxlength: "4",
              required: ""
            }, ssrGetDirectiveProps(_ctx, _directive_maska, "####")), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, smsCode.value))))} data-v-13816cb4${_scopeId}></label><button type="button" class="auth-resend-button"${ssrIncludeBooleanAttr(resending.value || interval.value > 0) ? " disabled" : ""} data-v-13816cb4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.resendSms"))} `);
            if (interval.value) {
              _push2(`<span data-v-13816cb4${_scopeId}>(${ssrInterpolate(interval.value)})</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
            if (unref(authStore).activateError) {
              _push2(`<div class="auth-error" data-v-13816cb4${_scopeId}>${ssrInterpolate(unref(authStore).activateError)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit" class="auth-button"${ssrIncludeBooleanAttr(unref(authStore).activating || unref(authStore).resending || smsCode.value.length < 4) ? " disabled" : ""} data-v-13816cb4${_scopeId}>`);
            if (unref(authStore).activating || unref(authStore).resending) {
              _push2(`<span class="spinner" data-v-13816cb4${_scopeId}></span>`);
            } else {
              _push2(`<span data-v-13816cb4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.activateButton"))}</span>`);
            }
            _push2(`</button></form>`);
          } else {
            return [
              createVNode("div", { class: "auth-info-text" }, toDisplayString(_ctx.$t("auth.smsSent", { phone: formattedPhone.value })), 1),
              createVNode("form", {
                class: "auth-form",
                onSubmit: withModifiers(handleActivate, ["prevent"])
              }, [
                createVNode("label", { class: "auth-label" }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.smsCode")) + " * ", 1),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => smsCode.value = $event,
                    class: "auth-input",
                    maxlength: "4",
                    required: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, smsCode.value],
                    [_directive_maska, "####"]
                  ])
                ]),
                createVNode("button", {
                  type: "button",
                  class: "auth-resend-button",
                  disabled: resending.value || interval.value > 0,
                  onClick: handleResend
                }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.resendSms")) + " ", 1),
                  interval.value ? (openBlock(), createBlock("span", { key: 0 }, "(" + toDisplayString(interval.value) + ")", 1)) : createCommentVNode("", true)
                ], 8, ["disabled"]),
                createVNode(Transition, { name: "fade" }, {
                  default: withCtx(() => [
                    unref(authStore).activateError ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "auth-error"
                    }, toDisplayString(unref(authStore).activateError), 1)) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode("button", {
                  type: "submit",
                  class: "auth-button",
                  disabled: unref(authStore).activating || unref(authStore).resending || smsCode.value.length < 4
                }, [
                  unref(authStore).activating || unref(authStore).resending ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "spinner"
                  })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(_ctx.$t("auth.activateButton")), 1))
                ], 8, ["disabled"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/activate/[username].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _username_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-13816cb4"]]);

export { _username_ as default };
//# sourceMappingURL=_username_-euyYs4oa.mjs.map
