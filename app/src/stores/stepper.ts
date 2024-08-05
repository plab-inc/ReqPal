import { Scenario, ScenarioProgress } from "@/types/scenario";
import { defineStore } from "pinia";
import { useLessonStore } from "@/stores/lesson";
import { invokeItem, startWorkflow } from "@/services/api/process";
import { useUtilStore } from "@/stores/util";
import { BpmnProcessError } from "@/errors/custom.ts";
import router from "@/router/index.ts";
import { QuestionAnswer } from "@/types/lesson.ts";
import { useScenarioStatisticStore } from "@/stores/scenarioStatistic.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";

export interface Step {
  title: string;
  lessonId?: string;
  startStep: boolean;
  placeholderStep: boolean;
  endStep: boolean;
  completed: boolean;
}

interface StepperState {
  scenario?: Scenario;
  currentLessonId?: string;
  currentLessonAnswers?: QuestionAnswer[];
  currentStep: number;
  lessonSteps: Step[];
  isStarted: boolean;
  isCompleted: boolean;
}

export const useStepperStore = defineStore("stepper", {
  state: (): StepperState => ({
    scenario: undefined,
    currentLessonId: undefined,
    currentLessonAnswers: undefined,
    currentStep: 0,
    lessonSteps: [],
    isStarted: false,
    isCompleted: false
  }),
  getters: {
    allSteps(state: StepperState): Step[] {
      return [
        { title: "Start", startStep: true, placeholderStep: false, endStep: false, completed: state.isStarted },
        ...state.lessonSteps,
        { title: "", startStep: false, placeholderStep: true, endStep: false, completed: false },
        { title: "Ergebnisse", startStep: false, placeholderStep: false, endStep: true, completed: state.isCompleted }
      ];
    },
    getCurrentStep(state): Step {
      return this.allSteps[state.currentStep];
    },
    getStepIcon: () => (step: Step) => {
      if (step.startStep) return "mdi-play";
      if (step.placeholderStep) return "mdi-help";
      if (step.endStep) return "mdi-flag-checkered";
      return "mdi-book-open";
    },
    getStepColor: () => (step: Step) => {
      if (step.startStep) return "info";
      if (step.placeholderStep) return "secondary";
      if (step.endStep) return "success";
      return "primary";
    }
  },
  actions: {
    async loadScenarioProgress(scenarioProgress: ScenarioProgress) {
      this.scenario = scenarioProgress.scenario;
      this.currentStep = scenarioProgress.currentStep;
      this.currentLessonId = scenarioProgress.currentLessonId;
      this.isStarted = scenarioProgress.started;
      this.isCompleted = scenarioProgress.ended;
      this.currentLessonAnswers = scenarioProgress.currentLessonAnswers;
    },
    async initializeSteps() {
      this.lessonSteps = [];

      if (this.isCompleted) {
        this.addPreviousLessons(this.currentStep - 1);
        this.removePlaceholderStep();
        return;
      }

      if (this.currentStep > 1) {
        this.addPreviousLessons(this.currentStep - 1);
      }
      if (this.currentStep) {
        this.addLessonStep();
      }
    },
    async start() {
      const utilStore = useUtilStore();
      if (this.currentStep === 0 && this.scenario) {
        try {
          utilStore.startLoadingBar();
          const response = await startWorkflow(this.scenario.id);
          this.currentLessonId = response.lessonId;
          this.isStarted = true;
          this.currentStep++;
          await this.loadInLesson();
          this.addLessonStep();
        } catch (error) {
          throw new BpmnProcessError("Es gab ein Problem das Szenario zu starten.");
        } finally {
          utilStore.stopLoadingBar();
        }
      }
    },
    async continue(scenarioProgress: ScenarioProgress) {
      const utilStore = useUtilStore();
      try {
        utilStore.startLoadingBar();
        await this.loadScenarioProgress(scenarioProgress);
        await this.initializeSteps();
        await this.loadInLesson();
        await this.loadInAnswers();
      } catch (error) {
        throw new BpmnProcessError("Es gab ein Problem das Szenario zu fortzuführen.");
      } finally {
        utilStore.stopLoadingBar();
      }
    },
    async nextStep(lessonAnswers: QuestionAnswer[]) {
      const utilStore = useUtilStore();
      const statisticStore = useScenarioStatisticStore();
      if (this.scenario && !this.getCurrentStep.endStep) {
        try {
          utilStore.startLoadingBar();
          const response = await invokeItem(this.scenario.id, lessonAnswers);
          if (response.nextLessonId) {
            this.currentLessonId = response.nextLessonId;
            await statisticStore.fetchCurrentScenarioStatistic(this.scenario);
            this.currentStep++;
            await this.loadInLesson();
            this.addLessonStep();
          } else {
            await this.completeScenario();
          }
        } catch (error) {
          await router.push({ path: "/error" });
          throw new BpmnProcessError("Es gab ein Problem das Szenario fortzuführen.");
        } finally {
          utilStore.stopLoadingBar();
        }
      }
    },
    async loadInLesson() {
      if (this.currentLessonId) {
        const lessonStore = useLessonStore();
        await lessonStore.fetchLessonWithQuestions(this.currentLessonId);
      }
    },
    async loadInAnswers() {
      if (this.currentLessonAnswers) {
        const lessonStore = useLessonStore();
        await lessonStore.loadInUserAnswers(this.currentLessonAnswers);
        this.currentLessonAnswers = undefined;
      }
    },
    async saveLessonAnswers(lessonAnswers: QuestionAnswer[]) {
      const authStore = useAuthStore();
      if (this.scenario && authStore.user?.id) {
        await ScenarioService.push.saveLessonAnswersInProgress(this.scenario, authStore.user?.id, lessonAnswers);
      }
    },
    addPreviousLessons(count: number) {
      for (let i = 0; i < count; i++) {
        this.lessonSteps.push({
          title: `Lektion ${i + 1}`,
          startStep: false,
          placeholderStep: false,
          endStep: false,
          completed: true
        });
      }
    },
    addLessonStep() {
      this.lessonSteps.push({
        title: `Lesson ${this.currentStep}`,
        startStep: false,
        placeholderStep: false,
        endStep: false,
        completed: false,
        lessonId: this.currentLessonId
      });
    },
    async completeScenario() {
      const scenarioStatisticStore = useScenarioStatisticStore();
      if (this.scenario) {
        await scenarioStatisticStore.fetchCurrentScenarioStatistic(this.scenario);
        await scenarioStatisticStore.fetchCurrentLessonResultsForCurrentScenario();
      }
      this.isCompleted = true;
      this.removePlaceholderStep();
      this.currentStep = this.allSteps.length - 1;
    },
    removePlaceholderStep() {
      this.allSteps.splice(this.allSteps.length - 2, 1);
    },
  }
});