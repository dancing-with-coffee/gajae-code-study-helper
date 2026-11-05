# 워크플로 패턴 다섯 가지 (Workflow Patterns)

**한 줄 정의**: LLM 호출을 엮는 대표적인 다섯 가지 방법으로, 프롬프트 체이닝·라우팅·병렬화·오케스트레이터-워커·평가자-최적화자가 있다.

## 왜 중요한가

복잡한 프레임워크 없이도 이 단순한 패턴들을 조합하면 대부분의 실무 시스템을 만들 수 있다. 가장 성공적인 팀들은 단순하고 조합 가능한 패턴을 썼다. ([출처](../../raw/building-effective-agents.md))

## 핵심 내용

| 패턴 | 쉽게 말하면 | 언제 쓰나 |
| --- | --- | --- |
| 프롬프트 체이닝 (Prompt chaining) | 일을 순서대로 쪼개 앞 단계 결과를 다음 단계에 넘긴다. 중간에 점검 관문(gate)을 둘 수 있다. | 일이 고정된 하위 단계로 깔끔히 나뉠 때 |
| 라우팅 (Routing) | 입력을 분류해 알맞은 전문 처리로 보낸다. | 성격이 다른 입력을 따로 다루는 게 나을 때 |
| 병렬화 (Parallelization) | 독립된 부분을 동시에 처리(나누기)하거나 같은 일을 여러 번 돌려 표를 모은다(투표). | 속도가 필요하거나 여러 관점이 필요할 때 |
| 오케스트레이터-워커 (Orchestrator-workers) | 중심 LLM이 일을 그때그때 쪼개 일꾼 LLM에게 맡기고 결과를 합친다. | 필요한 하위 작업을 미리 알 수 없을 때 |
| 평가자-최적화자 (Evaluator-optimizer) | 한 LLM이 만들고, 다른 LLM이 평가와 피드백을 주는 반복. | 평가 기준이 분명하고 고칠수록 좋아질 때 |

([출처](../../raw/building-effective-agents.md))

- 이 패턴들은 정답 규칙이 아니라 상황에 맞게 섞어 쓰는 재료다. 성능을 재고 개선을 반복하는 것이 핵심이며, 복잡도는 결과가 확실히 좋아질 때만 더한다. ([출처](../../raw/building-effective-agents.md))
- 평가자-최적화자 패턴은 이후 몇 시간짜리 자율 코딩에서 [생성자-평가자 분리](generator-evaluator.md) 구조로 발전했다. ([출처](../../raw/harness-design-long-running-apps.md))

## 관련 개념

- [에이전트와 워크플로](agents-vs-workflows.md)
- [증강된 LLM](augmented-llm.md)
- [생성자-평가자 분리](generator-evaluator.md)

## 출처

- [raw/building-effective-agents.md](../../raw/building-effective-agents.md) — https://www.anthropic.com/engineering/building-effective-agents
- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
