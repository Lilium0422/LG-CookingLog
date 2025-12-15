import { ProfileData, UpdateProfilePayload } from '../types/profile';

export async function fetchProfile(): Promise<ProfileData> {
  return {
    imageUrl: '/images/male-default-profile.svg',
    bio: '',
    survey: {},
  };
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const formData = new FormData();
  formData.append('bio', payload.bio);
  formData.append('survey', JSON.stringify(payload.survey));

  if (payload.imageFile) {
    formData.append('image', payload.imageFile);
  }

  // return fetch('/api/profile', { method: 'POST', body: formData });
}
