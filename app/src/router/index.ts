import { createRouter, createWebHistory, Router } from "vue-router";
import { supabase } from '@/plugins/supabase';

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/home/Home.view.vue"),
      },
      {
        path: "/Lektionen",
        name: "Lektionen",
        component: () => import("@/views/lesson/Lektionen.view.vue"),
      },
      {
        path: "/lessons/:lessonId",
        name: "LessonDetails",
        component: () => import("@/views/lesson/LessonDetails.view.vue"),
      },
      {
        path: "/szenario",
        name: "Szenario",
        component: () => import("@/views/lesson/Szenario.view.vue"),
      },
      {
        path: "/feedback",
        name: "Feedback",
        component: () => import("@/views/Feedback.view.vue"),
      },
      {
        path: "/login",
        name: "LogIn",
        component: () => import("@/views/auth/LogIn.view.vue"),
        meta: { requiresNoSession: true },
      },
      {
        path: "/signup",
        name: "SignUp",
        meta: { requiresNoSession: true },
        component: () => import("@/views/auth/SignUp.view.vue"),
      },
      {
        path: "/resetPassword",
        name: "ResetPassword",
        meta: { requiresNoSession: true },
        component: () => import("@/views/auth/ResetPassword.view.vue"),
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/home/Dashboard.view.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/auth/Profile.view.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function isAuthenticated() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session !== null;
}

router.beforeEach(async (to, from) => {
  if (
    to.name !== "Login" && to.meta.requiresAuth && !(await isAuthenticated())){
    return { name: "Home" };
  }
  if (
    to.meta.requiresNoSession && (await isAuthenticated())){
    return { name: "Home" };
  }
});

export default router;