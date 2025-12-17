// 전화번호 하이픈 자동 입력 함수
export const formatPhoneNumber = (value: string): string => {
  const onlyNums = value.replace(/[^0-9]/g, "");

  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 8)
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
};

// 아이디 유효성 검사
export const validateUserId = (userId: string): {
  hasEnglish: boolean;
  isLongEnough: boolean;
  isValid: boolean;
} => {
  const hasEnglish = /[a-zA-Z]/.test(userId);
  const isLongEnough = userId.length >= 5;
  const isValid = hasEnglish && isLongEnough;

  return { hasEnglish, isLongEnough, isValid };
};

const API_BASE_URL = "https://after-ungratifying-lilyanna.ngrok-free.dev";

// 아이디 중복 확인 API
export const checkUserIdDuplicate = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/check-userid/${userId}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("아이디 중복 확인 응답 상태:", response.status);
    const data = await response.json();
    console.log("아이디 중복 확인 응답 데이터:", data);

    if (response.ok) {
      // isDuplicate가 false면 사용 가능, true면 중복
      if (data.isDuplicate === false) {
        return { success: true, message: "사용 가능한 아이디입니다!" };
      } else if (data.isDuplicate === true) {
        return { success: false, message: "이미 사용 중인 아이디입니다." };
      } else {
        // 예전 API 형식 (available) 지원
        if (data.available) {
          return { success: true, message: "사용 가능한 아이디입니다!" };
        } else {
          return { success: false, message: "이미 사용 중인 아이디입니다." };
        }
      }
    } else {
      console.error("아이디 중복 확인 실패 - 상태 코드:", response.status, "데이터:", data);
      return { success: false, message: "중복 확인에 실패했습니다." };
    }
  } catch (error) {
    console.error("아이디 중복 확인 오류:", error);
    return { success: false, message: "서버와 연결할 수 없습니다." };
  }
};

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (
  nickname: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/check-nickname/${nickname}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    console.log("닉네임 중복 확인 응답 상태:", response.status);
    const data = await response.json();
    console.log("닉네임 중복 확인 응답 데이터:", data);

    if (response.ok) {
      // isDuplicate가 false면 사용 가능, true면 중복
      if (data.isDuplicate === false) {
        return { success: true, message: "사용 가능한 닉네임입니다!" };
      } else if (data.isDuplicate === true) {
        return { success: false, message: "이미 사용 중인 닉네임입니다." };
      }
    }

    console.error("닉네임 중복 확인 실패 - 상태 코드:", response.status, "데이터:", data);
    return { success: false, message: "중복 확인에 실패했습니다." };
  } catch (error) {
    console.error("닉네임 중복 확인 오류:", error);
    return { success: false, message: "서버와 연결할 수 없습니다." };
  }
};

// 회원가입 API
export const signupUser = async (signupData: {
  userId: string;
  nickname: string;
  phoneNumber: string;
  password: string;
}): Promise<{ success: boolean; message: string }> => {
  console.log("회원가입 요청:", signupData);

  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(signupData),
    });

    let responseData = null;

    try {
      responseData = await response.json();
    } catch {
      // JSON 이 아닐 수 있음
    }

    if (response.ok) {
      return { success: true, message: "회원가입이 완료되었습니다!" };
    } else {
      console.error("회원가입 실패:", response.status, responseData);
      
      // 400 에러 처리 (전화번호 중복 등)
      if (response.status === 400) {
        // 전화번호 중복 체크
        if (responseData?.message && 
            (responseData.message.includes("전화번호") || 
             responseData.message.includes("phoneNumber") ||
             responseData.message.includes("phone"))) {
          return { success: false, message: "이미 가입된 전화번호입니다. 다시 확인해주세요." };
        }
        
        // 기타 400 에러
        return { success: false, message: "이미 가입된 전화번호 입니다. 다시 확인해주세요." };
      }
      
      // 기타 에러
      return {
        success: false,
        message: responseData?.message || "회원가입에 실패했습니다. 다시 시도해주세요.",
      };
    }
  } catch (error) {
    console.error("서버 요청 오류:", error);
    return { success: false, message: "서버와 연결할 수 없습니다." };
  }
};
