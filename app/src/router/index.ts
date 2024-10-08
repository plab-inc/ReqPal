import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    RouteLocationRaw,
    Router
} from "vue-router";
import { fetchObjectiveLevelsByUser, fetchReqPalLevelByUser } from "@/middlewares/level.ts";
import {
    requiresAuth,
    requiresModerator,
    requiresNoAuth,
    requiresPending,
    requiresStudent,
    requiresTeacher
} from "@/middlewares/auth.ts";
import { fetchCatalog, fetchCatalogs } from "@/middlewares/catalogs.ts";
import { fetchLessons, fetchQuestionsForLesson, loadLessonByUUID } from "@/middlewares/lesson.ts";
import { useUtilStore } from "@/stores/util.ts";
import { fetchProductsByUser } from "@/middlewares/product.ts";
import { fetchObjectivesByLessonOwner, fetchObjectivesByUser } from "@/middlewares/objective.ts";
import {
    fetchAchievementImages,
    fetchAchievementsByStudent,
    fetchAchievementsByUser,
    fetchReqPalAchievementImages,
    fetchReqPalAchievementsByModerator
} from "@/middlewares/achievement.ts";
import { fetchLatestTeacherRequestByUser, fetchTeacherRequests } from "@/middlewares/teacherRequest.ts";
import { fetchCurrentScenarioResults, fetchScenarioAchievements, fetchScenarios } from "@/middlewares/scenario.ts";
import { fetchStatisticsByStudent } from "@/middlewares/profile.ts";

const routes = [
    {
        path: "/",
        component: () => import("@/layouts/Default.vue"),
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/home/Home.vue")
            },
            {
                path: "/lesson",
                name: "Lesson",
                component: () => import("@/views/lesson/LessonOverview.vue"),
                meta: {
                    middleware: [
                        fetchLessons,
                        requiresTeacher
                    ]
                }
            },
            {
                path: "/lesson/builder",
                name: "LessonBuilder",
                component: () => import("@/views/lesson/LessonBuilder.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchLessons,
                        fetchObjectivesByLessonOwner
                    ]
                }
            },
            {
                path: "/lesson/:lessonUUID/teacher-overview",
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
                path: "/catalog",
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
                path: "/catalog/upload",
                name: "UploadCatalog",
                component: () => import("@/views/catalog/CatalogUpload.vue"),
                meta: {
                    middleware: [
                        requiresTeacher
                    ]
                }
            },
            {
                path: "/catalog/:catalogId",
                name: "CatalogDetails",
                component: () => import("@/views/catalog/CatalogDetail.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchCatalogs,
                        fetchCatalog,
                        fetchProductsByUser
                    ]
                }
            },
            {
                path: "/products",
                name: "Products",
                component: () => import("@/views/product/ProductOverview.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchProductsByUser
                    ]
                }
            },
            {
                path: "/objectives",
                name: "Objectives",
                component: () => import("@/views/objective/ObjectiveOverview.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchObjectivesByUser
                    ]
                }
            },
            {
                path: "/achievements",
                name: "Achievements",
                component: () => import("@/views/achievement/AchievementOverview.vue"),
                meta: {
                    middleware: [
                        requiresTeacher,
                        fetchAchievementsByUser,
                        fetchAchievementImages
                    ]
                }
            },
            {
                path: "/reqpal-achievements",
                name: "ReqPalAchievements",
                component: () => import("@/views/achievement/ReqPalAchievementOverview.vue"),
                meta: {
                    middleware: [
                        requiresModerator,
                        fetchReqPalAchievementsByModerator,
                        fetchReqPalAchievementImages
                    ]
                }
            },
            {
                path: "/scenario",
                name: "Scenario Overview",
                component: () => import("@/views/scenario/ScenarioOverview.vue"),
                meta: {
                    middleware: [
                        fetchScenarios,
                        requiresAuth
                    ]
                }
            },
            {
                path: "/scenario/builder",
                name: "Scenario Builder",
                component: () => import("@/views/scenario/ScenarioBuilder.vue"),
                meta: {
                    middleware: [
                        requiresAuth,
                        fetchLessons,
                        fetchObjectivesByLessonOwner,
                        fetchAchievementsByUser,
                    ]
                }
            },
            {
                path: "/scenario/loader",
                name: "Scenario Loader",
                component: () => import("@/views/scenario/ScenarioStepper.vue"),
                meta: {
                    middleware: [
                        requiresAuth,
                        fetchCurrentScenarioResults,
                        fetchScenarioAchievements
                    ]
                }
            },
            {
                path: "/feedback",
                name: "Feedback",
                component: () => import("@/views/user/Feedback.vue"),
                meta: {
                    middleware: [
                        requiresAuth
                    ]
                }
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
                meta: {
                    middleware: [
                        requiresNoAuth
                    ]
                }

            },
            {
                path: "/signup",
                name: "SignUp",
                component: () => import("@/views/user/SignUp.vue"),
                meta: {
                    middleware: [
                        requiresNoAuth
                    ]
                }

            },
            {
                path: "/resetPassword",
                name: "ResetPassword",
                component: () => import("@/views/user/ResetPassword.vue"),
                meta: {
                    middleware: [
                        requiresNoAuth
                    ]
                }
            },
            {
                path: "/profile/settings",
                name: "Account",
                component: () => import("@/views/user/Account.vue"),
                meta: {
                    middleware: [
                        requiresAuth
                    ]
                },
            },
            {
                path: "/profile",
                name: "Profil",
                component: () => import("@/views/user/Profile.vue"),
                meta: {
                    middleware: [
                        requiresStudent,
                        fetchReqPalLevelByUser,
                        fetchObjectiveLevelsByUser,
                        fetchAchievementsByStudent,
                        fetchStatisticsByStudent
                    ]
                },
            },
            {
                path: "/teacher-requests",
                name: "TeacherRequests",
                component: () => import("@/views/user/PendingTeacherOverview.vue"),
                meta: {
                    middleware: [
                        requiresModerator,
                        fetchTeacherRequests
                    ]
                },
            },
            {
                path: "/teacher-request",
                name: "PendingRequests",
                component: () => import("@/views/user/PendingTeacherRequest.vue"),
                meta: {
                    middleware: [
                        requiresPending,
                        fetchLatestTeacherRequestByUser
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