# 🦞 하네스 공부 도우미 (harness-study-helper)

**가재코드(gajae-code)**로 만든 "하네스 엔지니어링" 공부 도우미 웹 서비스입니다.
Karpathy의 **LLM Wiki** 방식으로, 에이전트가 원본 자료(`raw/`)를 읽고 위키(`wiki/`)를 정리합니다. 사람은 웹에서 읽고, 질문하고, 퀴즈를 풉니다.

- 가재코드 = 서비스를 만드는 **도구(하네스)**
- 하네스 엔지니어링 = 이 서비스로 **공부할 주제**

코딩 경험이 없어도 아래 순서대로 따라 하면 됩니다. 명령어는 **터미널**(맥: `Spotlight(⌘+Space)` → "터미널" 입력)에 한 줄씩 복사해 붙여 넣고 Enter를 누르세요.

---

## 1. 준비물 설치 (처음 한 번만)

### 1-1. 가재코드 설치 (v0.15.3 고정)

```sh
curl -fsSL https://raw.githubusercontent.com/Yeachan-Heo/gajae-code/v0.15.3/scripts/install.sh -o gjc-install.sh
sh gjc-install.sh --ref v0.15.3
```

설치가 끝나면 터미널을 **닫았다가 다시 열고** 확인합니다.

```sh
gjc --version
```

`0.15.3`이 보이면 성공입니다. (Windows는 [가재코드 설치 안내](https://github.com/Yeachan-Heo/gajae-code/blob/v0.15.3/docs/install.md)를 보세요.)

### 1-2. Bun 설치 (웹 서비스를 켜는 프로그램)

```sh
curl -fsSL https://bun.sh/install | bash
```

터미널을 닫았다가 다시 열고 `bun --version`으로 확인합니다. **1.4.0 이상**이어야 합니다.

### 1-3. 이 프로젝트 받기

GitHub 페이지에서 초록색 **Code → Download ZIP**을 눌러 받은 뒤 압축을 풀어도 되고, git을 쓸 줄 알면 아래처럼 받아도 됩니다.

```sh
git clone https://github.com/dancing-with-coffee/gajae-code-study-helper.git
```

그다음 터미널에서 프로젝트 폴더로 들어갑니다. (`cd ` 뒤에 Finder의 폴더를 터미널 창으로 끌어다 놓으면 경로가 자동으로 입력됩니다.)

```sh
cd gajae-code-study-helper
```

### 1-4. 필요한 부품 받기

```sh
bun install
```

---

## 2. 가재코드에 로그인 (처음 한 번만)

```sh
gjc
```

가재코드 화면이 열리면 아래를 입력하고, 쓰고 있는 구독(Claude Pro/Max 등)을 골라 로그인합니다.

```
/login
```

로그인이 끝나면 `Ctrl + C`를 두 번 눌러 가재코드를 닫습니다.
웹의 "질문하기"는 이 로그인을 그대로 씁니다. API 키가 꼭 필요한 경우에만 프로젝트 폴더의 **`env.txt`**를 열어 안내대로 적으세요(Finder에서 보이는 일반 텍스트 파일입니다).

---

## 3. 웹 서비스 켜기

```sh
bun run start
```

터미널에 `http://localhost:3000`이 보이면 브라우저 주소창에 붙여 넣으세요. 끌 때는 그 터미널에서 `Ctrl + C`.

| 화면 | 하는 일 |
| --- | --- |
| 홈 | 개념 목록(`wiki/index.md`)과 최근 작업 기록(`wiki/log.md`) 5줄 |
| 개념 페이지 | 위키 페이지 읽기. 주황색 **출처** 링크를 누르면 원본 자료가 열립니다 |
| 질문하기 | 위키를 근거로 가재코드 에이전트가 답하고 근거 페이지를 보여줍니다 |
| 퀴즈 | `wiki/quizzes/`의 객관식 문제 풀기 |

- 위키 파일이 바뀌면 **새로고침**만 하면 됩니다. 다시 켤 필요가 없습니다.
- 로그인이 안 되어 있거나 인터넷이 끊기면 **"질문하기"만** 꺼지고 나머지 화면은 그대로 됩니다.

---

## 4. 가재코드로 위키 키우기

프로젝트 폴더에서 `gjc`를 켜고 아래 스킬을 입력합니다.

| 명령 | 하는 일 |
| --- | --- |
| `/skill:wiki-ingest` | `raw/`에 새로 넣은 자료를 읽고 요약·개념 페이지를 만든 뒤 목차와 기록을 고칩니다 |
| `/skill:wiki-query` | 위키를 근거로 질문에 답하고, 좋은 답은 저장할지 묻습니다 |
| `/skill:wiki-lint` | 깨진 링크, 출처 없는 문장, 모순, 고아 페이지를 찾아 보고합니다 |
| `/skill:wiki-quiz` | 개념 하나로 객관식 3문제를 내고 한 문제씩 풀게 합니다 |

새 자료를 넣으려면 `raw/` 폴더에 마크다운 파일을 넣으세요. 파일 맨 위에는 아래 정보가 있어야 합니다.

```
---
title: 원래 제목
source_url: 원문 주소
published: 2026-01-01
collected: 2026-11-05
---
```

`bun run lint`는 위키를 기계적으로 점검합니다(`/skill:wiki-lint`가 내부에서 씁니다).

---

## 5. 폴더 구조

```
AGENTS.md         위키 규칙(스키마). 에이전트의 "일하는 방식 설명서" ← 하네스 엔지니어링의 핵심
env.txt           (필요할 때만) API 키
raw/              원본 자료. 사람이 넣고, 에이전트는 수정 금지
wiki/             에이전트가 쓰고 관리하는 위키
  index.md          전체 목차
  log.md            작업 기록(추가만)
  concepts/         개념 페이지
  sources/          원본 1개당 요약 1개
  quizzes/          개념별 퀴즈
.gjc/skills/      가재코드 프로젝트 스킬 4개
app/              웹 서비스 (server.ts가 시작점)
demo/             시연 때 raw/로 끌어다 넣을 자료
DEMO.md           강사용 시연 대본
```

## 원본 자료와 저작권

`raw/`와 `demo/`의 문서는 학습용으로 수집한 공개 문서이며, 저작권은 각 원저자(Anthropic, Andrej Karpathy)에게 있습니다. 각 파일 맨 위에 원문 주소와 게시일이 적혀 있습니다.

화면 글꼴은 [Pretendard](https://github.com/orioncactus/pretendard)(SIL Open Font License 1.1)를 `app/public/fonts/`에 넣어 인터넷 없이도 보이게 했습니다.

## 문제가 생기면

- `command not found: gjc` 또는 `bun` → 터미널을 닫았다가 다시 열어 보세요.
- `포트 3000번을 이미 다른 프로그램이 쓰고 있어요` → 이미 켜 둔 창이 있는지 확인하거나 `PORT=3001 bun run start`.
- 질문하기가 꺼져 있음 → `gjc`에서 `/login`을 했는지 확인한 뒤, 화면의 **다시 확인** 버튼을 누르세요.
