# Scaling Managed Agents: Decoupling the brain from the hands

- 원문: https://www.anthropic.com/engineering/managed-agents
- 게시일: 2026-04-08 (Anthropic)
- raw 파일: [raw/managed-agents.md](../../raw/managed-agents.md)

## 한 줄 요약

하네스는 모델이 좋아질수록 낡는다. 그래서 Anthropic은 특정 하네스가 아니라 "세션·하네스·샌드박스"라는 오래 가는 인터페이스를 만들고, 두뇌(Claude와 하네스)와 손(샌드박스와 도구)을 분리했다. ([출처](../../raw/managed-agents.md))

## 핵심 내용

- 하네스는 "Claude를 호출하고, Claude의 도구 호출을 알맞은 인프라로 보내는 반복 루프"다. ([출처](../../raw/managed-agents.md))
- 하네스에는 Claude가 혼자 못 하는 일에 대한 가정이 담기고, 모델이 좋아지면 그 가정은 낡는다. Sonnet 4.5의 "컨텍스트 불안" 때문에 넣은 리셋이 Opus 4.5에서는 쓸모없는 짐이 됐다. ([출처](../../raw/managed-agents.md))
- 에이전트를 세 부품으로 나눴다: 세션(일어난 모든 일의 추가 전용 기록), 하네스(루프), 샌드박스(코드를 실행하고 파일을 고치는 환경). ([출처](../../raw/managed-agents.md))
- 모든 걸 컨테이너 하나에 넣었더니 그 컨테이너가 잃으면 안 되는 "애완동물(pet)"이 됐다. 분리 후 컨테이너는 언제든 바꿀 수 있는 "가축(cattle)"이 됐다. ([출처](../../raw/managed-agents.md))
- 손은 모두 `execute(name, input) → string`이라는 하나의 도구 형태로 부른다. 하네스는 그 손이 컨테이너인지, 휴대폰인지 몰라도 된다. ([출처](../../raw/managed-agents.md))
- 세션은 Claude의 컨텍스트 창이 아니다. 기록은 세션에 안전하게 남기고, 무엇을 컨텍스트에 넣을지는 하네스가 정한다. ([출처](../../raw/managed-agents.md))
- 분리 덕분에 첫 응답까지 걸리는 시간(TTFT)이 p50 기준 약 60%, p95 기준 90% 넘게 줄었다. ([출처](../../raw/managed-agents.md))

## 이 자료가 다루는 개념

- [하네스 엔지니어링](../concepts/harness-engineering.md)
- [두뇌와 손의 분리](../concepts/brain-and-hands.md)
- [긴 작업의 컨텍스트 관리](../concepts/long-task-context-management.md)
