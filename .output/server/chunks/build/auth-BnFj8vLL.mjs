import { m as defineNuxtRouteMiddleware, g as useAuthStore, b as useApi, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'lodash-es/sortBy.js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const api = useApi();
  const token = api.getToken();
  const isAuthenticated = !!(authStore.data || token);
  const publicRoutes = ["/signin", "/signup", "/password-recover"];
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith("/activate/");
  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo("/signin");
  }
  if (isAuthenticated && isPublicRoute && !to.path.startsWith("/activate/")) {
    return navigateTo("/");
  }
  if (token && !authStore.data && !isPublicRoute) {
    authStore.fetch().catch(() => {
      authStore.clear();
      return navigateTo("/signin");
    });
  }
});

export { auth as default };
//# sourceMappingURL=auth-BnFj8vLL.mjs.map
