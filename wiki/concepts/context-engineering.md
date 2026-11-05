# 컨텍스트 엔지니어링 (Context Engineering)

**한 줄 정의**: 모델이 답을 만들 때 보는 정보 전체, 즉 **컨텍스트(context)**에 무엇을 넣고 뺄지 매 순간 골라 관리하는 기술이다.

## 왜 중요한가

모델은 컨텍스트가 길어질수록 집중력이 흐려진다([컨텍스트 부패](context-rot.md)). 그래서 "어떤 말을 쓸까"보다 "지금 어떤 정보를 보여줄까"가 결과를 더 크게 좌우한다. 좋은 컨텍스트 엔지니어링은 원하는 결과를 낼 가능성을 최대로 하는, 가장 작은 고신호 정보 묶음을 찾는 일이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 핵심 내용

### 프롬프트 엔지니어링과의 차이

- 프롬프트 엔지니어링은 지시문(특히 시스템 프롬프트)을 잘 쓰는 방법이다. 컨텍스트 엔지니어링은 그보다 넓게, 시스템 지시·도구·외부 데이터·대화 기록까지 모델이 보는 모든 정보를 관리한다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 프롬프트 작성은 한 번 하는 일이지만, 컨텍스트 엔지니어링은 모델에게 무엇을 넘길지 정할 때마다 반복된다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

### 좋은 컨텍스트의 구성

- **시스템 프롬프트**: "적절한 고도"로 쓴다. 너무 딱딱한 if-else 규칙은 깨지기 쉽고, 너무 막연한 지침은 모델이 알아서 짐작하게 만든다. 섹션을 나누고, 최소한이지만 충분한 정보를 준다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- **도구**: 서로 겹치지 않고, 결과를 토큰 효율적으로 돌려주는 최소한의 도구 묶음. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- **예시**: 모든 예외 규칙을 늘어놓기보다, 다양하고 대표적인 예시 몇 개를 고른다. LLM에게 예시는 "천 마디 말보다 나은 그림"이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

### 필요할 때 불러오기 (just-in-time)

- 모든 자료를 미리 넣어두는 대신, 파일 경로 같은 가벼운 표지만 들고 있다가 필요할 때 도구로 불러온다. 폴더 구조나 파일 이름 자체도 무엇이 중요한지 알려주는 신호가 된다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- Claude Code는 혼합형이다. CLAUDE.md 파일은 처음부터 컨텍스트에 넣고, 나머지 파일은 glob·grep 같은 도구로 그때그때 찾는다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- [LLM 위키](llm-wiki.md)도 비슷하게 일한다. 질문을 받으면 LLM이 먼저 index.md를 읽어 관련 페이지를 찾고, 그 페이지로 들어가 읽는다. ([출처](../../raw/karpathy-llm-wiki.md))

### 하네스 안의 컨텍스트 엔지니어링

- Managed Agents에서는 기록 보관(세션)과 컨텍스트 관리(하네스)를 분리했다. 앞으로 어떤 컨텍스트 엔지니어링이 필요할지 예측할 수 없기 때문이다. ([출처](../../raw/managed-agents.md))

## 관련 개념

- [컨텍스트 부패와 주의력 예산](context-rot.md)
- [긴 작업의 컨텍스트 관리](long-task-context-management.md)
- [에이전트 규칙 파일(AGENTS.md)](agent-rules-file.md)
- [하네스 엔지니어링](harness-engineering.md)

## 출처

- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- [raw/managed-agents.md](../../raw/managed-agents.md) — https://www.anthropic.com/engineering/managed-agents
- [raw/karpathy-llm-wiki.md](../../raw/karpathy-llm-wiki.md) — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
