import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    RouteParamValue,
    Router
} from "vue-router";
import {supabase} from '@/plugins/supabase';
import {useLessonStore} from "@/stores/lesson.store";

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
                beforeEnter: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
                    try {
                        await fetchLessons();
                        next();
                    } catch (error) {
                        next("/error");
                    }
                },
            },
            {
                path: "/lessons/:lessonId",
                name: "LessonDetails",
                component: () => import("@/views/lesson/LessonDetails.view.vue"),
                beforeEnter: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
                    const lessonId = to.params.lessonId;
                    try {
                        const lessonData = await fetchLessonById(lessonId);
                        if (!lessonData) {
                            next("/error");
                            return;
                        }
                        next();
                    } catch (error) {
                        next("/error");
                    }
                },
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
                meta: {requiresNoSession: true},
            },
            {
                path: "/signup",
                name: "SignUp",
                meta: {requiresNoSession: true},
                component: () => import("@/views/auth/SignUp.view.vue"),
            },
            {
                path: "/resetPassword",
                name: "ResetPassword",
                meta: {requiresNoSession: true},
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
                meta: {requiresAuth: true},
            },
            {
                path: "/error",
                name: "Error",
                component: () => import("@/views/Error.view.vue"),
                meta: {requiresNoSession: true},
            },
            {
                path: "/:pathMatch(.*)*",
                name: "Error",
                component: () => import("@/views/Error.view.vue"),
                meta: {requiresNoSession: true},
            }
        ],
    },
];

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

async function isAuthenticated() {
    const {data, error} = await supabase.auth.getSession();
    if (error) throw error;
    return data.session !== null;
}

router.beforeEach(async (to, from) => {
    if (
        to.name !== "Login" && to.meta.requiresAuth && !(await isAuthenticated())) {
        return {name: "Home"};
    }
    if (
        to.meta.requiresNoSession && (await isAuthenticated())) {
        return {name: "Home"};
    }
});

async function fetchLessons() {
    console.log("Fetching lessons before entering the view...")
    const lessonStore = useLessonStore();
    return lessonStore.fetchLessons();
}

async function fetchLessonById(lessonId: string | RouteParamValue[]) {
    console.log("Fetching lesson before entering the view...")
    const lessonStore = useLessonStore();
    await lessonStore.fetchLessonById(<string>lessonId);
    if (lessonStore.currentLesson) {
        await lessonStore.fetchQuestionsForLesson(<string>lessonId);
    }
    return lessonStore.currentLesson;
}

export default router;