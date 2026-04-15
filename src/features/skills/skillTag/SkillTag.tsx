// SkillTag.tsx
import { skillColors } from './skillColors';
import { SkillTagUI } from '../../../shared/ui/skillTag/SkillTagUI';

type SkillTagProps = {
  skill?: string;
  rest?: number;
  className?: string;
};

// Если не указывать проп-skill, то покажет проп-rest (когда нужно показать
//  количество невместившихся скилов) 
//  Поэтому указываем либо проп-скилл, либо проп-rest

export const SkillTag = ({ skill, rest, className }: SkillTagProps) => {
  if (!skill && rest) {
    return (
      <SkillTagUI
        className={className}
        label={`+${rest}`}
        backgroundColor="#e8ecf7"
      />);
  }

  if (skill) {
    return (
      <SkillTagUI
        className={className}
        label={skill}
        backgroundColor={skillColors[skill] ?? "#e8ecf7"}
      />
    );
  }

  return null;
};
