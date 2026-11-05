# Effective harnesses for long-running agents

- 원문: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- 게시일: 2025-11-26 (Anthropic)
- raw 파일: [raw/effective-harnesses-for-long-running-agents.md](../../raw/effective-harnesses-for-long-running-agents.md)

## 한 줄 요약

여러 번의 세션(컨텍스트 창)에 걸쳐 일하는 에이전트가 꾸준히 진도를 내도록, 첫 세션에서 환경을 깔아주는 **초기화 에이전트**와 매번 조금씩 진행하고 흔적을 남기는 **코딩 에이전트**로 하네스를 나눈 경험담이다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

## 핵심 내용

- 핵심 문제: 새 세션은 이전 세션을 기억하지 못한다. 교대 근무하는 엔지니어가 매번 기억 없이 출근하는 것과 같다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 압축(compaction)만으로는 부족했다. 실패 유형은 두 가지였다. 한 번에 다 하려다 중간에 컨텍스트가 바닥나는 것, 그리고 진행된 걸 보고 너무 일찍 "다 했다"고 선언하는 것. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 초기화 에이전트는 `init.sh`, 진행 기록 파일(`claude-progress.txt`), 첫 git 커밋을 만든다. 200개가 넘는 기능 목록도 JSON으로 만들고 모두 "실패" 상태로 시작한다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- JSON을 쓴 이유: 모델이 마크다운보다 JSON 파일을 함부로 고치거나 덮어쓸 가능성이 낮았다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 코딩 에이전트는 한 번에 기능 하나만 하고, 끝날 때 git 커밋과 진행 기록을 남겨 "깨끗한 상태"로 넘긴다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 브라우저 자동화 도구로 사람처럼 끝까지 테스트하라고 명시하자 성능이 크게 좋아졌다. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))
- 세션 시작 루틴: `pwd` 확인 → git 로그와 진행 기록 읽기 → 기능 목록에서 다음 할 일 고르기 → 개발 서버를 켜고 기본 기능부터 확인. ([출처](../../raw/effective-harnesses-for-long-running-agents.md))

## 이 자료가 다루는 개념

- [장시간 실행 에이전트](../concepts/long-running-agents.md)
- [하네스 엔지니어링](../concepts/harness-engineering.md)
- [긴 작업의 컨텍스트 관리](../concepts/long-task-context-management.md)
