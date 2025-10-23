import axios from "axios";
import { createRouter, createWebHashHistory } from "vue-router";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { useAuthStore } from "@/store/auth";
import { getToken } from "@/misc/token";
import { useEcclivoStore } from "./store/ecclivo";
import { useWorkStore } from "./store/work";
import { WorkType } from "./models/enums/enums";

async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const ecclivoStore = useEcclivoStore();

  if (authStore.data) {
    return next();
  } else if (getToken()) {
    return authStore
      .fetch()
      .then(async () => {
        await ecclivoStore.fetchMeta();
        return next();
      })
      .catch(() => next({ name: "signout" }));
  }

  return next({ name: "signin" });
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // Private views
    {
      path: "/",
      name: "home",
      redirect: { name: "main" },
      beforeEnter: authGuard,
      component: () => import("@/views/Home.vue"),
      children: [
        {
          path: "main",
          name: "main",
          component: () => import("@/views/Main.vue"),
        },
        {
          path: "calculator-list",
          name: "calculator-list",
          component: () => import("@/views/CalculatorList.vue"),
        },
        {
          path: "calculator-list/ecclivo",
          name: "calculator-ecclivo",
          component: () => import("@/views/CalculatorECCLIVO.vue"),
        },
        {
          path: "ecclivo",
          name: "ecclivo-create",
          component: () => import("@/views/ECCLIVO.vue"),
        },
        {
          path: "ecclivo/:id",
          name: "ecclivo-details",
          component: () => import("@/views/ECCLIVO.vue"),
        },
        {
          path: "osgor",
          name: "osgor-create",
          component: () => import("@/views/OsgorCreate.vue"),
        },
        {
          path: "osgor/:id",
          name: "osgor-details",
          component: () => import("@/views/OsgorCreate.vue"),
        },
        {
          path: "osgop",
          name: "osgop-create",
          component: () => import("@/views/OsgopCreate.vue"),
        },
        {
          path: "osgop/:id",
          name: "osgop-details",
          component: () => import("@/views/OsgopCreate.vue"),
        },
        {
          path: "policies-list",
          name: "policies-list",
          component: () => import("@/views/PoliciesList.vue"),
        },
        {
          path: "claims-list",
          name: "claims-list",
          component: () => import("@/views/ClaimsList.vue"),
        },
        {
          path: "claims",
          name: "claim-create",
          component: () => import("@/views/ClaimCreate.vue"),
        },
        {
          path: "claims/:id",
          name: "claim-details",
          component: () => import("@/views/ClaimCreate.vue"),
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/Profile.vue"),
        },
      ],
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/Signup.vue"),
    },
    {
      path: "/activate/:username",
      name: "activate",
      component: () => import("@/views/Activate.vue"),
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/views/Signin.vue"),
    },
    {
      path: "/password-recover",
      name: "password-recover",
      component: () => import("@/views/PasswordRecover.vue"),
    },
    {
      path: "/signout",
      name: "signout",
      redirect: () => {
        useAuthStore().clear();
        return { name: "signin" };
      },
    },

    // Public views
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("@/views/Welcome.vue"),
    },
    {
      path: "/terms-of-service",
      name: "terms-of-service",
      component: () => import("@/views/TermsOfService.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const workStore = useWorkStore();
    workStore.lazyFetch().finally(() => {
      if (
        !!workStore.getWorkService(WorkType.PAGE) &&
        to.name !== "signin" &&
        to.name !== "signout"
      ) {
        next({ name: "signout" });
      } else if (
        !!workStore.getWorkService(WorkType.PAGE) &&
        to.name === "ecclivo-create"
      ) {
        next({ name: "home" });
      } else {
        next();
      }
    });
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore().clear();
      router.push({ name: "signin" });
    }
    return Promise.reject(error);
  }
);

export default router;
