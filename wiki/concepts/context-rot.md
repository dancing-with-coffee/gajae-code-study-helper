# 컨텍스트 부패와 주의력 예산 (Context Rot & Attention Budget)

**한 줄 정의**: 컨텍스트에 넣는 정보가 많아질수록 모델이 그 안의 내용을 정확히 떠올리는 능력이 떨어지는 현상이다.

## 왜 중요한가

"컨텍스트 창이 크니 다 넣으면 된다"는 생각이 틀린 이유다. 컨텍스트는 쓸수록 효과가 줄어드는 유한한 자원으로 다뤄야 한다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 핵심 내용

- 사람의 작업 기억처럼 LLM에게도 "주의력 예산(attention budget)"이 있다. 새 토큰이 들어올 때마다 예산이 조금씩 줄어든다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 원인은 구조에 있다. 트랜스포머(transformer, 요즘 LLM의 기본 구조)는 모든 토큰이 다른 모든 토큰을 살피므로, 토큰이 n개면 관계가 n² 개다. 길어질수록 집중이 얇게 퍼진다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 모델은 학습 때 짧은 글을 더 많이 봤기 때문에, 긴 글 전체에 걸친 관계를 다룬 경험이 적다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 갑자기 무너지는 절벽이 아니라 서서히 나빠지는 비탈이다. 긴 컨텍스트에서도 쓸 만하지만 정보 찾기와 긴 추론의 정확도가 떨어진다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 긴 작업에서는 컨텍스트가 찰수록 일관성을 잃고, 어떤 모델은 한계가 다가온다고 여겨 일을 서둘러 끝내는 "컨텍스트 불안(context anxiety)"을 보였다. ([출처](../../raw/harness-design-long-running-apps.md))

## 관련 개념

- [컨텍스트 엔지니어링](context-engineering.md)
- [긴 작업의 컨텍스트 관리](long-task-context-management.md)

## 출처

- [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- [raw/harness-design-long-running-apps.md](../../raw/harness-design-long-running-apps.md) — https://www.anthropic.com/engineering/harness-design-long-running-apps
