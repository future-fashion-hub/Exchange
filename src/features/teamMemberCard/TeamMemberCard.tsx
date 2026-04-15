import { FC } from "react";
import styles from "./TeamMemberCard.module.css";
import { SocialButton } from "../../shared/ui/social-button/SocialButton";
import { getImageUrl } from "../../shared/lib/helpers";

export type TTeamMember = {
  id: number;
  name: string;
  role: string;
  gitHubUrl: string;
  photo: string;
};

type TeamMemberCardProps = {
  member: TTeamMember;
};

export const TeamMemberCard: FC<TeamMemberCardProps> = ({ member }) => {
  const handleGitHubClick = () => {
    window.open(member.gitHubUrl, "_blank");
  };

  return (
    <article className={styles.card}>
      <div className={styles.avatarContainer}>
        <img
          src={getImageUrl(member.photo, "team")}
          alt={member.name}
          className={styles.avatar}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>

        <div className={styles.buttonContainer}>
          <SocialButton
            provider="github"
            onClick={handleGitHubClick}
            className={styles.gitHubButton}
          >
            GitHub
          </SocialButton>
        </div>
      </div>
    </article>
  );
};
