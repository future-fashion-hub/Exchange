import { FC, useState, useEffect } from "react";
import { TeamMemberCard } from "../../features/teamMemberCard/TeamMemberCard";
import styles from "./About.module.css";
import { TTeamMember } from "../../features/teamMemberCard/TeamMemberCard";
import { TEAM_JSON_FILE } from "../../shared/const/paths";

export const About: FC = () => {
  const [teamMembers, setTeamMembers] = useState<TTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(TEAM_JSON_FILE);
        const data = await response.json();
        setTeamMembers(data.team || []);
      } catch (error) {
        console.error("Ошибка загрузки данных команды:", error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  const teamLeads = teamMembers.slice(0, 2);
  const otherMembers = teamMembers.slice(2);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        {/* Блок описания проекта */}
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>SkillSwap</h1>
          <div className={styles.content}>
            <p className={styles.paragraph}>
              <strong>SkillSwap</strong> — это учебный проект, реализованный как
              одностраничное приложение (SPA) на стеке React + TypeScript +
              Vite.
            </p>
            <p className={styles.paragraph}>
              Платформа позволяет пользователям обмениваться навыками, создавая
              сообщество взаимного обучения.
            </p>
            <p className={styles.paragraph}>
              Проект разрабатывается{" "}
              <a
                href="https://github.com/PM-YandexPracticum/SkillSwap_37_2"
                target="_blank"
                rel="noopener noreferrer" // для безопасности при открытии внеш ссылок
                className={styles.link}
              >
                Когортой 37
              </a>{" "}
              — командой, которая верит в силу совместного обучения. Для нас это
              не только возможность применить современные технологии на
              практике, но и шанс создать действительно полезный продукт,
              объединяющий людей через обмен знаниями.
            </p>
          </div>
        </section>

        {/* Блок команды */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Наша команда</h2>
          {loading ? (
            <p>Загрузка данных команды...</p>
          ) : (
            <>
              {/* Тимлиды - отдельная строка по центру */}
              <div className={styles.teamLeads}>
                {teamLeads.map((member) => (
                  <div key={member.id} className={styles.teamLeadCard}>
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>

              {/* Остальные участники - сетка 4x2 */}
              <div className={styles.teamGrid}>
                {otherMembers.map((member) => (
                  <div key={member.id} className={styles.teamMemberCard}>
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
