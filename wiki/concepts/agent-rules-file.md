# 에이전트 규칙 파일 (AGENTS.md / CLAUDE.md)

**한 줄 정의**: 에이전트가 일을 시작할 때 가장 먼저 읽는 "일하는 방식 설명서" 파일로, 코드를 고치지 않고 글만 바꿔서 에이전트의 행동을 바꿀 수 있다.

## 왜 중요한가

LLM 위키에서 이 파일은 LLM을 평범한 챗봇이 아니라 규칙을 지키는 위키 관리자로 만드는 핵심 설정 파일이다. 사람과 LLM이 함께 이 파일을 고쳐 가며 자기 분야에 맞는 방식을 찾아간다. ([출처](../../raw/karpathy-llm-wiki.md))

## 핵심 내용

- 위키의 구조, 지켜야 할 규칙, 자료를 넣거나 질문에 답하거나 점검할 때의 작업 순서를 적는다. Claude Code에서는 CLAUDE.md, Codex에서는 AGENTS.md라는 이름을 쓴다. ([출처](../../raw/karpathy-llm-wiki.md))
- Claude Code는 CLAUDE.md 파일을 처음부터 컨텍스트에 그대로 넣는다. 나머지 파일은 필요할 때 도구로 찾아 읽는다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 처음부터 컨텍스트에 들어가므로 [컨텍스트 엔지니어링](context-engineering.md)의 시스템 프롬프트 원칙이 그대로 적용된다. 너무 딱딱한 규칙도, 너무 막연한 지침도 아닌 "적절한 고도"로, 최소한이지만 충분하게 쓴다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 관련 개념

- [LLM 위키](llm-wiki.md)
- [컨텍스트 엔지니어링](context-engineering.md)
- [하네스 엔지니어링](harness-engineering.md)

## 출처

- [raw/karpathy-llm-wiki.md](../../raw/karpathy-llm-wiki.md) — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
