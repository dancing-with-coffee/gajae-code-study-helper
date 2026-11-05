# 하네스 엔지니어링 (Harness Engineering)

**한 줄 정의**: 모델(AI의 두뇌)을 감싸서 실제로 일하게 만드는 바깥 장치, 즉 **하네스**(harness)를 설계하고 다듬는 일이다.

## 왜 중요한가

같은 모델이라도 어떤 하네스에 넣느냐에 따라 결과가 크게 달라진다. 같은 한 문장 요청을 단독 실행하면 20분·9달러짜리 앱이 나왔고, 계획자·생성자·평가자로 짠 하네스에서는 6시간·200달러가 들었지만 실제로 게임이 돌아가는 훨씬 나은 앱이 나왔다. ([출처](../../raw/harness-design-long-running-apps.md))

Anthropic은 이전 실험에서도 하네스 설계가 오래 걸리는 코딩 작업의 효과에 큰 영향을 준다는 것을 보였다. ([출처](../../raw/harness-design-long-running-apps.md))

## 핵심 내용

### 하네스와 모델은 어떻게 다른가

- **모델**은 Claude 같은 LLM(대규모 언어 모델) 자체다. 글을 읽고 다음에 할 말과 행동을 정한다. ([출처](../../raw/managed-agents.md))
- **하네스**는 "Claude를 호출하고, Claude의 도구 호출을 알맞은 인프라로 보내는 반복 루프"다. 모델이 무엇을 보고, 어떤 도구를 쓸 수 있고, 결과가 어디에 기록되는지를 정한다. ([출처](../../raw/managed-agents.md))
- Anthropic은 Claude와 하네스를 묶어 "두뇌(brain)"라 부르고, 실제로 코드를 실행하고 파일을 고치는 샌드박스와 도구를 "손(hands)"이라 불렀다. 자세한 내용은 [두뇌와 손의 분리](brain-and-hands.md)에 있다. ([출처](../../raw/managed-agents.md))
- Claude Agent SDK는 코딩처럼 도구로 정보를 모으고, 계획하고, 실행하는 일에 능숙한 범용 에이전트 하네스다. 압축(compaction) 같은 컨텍스트 관리 기능도 들어 있다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

### 하네스는 가정을 담는다

- "하네스의 모든 구성 요소는 모델이 혼자 못 하는 일에 대한 가정을 담고 있다." 그래서 그 가정이 아직 맞는지 계속 시험해야 한다. ([출처](../../raw/harness-design-long-running-apps.md))
- 예: Sonnet 4.5는 컨텍스트 한계가 다가온다고 느끼면 일을 서둘러 끝냈다(컨텍스트 불안). 그래서 하네스에 컨텍스트 리셋을 넣었다. 그런데 같은 하네스를 Opus 4.5에 쓰니 그 행동이 사라져 리셋이 쓸모없는 짐이 됐다. ([출처](../../raw/managed-agents.md))
- Opus 4.6에서는 작업을 스프린트로 쪼개는 구조를 빼도 모델이 두 시간 넘게 일관되게 일했다. 하네스를 단순하게 만들 때는 한 번에 한 부품씩 빼며 영향을 확인하는 것이 좋았다. ([출처](../../raw/harness-design-long-running-apps.md))
- 모델이 좋아져도 흥미로운 하네스 조합의 공간은 줄지 않고 "옮겨 갈" 뿐이다. ([출처](../../raw/harness-design-long-running-apps.md))

### 하네스가 다루는 것들

- 첫 세션에 환경을 깔고, 이후 세션은 조금씩 진행하며 흔적을 남기게 하는 구조 → [장시간 실행 에이전트](long-running-agents.md) ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 일하는 에이전트와 평가하는 에이전트를 나누는 구조 → [생성자-평가자 분리](generator-evaluator.md) ([출처](../../raw/harness-design-long-running-apps.md))
- 모델에게 무엇을 보여줄지 고르는 일 → [컨텍스트 엔지니어링](context-engineering.md) ([출처](../../raw/managed-agents.md))

## 관련 개념

- [두뇌와 손의 분리](brain-and-hands.md)
- [장시간 실행 에이전트](long-running-agents.md)
- [생성자-평가자 분리](generator-evaluator.md)
- [컨텍스트 엔지니어링](context-engineering.md)
- [에이전트 규칙 파일(AGENTS.md)](agent-rules-file.md)

## 출처

- [raw/managed-agents.md](../../raw/managed-agents.md) — https://www.anthropic.com/engineering/managed-agents
- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
- [raw/effective-harnesses-for-long-running-agents.md](../../raw/effective-harnesses-for-long-running-agents.md) — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
