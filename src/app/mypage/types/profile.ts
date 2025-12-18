// types/profile.ts
import { SurveyAnswers } from '../components/CookingSurvey';

export interface ProfileData {
  id: number;
  userId: string;
  nickname: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  survey: SurveyAnswers;
}

export interface UpdateProfilePayload {
  bio: string;
  survey: SurveyAnswers;
  imageFile?: File;
}
