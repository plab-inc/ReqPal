import { Scenario, ScenarioProgress } from "@/types/scenario";
import { defineStore } from "pinia";
import ScenarioService from "@/services/database/scenario";
import { useLessonStore } from "@/stores/lesson";
import { InvokeItemResponse, StartWorkflowResponse } from "@/types/bpmn";
import { invokeItem, startWorkflow } from "@/services/api/process";
import { useUtilStore } from "@/stores/util";
import { BpmnProcessError } from "@/errors/custom.ts";
import router from "@/router/index.ts";

export interface Step {
  title: string;
  lessonId?: string;
  startStep: boolean;
  placeholderStep: boolean;
  endStep: boolean;
  completed: boolean;
}

interface StepperState {
  scenario: Scenario | undefined;
  currentLessonId: string | undefined;
  currentStep: number;
  lessonSteps: Step[];
  isStarted: boolean;
  isCompleted: boolean;
}

export const useStepperStore = defineStore("stepper", {
  state: (): StepperState => ({
    scenario: undefined,
    currentLessonId: undefined,
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
        { title: "Results", startStep: false, placeholderStep: false, endStep: true, completed: state.isCompleted }
      ];
    },
    getCurrentStep(state): Step {
      return this.allSteps[state.currentStep];
    },
    getStepIcon: (state) => (step: Step) => {
      if (step.startStep) return "mdi-play";
      if (step.placeholderStep) return "mdi-help";
      if (step.endStep) return "mdi-flag-checkered";
      return "mdi-book-open";
    },
    getStepColor: (state) => (step: Step) => {
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
    },
    async initializeSteps() {
      this.lessonSteps = [];
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
          const response: StartWorkflowResponse = await startWorkflow(this.scenario.id);
          this.currentLessonId = response.lessonId;
          this.isStarted = true;
          await this.loadInLesson().then(this.addLessonStep);
          this.currentStep++;
        } catch (error) {
          throw new BpmnProcessError("Es gab ein Problem das Szenario zu starten.");
        } finally {
          utilStore.stopLoadingBar();
        }
      }
    },

    async nextStep() {
      const utilStore = useUtilStore();
      if (this.scenario && !this.getCurrentStep.endStep) {
        try {
          utilStore.startLoadingBar();
          const response: InvokeItemResponse = await invokeItem(this.scenario.id, { "question_1": false });
          if (response.nextLessonId) {
            this.currentLessonId = response.nextLessonId;
            await this.loadInLesson().then(this.addLessonStep);
            this.currentStep++;
            if (this.currentStep === this.scenario.lessonsCount) this.removePlaceholderStep();
          } else {
            this.completeScenario();
          }
        } catch (error) {
          await router.push({ path: "/error" });
          throw new BpmnProcessError("Es gab ein Problem das Szenario fortzuführen.");
        } finally {
          utilStore.stopLoadingBar();
        }
      }
    },

    async fetchScenarioProgress() {
      const scenarioProgress = await ScenarioService.fetchScenarioProgressByScenario("2118957a-8e6d-46b7-937f-0567da10cb22");
      if (scenarioProgress) {
        this.loadScenarioProgress(scenarioProgress).then(() => {
          this.initializeSteps();
          this.loadInLesson();
        });
      }
    },

    async loadInLesson() {
      if (this.currentLessonId) {
        const lessonStore = useLessonStore();
        await lessonStore.fetchQuestionsWithLesson(this.currentLessonId);
      }
    },

    addPreviousLessons(count: number) {
      for (let i = 0; i < count; i++) {
        this.lessonSteps.push({
          title: `Lesson ${i + 1}`,
          startStep: false,
          placeholderStep: true,
          endStep: false,
          completed: true
        });
      }
    },

    addLessonStep() {
      this.lessonSteps.push({
        title: `Lesson ${this.currentStep + 1}`,
        startStep: false,
        placeholderStep: false,
        endStep: false,
        completed: false,
        lessonId: this.currentLessonId
      });
    },

    completeScenario() {
      this.isCompleted = true;
      this.removePlaceholderStep();
      this.currentStep = this.allSteps.length - 1;
    },

    removePlaceholderStep() {
      this.allSteps.splice(this.allSteps.length - 2, 1);
    },
  }
});
