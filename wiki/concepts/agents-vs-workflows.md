# 에이전트와 워크플로 (Agents vs. Workflows)

**한 줄 정의**: **워크플로**는 사람이 미리 정한 순서대로 LLM과 도구가 움직이는 시스템이고, **에이전트**는 LLM이 스스로 다음 할 일과 쓸 도구를 정하는 시스템이다.

## 왜 중요한가

무엇이든 에이전트로 만들 필요는 없다. 에이전트 시스템은 더 나은 성능을 얻는 대신 시간과 비용을 더 쓰기 때문에, 그 거래가 맞는지 먼저 따져야 한다. 많은 경우 LLM을 한 번 잘 부르는 것으로 충분하다. ([출처](../../raw/building-effective-agents.md))

## 핵심 내용

- Anthropic은 두 가지를 모두 "에이전트 시스템"이라 부르되 구조적으로 구분한다. 워크플로는 정해진 코드 경로로 움직이고, 에이전트는 LLM이 과정을 직접 지휘한다. ([출처](../../raw/building-effective-agents.md))
- 잘 정의된 일에는 예측 가능하고 일관된 워크플로가 낫다. 유연함과 모델의 판단이 필요할 때 에이전트가 낫다. ([출처](../../raw/building-effective-agents.md))
- 에이전트는 사람의 지시나 대화로 시작해, 일이 분명해지면 스스로 계획하고 움직인다. 각 단계마다 도구 실행 결과 같은 환경의 "실제 결과(ground truth)"를 보고 진행 상황을 판단한다. ([출처](../../raw/building-effective-agents.md))
- 에이전트는 몇 단계가 필요할지 예측하기 어려운 열린 문제에 쓴다. 자율성이 큰 만큼 비용이 크고 실수가 쌓일 수 있어, 샌드박스에서 충분히 시험하고 안전장치를 두라고 권한다. ([출처](../../raw/building-effective-agents.md))
- 이후 Anthropic은 에이전트를 더 간단히 정의했다. "LLM이 반복 루프 안에서 스스로 도구를 쓰는 것." ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 관련 개념

- [증강된 LLM](augmented-llm.md)
- [워크플로 패턴 다섯 가지](workflow-patterns.md)
- [하네스 엔지니어링](harness-engineering.md)

## 출처

- [raw/building-effective-agents.md](../../raw/building-effective-agents.md) — https://www.anthropic.com/engineering/building-effective-agents
- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
