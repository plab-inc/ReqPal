import {DefaultsInstance} from "vuetify/lib/framework.mjs";
import {colors} from "@/utils/colors";

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
    VAvatar: {
        color: colors.slate[900],
        size: "32"
    },
    VCol: {
        cols: "12"
    }
};
