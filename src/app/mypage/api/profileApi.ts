import { ProfileData, UpdateProfilePayload } from '../types/profile';

export async function fetchProfile(): Promise<ProfileData> {
  return {
    imageUrl: '/images/male-default-profile.svg',
    bio: '',
    survey: {},
  };
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ProfileData> {
  const formData = new FormData();
  formData.append('bio', payload.bio);
  formData.append('survey', JSON.stringify(payload.survey));

  if (payload.imageFile) {
    formData.append('image', payload.imageFile);
  }

  const res = await fetch('/api/profile', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('프로필 저장 실패');
  }

  return res.json();
}
