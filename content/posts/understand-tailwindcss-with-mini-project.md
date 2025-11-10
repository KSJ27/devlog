---
title: TailwindCSS를 직접 만들어보고 동작 원리 이해하기
slug: understand-tailwindcss-with-mini-project
date: 2025-11-06 22:00
cover: cover.png
tags: [css]
---

# TailwindCSS를 직접 만들어보고 동작 원리 이해하기

## 들어가며

**TailwindCSS**로 하나의 목적만 가진 유틸리티 클래스를 조합해 간편하게 스타일링할 수 있습니다.
규칙에 맞게 클래스를 작성하면 해당 클래스에 맞는 스타일이 적용됩니다. TailwindCSS는 스타일을 어떻게 만들어 주는 걸까요?

이 글에서는 TailwindCSS를 직접 구현해보고, 그 원리를 이해하고자 합니다.

## 간단한 방법: 사전에 모든 CSS를 정의하기

유틸리티 CSS 프레임워크를 만든다면 가장 쉬운 방법으로 모든 클래스를 정의한 CSS 파일을 만드는 것을 생각해볼 수 있습니다.
예를 들어 margin 속성을 다루는 클래스를 만든다면, 아래와 같이 css를 정의할 수 있습니다.

```css
.m-0 {
  margin: 0;
}
.m-1 {
  margin: 0.25rem;
}
.m-2 {
  margin: 0.5rem;
}
/* ... m-96까지 */
```

클래스를 하나씩 정의하는게 (많이) 귀찮긴 하지만 구현 방식이 아주 간단합니다!

**하지만 다음과 같은 문제를 예측할 수 있습니다.**

1. 너무 많은 조합
   selector, properties, value, pseudo class, At-rules, ... 등 모든 CSS 규칙을 조합한다면
   수많은 경우의 수가 존재합니다.

2. 거의 사용하지 않는 클래스  
   규칙들을 조합해 가능한 모든 클래스를 만들었다고 해도, 실제 프로젝트에서 사용하는 클래스는 그 중 아주 일부입니다.
   그러면 브라우저가 읽을 CSS 파일의 크기가 불필요하게 커질 겁니다.

**그럼 사용하지 않는 클래스를 제거하면 되지 않을까요?**

