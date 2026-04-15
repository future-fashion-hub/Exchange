// src\pages\Offer\OfferPage.tsx

import { RootState, useDispatch } from '@store';
import { useSelector } from 'react-redux';
import { UserCard } from '../../features/users/userCard/UserCard';
import { Icon } from '../../shared/ui/icon/Icon';
import { CardShowcase } from '../../widgets/cardShowcase/CardShowcase';
import { CardSlider } from '@widgets';
import { SkillCardDetails } from '../../features/skills/skillCardDetails/skillCardDetails';
import { getOfferUser } from '../../services/users/users-slice';
import { Loader } from '../../shared/ui/loader/Loader';
import { getCurrentUser } from '../../services/user/user-slice';
import { addOfferThunk } from '../../services/offers/actions';
import { RegistrationModal } from '../../features/registration/RegistrationModal';
import { useState } from 'react';

import styles from './OfferPage.module.css';

export const OfferPage: React.FC = () => {
  
  const dispatch = useDispatch();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const currentUser = useSelector(getCurrentUser);
  const offerUser = useSelector(getOfferUser);
  const {users} = useSelector((state: RootState) => state.users);

   const handleExchange = () => {
    if (!offerUser) {
      console.error("Offer user is not available");
      return;
    }

    if (currentUser?.subCategoryId) {
      // Пользователь авторизован - предлагаем обмен
      dispatch(addOfferThunk({
        offerUserId: offerUser.id,
        skillOwnerId: currentUser.subCategoryId
      }));
    } else {
      // Пользователь не авторизован - показываем модалку регистрации
      setIsRegistrationModalOpen(true);
    }
  };

  const handleRegistrationComplete = () => {
    console.log("Регистрация завершена, можно предлагать обмен");
    // После регистрации можно сразу предложить обмен
    if (offerUser && currentUser?.subCategoryId) {
      dispatch(addOfferThunk({
        offerUserId: offerUser.id,
        skillOwnerId: currentUser.subCategoryId
      }));
    }
  };

  if (!offerUser) {
    return <Loader />;
  }

  return (
    <>
      <section className={styles.skillSection}>
        <div className={styles.userCard}>
          {offerUser && (
            <UserCard
              needAbout
              user={offerUser}
            />
          )}
        </div>
        {offerUser && (
          <SkillCardDetails
              title={offerUser.skill || "Навык не указан"}
              subtitle={`${offerUser.cat_text || ""} / ${offerUser.sub_text || ""}`}
              description={offerUser.description || "Описание отсутствует"}
              images={offerUser.images || ""}
              buttonText={"Предложить обмен"}
              onExchange={handleExchange}
          />)
        }
      </section>

      {!users && (
        <Loader />
      )}

{/* 
      похожие предложения должны браться из API
      к примеру у тебя 10000 пользователей. а загружено в users 100
      твой поиск будет только среди 100
 */}
     <section>
        <CardShowcase
          title="Похожие предложения"
          titleSize='1.5em'
          icon={<Icon name="chevronRight" />}>
            <CardSlider users={users}/>
        </CardShowcase>
      </section>

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </>
  )
};
