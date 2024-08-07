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
        "Sobald Sie eine Aussage auswählen, gilt sie als zutreffend. " +
        "Die Gesamtpunktzahl der Aufgabe wird gleichmäßig auf jede Antwortmöglichkeit verteilt. Für jede richtige Antwort können dementsprechend Teilpunkte erhalten werden.",
    confirmLabel: explanationConfirmation,
}

export const tfExplanation: DialogText = {
    title: "True or False Aufgabe: Erklärung",
    message: "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
        "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
        "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
        "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
        "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist. " +
        "In dieser Aufgabe kann man entweder die Gesamtpunktzahl bei richtiger Antwort erhalten oder keine Punkte bei falscher Antwort.",
    confirmLabel: explanationConfirmation,
}

export const sliderExplanation: DialogText = {
    title: "Slider Aufgabe: Erklärung",
    message: "In einer Slider Aufgabe ist das Ziel, einen Wert auszuwählen oder einzuschätzen abhängig von der gestellten Frage. " +
        "Der Slider kann mithilfe der Maus bewegt werden. Klicken Sie auf den Slider und ziehen Sie diesen nach links oder rechts. " +
        "Links wird der Wert kleiner, rechts wird dieser größer. Wählen Sie so einen Wert aus. Manchmal muss der Wert nicht 100% korrekt sein, da es einen " +
        "Toleranzbereich geben kann, je nach Aufgabe. " +
        "In dieser Aufgabe kann man entweder die Gesamtpunktzahl bei richtiger Antwort erhalten oder keine Punkte bei falscher Antwort.",
    confirmLabel: explanationConfirmation,
}

export const productQualificationExplanation: DialogText = {
    title: "Produkt Qualifizierung Aufgabe: Erklärung",
    message: "In dieser Aufgabe ist das Ziel, die angegebenen Produkte nach ihrer Qualifizierung zu bewerten. " +
        "Recherchieren Sie hierfür zunächst mithilfe der bereitgestellten Links und Kriterien oder Anforderungen. " +
        "Daraufhin können Sie mithilfe des Sliders einen Wert zwischen 1 und 5 auswählen. Der Wert 1 ist schlecht, also nicht gut geeignet, während " +
        "der Wert 5 sehr gut ist, also das Produkt eignet sich sehr gut. " +
        "Die Gesamtpunktzahl der Aufgabe wird gleichmäßig auf jedes zu bewertende Produkt verteilt. Für jede richtige Bewertung des Produkts können dementsprechend Teilpunkte erhalten werden.",
    confirmLabel: explanationConfirmation,
}

export const productQualificationTeacherExplanation: DialogText = {
    title: "Anforderung und Produkt Qualifizierung Aufgabe: Erklärung",
    message: "Hier können Sie einen von Ihnen hochgeladenen Katalog auswählen und daraufhin eine Anforderung daraus auswählen. Entweder wird die Anforderung alleine in der Lektion" +
        " angezeigt, so dass dann z.B. ein darauffolgendes Modul Bezug auf die Anforderung nehmen kann, oder Sie können hier direkt eine Produkt Qualifizierungs-Aufgabe zu der Anforderung erstellen. " +
        "In der Produkt Qualifizierungs-Aufgabe ist das Ziel, die angegebenen Produkte nach ihrer Qualifizierung zu bewerten. Wählen Sie hierfür Produkte aus dem Katalog aus. " +
        "Mithilfe der bereitgestellten Links und Anforderungen können die Lernenden dann die Produkte evaluieren. " +
        "Mit dem Slider wird ein Wert zwischen 1 und 5 ausgewählt. Der Wert 1 ist schlecht, also nicht gut geeignet, während " +
        "der Wert 5 sehr gut ist, also das Produkt eignet sich sehr gut. " +
        "Die Gesamtpunktzahl der Aufgabe wird gleichmäßig auf jedes zu bewertende Produkt verteilt. Für jede richtige Bewertung des Produkts können dementsprechend Teilpunkte erhalten werden.",
    confirmLabel: explanationConfirmation,
}

export const notesExplanation: DialogText = {
    title: "Notizen: Erklärung",
    message: "Nutzen Sie die bereitgestellten Textfelder, um sich Notizen zu Produkten, Anforderungen oder anderen Themen zu machen. " +
        "Das Textfeld besitzt einen Titel, dass Ihnen helfen kann, Ihre Gedanken direkt zu einer bestimmten Kategorie zuzuordnen. " +
        "In dem Feld 'Allgemein' können Sie frei alles notieren, was Ihnen wichtig ist oder auffällt. " +
        "Die Notizen werden nicht bewertet und bringen auch keine Punkte ein.",
    confirmLabel: explanationConfirmation,
}

export const notesTeacherExplanation: DialogText = {
    title: "Notizen: Erklärung",
    message: "Mithilfe von Textfeldern können sich Lernende Notizen beim Bearbeiten von Lektionen machen. Sie können den Notizfeldern Titel geben, " +
        "so dass die Lernenden dazu angeregt werden, sich Notizen zu bestimmten Kategorieren zu machen. " +
        "Hierbei handelt es sich um keine direkte Aufgabe, sondern nur um eine Hilfestellung für die Lernenden. " +
        "Die Notizen können nicht bewertet werden oder Punkte einbringen.",
    confirmLabel: explanationConfirmation,
}

