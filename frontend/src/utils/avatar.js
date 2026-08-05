
export const getAvatarUrl = (url) => {
  if (!url) return '/avatars/default_avatar.jpg';
  return url;
};