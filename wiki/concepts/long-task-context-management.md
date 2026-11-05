# 긴 작업의 컨텍스트 관리 (Compaction, Note-taking, Sub-agents, Reset)

**한 줄 정의**: 컨텍스트 창 하나에 다 담기지 않는 긴 작업을 위해 쓰는 기법들로, 압축·구조화된 메모·서브에이전트·컨텍스트 리셋이 있다.

## 왜 중요한가

몇십 분에서 몇 시간 이어지는 작업(큰 코드 이전, 깊은 조사 등)은 토큰 양이 컨텍스트 창을 넘는다. 더 큰 컨텍스트 창을 기다리는 것만으로는 부족하다. 창이 커도 불필요한 정보가 쌓이는 문제는 남기 때문이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 핵심 내용

| 기법 | 쉽게 말하면 | 잘 맞는 일 |
| --- | --- | --- |
| 압축 (Compaction) | 대화가 한계에 가까워지면 내용을 요약하고, 요약본으로 새 컨텍스트를 시작한다. | 주고받는 대화가 많은 일 |
| 구조화된 메모 (Structured note-taking) | 에이전트가 컨텍스트 밖 파일(예: NOTES.md, 할 일 목록)에 메모를 쓰고 나중에 다시 읽는다. | 단계가 분명한 반복 개발 |
| 서브에이전트 (Sub-agents) | 전문 하위 에이전트가 깨끗한 컨텍스트로 깊이 조사하고 짧은 요약만 돌려준다. | 여러 갈래를 동시에 탐색하는 조사·분석 |

([출처](../../raw/effective-context-engineering-for-ai-agents.md))

- 압축에서 가장 어려운 것은 무엇을 남기고 버릴지 고르는 일이다. 너무 세게 줄이면 나중에야 중요해지는 미묘한 정보를 잃는다. 가장 가벼운 압축은 오래된 도구 실행 결과를 지우는 것이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- **컨텍스트 리셋**은 압축과 다르다. 압축은 같은 에이전트가 줄인 기록으로 계속 가지만, 리셋은 컨텍스트를 완전히 비우고 새 에이전트가 인수인계 파일을 보고 이어받는다. 깨끗하게 시작하는 대신, 인수인계 파일에 충분한 정보가 있어야 한다. ([출처](../../raw/harness-design-long-running-apps.md))
- 압축만으로는 부족했다. 최신 모델도 큰 요청 하나만 받고 여러 컨텍스트 창을 돌면 완성도 높은 앱을 만들지 못했다. 그래서 진행 기록 파일과 git 기록으로 다음 세션에 상태를 넘기는 구조를 만들었다([장시간 실행 에이전트](long-running-agents.md)). ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 무엇을 남기고 버릴지는 되돌릴 수 없는 결정이 되기 쉽다. Managed Agents는 모든 기록을 컨텍스트 밖 세션 로그에 안전하게 남겨, 필요하면 다시 꺼내 볼 수 있게 했다. ([출처](../../raw/managed-agents.md))

## 관련 개념

- [컨텍스트 엔지니어링](context-engineering.md)
- [컨텍스트 부패와 주의력 예산](context-rot.md)
- [장시간 실행 에이전트](long-running-agents.md)
- [두뇌와 손의 분리](brain-and-hands.md)

## 출처

- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
- [raw/effective-harnesses-for-long-running-agents.md](../../raw/effective-harnesses-for-long-running-agents.md) — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- [raw/managed-agents.md](../../raw/managed-agents.md) — https://www.anthropic.com/engineering/managed-agents
