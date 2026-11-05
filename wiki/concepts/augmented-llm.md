# 증강된 LLM (Augmented LLM)

**한 줄 정의**: 검색(retrieval), 도구(tools), 메모리(memory) 같은 능력을 덧붙인 LLM으로, 모든 에이전트 시스템의 기본 부품이다.

## 왜 중요한가

워크플로든 에이전트든 결국 이 부품을 여러 개 이어 붙여 만든다. 기본 부품을 잘 만들어야 위에 쌓는 구조도 잘 동작한다. ([출처](../../raw/building-effective-agents.md))

## 핵심 내용

- 요즘 모델은 이런 능력을 스스로 쓴다. 검색어를 직접 만들고, 알맞은 도구를 고르고, 무엇을 기억할지 정한다. ([출처](../../raw/building-effective-agents.md))
- 구현할 때 두 가지에 집중하라고 권한다. 내 용도에 맞게 능력을 다듬는 것, 그리고 LLM이 쓰기 쉽고 설명이 잘 된 인터페이스를 주는 것. ([출처](../../raw/building-effective-agents.md))
- 외부 도구를 붙이는 한 가지 방법으로 MCP(Model Context Protocol, 모델과 외부 도구를 잇는 표준 규약)를 소개한다. ([출처](../../raw/building-effective-agents.md))

## 관련 개념

- [에이전트와 워크플로](agents-vs-workflows.md)
- [워크플로 패턴 다섯 가지](workflow-patterns.md)
- [에이전트-컴퓨터 인터페이스(ACI)](agent-computer-interface.md)

## 출처

- [raw/building-effective-agents.md](../../raw/building-effective-agents.md) — https://www.anthropic.com/engineering/building-effective-agents
