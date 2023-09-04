import {DefaultsInstance} from "vuetify/lib/framework.mjs";

export const defaults: DefaultsInstance = {
    VAppBar: {
        elevation: 3,
        color: "primary",
    },
    VTabs: {
        color: "primary"
    },
    VTab: {
        elevation: 0,
        ripple: false,
        variant: "plain",
    },
    VTextField: {
        color: "primary",
        variant: "solo-filled",
        density: "comfortable",
    },
    VCol: {
        cols: "12"
    }
};
