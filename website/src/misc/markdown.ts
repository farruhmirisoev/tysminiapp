import { marked } from "marked";

export function markdown(text: string) {
  const renderer = new marked.Renderer();
  const htmlText = marked(text, { renderer, breaks: true });

  return htmlText;
}

export default {
  markdown,
};
