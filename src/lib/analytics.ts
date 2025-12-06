export const analytics = {
  trackGeneration: (cat: string, success: boolean, time: number) => console.log('Track:', cat, success, time),
  trackFavorite: (cat: string, action: string) => console.log('Fav:', cat, action),
  track: (data: any) => console.log('Analytics:', data)
};
