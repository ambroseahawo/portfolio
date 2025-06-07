export interface Language {
  flag: string;
  name: string;
  proficiency: number;
  progressClass: string;
}

export const languages: Language[] = [
  {
    flag: "🇬🇧",
    name: "English",
    proficiency: 100,
    progressClass: "c80ee"
  },
  // {
  //   flag: "🇮🇹",
  //   name: "Italian",
  //   proficiency: 100,
  //   progressClass: "c80ee"
  // },
  // {
  //   flag: "🇪🇸",
  //   name: "Spanish",
  //   proficiency: 50,
  //   progressClass: "cx3us"
  // }
]; 