import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized, RouteLocationRaw,
    Router
} from "vue-router";

import { requiresAuth } from "@/middlewares/auth.middleware";
import {fetchLessonById, fetchLessons} from "@/middlewares/lessons.middleware";

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
                path: "/lessons",
                name: "AllLessons",
                component: () => import("@/views/lesson/Lessons.view.vue"),
                meta: {
                    middleware: [
                        fetchLessons
                    ]
                }
            },
            {
                path: "/lessons/:lessonId",
                name: "LessonDetails",
                component: () => import("@/views/lesson/LessonDetails.view.vue"),
                meta: {
                    middleware: [
                        fetchLessonById
                    ]
                }
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
            },
            {
                path: "/signup",
                name: "SignUp",
                component: () => import("@/views/auth/SignUp.view.vue"),
            },
            {
                path: "/resetPassword",
                name: "ResetPassword",
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
                meta: {
                    middleware: [
                        requiresAuth
                    ]
                },
            },
            {
                path: "/error",
                name: "Error",
                component: () => import("@/views/Error.view.vue"),
            },
            {
                path: "/:pathMatch(.*)*",
                name: "Error",
                component: () => import("@/views/Error.view.vue"),
            }
        ],
    },
];

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middlewares = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
        return runMiddleware(middlewares, to, from, next);
    }

    return next();
});

function runMiddleware(middlewares: Function[], to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const [middleware, ...rest] = middlewares;

    if (!middleware) {
        return next();
    }

    middleware(to, from, (nextRoute: RouteLocationRaw | undefined) => {
        runMiddleware(rest, to, from, nextRoute ? () => next(nextRoute) : next);
    });
}

export default router;