export const dividerTeacherExplanation: DialogText = {
    title: "Trenner: Erklärung",
    message: "Mithilfe von Trennern können Sie die Lektion in verschiedene Abschnitte unterteilen. " +
        "Die Trenner können nicht bewertet werden oder Punkte einbringen.",
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
        " eine motivierende Nachricht handeln. Der Text ist unabhängig von den anderen Modulen, kann aber durch Kontext und ihrer Reihenfolge Bezug auf z.B. darauffolgende Module nehmen. " +
        "Die Textfelder können nicht bewertet werden oder Punkte einbringen.",
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

export const DeleteRequirements: DialogText = {
    title: "Requirements löschen",
    message: "Möchten Sie wirklich die ausgewählten Anforderungen löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Lektionen.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteProduct: DialogText = {
    title: "Produkt löschen",
    message: "Möchten Sie wirklich das ausgewählte Produkt löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Lektionen.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteObjective: DialogText = {
    title: "Lernziel löschen",
    message: "Möchten Sie wirklich das ausgewählte Lernziel löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Lektionen und Level der Lernenden.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteAchievement: DialogText = {
    title: "Achievement löschen",
    message: "Möchten Sie wirklich das ausgewählte Achievement löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Szenarien und Achievements der Lernenden.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteReqPalAchievement: DialogText = {
    title: "Achievement löschen",
    message: "Möchten Sie wirklich das ausgewählte ReqPal-Achievement löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte ReqPal-Achievements und Level der Lernenden.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteReqPalAchievementLevel: DialogText = {
    title: "Achievement löschen",
    message: "Möchten Sie wirklich das ausgewählte ReqPal-Achievement-Level löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte ReqPal-Achievements und Level der Lernenden.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const DeleteLesson: DialogText = {
    title: "Lektion löschen",
    message: "Möchten Sie wirklich die ausgewählte Lektion löschen? " +
        "Dies kann nicht rückgängig gemacht werden und hat möglicherweise Auswirkungen auf bereits erstellte Szenarien der Lernenden.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};


export const DeployScenarioFirstTime: DialogText = {
    title: "Szenario Veröffentlichen",
    message: "Möchten Sie das ausgewählte Szenario wirklich veröffentlichen? " +
        "Diese Aktion kann nicht rückgängig gemacht werden. Ab diesem Zeitpunkt ist das Szenario für Studierende sichtbar und kann, sofern freigegeben, gestartet werden. " +
        "Einmal von einem Studierenden gestartete Szenarien können nicht mehr bearbeitet werden. Es kann dann nur eine neue Version veröffentlicht werden." +
        "Studierende, die das Szenario dann starten, bearbeiten die neue Version. Bereits gestartete Szenarien sind von den Änderungen in der Version nicht betroffen, mit Ausnahme des Titels und der Beschreibung des Szenarios.",
    confirmLabel: "Veröffentlichen",
    cancelLabel: "Zurück"
};

export const DeployScenarioNewVersion: DialogText = {
    title: "Neue Szenario Version Veröffentlichen",
    message: "Möchten die neue Version des Szenarios wirklich veröffentlichen?" +
        "Diese Aktion kann nicht rückgängig gemacht werden." +
        "Einmal von einem Studierenden gestartete Szenarien können nicht mehr bearbeitet werden. Es kann dann nur eine weitere Version veröffentlicht werden. " +
        "Studierende, die das Szenario dann starten, bearbeiten die neue Version. Bereits gestartete Szenarien sind von den Änderungen in der Version nicht betroffen, mit Ausnahme des Titels und der Beschreibung des Szenarios. ",
    confirmLabel: "Neue Version Veröffentlichen",
    cancelLabel: "Zurück"
};

export const LockScenario: DialogText = {
    title: "Szenario Sperren",
    message: "Möchten das Szenario wirklich sperren? " +
        "Szenarios können dann nicht mehr von Studierenden gestartet werden. " +
        "Ausgenommen sind Durchläufe von Szenarien die bereits gestartet wurden. Diese können von Studierenden fortgeführt werden. ",
    confirmLabel: "Szenario Sperren",
    cancelLabel: "Zurück"
};

export const UnlockScenario: DialogText = {
    title: "Szenario Freigeben",
    message: "Möchten das Szenario wirklich freigeben? " +
        "Szenarios ab diesem Zeitpunkt von Studierenden gestartet und bearbeitet werden. " +
        "Einmal von einem Studierendem gestartete Szenarien sind von einer erneuten Sperrung ausgenommen.",
    confirmLabel: "Szenario Freigeben",
    cancelLabel: "Zurück"
};

export const DeleteScenario: DialogText = {
    title: "Szenario Freigeben",
    message: "Achtung! Möchten das Szenario wirklich löschen? " +
        "Szenarios werden unwiderruflich gelöscht und Studierende können es ggf. nicht mehr fertigstellen oder den Fortschritt einsehen." +
        "Bereits erzielte Punkte und Achievements bleiben den Studierenden allerdings erhalten.",
    confirmLabel: "Szenario Löschen",
    cancelLabel: "Zurück"
};

export const ApproveTeacherRequest: DialogText = {
    title: "Dozent-Anfrage freigeben",
    message: "Möchten Sie wirklich diese Dozenten-Anfrage freigeben? " +
        "Dadurch erhält der Nutzer Rechte und Funktionen eines Dozenten.",
    confirmLabel: "Freigeben",
    cancelLabel: "Zurück"
};

export const DeleteTeacherRequest: DialogText = {
    title: "Dozent-Anfrage löschen",
    message: "Möchten Sie wirklich diese Dozenten-Anfrage löschen? " +
        "Der Nutzer muss ansonsten erneut eine Anfrage stellen.",
    confirmLabel: "Löschen",
    cancelLabel: "Zurück"
};

export const BPMNHint: DialogText = {
    title: "Erstellen von Szenarien",
    message:
      "Damit die Diagramme gültig sind, sollten Sie für die Erstellung nur den ReqPal BPMN Modeler verwenden!\n\n" +
      "Zusätzlich gelten folgende Validierungsregeln:\n" +
      "1. Modelle müssen ein Start- und ein End-Event haben.\n" +
      "2. User- oder Service-Tasks müssen immer einer Lektion, einem Achievement oder einem Objective zugewiesen sein.\n" +
      "3. Andere BPMN-Elemente, außer den angebotenen, werden nicht unterstützt.\n" +
      "4. Bedingungen müssen eine Art und einen Auswertungsausdruck enthalten.\n\n" +
      "Weiterhin sollten folgende Hinweise beachtet werden, damit Studierende erfolgreich durch das Szenario kommen:\n" +
      "1. Schleifen sollten, wenn nicht gut durchdacht, vermieden werden.\n" +
      "2. Es sollten immer eindeutige Pfade aus den Tasks/Bedingungen herausführen.\n" +
      "3. Der Token-Simulator liefert einen guten Hinweis, ob ein Szenario ausführbar ist.\n" +
      "4. Achievements/XP-Boosts lassen sich nicht an Bedingungen binden und sind einem LessonTask zuzuordnen.\n" +
      "5. Das explizite Auswählen des Default-Flows erleichtert die lesbarkeit des Diagrams.",
    confirmLabel: "OK"
};


export const ObjectiveHint: DialogText = {
    title: "Lernziele",
    message:
      "Lernziele sind Ziele, die an Lektionen geknüpft werden können.\n" +
        "Lernende können dadurch ihre Fortschritte verfolgen für verschiedene Lernziele und für diese Erfahrungspunkte (XP) sammeln. " +
        "Dies erfolgt mithilfe von Levels, die sie pro Lernziel erhalten. Durch das maximale Level wird das Lernziel erreichbar für den Lernenden.\n\n" +
        "Lernziel Level-Grenzen:\n" +
        "Die Grenzen werden mit einer Formel automatisch berechnet und erhöhen sich jeweils um 25XP für das nächste Level.\n"+
        "So würden die ersten 4 Level z.B. so aussehen, vorausgesetzt, man startet mit Level 0:\n" +
        "\n" +
        "1. 50\n" +
        "2. 75\n" +
        "3. 100\n" +
        "4. 125\n\n" +
        "Beim Erreichen eines neuen Levels werden die XP für das Level abgezogen, die man für das nächste Level benötigt. Rest-XP werden behalten.\n" +
        "In Szenarien können Sie dann XP für einzelne oder alle Lernziele verteilen. Sie können sich demnach an dem Basiswert von 25XP orientieren und den Level-Grenzen.\n" +
    "Haben die Lernenden ihr maximales Level erreicht, so sammeln sie dennoch weiter XP und können diese in ihren Statistiken einsehen.",
    confirmLabel: "OK"
};

export const AchievementHint: DialogText = {
    title: "Achievements",
    message:
        "Achievements sind Errungenschaften, die man in Szenarien erhalten und sammeln kann.\n" +
        "Lernende erhalten beim Sammeln von Achievements 25XP für ihr ReqPal Level. Sie können das gleiche Achievement mehrmals erhalten und einsehen, wie oft sie es erhalten haben.\n" +
        "Sie können die Achievements frei definieren und z.B. an bestimmte Szenarien und Lektionen anpassen.\n" +
        "Lernende erhalten dadurch Belohnungen für ihre Fortschritte und Leistungen.",
    confirmLabel: "OK"
};

export const ReqPalHint: DialogText = {
    title: "ReqPal-Achievements",
    message:
        "ReqPal-Achievements sind Errungenschaften, die Lernende für verschiedene Aktionen auf der Lernplattform erhalten.\n" +
        "Diese sind häufig an Statistiken gebunden, aber auch an Aktionen wie die Registrierung. Sie besitzen verschiedene Stufen, die sie erreichen können.",
    confirmLabel: "OK"
};