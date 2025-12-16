import { ProfileData, UpdateProfilePayload } from '../types/profile';

const API_BASE_URL =
  'https://after-ungratifying-lilyanna.ngrok-free.dev';
const DEFAULT_IMAGE = '/images/male-default-profile.svg';

/* ======================
   localStorage 유저 조회
====================== */
function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) throw new Error('유저 정보가 없습니다.');

  const parsed = JSON.parse(raw);
  if (!parsed.user) {
    throw new Error('user 정보가 없습니다.');
  }

  return parsed.user; // { id, userId, nickname ... }
}

/* ======================
   survey 파싱
====================== */
function parseSurvey(survey: string | null) {
  if (!survey) return {};
  try {
    return JSON.parse(survey);
  } catch (e) {
    console.warn('[parseSurvey] 실패:', survey);
    return {};
  }
}

/* ======================
   이미지 URL 보정
====================== */
function resolveProfileImage(url?: string | null) {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
}

/* ======================
   프로필 조회
====================== */
export async function fetchProfile(): Promise<ProfileData> {
  const user = getUser();

  const res = await fetch(
    `${API_BASE_URL}/api/users/${user.id}`,
    {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );

  if (!res.ok) {
    throw new Error('프로필 조회 실패');
  }

  const data = await res.json();
  console.log('[fetchProfile] response:', data);

  return {
    id: data.id,
    userId: data.userId,
    bio: data.bio ?? '',
    survey: parseSurvey(data.survey),
    imageUrl: resolveProfileImage(data.profileImageUrl),
  };
}

/* ======================
   프로필 업데이트
====================== */
export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ProfileData> {
  const user = getUser();
  console.log('[updateProfile] payload:', payload);

  /** ======================
   * 이미지 포함 → FormData
   ====================== */
  if (payload.imageFile) {
    const formData = new FormData();
    formData.append('userId', user.userId); // 문자열 ID
    formData.append('bio', payload.bio);
    formData.append('survey', JSON.stringify(payload.survey));
    formData.append('imageFile', payload.imageFile);

    const res = await fetch(
      `${API_BASE_URL}/api/users/${user.id}/profile`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    if (!res.ok) throw new Error('프로필 업데이트 실패');

    const data = await res.json();
    return {
      id: data.id,
      userId: data.userId,
      bio: data.bio ?? '',
      survey: parseSurvey(data.survey),
      imageUrl: resolveProfileImage(data.profileImageUrl),
    };
  }

  /** ======================
   * 이미지 제외 → JSON
   ====================== */
  const res = await fetch(
    `${API_BASE_URL}/api/users/${user.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        bio: payload.bio,
        survey: JSON.stringify(payload.survey),
      }),
    }
  );

  if (!res.ok) throw new Error('프로필 업데이트 실패');

  const data = await res.json();
  return {
    id: data.id,
    userId: data.userId,
    bio: data.bio ?? '',
    survey: parseSurvey(data.survey),
    imageUrl: resolveProfileImage(data.profileImageUrl),
  };
}
