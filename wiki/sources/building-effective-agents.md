# Building effective agents

- 원문: https://www.anthropic.com/engineering/building-effective-agents
- 게시일: 2024-12-19 (Anthropic)
- raw 파일: [raw/building-effective-agents.md](../../raw/building-effective-agents.md)

## 한 줄 요약

잘 되는 에이전트는 복잡한 프레임워크가 아니라 단순하고 조합 가능한 패턴으로 만들어진다. 가장 단순한 방법부터 시작하고, 효과가 확인될 때만 복잡도를 더하라는 글이다. ([출처](../../raw/building-effective-agents.md))

## 핵심 내용

- "에이전트 시스템"을 두 가지로 나눈다. 정해진 코드 경로로 LLM과 도구를 엮는 **워크플로(workflow)**, 그리고 LLM이 스스로 과정과 도구 사용을 정하는 **에이전트(agent)**. ([출처](../../raw/building-effective-agents.md))
- 기본 부품은 검색·도구·메모리가 붙은 **증강된 LLM(augmented LLM)**이다. ([출처](../../raw/building-effective-agents.md))
- 자주 쓰는 워크플로 다섯 가지: 프롬프트 체이닝, 라우팅, 병렬화, 오케스트레이터-워커, 평가자-최적화자. ([출처](../../raw/building-effective-agents.md))
- 에이전트는 대개 "환경의 피드백을 보며 반복해서 도구를 쓰는 LLM"일 뿐이다. 그래서 도구와 그 설명서를 잘 만드는 일이 중요하다. ([출처](../../raw/building-effective-agents.md))
- 에이전트 설계의 세 원칙: 단순함, 투명성(계획 단계를 드러내기), 에이전트-컴퓨터 인터페이스(ACI)를 문서화하고 테스트하기. ([출처](../../raw/building-effective-agents.md))
- 프레임워크는 내부의 프롬프트와 응답을 가려 디버깅을 어렵게 만들 수 있다. LLM API를 직접 써서 시작하길 권한다. ([출처](../../raw/building-effective-agents.md))
- SWE-bench용 에이전트를 만들 때 전체 프롬프트보다 도구를 다듬는 데 더 많은 시간을 썼다. 상대 경로 대신 절대 경로만 받게 바꾸자 실수가 사라졌다. ([출처](../../raw/building-effective-agents.md))

## 이 자료가 다루는 개념

- [에이전트와 워크플로](../concepts/agents-vs-workflows.md)
- [증강된 LLM](../concepts/augmented-llm.md)
- [워크플로 패턴 다섯 가지](../concepts/workflow-patterns.md)
- [에이전트-컴퓨터 인터페이스(ACI)](../concepts/agent-computer-interface.md)
