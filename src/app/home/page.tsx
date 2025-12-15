import Hero from "./components/Hero";
import RecipeSection from "./components/RecipeSection";
import HomeCtaSection from "./components/CtaSection";

export default function HomePage() {
  return (
    <main>
      {/* 메인 타이틀 */}
      <section style={{ textAlign: "center", marginTop: "30px" }}>
        <h1 style={{ fontSize: 27, fontWeight: 700 }}>
          당신의 레시피를 공유해보세요! <br />
          <span style={{ color: "#F36E5C" }}>쿠킹로그</span>와 함께해요
        </h1>
      </section>

      <Hero />

      {/* 추천 레시피 */}
      <RecipeSection
        label="요리 초보라면? 이것부터 보세요!"
        title="추천 레시피 보기"
        type="popular"
      />

      {/* 인기 레시피 */}
      <RecipeSection
        label="과연 이번주 인기레시피는?"
        title="인기 레시피 보기"
        type="recommend"
      />
      
      <HomeCtaSection />
    </main>
  );
}
