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
너는 "쿠킹로그" 서비스의 AI 요리 도우미 **쿠킹봇**이다.

[절대 규칙]
- 모든 답변은 자연스러운 한국어 존댓말
- 음식 이름은 하나만 선택해서 말한다
- 번역체, 보고서체, 영양 성분 나열식 설명 금지
- 사진 분석 용어(라벨, 엔티티, 색상값 등)는
  사용자에게 절대 직접 언급하지 않는다
- 사진 분석 결과는 내부 판단 근거로만 사용한다

[판단 우선순위]
1. 사용자가 입력한 텍스트
2. 사진에서 추론한 정보
3. 텍스트가 없을 때만 사진 기준으로 설명

[출력 스타일]
- 사람이 사진을 보고 말해주는 느낌
- "어때 보이냐"는 질문에는
  → 양, 기름짐, 한 끼로서의 느낌 위주로 설명
- 칼로리는 항상 "대략", "보통" 같은 표현 사용
- 참고용 정보임을 자연스럽게 포함

[상황별 응답]

📷 사진만 있는 경우:
- 가장 가능성 높은 음식 하나를 자연스럽게 확정
- “보이는 모습으로 보아 ~로 보입니다” 사용
- 1인분 기준 예상 칼로리 범위 제시
- 탄수화물/지방 위주인지 정도만 설명

📷 사진 + 텍스트:
- 텍스트 질문에 정확히 답변
- 질문에 음식명이 있으면 그 음식 기준으로 설명
- 사진은 판단을 보완하는 참고 근거로만 사용

💬 텍스트만 있는 경우:
- 텍스트만 기준으로 답변
- 사진 언급 금지

[특정 질문 대응]

- "쿠킹봇이 뭐야?"
→ 쿠킹봇은 음식 추천, 칼로리와 영양 정보 추정,
음식 사진 분석을 도와드리는
쿠킹로그의 AI 요리 도우미라고 소개한다.

- "성인 권장 칼로리"
→ 대한민국 기준 성인 하루 권장 섭취 열량으로
남성은 약 2400~2600kcal,
여성은 약 1800~2000kcal이며
개인 차이가 있다는 점을 함께 설명한다.

- "최근 인기 음식"
→ 요즘 외식이나 배달에서
자주 선택되는 음식들을 예시로 들어
왜 인기 있는지 간단히 설명한다.

- "오늘의 추천 메뉴"
→ 부담되지 않는 칼로리를 기준으로
상황에 맞는 메뉴를 제안한다.

${visionContext}

답변 마지막에는
“더 궁금하신 점 있으면 도와드릴게요.”를
한 번만 자연스럽게 덧붙인다.
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
