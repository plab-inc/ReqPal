\ProvidesClass{projektarbeit}[2023/12/05 v1.0 FH Dortmund]
\LoadClass[titlepage=firstiscover, oneside, a4paper, fontsize=12pt]{scrbook}

%Packages
\RequirePackage{scrlayer-scrpage}
\RequirePackage{graphicx}
\RequirePackage{geometry}
\RequirePackage[ngerman]{babel}
\RequirePackage[hidelinks,bookmarks]{hyperref}
\RequirePackage{lipsum}
\RequirePackage[scaled]{helvet}
\RequirePackage[T1]{fontenc}
\RequirePackage[citestyle=authortitle, bibstyle=numeric, urldate=long, backend=biber]{biblatex}
\RequirePackage{microtype}
\RequirePackage{listings}
\RequirePackage{xcolor}
\RequirePackage{minted}

%Minted Einstellungen
\usemintedstyle{material}
\definecolor{bg}{HTML}{282828}
\setminted{bgcolor=bg, linenos, breaklines, baselinestretch=1, tabsize=2, fontsize=\footnotesize}

%Pfade für Grafiken
\graphicspath{ {./assets/screenshots/} }

% Bibliographie
\DeclareFieldFormat{urldate}{\mkbibparens{Zuletzt abgerufen am: #1}}
\renewbibmacro*{date}{%
  \iffieldundef{year}
  {\printtext{o. J.}}
  {\printdate}}
\addbibresource{bibliography/didactic.bib}
\addbibresource{bibliography/links.bib}
\addbibresource{bibliography/wirtschaftsinformatik.bib}

%Abschnittstitel mit Autor
\newcommand{\authoredsection}[2]{
  \ifthenelse{\equal{#1}{Fabian}}{%
    \section[#2]{#2\footnote{Autor: Fabian Teufel}}
  }{%
    \ifthenelse{\equal{#1}{Laura}}{%
      \section[#2]{#2\footnote{Autor: Laura Seifert}}
    }{%
      \section[#2]{#2\footnote{Autoren: Fabian Teufel, Laura Seifert}}
    }}
}
\newcommand{\authoredsubsection}[2]{
  \ifthenelse{\equal{#1}{Fabian}}{%
    \subsection[#2]{#2\footnote{Autor: Fabian Teufel}}
  }{%
    \ifthenelse{\equal{#1}{Laura}}{%
      \subsection[#2]{#2\footnote{Autor: Laura Seifert}}
    }{%
      \subsection[#2]{#2\footnote{Autoren: Fabian Teufel, Laura Seifert}}
    }}
}

% Einstellungen für Kopfzeile und Seitenlayout
\renewcommand\familydefault{\sfdefault}
\clearpairofpagestyles
\lohead*{\pagemark}
\ohead{\headmark}
\setlength{\parindent}{0pt}
\setcounter{tocdepth}{3}

% Umgebung für das Abstract
\newenvironment{abstract}
{% Beginn der Umgebung
  \begin{center}
    \bfseries Zusammenfassung
  \end{center}
  \begin{quote}
    \setlength{\parindent}{0pt}
    }
    {% Ende der Umgebung
  \end{quote}
}

% Befehle für Titelblatt-Parameter
\newcommand{\thesistitle}[1]{\gdef\@thesistitle{#1}}
\newcommand{\firstexaminer}[1]{\gdef\@firstexaminer{#1}}
\newcommand{\secondexaminer}[1]{\gdef\@secondexaminer{#1}}
\newcommand{\authorone}[1]{\gdef\@authorone{#1}}
\newcommand{\authortwo}[1]{\gdef\@authortwo{#1}}

% Definition von maketitle
\renewcommand{\maketitle}{
  \begin{titlepage}
    \newgeometry{left=3cm, right=3cm, top=3cm, bottom=3cm}
    \centering
    {\Large Projektarbeit \par}
    \vspace{1cm}
    {\Huge \@thesistitle \par}
    \vspace{1cm}
    {\large An der Fachhochschule Dortmund \par}
    {\large im Fachbereich Praktische Informatik \par}
    {\large erstellte Projektarbeit \par}
    {\large im Studiengang Informatik \par}
    {\large Vertiefungsrichtung: Praktische Informatik \par}
    \vspace{1cm}
    {\large \@authorone \par}
    \ifx\@authortwo\@empty\else
      {\large und \@authortwo \par}
    \fi
    \vfill
    \vspace{1cm}
    {\large Erstprüfer: \@firstexaminer \par}
    {\large Zweitprüfer: \@secondexaminer \par}
    \vspace{1cm}
    \today
    \restoregeometry
  \end{titlepage}
}