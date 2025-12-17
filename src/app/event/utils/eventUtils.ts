export const getEventStatus = (endDate: string): "진행중" | "진행종료" => {
  // XX가 포함된 날짜는 종료된 것으로 처리
  if (endDate.includes("XX")) {
    return "진행종료";
  }

  const today = new Date();
  // YY.MM.DD 형식을 YYYY-MM-DD로 변환
  const [year, month, day] = endDate.split(".");
  const fullYear = `20${year}`;
  const end = new Date(`${fullYear}-${month}-${day}`);
  return end >= today ? "진행중" : "진행종료";
};
