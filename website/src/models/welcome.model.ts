export interface Content {
  [index: string]: string;
}

export interface FAQ {
  id: number;
  order: number;
  question: Content;
  answer: Content;
}

export interface Welcome {
  faq: FAQ[];
}
