# 생성자-평가자 분리 (Generator-Evaluator)

**한 줄 정의**: 결과물을 만드는 에이전트(생성자)와 그것을 따로 채점하고 비판하는 에이전트(평가자)를 나누는 하네스 구조다.

## 왜 중요한가

에이전트에게 자기 작업을 평가하라고 하면, 사람이 보기에 평범한 결과도 자신 있게 칭찬하는 경향이 있다. 일하는 쪽과 판단하는 쪽을 나누는 것이 이 문제를 푸는 강력한 수단이었다. ([출처](../../raw/harness-design-long-running-apps.md))

## 핵심 내용

- GAN(생성적 적대 신경망: 만드는 쪽과 가려내는 쪽이 경쟁하며 함께 좋아지는 AI 구조)에서 아이디어를 얻었다. ([출처](../../raw/harness-design-long-running-apps.md))
- 나눈다고 바로 해결되지는 않는다. 평가자도 LLM이라 LLM이 만든 결과에 너그럽다. 하지만 독립된 평가자를 깐깐하게 다듬는 것이 생성자에게 자기비판을 시키는 것보다 훨씬 쉽다. ([출처](../../raw/harness-design-long-running-apps.md))
- 주관적인 품질도 기준을 글로 적으면 채점할 수 있다. 프런트엔드 디자인에는 디자인 품질, 독창성, 완성도(craft), 기능성의 네 기준을 썼다. 기준의 문구가 결과물의 성격까지 바꿨다. ([출처](../../raw/harness-design-long-running-apps.md))
- 풀스택 코딩에서는 3인 구조를 썼다. **계획자**는 짧은 요청을 제품 명세로 키우고, **생성자**는 기능을 하나씩 만들고, **평가자**는 Playwright로 실제 앱을 사람처럼 눌러 보며 버그를 찾는다. ([출처](../../raw/harness-design-long-running-apps.md))
- 생성자와 평가자는 코드를 쓰기 전에 "무엇이 완료인가"를 합의하는 스프린트 계약을 맺었고, 서로 파일을 주고받으며 소통했다. ([출처](../../raw/harness-design-long-running-apps.md))
- 평가자는 정해진 정답이 아니다. 과제가 현재 모델이 혼자 안정적으로 할 수 있는 수준을 넘을 때 비용을 들일 가치가 있다. ([출처](../../raw/harness-design-long-running-apps.md))

## 관련 개념

- [워크플로 패턴 다섯 가지](workflow-patterns.md) (평가자-최적화자 패턴)
- [장시간 실행 에이전트](long-running-agents.md)
- [하네스 엔지니어링](harness-engineering.md)

## 출처

- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
