# Harness design for long-running application development

- 원문: https://www.anthropic.com/engineering/harness-design-long-running-apps
- 게시일: 2026-03-24 (Anthropic)
- raw 파일: [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md)

## 한 줄 요약

일을 하는 에이전트와 평가하는 에이전트를 분리한 **계획자-생성자-평가자** 3인 구조로, 몇 시간짜리 자율 코딩에서 훨씬 완성도 높은 앱을 만든 실험 기록이다. ([출처](../../raw/harness-design-long-running-apps.md))

## 핵심 내용

- GAN(생성적 적대 신경망)에서 착안해 생성자(generator)와 평가자(evaluator)를 나눴다. ([출처](../../raw/harness-design-long-running-apps.md))
- 에이전트는 자기 작업을 평가하라고 하면 품질이 평범해도 자신 있게 칭찬하는 경향이 있다. 일하는 쪽과 판단하는 쪽을 분리하는 것이 강력한 해법이다. ([출처](../../raw/harness-design-long-running-apps.md))
- 컨텍스트가 찰수록 일관성이 무너지고, 일부 모델은 한계가 다가온다고 느끼면 서둘러 마무리하는 "컨텍스트 불안(context anxiety)"을 보인다. 이를 위해 컨텍스트를 아예 비우는 리셋을 썼다. ([출처](../../raw/harness-design-long-running-apps.md))
- 디자인처럼 주관적인 품질도 채점 기준(디자인 품질, 독창성, 완성도, 기능성)을 글로 적으면 평가할 수 있게 된다. ([출처](../../raw/harness-design-long-running-apps.md))
- 계획자는 1~4문장 요청을 전체 제품 명세로 확장한다. 생성자와 평가자는 작업 전에 "완료의 기준"을 합의하는 스프린트 계약을 맺었다. 에이전트끼리는 파일로 소통했다. ([출처](../../raw/harness-design-long-running-apps.md))
- 단독 실행은 20분에 9달러, 전체 하네스는 6시간에 200달러였다. 비용은 20배 넘게 들었지만 결과 품질 차이가 분명했다. ([출처](../../raw/harness-design-long-running-apps.md))
- "하네스의 모든 구성 요소는 모델이 혼자 못 하는 일에 대한 가정을 담고 있다." 모델이 좋아지면 그 가정을 다시 시험해야 한다. Opus 4.6에서는 스프린트 구조를 없애도 됐다. ([출처](../../raw/harness-design-long-running-apps.md))

## 이 자료가 다루는 개념

- [하네스 엔지니어링](../concepts/harness-engineering.md)
- [생성자-평가자 분리](../concepts/generator-evaluator.md)
- [장시간 실행 에이전트](../concepts/long-running-agents.md)
- [긴 작업의 컨텍스트 관리](../concepts/long-task-context-management.md)
