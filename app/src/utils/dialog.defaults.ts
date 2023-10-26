export type DialogText = {
    title: string,
    message: string,
    confirmLabel: string,
    cancelLabel?: string
}

const explanationConfirmation: string = "Verstanden!";

export const mcExplanation: DialogText = {
    title: "Multiple Choice Aufgabe: Erklärung",
    message: "In einer Multiple-Choice-Aufgabe ist das Ziel, alle Aussagen auszuwählen, die auf die zuvor gestellte Frage zutreffen. " +
        "Sie haben die Möglichkeit, mehrere oder auch keine Aussagen auszuwählen. " +
        "Bitte lesen Sie die Frage sorgfältig durch und überlegen Sie, welche Aussagen wahr und welche falsch sind. " +
        "Sobald Sie eine Aussage auswählen, gilt sie als zutreffend.",
    confirmLabel: explanationConfirmation,
}

export const tfExplanation: DialogText = {
    title: "True or False Aufgabe: Erklärung",
    message: "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
        "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
        "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
        "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
        "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist.",
    confirmLabel: explanationConfirmation,
}

export const sliderExplanation: DialogText = {
    title: "Slider Aufgabe: Erklärung",
    message: "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
        "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
        "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
        "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
        "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist."
    ,
    confirmLabel: explanationConfirmation,
}


export const notesExplanation: DialogText = {
    title: "Notizen: Erklärung",
    message: "Nutzen Sie die bereitgestellten Textfelder, um sich Notizen zu Produkten, Anforderungen oder anderen Themen zu machen. " +
        "Das Textfeld besitzt einen Titel, dass Ihnen helfen kann, Ihre Gedanken direkt zu einer bestimmten Kategorie zuzuordnen. " +
        "In dem Feld 'Allgemein' können Sie frei alles notieren, was Ihnen wichtig ist oder auffällt.",
    confirmLabel: explanationConfirmation,
}

export const productExplanation: DialogText = {
    title: "Produkte: Erklärung",
    message: "In diesem Bereich finden Sie Produkte, die für den weiteren Verlauf dieser Lektion oder für konkrete Aufgaben relevant sein können. " +
        "Betrachten Sie sich die Produkte und klicken Sie bei Bedarf von weiteren Informationen auf das Produkt. " +
        "Sie werden dann zu einer hilfreichen Website oder der offiziellen Website des Produkts weitergeleitet.",
    confirmLabel: explanationConfirmation,
}

export const LessonFinished: DialogText = {
    title: "Lektion beenden",
    message: "Möchten Sie wirklich die Lektion beenden und Ihre Lösungen einreichen? Die Lösungen können dann nicht mehr verändert werden.",
    confirmLabel: "Lektion beenden",
    cancelLabel: "Zurück zur Lektion"
}

export const LessonReset: DialogText = {
    title: "Lektion zurücksetzen",
    message: "Möchten Sie wirklich die Lektion zurücksetzen und Ihre eingereichten Antworten löschen? " +
        "Die Lösungen können dann nicht mehr eingesehen werden. Ihre gesammelten Punkte behalten Sie trotzdem.",
    confirmLabel: "Lektion zurücksetzen",
    cancelLabel: "Zurück zur Lektion"
}



