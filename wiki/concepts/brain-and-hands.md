# 두뇌와 손의 분리 (Decoupling the Brain from the Hands)

**한 줄 정의**: 생각하는 부분(Claude와 하네스, "두뇌")과 실제로 실행하는 부분(샌드박스와 도구, "손"), 그리고 기록(세션)을 서로 독립된 부품으로 나누는 설계다.

## 왜 중요한가

하네스는 모델이 좋아질수록 계속 바뀐다. 그래서 특정 하네스에 묶이지 않는, 오래 가는 인터페이스가 필요했다. 운영체제가 하드웨어를 "프로세스"와 "파일"로 추상화해 수십 년을 버틴 것과 같은 발상이다. ([출처](../../raw/managed-agents.md))

## 핵심 내용

- 에이전트를 세 부품으로 나눴다. **세션**(일어난 모든 일의 추가 전용 기록), **하네스**(Claude를 부르고 도구 호출을 보내는 루프), **샌드박스**(코드를 실행하고 파일을 고치는 환경). 각각을 다른 것에 영향 없이 바꿀 수 있다. ([출처](../../raw/managed-agents.md))
- 처음엔 셋을 컨테이너 하나에 넣었다. 그러자 컨테이너가 잃으면 안 되는 "애완동물(pet)"이 됐다. 컨테이너가 죽으면 세션도 사라졌고, 어디서 고장 났는지 알기도 어려웠다. ([출처](../../raw/managed-agents.md))
- 분리 후 하네스는 컨테이너를 다른 도구처럼 `execute(name, input) → string`으로 부른다. 컨테이너가 죽으면 도구 오류로 받아 Claude에게 넘기고, 새 컨테이너를 띄우면 된다. 하네스가 죽어도 세션 기록에서 이어서 다시 시작한다. ([출처](../../raw/managed-agents.md))
- 보안도 좋아졌다. 예전엔 Claude가 만든 코드가 인증 정보와 같은 컨테이너에서 돌았다. 이제 토큰은 샌드박스 밖 금고에 두어 에이전트가 직접 만지지 않는다. ([출처](../../raw/managed-agents.md))
- 세션은 Claude의 컨텍스트 창이 아니다. 기록은 세션에 남기고, 그중 무엇을 컨텍스트에 넣을지는 하네스가 정한다. ([출처](../../raw/managed-agents.md))
- 필요할 때만 컨테이너를 띄우게 되자 첫 응답까지 시간(TTFT)이 p50 약 60%, p95 90% 넘게 줄었다. ([출처](../../raw/managed-agents.md))

## 관련 개념

- [하네스 엔지니어링](harness-engineering.md)
- [긴 작업의 컨텍스트 관리](long-task-context-management.md)
- [에이전트-컴퓨터 인터페이스(ACI)](agent-computer-interface.md)

## 출처

- [raw/managed-agents.md](../../raw/managed-agents.md) — https://www.anthropic.com/engineering/managed-agents
