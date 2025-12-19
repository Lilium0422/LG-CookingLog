"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./write.module.css";

// 백엔드 API 명세서에 맞는 데이터 구조
interface RecipeFormData {
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  mainIngredients: string[];
  seasonings: string[];
  tags: string[];
  rating: number;
  userNickname: string;
}

const categories = ["한식", "양식", "중식", "일식", "분식", "디저트", "기타"];

export default function RecipeWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    category: "",
    content: "",
    imageUrl: "",
    mainIngredients: [],
    seasonings: [],
    tags: [],
    rating: 5, // 기본값
    userNickname: "",
  });

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const data = JSON.parse(userData);
      console.log("로그인 데이터:", data); // 디버깅용
      // {token, user: {nickname, ...}} 구조
      const nickname = data.user?.nickname || data.nickname || "";
      console.log("닉네임:", nickname); // 디버깅용
      setFormData((prev) => ({
        ...prev,
        userNickname: nickname,
      }));
    } else {
      // 로그인 안 된 경우 로그인 페이지로 이동
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [router]);

  // 입력 필드 상태
  const [mainIngredientInput, setMainIngredientInput] = useState("");
  const [seasoningInput, setSeasoningInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 일반 입력 필드 변경
  const handleInputChange = (
    field: keyof RecipeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 주재료 추가
  const handleAddMainIngredient = () => {
    if (
      mainIngredientInput.trim() &&
      !formData.mainIngredients.includes(mainIngredientInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        mainIngredients: [...prev.mainIngredients, mainIngredientInput.trim()],
      }));
      setMainIngredientInput("");
    }
  };

  // 주재료 삭제
  const handleRemoveMainIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      mainIngredients: prev.mainIngredients.filter(
        (item) => item !== ingredient
      ),
    }));
  };

  // 양념 추가
  const handleAddSeasoning = () => {
    if (
      seasoningInput.trim() &&
      !formData.seasonings.includes(seasoningInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        seasonings: [...prev.seasonings, seasoningInput.trim()],
      }));
      setSeasoningInput("");
    }
  };

  // 양념 삭제
  const handleRemoveSeasoning = (seasoning: string) => {
    setFormData((prev) => ({
      ...prev,
      seasonings: prev.seasonings.filter((item) => item !== seasoning),
    }));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (예: 5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("이미지 파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 파일 형식 검증
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
        return;
      }

      setImageFile(file);
      // 미리보기용 임시 URL 생성 (실제 저장은 서버에서 처리)
      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  // 이미지 삭제
  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 토큰 가져오기
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : "";

      const imageUrl = "";

      // 이미지가 있는 경우와 없는 경우 분기 처리
      if (imageFile) {
        // 이미지+게시글 동시 업로드: /api/posts/with-image 사용
        const formDataToSend = new FormData();

        // 문자열로 변환해서 전송
        formDataToSend.append("title", String(formData.title || ""));
        formDataToSend.append("category", String(formData.category || ""));
        formDataToSend.append("content", String(formData.content || ""));
        formDataToSend.append("rating", String(formData.rating || 5));
        formDataToSend.append(
          "userNickname",
          String(formData.userNickname || "")
        );

        // 배열은 JSON 문자열로 변환
        formDataToSend.append(
          "mainIngredients",
          JSON.stringify(formData.mainIngredients || [])
        );
        formDataToSend.append(
          "seasonings",
          JSON.stringify(formData.seasonings || [])
        );
        formDataToSend.append("tags", JSON.stringify(formData.tags || []));

        // 이미지 파일 (필드명: imageFile)
        formDataToSend.append("imageFile", imageFile);

        // 디버깅: FormData 내용 확인
        console.log("FormData 내용:");
        for (const [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }

        console.log("이미지+게시글 동시 업로드 시작...");

        const response = await fetch(
          "https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/with-image",
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
              // Content-Type은 FormData 사용시 자동으로 설정됨
            },
            body: formDataToSend,
          }
        );

        console.log("응답 상태:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("에러 응답:", errorText);
          throw new Error(
            `레시피 작성 실패: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("작성된 레시피:", result);
      } else {
        // 이미지가 없는 경우: 기존 /api/posts 사용
        const submitData = {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          imageUrl: "", // 이미지 없음
          mainIngredients: formData.mainIngredients,
          seasonings: formData.seasonings,
          tags: formData.tags,
          rating: formData.rating,
          userNickname: formData.userNickname,
        };

        console.log("이미지 없이 전송할 데이터:", submitData);

        const response = await fetch(
          "https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(submitData),
          }
        );

        console.log("응답 상태:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("에러 응답:", errorText);
          throw new Error(
            `레시피 작성 실패: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("작성된 레시피:", result);
      }

      alert("레시피가 성공적으로 작성되었습니다!");
      router.push("/recipes");
    } catch (error) {
      console.error("레시피 작성 오류:", error);
      alert("레시피 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    addFunction: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFunction();
    }
  };

  return (
    <div className={styles.writeContainer}>
      <div className={styles.writeContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>글쓰기</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 제목 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>제목</label>
            <input
              type="text"
              placeholder="제목을 입력해 주세요"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={styles.input}
            />
          </div>

          {/* 카테고리 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={styles.select}
            >
              <option value="">카테고리를 선택해 주세요</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 내용 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>내용</label>
            <textarea
              placeholder="내용을 입력해 주세요"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={styles.textarea}
              rows={10}
            />
          </div>

          {/* 완성 이미지 업로드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>완성 이미지(필수)</label>
            <div className={styles.imageUpload}>
              <input
                type="text"
                placeholder="이미지를 업로드해 주세요"
                value={imageFile?.name || ""}
                readOnly
                className={styles.imageUrlInput}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className={styles.fileLabel}>
                파일 첨부
              </label>
            </div>

            {/* 업로드된 이미지 미리보기 */}
            {formData.imageUrl && (
              <div className={styles.imagePreview}>
                <div className={styles.imageItem}>
                  <img
                    src={formData.imageUrl}
                    alt="업로드 이미지"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeImageBtn}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 재료 상세 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>재료 상세</label>

            {/* 추가된 재료 목록 */}
            {(formData.mainIngredients.length > 0 ||
              formData.seasonings.length > 0) && (
              <div className={styles.addedIngredients}>
                {formData.mainIngredients.length > 0 && (
                  <div className={styles.ingredientList}>
                    <span className={styles.ingredientListLabel}>주재료:</span>
                    {formData.mainIngredients.map((ingredient, index) => (
                      <span key={index} className={styles.ingredientTag}>
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => handleRemoveMainIngredient(ingredient)}
                          className={styles.removeIngredientBtn}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formData.seasonings.length > 0 && (
                  <div className={styles.ingredientList}>
                    <span className={styles.ingredientListLabel}>양념:</span>
                    {formData.seasonings.map((seasoning, index) => (
                      <span key={index} className={styles.ingredientTag}>
                        {seasoning}
                        <button
                          type="button"
                          onClick={() => handleRemoveSeasoning(seasoning)}
                          className={styles.removeIngredientBtn}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.ingredientSection}>
              <div className={styles.ingredientItem}>
                <span className={styles.ingredientLabel}>주 재료</span>
                <input
                  type="text"
                  placeholder="예) 돼지고기 앞다리살 100g"
                  value={mainIngredientInput}
                  onChange={(e) => setMainIngredientInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddMainIngredient)}
                  className={styles.ingredientInput}
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={handleAddMainIngredient}
                >
                  +
                </button>
              </div>
              <div className={styles.ingredientItem}>
                <span className={styles.ingredientLabel}>양념</span>
                <input
                  type="text"
                  placeholder="예) 고추장 1큰술"
                  value={seasoningInput}
                  onChange={(e) => setSeasoningInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddSeasoning)}
                  className={styles.ingredientInput}
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={handleAddSeasoning}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>태그</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                placeholder="예) #기념일 #생일 #다이어트 #제육볶음"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddTag)}
                className={styles.input}
              />
            </div>

            {/* 태그 목록 */}
            {formData.tags.length > 0 && (
              <div className={styles.tagList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeTagBtn}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 작성하기 버튼 */}
          <div className={styles.submitSection}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
