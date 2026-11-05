# LLM 위키 (LLM Wiki)

**한 줄 정의**: LLM이 원본 자료를 읽고, 서로 연결된 마크다운 위키를 직접 쓰고 계속 최신으로 관리하게 하는 개인 지식 관리 방법이다.

## 왜 중요한가

보통의 RAG(검색 증강 생성: 질문 때마다 문서 조각을 찾아 답하는 방식)는 매번 지식을 처음부터 다시 찾고, 쌓이는 게 없다. LLM 위키는 한 번 정리한 내용이 남아 자료를 넣고 질문할수록 풍부해진다. 위키는 "복리로 불어나는 결과물"이다. ([출처](../../raw/karpathy-llm-wiki.md))

## 핵심 내용

### 세 층

- **원본 자료(raw)**: 사람이 고른 원문. 바꾸지 않는다. 진실의 원천이다. ([출처](../../raw/karpathy-llm-wiki.md))
- **위키(wiki)**: LLM이 쓴 마크다운 파일들. 요약, 개념 페이지, 비교 등. LLM이 전부 관리하고, 사람은 읽는다. ([출처](../../raw/karpathy-llm-wiki.md))
- **스키마(schema)**: CLAUDE.md나 AGENTS.md처럼 위키 구조와 규칙, 작업 순서를 적은 문서. LLM을 평범한 챗봇이 아니라 규칙을 지키는 위키 관리자로 만드는 핵심 설정 파일이다([에이전트 규칙 파일](agent-rules-file.md)). ([출처](../../raw/karpathy-llm-wiki.md))

### 세 작업

- **넣기(ingest)**: 새 자료를 넣으면 LLM이 읽고 요약 페이지를 쓰고, 목차와 관련 개념 페이지를 고치고, 기록을 남긴다. 자료 하나가 10~15쪽을 건드리기도 한다. ([출처](../../raw/karpathy-llm-wiki.md))
- **묻기(query)**: 위키를 근거로 질문에 답한다. 좋은 답은 새 페이지로 위키에 다시 저장할 수 있다. ([출처](../../raw/karpathy-llm-wiki.md))
- **점검(lint)**: 페이지 간 모순, 낡은 주장, 아무도 링크하지 않는 고아 페이지, 빠진 연결 등을 찾는다. ([출처](../../raw/karpathy-llm-wiki.md))

### 두 특별한 파일

- `index.md`는 내용 중심 목차다. 질문을 받으면 LLM이 먼저 이 파일을 읽고 관련 페이지로 들어간다. ([출처](../../raw/karpathy-llm-wiki.md))
- `log.md`는 시간순 작업 기록이며 추가만 한다. 줄마다 같은 머리말을 쓰면 간단한 명령으로 최근 기록을 뽑을 수 있다. ([출처](../../raw/karpathy-llm-wiki.md))
- 사람의 일은 자료를 고르고, 좋은 질문을 하고, 그 의미를 생각하는 것이다. 지루한 정리 작업은 LLM이 한다. ([출처](../../raw/karpathy-llm-wiki.md))

## 관련 개념

- [에이전트 규칙 파일(AGENTS.md)](agent-rules-file.md)
- [컨텍스트 엔지니어링](context-engineering.md)

## 출처

- [raw/karpathy-llm-wiki.md](../../raw/karpathy-llm-wiki.md) — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
