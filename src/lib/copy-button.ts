// https://github.com/rehype-pretty/rehype-pretty-code/blob/master/packages/transformers/src/copy-button.ts
// 위 소스 코드를 참고했습니다.
import type { ShikiTransformer } from "shiki";

const whitespaceRegEx = /\s*\n\s*/g;

export const trimWhitespace = (input: string) =>
  input.replaceAll(whitespaceRegEx, "").trim();

interface CopyButtonOptions {
  feedbackDuration?: number;
  copyIcon?: string;
  successIcon?: string;
  visibility?: "hover" | "always";
}

/**
 * A transformer that adds a copy button to code blocks.
 * @param {Object} options - Options for the copy button behavior and appearance.
 * @param {number} options.feedbackDuration - The duration in milliseconds to show the success icon after copying.
 * @param {string} options.copyIcon - Either data URL svg or inline svg for the copy icon.
 * @param {string} options.successIcon - Either data URL svg or inline svg for the success icon.
 * @returns A Shiki transformer.
 *
 * find icons at https://icones.js.org - copy the "Data URL" and paste it as the value of `copyIcon` and/or `successIcon`.
 *
 * @example
 * ```ts
 * import { codeToHtml } from 'shiki'
 * import { transformerCopyButton } from '@rehype-pretty/copy-button'
 *
 * const html = await codeToHtml(`console.log('hello, world')`, {
 *   lang: 'ts',
 *   theme: 'houston',
 *   transformers: [
 *     transformerCopyButton({
 *       visibility: 'always',
 *       feedbackDuration: 2_000,
 *     }),
 *   ],
 * })
 * ```
 */
export function transformerCopyButton(
  options: CopyButtonOptions = {
    visibility: "hover",
    feedbackDuration: 3_000,
  }
): ShikiTransformer {
  return {
    name: "@rehype-pretty/transformers/copy-button",
    code(node) {
      node.children.push({
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          data: this.source,
          title: "Copy code",
          "aria-label": "Copy code",
          class: "rehype-pretty-copy",
          "data-name": "rehype-pretty-copy-button",
          onclick: trimWhitespace(/* javascript */ `
            navigator.clipboard.writeText(this.attributes.data.value);
            this.classList.add('rehype-pretty-copied');
            window.setTimeout(() => this.classList.remove('rehype-pretty-copied'), ${options.feedbackDuration});
          `),
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { class: "ready" },
            children: [],
          },
          {
            type: "element",
            tagName: "span",
            properties: { class: "success" },
            children: [],
          },
        ],
      });
      node.children.push({
        type: "element",
        tagName: "style",
        properties: {},
        children: [
          {
            type: "text",
            value: copyButtonStyle({
              visibility: options.visibility,
            }),
          },
        ],
      });
    },
  };
}

function copyButtonStyle({
  visibility = "hover",
}: {
  visibility?: "hover" | "always";
} = {}) {
  const copyIcon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-clipboard-icon lucide-clipboard'%3E%3Crect width='8' height='4' x='8' y='2' rx='1' ry='1'/%3E%3Cpath d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/%3E%3C/svg%3E";
  const successIcon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23009689' d='M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z'/%3E%3C/svg%3E";
  const copyIconDark =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a1a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-clipboard-icon lucide-clipboard'%3E%3Crect width='8' height='4' x='8' y='2' rx='1' ry='1'/%3E%3Cpath d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/%3E%3C/svg%3E";
  const successIconDark =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2300bc7d' d='M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z'/%3E%3C/svg%3E";

  let copyButtonStyle = /* css */ `
    :root {
      --copy-icon: url("${copyIcon}");
      --success-icon: url("${successIcon}");
    }

    html.dark {
      --copy-icon: url("${copyIconDark}");
      --success-icon: url("${successIconDark}");
    } 

    pre:has(code) {
      position: relative;
    }

    button[data='<span>'] {
      width: 0;
      height: 0;
      display: none;
      visibility: hidden;
    }

    pre button.rehype-pretty-copy {
      top: 16px;
      right: 16px;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      position: absolute;
      border-radius: 25%;
      & span {
        width: 100%;
        aspect-ratio: 1 / 1;
      }
      & .ready {
        background-image: var(--copy-icon);
      }
      & .success {
        display: none; background-image: var(--success-icon);
      }
    }

    &.rehype-pretty-copied { 
      & .success { 
        display: block;
      } & .ready {
        display: none;
      }
    }

    pre button.rehype-pretty-copy.rehype-pretty-copied {
      opacity: 1;
      & .ready { display: none; }
      & .success { display: block; }
    }
`;

  if (visibility === "hover") {
    copyButtonStyle += /* css */ `
        pre button.rehype-pretty-copy { opacity: 0; }
        figure[data-rehype-pretty-code-figure]:hover > pre > code button.rehype-pretty-copy {
          opacity: 1;
        }
      `;
  }
  return trimWhitespace(copyButtonStyle);
}
