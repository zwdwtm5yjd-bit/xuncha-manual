export interface Subsection {
  id: string;
  title: string;
  content: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  subsections: Subsection[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  isHighlight: boolean;
  intro: string;
  sections: Section[];
}

export interface ManualData {
  title: string;
  preface: string;
  chapters: Chapter[];
}
