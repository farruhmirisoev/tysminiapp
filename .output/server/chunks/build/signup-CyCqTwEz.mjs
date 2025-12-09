import { _ as __nuxt_component_0 } from './AuthContainer-hvvudxXF.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-T9a4B72R.mjs';
import { defineComponent, ref, computed, resolveDirective, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, withModifiers, withDirectives, vModelText, vModelDynamic, vModelCheckbox, Transition, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderClass, ssrGetDirectiveProps, ssrGetDynamicModelProps, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18n();
    const agree = ref(false);
    const username = ref("+998");
    const password = ref("");
    const showPassword = ref(false);
    const phone = computed(() => username.value.replace(/[+()-]/g, ""));
    const isValid = computed(
      () => agree.value && phone.value.length === 12 && password.value.length >= 6
    );
    const handleSignUp = async () => {
      try {
        await authStore.signUp(phone.value, password.value);
        await router.push(`/activate/${phone.value}`);
      } catch (error) {
        console.error("[Signup] Sign up failed:", error);
      }
    };
    useHead({
      title: t("auth.signup")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthContainer = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _directive_maska = resolveDirective("maska");
      let _temp0;
      _push(ssrRenderComponent(_component_AuthContainer, mergeProps({
        title: _ctx.$t("auth.signup")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="auth-link-text" data-v-6781b20a${_scopeId}>${ssrInterpolate(_ctx.$t("auth.hasAccount"))} `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "auth-link",
              to: "/signin"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("auth.login"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("auth.login")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.$t("auth.toStart"))}</div><form class="auth-form" data-v-6781b20a${_scopeId}><label class="auth-label" data-v-6781b20a${_scopeId}>${ssrInterpolate(_ctx.$t("auth.phoneNumber"))} * <input${ssrRenderAttrs((_temp0 = mergeProps({
              value: username.value,
              class: "auth-input",
              type: "tel",
              required: ""
            }, ssrGetDirectiveProps(_ctx, _directive_maska, "+998(##)###-##-##")), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, username.value))))} data-v-6781b20a${_scopeId}></label><label class="auth-label" data-v-6781b20a${_scopeId}>${ssrInterpolate(_ctx.$t("auth.password"))} * <div class="password-input-wrapper" data-v-6781b20a${_scopeId}><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="auth-input" required minlength="6" data-v-6781b20a${_scopeId}><button type="button" class="password-toggle" data-v-6781b20a${_scopeId}><i class="${ssrRenderClass([showPassword.value ? "bx-hide" : "bx-show", "bx"])}" data-v-6781b20a${_scopeId}></i></button></div></label><label class="auth-checkbox-label" data-v-6781b20a${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(agree.value) ? ssrLooseContain(agree.value, null) : agree.value) ? " checked" : ""} type="checkbox" class="auth-checkbox" required data-v-6781b20a${_scopeId}><span data-v-6781b20a${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "auth-link",
              to: "/terms"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("auth.agreeTerms"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("auth.agreeTerms")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span></label>`);
            if (unref(authStore).signUpError) {
              _push2(`<div class="auth-error" data-v-6781b20a${_scopeId}>${ssrInterpolate(unref(authStore).signUpError)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit" class="auth-button"${ssrIncludeBooleanAttr(unref(authStore).signingUp || !isValid.value) ? " disabled" : ""} data-v-6781b20a${_scopeId}>`);
            if (unref(authStore).signingUp) {
              _push2(`<span class="spinner" data-v-6781b20a${_scopeId}></span>`);
            } else {
              _push2(`<span data-v-6781b20a${_scopeId}>${ssrInterpolate(_ctx.$t("auth.signup"))}</span>`);
            }
            _push2(`</button></form>`);
          } else {
            return [
              createVNode("div", { class: "auth-link-text" }, [
                createTextVNode(toDisplayString(_ctx.$t("auth.hasAccount")) + " ", 1),
                createVNode(_component_NuxtLink, {
                  class: "auth-link",
                  to: "/signin"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.$t("auth.login")), 1)
                  ]),
                  _: 1
                }),
                createTextVNode(" " + toDisplayString(_ctx.$t("auth.toStart")), 1)
              ]),
              createVNode("form", {
                class: "auth-form",
                onSubmit: withModifiers(handleSignUp, ["prevent"])
              }, [
                createVNode("label", { class: "auth-label" }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.phoneNumber")) + " * ", 1),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => username.value = $event,
                    class: "auth-input",
                    type: "tel",
                    required: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, username.value],
                    [_directive_maska, "+998(##)###-##-##"]
                  ])
                ]),
                createVNode("label", { class: "auth-label" }, [
                  createTextVNode(toDisplayString(_ctx.$t("auth.password")) + " * ", 1),
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
                ]),
                createVNode("label", { class: "auth-checkbox-label" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => agree.value = $event,
                    type: "checkbox",
                    class: "auth-checkbox",
                    required: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelCheckbox, agree.value]
                  ]),
                  createVNode("span", null, [
                    createVNode(_component_NuxtLink, {
                      class: "auth-link",
                      to: "/terms"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("auth.agreeTerms")), 1)
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode(Transition, { name: "fade" }, {
                  default: withCtx(() => [
                    unref(authStore).signUpError ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "auth-error"
                    }, toDisplayString(unref(authStore).signUpError), 1)) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode("button", {
                  type: "submit",
                  class: "auth-button",
                  disabled: unref(authStore).signingUp || !isValid.value
                }, [
                  unref(authStore).signingUp ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "spinner"
                  })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(_ctx.$t("auth.signup")), 1))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const signup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6781b20a"]]);

export { signup as default };
//# sourceMappingURL=signup-CyCqTwEz.mjs.map
