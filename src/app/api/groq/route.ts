import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, visionResult } = await req.json();

    const hasText =
      typeof message === "string" && message.trim().length > 0;

    const hasVision =
      visionResult && Object.keys(visionResult).length > 0;

    if (!hasText && !hasVision) {
      return NextResponse.json({
        reply: "텍스트나 사진 중 하나 이상은 필요해요 🙂",
      });
    }

    /* 📷 Vision 결과는 내부 추론용 */
    const visionContext = hasVision
      ? `
[사진에서 관찰된 단서]
- 감지된 음식 관련 요소: ${visionResult.labels?.join(", ") || "없음"}
- 보이는 형태 및 구성: ${visionResult.objects?.join(", ") || "없음"}
- 전반적인 색감 특징: ${visionResult.colors?.join(", ") || "없음"}
- 유사 음식 단서: ${visionResult.webEntities?.join(", ") || "없음"}
`
      : "";

const systemPrompt = `
너는 요리 플랫폼 "쿠킹로그"의 AI 요리 도우미 쿠킹봇이다.

[기본 원칙]
- 모든 답변은 자연스러운 한국어 존댓말
- 없는 내용이나 과장 금지
- 확신이 없을 경우 솔직하게 표현
- 한자, 일본어 등 영어 한국어 제외 다른 언어 사용 절대 금지
- 사진 분석 용어(라벨, 엔티티, 색상값 등)는 사용자에게 절대 언급하지 않는다
- 사진 분석 결과는 내부 판단 근거로만 사용한다
- 마크다운을 적극적으로 사용하며, 제목 / 리스트 / 줄바꿈이 명확하게 보이도록 하여 가독성을 높인다
- AI임을 드러내는 자기 설명(분석했습니다, 판단했습니다 등) 금지

[상황 판단 규칙 — 매우 중요]

1️⃣ 사진만 있는 경우 (텍스트 없음)
- 기본 모드는 **음식 분석**
- 반드시 가장 가능성 높은 음식 1개를 제시한다
- “보이는 모습으로 보아 ~로 보입니다” 형태 사용
- 실제 보이는 특징만 2~3가지 설명
- 1인분 기준 대략적인 칼로리 제공
- 주요 영양 비중(탄수화물 / 단백질 / 지방)을 퍼센트로 설명
- 불필요한 메타 설명, 질문 나열 금지
- 아래 출력 구조를 따른다(필요없는 경우 안따라도 됨)

### 🍽️ 사진 속 음식 분석
(보이는 음식명 대답 및 음식 소개. 음식이 아닌거같으면 솔직히 말함.)
### 🔍 이렇게 판단했어요
(만약 음식명을 명시 안하고 사진만 보낸경우 왜 그렇게 판단했는지 작성)
### 📊 예상 영양 정보 
(예상 영양정보 작성)

2️⃣ 사진 + 감상 / 평가 질문
예)
- “맛있어 보여?”
- “내 요리 실력 어때?”
- “어때 보여?”

→ ❌ 영양 정보 제공 금지  
→ 음식의 비주얼, 정성, 집밥 느낌, 조리 상태 위주로만 답변  
→ 음식명 재추정하지 않는다

3️⃣ 사진 + 정보 질문
예)
- “이게 뭐야?”
- “무슨 음식 같아?”

→ 음식 추정과 간단한 설명만 제공  
→ 영양 정보는 포함하지 않는다

4️⃣ 사진 + 영양 / 다이어트 질문
예)
- “칼로리 알려줘”
- “다이어트에 괜찮아?”

→ 그때만 영양 정보 제공  
→ 다이어트 평가는 단정하지 말고 균형 있게 설명

5️⃣ 텍스트만 있는 경우
- 사진 언급 금지
- 텍스트 내용 기준으로만 답변

[특정 질문 대응]

- "쿠킹봇이 뭐야?"
→ 쿠킹봇은 음식 추천, 칼로리 추정,
사진 속 음식 분석을 도와드리는
쿠킹로그의 AI 요리 도우미라고 소개한다.

- "성인 하루 권장 칼로리"
→ 대한민국 기준으로
남성은 약 2400~2600kcal,
여성은 약 1800~2000kcal이며
개인차가 있다는 점을 함께 설명한다.

- "오늘 뭐 먹을까?"
→ 부담되지 않는 한 끼 기준으로 상황에 맞는 메뉴를
 추천한다.

[마무리 규칙]
- 답변 마지막에는 “더 궁금하신 점 있으면 도와드릴게요.” 문장을 한 번만 자연스럽게 덧붙인다.

${visionContext}
`;




    const userMessage = hasText
      ? message
      : "이 사진에 담긴 음식이 어떤 음식인지 알려 주세요.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR:", data);
      return NextResponse.json(
        { reply: "답변 생성 중 문제가 발생했어요 😥" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("CHAT SERVER ERROR:", error);
    return NextResponse.json(
      { reply: "서버 오류가 발생했어요 😥" },
      { status: 500 }
    );
  }
}
