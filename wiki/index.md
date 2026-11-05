# 하네스 엔지니어링 공부 위키 — 목차

에이전트가 관리하는 위키의 전체 목차다. 질문에 답할 때 에이전트는 이 파일을 가장 먼저 읽는다.

## 개념

- [하네스 엔지니어링](concepts/harness-engineering.md) — 모델을 감싸서 실제로 일하게 만드는 바깥 장치(하네스)를 설계하는 일. 하네스와 모델의 차이.
- [두뇌와 손의 분리](concepts/brain-and-hands.md) — 생각(Claude+하네스), 실행(샌드박스·도구), 기록(세션)을 독립 부품으로 나누는 설계.
- [장시간 실행 에이전트](concepts/long-running-agents.md) — 여러 세션에 걸쳐 일하는 에이전트를 위한 초기화 에이전트·코딩 에이전트 구조.
- [생성자-평가자 분리](concepts/generator-evaluator.md) — 만드는 에이전트와 채점하는 에이전트를 나누는 구조. 계획자·생성자·평가자.
- [컨텍스트 엔지니어링](concepts/context-engineering.md) — 모델이 보는 정보에 무엇을 넣고 뺄지 매 순간 고르는 기술.
- [컨텍스트 부패와 주의력 예산](concepts/context-rot.md) — 컨텍스트가 길수록 모델의 정확도가 떨어지는 현상.
- [긴 작업의 컨텍스트 관리](concepts/long-task-context-management.md) — 압축, 구조화된 메모, 서브에이전트, 컨텍스트 리셋.
- [에이전트와 워크플로](concepts/agents-vs-workflows.md) — 정해진 순서로 움직이는 워크플로와 스스로 판단하는 에이전트의 차이.
- [증강된 LLM](concepts/augmented-llm.md) — 검색·도구·메모리를 붙인 LLM. 에이전트 시스템의 기본 부품.
- [워크플로 패턴 다섯 가지](concepts/workflow-patterns.md) — 프롬프트 체이닝, 라우팅, 병렬화, 오케스트레이터-워커, 평가자-최적화자.
- [에이전트-컴퓨터 인터페이스(ACI)](concepts/agent-computer-interface.md) — 에이전트가 쓰는 도구를 사람용 화면만큼 공들여 설계하기.
- [에이전트 규칙 파일(AGENTS.md)](concepts/agent-rules-file.md) — 에이전트가 가장 먼저 읽는 "일하는 방식 설명서".
- [LLM 위키](concepts/llm-wiki.md) — LLM이 원본 자료로 위키를 쌓고 관리하는 지식 관리 방법.

## 원본 요약

- [Building effective agents](sources/building-effective-agents.md) — Anthropic, 2024-12-19. 단순하고 조합 가능한 패턴으로 에이전트 만들기.
- [Effective context engineering for AI agents](sources/effective-context-engineering-for-ai-agents.md) — Anthropic, 2025-09-29. 한정된 컨텍스트를 고르고 관리하는 기술.
- [Effective harnesses for long-running agents](sources/effective-harnesses-for-long-running-agents.md) — Anthropic, 2025-11-26. 초기화 에이전트와 코딩 에이전트.
- [Harness design for long-running application development](sources/harness-design-long-running-apps.md) — Anthropic, 2026-03-24. 계획자·생성자·평가자 3인 구조.
- [Scaling Managed Agents: Decoupling the brain from the hands](sources/managed-agents.md) — Anthropic, 2026-04-08. 두뇌와 손을 분리한 오래 가는 인터페이스.
- [LLM Wiki](sources/karpathy-llm-wiki.md) — Andrej Karpathy, 2026-04-04. LLM이 관리하는 개인 위키 아이디어.

## 퀴즈

- [퀴즈: 하네스 엔지니어링](quizzes/harness-engineering.md)
- [퀴즈: 컨텍스트 엔지니어링](quizzes/context-engineering.md)
- [퀴즈: 생성자-평가자 분리](quizzes/generator-evaluator.md)
