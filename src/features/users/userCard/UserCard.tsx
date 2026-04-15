// src\features\users\userCard\UserCard.tsx

import { useNavigate } from "react-router-dom";
import { Icon } from '../../../shared/ui/icon/Icon';
import { Button } from "../../../shared/ui/button/Button";
import { SkillTag } from "../../skills/skillTag/SkillTag";
import { TUser } from "../../../api/types";
import { prepareSkillsToRender } from "../../../shared/lib/prepareSkillsToRender";
import { RootState, useDispatch, useSelector } from '@store';
import { setOfferUser } from '../../../services/users/users-slice';
import { birthdayToFormatedAge, getImageUrl } from "../../../shared/lib/helpers";
import { setUser } from "../../../services/user/user-slice";
import clsx from "clsx";
import styles from "./UserCard.module.css";
import { toggleLikeAction } from "../../../services/users/actions";

type UserCardProps = {
  user: TUser;
  needAbout?: boolean;
};

export const UserCard = ({
  user,
  needAbout = false
}: UserCardProps) => {
  const subCategories = useSelector((s: RootState) => s.categories.subcategories);

  // фича prepareSkillsToRender возвращает массив скилов
  // таким образом, чтобы они уместились в строке целиком, без обрезания
const { skillsCanRender, isRest, rest } = prepareSkillsToRender(
  user.need_subcat,
  subCategories
);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const age = birthdayToFormatedAge(user.birthdate);
  const avatar = getImageUrl(user.photo);
  const onDetailsClick = () => {
    dispatch(setOfferUser(user));
    navigate(`/skills/${user.id}`);
  }
  
  return (
    <article className={clsx(
      styles.card,
      needAbout && styles.cardAbout
    )}>
      <section className={styles.userInfo}>
        <div className={styles.userInfoContainer}>

          <img
            src={avatar}
            alt="фото профиля"
            className={styles.avatar}
            onClick={() => dispatch(setUser(user))}
          />

          <div className={styles.infoWrapper}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.fromAge}>{`${user.from}, ${age}`}</p>
          </div>
        </div>

        {!needAbout && (
          <Icon
            name={user.likedByMe ? 'like-active' : 'like'}
            alt={user.likedByMe ? 'уже лайкнул' : 'поставить лайк'}
            className={styles.like}
            // onClick={() => dispatch(toggleLike(user.id))}
            onClick={() => dispatch(toggleLikeAction(user.id))}
          />        
        )}

      </section>

      {needAbout && (
        <section className={styles.about}>
          <p>{user.about}</p>
        </section>
      )}

      <section>
        <div className={clsx(
          styles.canTeach,
          needAbout && styles.canTeachAbout
        )}>
          <p className={clsx(
            styles.offer,
            needAbout && styles.offerAbout
          )}>
            Может научить
          </p>
          <ul className={styles.tagWrapper}>
              <SkillTag skill={user.sub_text} />
          </ul>
        </div>
        <div>
          <p className={clsx(
            styles.offer,
            needAbout && styles.offerAbout
          )}>
            Хочет научиться
          </p>
          <ul className={styles.tagWrapper}>
            {skillsCanRender.map((item, index) => {
              return (
                <li key={index} className={styles.tag}>
                  <SkillTag skill={item as string} />
                </li>
              );
            })}

            {isRest && (
              <li>
                <SkillTag rest={rest} />
              </li>
            )}
          </ul>
        </div>
      </section>
 
      {!needAbout && (
        <Button colored className={styles.button} onClick={onDetailsClick}>
          Подробнее
        </Button>
      )}
    </article>
  );
};
