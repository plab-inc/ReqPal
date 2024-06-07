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
    message: "In einer Slider Aufgabe ist das Ziel, einen Wert auszuwählen oder einzuschätzen abhängig von der gestellten Frage. " +
        "Der Slider kann mithilfe der Maus bewegt werden. Klicken Sie auf den Slider und ziehen Sie diesen nach links oder rechts. " +
        "Links wird der Wert kleiner, rechts wird dieser größer. Wählen Sie so einen Wert aus. Manchmal muss der Wert nicht 100% korrekt sein, da es einen " +
        "Toleranzbereich geben kann, je nach Aufgabe."
    ,
    confirmLabel: explanationConfirmation,
}

export const productQualificationExplanation: DialogText = {
    title: "Produkt Qualifizierung Aufgabe: Erklärung",
    message: "In dieser Aufgabe ist das Ziel, die angegebenen Produkte nach ihrer Qualifizierung zu bewerten. " +
        "Recherchieren Sie hierfür zunächst mithilfe der bereitgestellten Links und Kriterien oder Anforderungen. " +
        "Daraufhin können Sie mithilfe des Sliders einen Wert zwischen 1 und 5 auswählen. Der Wert 1 ist schlecht, also nicht gut geeignet, während " +
        "der Wert 5 sehr gut ist, also das Produkt eignet sich sehr gut."
    ,
    confirmLabel: explanationConfirmation,
}

export const productQualificationTeacherExplanation: DialogText = {
    title: "Anforderung und Produkt Qualifizierung Aufgabe: Erklärung",
    message: "Hier können Sie einen von Ihnen hochgeladenen Katalog auswählen und daraufhin eine Anforderung daraus auswählen. Entweder wird die Anforderung alleine in der Lektion" +
        " angezeigt, so dass dann z.B. ein darauffolgendes Modul Bezug auf die Anforderung nehmen kann, oder Sie können hier direkt eine Produkt Qualifizierungs-Aufgabe zu der Anforderung erstellen. " +
        "In der Produkt Qualifizierungs-Aufgabe ist das Ziel, die angegebenen Produkte nach ihrer Qualifizierung zu bewerten. Wählen Sie hierfür Produkte aus dem Katalog aus. " +
        "Mthilfe der bereitgestellten Links und Anforderungen können die Lernenden dann die Produkte evaluieren. " +
        "Mit dem Slider wird ein Wert zwischen 1 und 5 ausgewählt. Der Wert 1 ist schlecht, also nicht gut geeignet, während " +
        "der Wert 5 sehr gut ist, also das Produkt eignet sich sehr gut."
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

export const notesTeacherExplanation: DialogText = {
    title: "Notizen: Erklärung",
    message: "Mithilfe von Textfeldern können sich Lernende Notizen beim Bearbeiten von Lektionen machen. Sie können den Notizfeldern Titel geben, " +
        "so dass die Lernenden dazu angeregt werden, sich Notizen zu bestimmten Kategorieren zu machen. " +
        "Hierbei handelt es sich um keine direkte Aufgabe, sondern nur um eine Hilfestellung für die Lernenden.",
    confirmLabel: explanationConfirmation,
}

export const dividerTeacherExplanation: DialogText = {
    title: "Trenner: Erklärung",
    message: "Mithilfe von Trennern können Sie die Lektion in verschiedene Abschnitte unterteilen. ",
    confirmLabel: explanationConfirmation,
}

export const productExplanation: DialogText = {
    title: "Produkte: Erklärung",
    message: "In diesem Bereich finden Sie Produkte, die für den weiteren Verlauf dieser Lektion oder für konkrete Aufgaben relevant sein können. " +
        "Betrachten Sie sich die Produkte und klicken Sie bei Bedarf von weiteren Informationen auf das Produkt. " +
        "Sie werden dann zu einer hilfreichen Website oder der offiziellen Website des Produkts weitergeleitet.",
    confirmLabel: explanationConfirmation,
}

export const textfieldExplanation: DialogText = {
    title: "Textfeld: Erklärung",
    message: "Hier können Sie einen Text eingeben, welcher in der Lektion dann angezeigt wird. Es kann sich dabei um eine Erklärung, einen Hinweis, eine Aufgabenstellung oder" +
        " eine motivierende Nachricht handeln. Der Text ist unabhängig von den anderen Modulen, kann aber durch Kontext und ihrer Reihenfolge Bezug auf z.B. darauffolgende Module nehmen.",
    confirmLabel: explanationConfirmation,
}

export const LessonFinished: DialogText = {
    title: "Lektion beenden",
    message: "Möchten Sie wirklich die Lektion beenden und Ihre Lösungen einreichen? Die Lösungen können dann nicht mehr verändert werden.",
    confirmLabel: "Ja",
    cancelLabel: "Nein"
}

export const LessonReset: DialogText = {
    title: "Lektion zurücksetzen",
    message: "Möchten Sie wirklich die Lektion zurücksetzen und Ihre eingereichten Antworten löschen? " +
        "Die Lösungen können dann nicht mehr eingesehen werden. Sie können keine weiteren Punkte dazuverdienen, aber die Lektion " +
        "zu Übungszwecken erneut bearbeiten. Ihre gesammelten Punkte behalten Sie trotzdem.",
    confirmLabel: "Ja",
    cancelLabel: "Nein"
}

export const DeleteRequirement: DialogText = {
    title: "Requirement löschen",
    message: "Möchten Sie wirklich die ausgewählte Anforderung löschen? " +
      "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Lektionen.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};



