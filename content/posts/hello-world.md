---
title: Velite를 활용해 정적 블로그 만들기
slug: hello-world
date: 1992-02-25 13:22
cover: cover.png
tags: [velite, blog]
---

# Velite를 활용해 정적 블로그 만들기

## 들어가며

개발자로서 내 블로그의 콘텐츠를 직접 관리하고 싶어 블로그를 직접 만들기로 했다. 글은 마크다운 파일이고, 배포는 깃 커밋 한 번이면 끝.
콘텐츠를 버전 관리할 수 있고, 플랫폼이 바뀌어도 내 글이 사라질 걱정이 없다.

개발자 입장에서 블로그를 제작하기 전, 기술을 선택하고 활용하는데 있어서 도움이 될 것이다.

## Next.js와 Velite를 선택한 이유

### Next.js

가장 친숙한 프레임워크이다. 정적 블로그는 서버가 없어도 배포 가능한 구조가 핵심이다. 빌드 후 정적 배포가 가능하다.
페이지 라우팅, 메타데이터, OB 이미지 생성까지 하나의 패턴으로 정리된다.

### Velite

Next.js만으로도 정적 블로그를 만들 수 있지만, 콘텐츠 관리는 별개의 문제다.
마크다운 파일을 직접 읽고 메타데이터를 관리하려면

## 사용 방법

[공식 문서](https://velite.js.org/guide/quick-start)를 참고했다.

과정은 다음과 같다.

1. 콘텐츠의 스키마를 정의하고, 그에 맞게 파일을 빌드한다.
2. 빌드된 파일을 프로젝트에 불러온다.

### 1. Collections 정의하기

프로젝트 루트에 구성 파일을 생성한다.

```javascript title="velite.config.js" caption="hello"
import { defineConfig, s } from 'velite'

export default defineConfig({
  collections: {
    posts: { // 콘텐츠의 종류이다. RDBMS의 table과 같다.
      name: 'Post', // collection type name
      pattern: 'posts/**/*.md', // glob pattern으로 읽어들일 콘텐츠 파일의 경로를 정의한다.
      schema: s // 기본적으로 Zod를 확장한 's'라는 스키마를 사용한다.
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.path(), // auto generate slug from file path
          date: s.isodate(), // input Date-like string, output ISO Date string.
          cover: s.image(), // input image relative path, output image object with blurImage.
          video: s.file().optional(), // input file relative path, output file public path.
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          excerpt: s.excerpt(), // excerpt of markdown content
          content: s.markdown() // transform markdown to html
        })
        // .object()로 정의한 스키마를 변환해 필드를 재정의하거나 새로운 필드를 만든다. 
        .transform(data => ({ ...data, permalink: `/blog/${data.slug}` }))
    }
  }
});
```

### 2. 콘텐츠 파일 만들기

`content` 디렉토리를 생성해 파일을 저장한다.

```diff
 root
+├── content
+│   └── posts
+│       └── hello-world.md
+│       └── cover.jpg
+│       └── image.png
 ├── public
 ├── package.json
 └── velite.config.js
```

```md title="content/posts/hello-world.md"
---
title: Hello world
slug: hello-world
date: 1992-02-25 13:22
cover: cover.jpg
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse

![some image](image.png)
```

### 3. 파일 변환하기

```sh title="shell"
npx velite
```

### 4. 파일 사용하기

ㄴㅇ
