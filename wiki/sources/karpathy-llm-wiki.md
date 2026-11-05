# LLM Wiki

- 원문: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- 게시일: 2026-04-04 (Andrej Karpathy, GitHub Gist)
- raw 파일: [raw/karpathy-llm-wiki.md](../../raw/karpathy-llm-wiki.md)

## 한 줄 요약

질문할 때마다 문서를 새로 뒤지는 대신, LLM이 원본 자료를 읽고 서로 연결된 마크다운 위키를 계속 쌓아가게 하자는 아이디어다. ([출처](../../raw/karpathy-llm-wiki.md))

## 핵심 내용

- 보통의 RAG(검색 증강 생성)는 질문마다 지식을 처음부터 다시 찾는다. 쌓이는 게 없다. ([출처](../../raw/karpathy-llm-wiki.md))
- LLM Wiki는 한 번 정리한 지식을 계속 최신으로 유지한다. 위키는 "복리로 불어나는 결과물"이다. ([출처](../../raw/karpathy-llm-wiki.md))
- 세 층: 원본 자료(raw, 수정 금지), 위키(LLM이 전부 관리), 스키마(CLAUDE.md나 AGENTS.md처럼 위키 규칙을 적은 문서). ([출처](../../raw/karpathy-llm-wiki.md))
- 세 작업: 넣기(ingest), 묻기(query), 점검(lint). 좋은 답은 위키에 새 페이지로 다시 저장할 수 있다. ([출처](../../raw/karpathy-llm-wiki.md))
- `index.md`는 내용 중심 목차, `log.md`는 시간순 작업 기록(추가만 함)이다. ([출처](../../raw/karpathy-llm-wiki.md))
- 사람의 일은 자료를 고르고, 좋은 질문을 하고, 의미를 생각하는 것. 나머지 정리 작업은 LLM이 한다. ([출처](../../raw/karpathy-llm-wiki.md))

## 이 자료가 다루는 개념

- [LLM 위키](../concepts/llm-wiki.md)
- [에이전트 규칙 파일(AGENTS.md)](../concepts/agent-rules-file.md)
