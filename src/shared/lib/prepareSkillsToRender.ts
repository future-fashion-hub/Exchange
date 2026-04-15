import { TPlace } from "../../api/types";

// фича prepareSkillsToRender возвращает массив скилов
// таким образом, чтобы они уместились в строке целиком, без обрезания
export function prepareSkillsToRender(
  learnSkills: number[],
  subCategories: TPlace[]
) {
  // сохраняем скилы в массив в виде строк
  const names = learnSkills
    .map(id => subCategories.find(i => i.id === id)?.name || '')
    .filter(Boolean);

  if (names.length === 0) {
    return { skillsCanRender: [], isRest: false, rest: 0 };
  }

  if (names.length === 1) {
    return { skillsCanRender: [names[0]], isRest: false, rest: 0 };
  }

  // два скила
  if (names.length === 2) {
    const totalLength = names[0].length + names[1].length;
    if (totalLength < 30) {
      return { skillsCanRender: names, isRest: false, rest: 0 };
    }
    return { skillsCanRender: [names[0]], isRest: true, rest: 1 };
  }

  // больше двух
  if (names[0].length > 18 || names[1].length > 18) {
    return { 
      skillsCanRender: [names[0]], isRest: true, rest: names.length - 1 
    };
  }

  return {
    skillsCanRender: names.slice(0, 2), isRest: true, rest: names.length - 2
  };
}