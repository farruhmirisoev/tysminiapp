import { _ as __nuxt_component_0 } from './AuthContainer-hvvudxXF.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-T9a4B72R.mjs';
import { defineComponent, ref, resolveDirective, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, withModifiers, createBlock, createCommentVNode, withDirectives, vModelText, openBlock, vModelDynamic, Transition, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrGetDirectiveProps, ssrGetDynamicModelProps, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { g as useAuthStore, h as useRouter, c as useI18n, u as useHead } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "password-recover",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18n();
    const recoveryCodeReceived = ref(false);
    const username = ref("+998");
    const password = ref("");
    const smsCode = ref("");
    const showPassword = ref(false);
    const handleSubmit = async () => {
      if (recoveryCodeReceived.value) {
        try {
          await authStore.recoverPassword(
            username.value.replace(/[+()-]/g, ""),
            password.value,
            smsCode.value
          );
          await router.push("/signin");
        } catch (error) {
          console.error("[PasswordRecover] Recover password failed:", error);
        }
      } else {
        try {
          await authStore.sendRecoveryCode(username.value.replace(/[+()-]/g, ""));
          recoveryCodeReceived.value = true;
        } catch (error) {
          console.error("[PasswordRecover] Send recovery code failed:", error);
        }
      }
    };
    useHead({
      title: t("auth.recover")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthContainer = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _directive_maska = resolveDirective("maska");
      let _temp0, _temp1;
      _push(ssrRenderComponent(_component_AuthContainer, mergeProps({
        title: _ctx.$t("auth.recover")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="auth-form" data-v-f282b9c4${_scopeId}><label class="auth-label" data-v-f282b9c4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.phoneNumber"))} <input${ssrRenderAttrs((_temp0 = mergeProps({
              value: username.value,
              class: "auth-input",
              type: "tel",
              disabled: recoveryCodeReceived.value,
              required: ""
            }, ssrGetDirectiveProps(_ctx, _directive_maska, "+998(##)###-##-##")), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, username.value))))} data-v-f282b9c4${_scopeId}></label>`);
            if (recoveryCodeReceived.value) {
              _push2(`<label class="auth-label" data-v-f282b9c4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.password"))} <div class="password-input-wrapper" data-v-f282b9c4${_scopeId}><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="auth-input" required minlength="6" data-v-f282b9c4${_scopeId}><button type="button" class="password-toggle" data-v-f282b9c4${_scopeId}><i class="${ssrRenderClass([showPassword.value ? "bx-hide" : "bx-show", "bx"])}" data-v-f282b9c4${_scopeId}></i></button></div></label>`);
            } else {
              _push2(`<!---->`);
            }
            if (recoveryCodeReceived.value) {
              _push2(`<label class="auth-label" data-v-f282b9c4${_scopeId}>${ssrInterpolate(_ctx.$t("auth.confirmationCode"))} <input${ssrRenderAttrs((_temp1 = mergeProps({
                value: smsCode.value,
                class: "auth-input",
                maxlength: "4",
                required: ""
              }, ssrGetDirectiveProps(_ctx, _directive_maska, "####")), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, smsCode.value))))} data-v-f282b9c4${_scopeId}></label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="auth-link-wrapper" data-v-f282b9c4${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "auth-link",
              to: "/signin"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("auth.signIn"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("auth.signIn")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(authStore).sendRecoveryCodeError) {
              _push2(`<div class="auth-error" data-v-f282b9c4${_scopeId}>${ssrInterpolate(unref(authStore).sendRecoveryCodeError)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(authStore).recoverPasswordError) {
              _push2(`<div class="auth-error" data-v-f282b9c4${_scopeId}>${ssrInterpolate(unref(authStore).recoverPasswordError)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit" class="auth-button"${ssrIncludeBooleanAttr(
              recoveryCodeReceived.value ? !password.value || !smsCode.value || unref(authStore).recoveringPassword : !username.value || unref(authStore).sendingRecoveryCode
            ) ? " disabled" : ""} data-v-f282b9c4${_scopeId}>`);
            if (unref(authStore).sendingRecoveryCode || unref(authStore).recoveringPassword) {
              _push2(`<span class="spinner" data-v-f282b9c4${_scopeId}></span>`);
            } else {
              _push2(`<span data-v-f282b9c4${_scopeId}>${ssrInterpolate(recoveryCodeReceived.value ? _ctx.$t("auth.changePassword") : _ctx.$t("auth.sendSms"))}</span>`);
            }
            _push2(`</button></form>`);
          } else {
            return [
              createVNode("form", {
                class: "auth-form",
                onSubmit: withModifiers(handleSubmit, ["prevent"])
              }, [
                createVNode("label", { class: "auth-label" }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.phoneNumber")) + " ", 1),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => username.value = $event,
                    class: "auth-input",
                    type: "tel",
                    disabled: recoveryCodeReceived.value,
                    required: ""
                  }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                    [vModelText, username.value],
                    [_directive_maska, "+998(##)###-##-##"]
                  ])
                ]),
                recoveryCodeReceived.value ? (openBlock(), createBlock("label", {
                  key: 0,
                  class: "auth-label"
                }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.password")) + " ", 1),
                  createVNode("div", { class: "password-input-wrapper" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => password.value = $event,
                      type: showPassword.value ? "text" : "password",
                      class: "auth-input",
                      required: "",
                      minlength: "6"
                    }, null, 8, ["onUpdate:modelValue", "type"]), [
                      [vModelDynamic, password.value]
                    ]),
                    createVNode("button", {
                      type: "button",
                      class: "password-toggle",
                      onClick: ($event) => showPassword.value = !showPassword.value
                    }, [
                      createVNode("i", {
                        class: ["bx", showPassword.value ? "bx-hide" : "bx-show"]
                      }, null, 2)
                    ], 8, ["onClick"])
                  ])
                ])) : createCommentVNode("", true),
                recoveryCodeReceived.value ? (openBlock(), createBlock("label", {
                  key: 1,
                  class: "auth-label"
                }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.confirmationCode")) + " ", 1),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => smsCode.value = $event,
                    class: "auth-input",
                    maxlength: "4",
                    required: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, smsCode.value],
                    [_directive_maska, "####"]
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "auth-link-wrapper" }, [
                  createVNode(_component_NuxtLink, {
                    class: "auth-link",
                    to: "/signin"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.$t("auth.signIn")), 1)
                    ]),
                    _: 1
                  })
                ]),
                createVNode(Transition, { name: "fade" }, {
                  default: withCtx(() => [
                    unref(authStore).sendRecoveryCodeError ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "auth-error"
                    }, toDisplayString(unref(authStore).sendRecoveryCodeError), 1)) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(Transition, { name: "fade" }, {
                  default: withCtx(() => [
                    unref(authStore).recoverPasswordError ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "auth-error"
                    }, toDisplayString(unref(authStore).recoverPasswordError), 1)) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode("button", {
                  type: "submit",
                  class: "auth-button",
                  disabled: recoveryCodeReceived.value ? !password.value || !smsCode.value || unref(authStore).recoveringPassword : !username.value || unref(authStore).sendingRecoveryCode
                }, [
                  unref(authStore).sendingRecoveryCode || unref(authStore).recoveringPassword ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "spinner"
                  })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(recoveryCodeReceived.value ? _ctx.$t("auth.changePassword") : _ctx.$t("auth.sendSms")), 1))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/password-recover.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const passwordRecover = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f282b9c4"]]);

export { passwordRecover as default };
//# sourceMappingURL=password-recover-BrUdTVFx.mjs.map