[PurgeCSS](https://purgecss.com/introduction.html) 같은 도구로
프로젝트에 사용되지 않는 CSS를 제거할 수 있습니다.
하지만 개발 모드에서는 여전히 많은 CSS를 로드해야하고, 수 많은 선택자를 필터링하는데 많은 빌드 시간이 소요될 수 있습니다.

따라서 더 근본적인 해결책이 필요합니다.

## 개선하기: 사용할 CSS만 생성하기

**미리 만들지 말고, 사용할 때 만들면 어떨까요?**

소스 코드를 읽어서 실제로 사용된 클래스만 찾고, 찾은 클래스에 대해서만 CSS를 생성하면 좋을 것 같습니다.

TailwindCSS v4는 CSS를 사용하는 파일에서 클래스 이름을 찾고, 그에 맞는 스타일을 정적 CSS 파일에 작성한다고 합니다.
([출처](https://tailwindcss.com/docs/detecting-classes-in-source-files#how-classes-are-detected))

**그렇다면, 어떻게 소스 코드에서 클래스를 찾을 수 있을까요?**

DOM 트리를 순회하며 클래스 이름을 찾을 수 있을 것 같습니다.

```javascript
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

function extractClassesWithAST(code) {
  // 코드를 AST로 파싱
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const classes = new Set();

  // AST를 순회하며 className 속성 찾기
  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name === "className") {
        // 문자열 리터럴인 경우만 찾는다고 가정
        const classNames = path.node.value.value.split(/\s+/);
        classNames.forEach((cls) => classes.add(cls));
      }
    },
  });

  return Array.from(classes);
}
```

이러한 방식은 HTML/JS/JSX 문법을 파악하면서 정확하게 클래스를 추출할 수 있습니다.
하지만 코드 길이가 길어질수록 많은 연산이 필요합니다.
소스 코드에서 사용된 클래스만 확인한다는 목적에 비해 많은 연산을 하는 건 아닐까요?

### 파일을 텍스트로 다루기

TailwindCSS 팀은 클래스를 찾을 때 소스 코드를 코드가 아닌 평문으로 간주한다고 합니다.
([출처](https://tailwindcss.com/docs/detecting-classes-in-source-files#how-classes-are-detected))

## 구현하기

그렇다면 다음 순서에 따라 TailwindCSS를 구현해 볼 수 있겠습니다.

1. 파일 스캔: 프로젝트 내 모든 소스 파일(JSX, HTML 등)을 찾아 읽음
2. 클래스 추출: 각 파일에서 className 속성에 사용된 클래스명을 추출
3. CSS 생성: 추출된 클래스명을 CSS 규칙으로 변환
4. 최종 CSS 생성: 생성된 CSS를 하나의 파일로 결합

### 1. 파일 스캔

CSS를 사용하는 소스 파일을 읽습니다.
각 파일에서 필요한 작업을 수행합니다.

```javascript
import glob from "fast-glob";
import { readFileSync } from "fs";

const files = await glob(["./src/**/*.{js,jsx,ts,tsx}"]);

processFiles(files) {
  // 2. 클래스 추출하기
  const allClasses = extractClassesFromFiles(files);

  // 3. 클래스를 CSS로 변환하기
  const cssRules = generateCSSRules(allClasses);

  // 4. 최종 CSS 반환
  return combineCSS(cssRules);
}
```

### 2. 클래스 추출하기

파일에서 읽어온 문자열(content) 안에서 class="..." 또는 className="..." 형태를 찾아내고,
그 안에 포함된 개별 유틸리티 클래스 후보들을 분리하여 배열로 반환합니다

```javascript
function extractClassesFromFiles(files) {
  const allClasses = new Set();

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const classes = extractClasses(content);
    classes.forEach((cls) => allClasses.add(cls));
  });

  return allClasses;
}

function extractClasses(content) {
  const classRegex = /class(?:Name)?=["'{]([^"'}]+)["'}]/g;
  const classes = new Set();
  let match;

  while ((match = classRegex.exec(content)) !== null) {
    const classStr = match[1].replace(/\${[^}]+}/g, "");

    classStr.split(/\s+/).forEach((cls) => {
      if (cls && !cls.includes("${")) {
        classes.add(cls.trim());
      }
    });
  }

  return Array.from(classes);
}
```

### 3. 클래스를 CSS로 변환하기

유틸리티 클래스 후보들을 `.클래스 { 규칙 }` 형태로 반환해야 합니다.

1. 각 후보가 정의된 클래스 문자열 형식에 맞는지 확인
2. 맞다면, 클래스에 맞는 CSS 규칙 문자열 생성
3. `.클래스 { 규칙 }` 문자열 생성

```javascript
// margin만 확인한다고 가정
function matchUtility(className) {
  const marginCSS = matchMargin(className);
  if (marginCSS) return marginCSS;

  function matchMargin(className) {
    const match = className.match(/^m([trblxy])?-(\d+)$/);
    if (!match) return null;

    const spacing =  {
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      4: "1rem",
      8: "2rem",
    }

    const [, dir, size] = match;
    const value = spacing[size];
    if (!value) return null;

    const dirMap = { t: "top", r: "right", b: "bottom", l: "left" };

    if (!dir) return `{ margin: ${value}; }`;
    if (dir === "x")
      return `{ margin-left: ${value}; margin-right: ${value}; }`;
    if (dir === "y")
      return `{ margin-top: ${value}; margin-bottom: ${value}; }`;
    return `{ margin-${dirMap[dir]}: ${value}; }`;
  }

  return null;
}

function generateCSSRules(classes) {
  const cssRules = [];

  for (const class of classes) {
    const css = matchUtility(className);
    if (!css) continue;
    const rule = `.${className.replace(/:/g, "\\:")} ${css}`;
    cssRules.push(rule)
  }

  return cssRules;
}

```

### 4. 최종 CSS 파일 생성

```javascript
const generatedCSS = cssRules.join("\n\n");
fs.writeFileSync("path/my-tailwind.css", generatedCSS);
```

## 마무리

이 글에서는 단순한 버전의 Tailwind를 직접 만들어보며 TailwindCSS가 내부적으로 어떻게 동작하는지 알아보았습니다.

구현한 코드가 실제로 동작하는지 아래에서 확인 가능합니다.

<https://codesandbox.io/p/github/KSJ27/mini-tailwind/main?autofocus=0&embed=1&showConsole=true>
