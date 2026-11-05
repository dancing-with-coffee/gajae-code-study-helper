# 에이전트-컴퓨터 인터페이스 (ACI, Agent-Computer Interface)

**한 줄 정의**: 에이전트가 쓰는 도구의 이름·설명·입력 형식 같은 "에이전트용 사용 설명서와 조작부"로, 사람용 화면(HCI)만큼 공들여 설계해야 하는 부분이다.

## 왜 중요한가

에이전트는 결국 환경의 피드백을 보며 도구를 쓰는 LLM이므로, 도구가 헷갈리면 에이전트도 헷갈린다. Anthropic은 SWE-bench 에이전트를 만들 때 전체 프롬프트보다 도구를 다듬는 데 더 많은 시간을 썼다. ([출처](../../raw/building-effective-agents.md))

## 핵심 내용

- 도구 정의도 프롬프트만큼 공을 들여야 한다. 모델이 생각할 여유를 주고, 인터넷 글에서 자주 본 형식에 가깝게 하고, 수천 줄을 세거나 문자열을 이스케이프하는 부담을 없앤다. ([출처](../../raw/building-effective-agents.md))
- 모델 입장이 되어 보라. 설명과 입력값만 보고 사용법이 바로 보이는가? 좋은 도구 정의에는 사용 예, 경계 사례, 입력 형식, 다른 도구와의 구분이 들어 있다. ([출처](../../raw/building-effective-agents.md))
- 실수하기 어렵게 만든다(포카요케, poka-yoke: 실수 방지 설계). 상대 경로 대신 절대 경로만 받게 바꾸자 모델이 완벽하게 썼다. ([출처](../../raw/building-effective-agents.md))
- 도구가 너무 많거나 기능이 겹치면 실패하기 쉽다. 사람 엔지니어도 어떤 도구를 써야 할지 확신할 수 없다면 에이전트도 마찬가지다. 꼭 필요한 최소한의 도구만 두라고 권한다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 관련 개념

- [증강된 LLM](augmented-llm.md)
- [컨텍스트 엔지니어링](context-engineering.md)
- [두뇌와 손의 분리](brain-and-hands.md)

## 출처

- [raw/building-effective-agents.md](../../raw/building-effective-agents.md) — https://www.anthropic.com/engineering/building-effective-agents
- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
