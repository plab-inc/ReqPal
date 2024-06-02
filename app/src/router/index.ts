import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    RouteLocationRaw,
    Router
} from "vue-router";

import {requiresAuth, requiresStudent, requiresTeacher} from "@/middlewares/auth.ts";
import {fetchCatalogs} from "@/middlewares/catalogs.ts";
import {
    fetchLessons,
    fetchQuestionsForLesson,
    fetchUserAnswersForQuestions,
    fetchUserProgressForLesson,
    loadLessonByUUID,
    loadQuestionsWithSolutions,
    requiresFinishedLesson,
    requiresUnfinishedLesson
} from "@/middlewares/lesson.ts";
import {useUtilStore} from "@/stores/util.ts";

const routes = [
    {
        path: "/",
        component: () => import("@/layouts/Default.vue"),
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/home/Home.vue"),
                meta: {
                    middleware: [
                        fetchLessons
                    ]
                }
            },
            {
                path: "/lessons",
                name: "Lessons",
                component: () => import("@/views/lesson/LessonOverview.vue"),
                meta: {
                    middleware: [
                        fetchLessons
                    ]
                }
            },
            {
                path: "/builder",
                name: "LessonBuilder",
                component: () => import("@/views/lesson/LessonBuilder.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchLessons
                    ]
                }
            },
            {
                path: "/lessons/:lessonUUID",
                name: "LessonDetails",
                component: () => import("@/views/lesson/LessonDetailsStudent.vue"),
                meta: {
                    middleware: [
                        requiresStudent,
                        requiresUnfinishedLesson,
                        loadLessonByUUID,
                        fetchQuestionsForLesson,
                        fetchUserProgressForLesson
                    ]
                }
            },
            {
                path: "/lessons/:lessonUUID/results",
                name: "LessonResults",
                component: () => import("@/views/lesson/LessonResults.vue"),
                meta: {
                    middleware: [
                        requiresStudent,
                        loadLessonByUUID,
                        requiresFinishedLesson,
                        loadQuestionsWithSolutions,
                        fetchUserAnswersForQuestions
                    ]
                }
            },
            {
                path: "/lessons/:lessonUUID/teacher-overview",
                name: "LessonTeacherOverview",
                component: () => import("@/views/lesson/LessonDetailsTeacher.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        loadLessonByUUID,
                        fetchQuestionsForLesson
                    ]
                }
            },
            {
                path: "/catalogs",
                name: "Catalogs",
                component: () => import("@/views/catalog/CatalogOverview.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchCatalogs
                    ]
                }
            },
            {
                path: "/catalogs/upload",
                name: "UploadCatalog",
                component: () => import("@/views/catalog/CatalogUpload.vue"),
                meta: {}
            },
            {
                path: "/catalogs/:catalogId",
                name: "CatalogDetails",
                component: () => import("@/views/catalog/CatalogDetail.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                    ]
                }
            },
            {
                path: "/modeler",
                name: "BPMN Modeler",
                component: () => import("@/views/bpmn/Modeler.vue"),
                meta: {
                    middleware: [
                        fetchLessons
                    ]
                }
            },
            {
                path: "/feedback",
                name: "Feedback",
                component: () => import("@/views/user/Feedback.vue"),
            },
            {
                path: "/legal",
                name: "Legal",
                component: () => import("@/views/user/Legal.vue"),
            },
            {
                path: "/login",
                name: "LogIn",
                component: () => import("@/views/user/LogIn.vue"),
            },
            {
                path: "/signup",
                name: "SignUp",
                component: () => import("@/views/user/SignUp.vue"),
            },
            {
                path: "/resetPassword",
                name: "ResetPassword",
                component: () => import("@/views/user/ResetPassword.vue"),
            },
            {
                path: "/account",
                name: "Account",
                component: () => import("@/views/user/Account.vue"),
                meta: {
                    middleware: [
                        requiresAuth
                    ]
                },
            },
            {
                path: "/error",
                name: "Error",
                component: () => import("@/views/util/Error.vue"),
            },
            {
                path: "/:pathMatch(.*)*",
                name: "Error",
                component: () => import("@/views/util/Error.vue"),
            }
        ],
    },
];

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const utilStore = useUtilStore();
    utilStore.startLoadingBar();

    if (to.meta.middleware) {
        const middlewares = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
        return runMiddleware(middlewares, to, from, next);
    }

    return next();
});

router.afterEach((to, from) => {
    const utilStore = useUtilStore();
    utilStore.stopLoadingBar();
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