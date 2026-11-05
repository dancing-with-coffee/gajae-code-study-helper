# Effective context engineering for AI agents

- 원문: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- 게시일: 2025-09-29 (Anthropic)
- raw 파일: [raw/effective-context-engineering-for-ai-agents.md](../../raw/effective-context-engineering-for-ai-agents.md)

## 한 줄 요약

모델에게 "어떤 말을 할까"보다 "지금 어떤 정보를 보여줄까"가 더 중요해졌다. 한정된 컨텍스트에 꼭 필요한 정보만 골라 넣는 기술, 컨텍스트 엔지니어링을 설명한다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 핵심 내용

- 컨텍스트(context)는 모델이 답을 만들 때 보는 토큰 전체다. 컨텍스트 엔지니어링은 그 토큰을 골라 넣고 관리하는 전략이며, 프롬프트 엔지니어링이 자연스럽게 발전한 형태다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 컨텍스트가 길어질수록 정보를 정확히 떠올리는 능력이 떨어진다(**컨텍스트 부패, context rot**). 그래서 컨텍스트는 "주의력 예산"이 있는 유한한 자원이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 좋은 컨텍스트는 "원하는 결과를 낼 가능성을 최대로 하는, 가장 작은 고신호 토큰 묶음"이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 시스템 프롬프트는 "적절한 고도"로 쓴다. 너무 딱딱한 if-else 규칙도, 너무 막연한 지침도 피한다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 미리 다 넣어두기보다, 파일 경로 같은 가벼운 표지만 들고 있다가 필요할 때 도구로 불러오는 **just-in-time** 전략이 늘고 있다. Claude Code는 CLAUDE.md는 처음부터 넣고, 나머지는 glob·grep으로 그때그때 찾는 혼합형이다. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))
- 긴 작업을 위한 세 가지 기법: 압축(compaction), 구조화된 메모(structured note-taking), 서브에이전트 구조. ([출처](../../raw/effective-context-engineering-for-ai-agents.md))

## 이 자료가 다루는 개념

- [컨텍스트 엔지니어링](../concepts/context-engineering.md)
- [컨텍스트 부패와 주의력 예산](../concepts/context-rot.md)
- [긴 작업의 컨텍스트 관리](../concepts/long-task-context-management.md)
- [에이전트 규칙 파일(AGENTS.md)](../concepts/agent-rules-file.md)
