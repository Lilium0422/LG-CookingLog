"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./write.module.css";

interface RecipeFormData {
  title: string;
  content: string;
  category: string;
  hashtags: string[];
  images: File[];
}

const categories = ["한식", "양식", "중식", "일식", "분식", "디저트"];

export default function RecipeWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    content: "",
    category: "",
    hashtags: [],
    images: [],
  });
  const [hashtagInput, setHashtagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddHashtag = () => {
    if (
      hashtagInput.trim() &&
      !formData.hashtags.includes(`#${hashtagInput.trim()}`)
    ) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, `#${hashtagInput.trim()}`],
      }));
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category
    ) {
      alert("제목, 내용, 카테고리는 필수 입력 항목입니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 백엔드 API 호출
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      submitData.append("category", formData.category);
      submitData.append("hashtags", JSON.stringify(formData.hashtags));

      formData.images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      // 임시: 콘솔에 데이터 출력
      console.log("레시피 작성 데이터:", {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        hashtags: formData.hashtags,
        imageCount: formData.images.length,
      });

      // API 호출 예시 (실제 구현시 주석 해제)
      // const response = await fetch('/api/recipes', {
      //   method: 'POST',
      //   body: submitData
      // });
      //
      // if (!response.ok) {
      //   throw new Error('레시피 작성에 실패했습니다.');
      // }

      alert("레시피가 성공적으로 작성되었습니다!");
      router.push("/recipes");
    } catch (error) {
      console.error("레시피 작성 오류:", error);
      alert("레시피 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
              placeholder="레시피 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* 카테고리 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={styles.select}
              required
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
              required
            />
          </div>

          {/* 대표 이미지 업로드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>대표 이미지(필수)</label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className={styles.fileLabel}>
                파일 첨부
              </label>
            </div>

            {/* 업로드된 이미지 미리보기 */}
            {formData.images.length > 0 && (
              <div className={styles.imagePreview}>
                {formData.images.map((image, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`업로드 이미지 ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className={styles.removeImageBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 재료 상세 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>재료 상세</label>
            <div className={styles.ingredientSection}>
              <div className={styles.ingredientItem}>
                <span className={styles.ingredientLabel}>주 재료</span>
                <input
                  type="text"
                  placeholder="예) 돼지고기 앞다리살 300g"
                  className={styles.ingredientInput}
                />
                <button type="button" className={styles.addBtn}>
                  +
                </button>
              </div>
              <div className={styles.ingredientItem}>
                <span className={styles.ingredientLabel}>양념</span>
                <input
                  type="text"
                  placeholder="예) 고추장 2큰술"
                  className={styles.ingredientInput}
                />
                <button type="button" className={styles.addBtn}>
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
                placeholder="태그를 입력하고 엔터를 누르세요"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHashtag();
                  }
                }}
                className={styles.input}
              />
            </div>

            {/* 태그 목록 */}
            {formData.hashtags.length > 0 && (
              <div className={styles.tagList}>
                {formData.hashtags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
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
