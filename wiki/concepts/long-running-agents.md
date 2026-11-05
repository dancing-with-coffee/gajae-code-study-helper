# 장시간 실행 에이전트 (Long-running Agents)

**한 줄 정의**: 몇 시간에서 며칠에 걸쳐 여러 세션을 이어 일하는 에이전트로, 세션마다 기억이 끊기는 문제를 하네스로 메워 줘야 한다.

## 왜 중요한가

새 세션은 이전 세션을 전혀 기억하지 못한다. 매번 기억 없이 출근하는 교대 근무 엔지니어와 같다. 이 틈을 메우지 않으면 에이전트는 같은 일을 다시 하거나, 망가진 상태를 물려받거나, 일을 다 했다고 착각한다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

## 핵심 내용

### 두 가지 실패

- 한 번에 앱 전체를 만들려다 중간에 컨텍스트가 바닥나, 다음 세션이 반쯤 만든 기능을 설명도 없이 물려받는다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 어느 정도 진행된 걸 본 뒤 에이전트가 "다 했다"고 너무 일찍 선언한다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

### 해법: 두 종류의 에이전트

- **초기화 에이전트(initializer agent)**: 첫 세션에서만 쓴다. 개발 서버를 켜는 `init.sh`, 진행 기록 파일(`claude-progress.txt`), 첫 git 커밋, 그리고 모든 기능을 "실패" 상태로 적은 기능 목록(JSON)을 만든다. claude.ai 복제 앱 예시에서는 기능이 200개가 넘었다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- **코딩 에이전트(coding agent)**: 이후 모든 세션에서 쓴다. 기능을 한 번에 하나만 만들고, 끝날 때 git 커밋과 진행 기록을 남겨 깨끗한 상태로 넘긴다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 기능 목록은 `passes` 값만 바꾸게 하고 "테스트를 지우거나 고치는 것은 용납할 수 없다" 같은 강한 문장을 넣었다. JSON을 고른 이유는 모델이 마크다운보다 JSON을 함부로 덮어쓸 가능성이 낮았기 때문이다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

### 세션 시작 루틴과 테스트

- 매 세션은 `pwd` 확인 → git 로그와 진행 기록 읽기 → 기능 목록에서 가장 중요한 미완료 기능 고르기 → 개발 서버를 켜고 기본 기능이 되는지 먼저 확인하는 순서로 시작한다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 에이전트는 제대로 시험하지 않고 기능을 완료로 표시하곤 했다. 브라우저 자동화 도구로 사람처럼 끝까지 테스트하라고 하자 성능이 크게 좋아졌다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 이후 연구에서는 계획자·생성자·평가자로 역할을 더 나눴다([생성자-평가자 분리](generator-evaluator.md)). ([출처](../../raw/harness-design-long-running-apps.md))

## 관련 개념

- [하네스 엔지니어링](harness-engineering.md)
- [긴 작업의 컨텍스트 관리](long-task-context-management.md)
- [생성자-평가자 분리](generator-evaluator.md)

## 출처

- [raw/effective-harnesses-for-long-running-agents.md](../../raw/effective-harnesses-for-long-running-agents.md) — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
