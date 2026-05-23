import { RootState, useDispatch } from '@store';
import { useSelector } from 'react-redux';
import { UserCard } from '../../features/users/userCard/UserCard';
import { CardSlider } from '@widgets';
import { getOfferUser } from '../../services/users/users-slice';
import { Loader } from '../../shared/ui/loader/Loader';
import { getCurrentUser } from '../../services/user/user-slice';
import { addOfferThunk } from '../../services/offers/actions';
import { RegistrationModal } from '../../features/registration/RegistrationModal';
import { useState } from 'react';
import { toAbsoluteServerUrl } from '../../shared/lib/helpers';
import skillPlaceholder from '../../shared/assets/images/school-board.png';

const formatOfferId = (id: string | number) => {
  const value = String(id);
  return value.length > 8 ? value.slice(0, 8) : value;
};

export const OfferPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const currentUser = useSelector(getCurrentUser);
  const offerUser = useSelector(getOfferUser);
  const { users } = useSelector((state: RootState) => state.users);
  const coverImage = offerUser?.images?.[0] ? toAbsoluteServerUrl(offerUser.images[0]) : skillPlaceholder;
  const shortOfferId = offerUser ? formatOfferId(offerUser.id) : '';

  const handleExchange = () => {
    if (!offerUser) return;
    if (currentUser) {
      void dispatch(addOfferThunk({
        receiverId: String(offerUser.id),
      }))
        .unwrap()
        .then(() => {
          alert('Запрос на обмен отправлен.');
        })
        .catch((error) => {
          console.error('Create offer error:', error);
          alert('Не удалось отправить запрос на обмен.');
        });
    } else {
      setIsRegistrationModalOpen(true);
    }
  };

  const handleRegistrationComplete = () => {
    if (offerUser && currentUser) {
      void dispatch(addOfferThunk({
        receiverId: String(offerUser.id),
      }))
        .unwrap()
        .then(() => {
          alert('Запрос на обмен отправлен.');
        })
        .catch((error) => {
          console.error('Create offer error:', error);
        });
    }
  };

  if (!offerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-primary transition-colors">Главная</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Навыки</span>
          <span>/</span>
          <span className="font-semibold text-gray-900 dark:text-white" title={`Оффер #${offerUser.id}`}>
            Оффер #{shortOfferId}
          </span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 sticky top-6">
            <UserCard needAbout user={offerUser} />
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-300 font-bold rounded-full text-sm">
                Открыт к обмену
              </span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 font-bold rounded-full text-sm">
                {offerUser.cat_text || 'Категория'} / {offerUser.sub_text || 'Подкатегория'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              {offerUser.skill || 'Навык не указан'}
            </h1>

            <div className="w-full h-64 sm:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8 overflow-hidden">
              <img
                src={coverImage}
                alt="Skill"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = skillPlaceholder;
                }}
              />
            </div>

            <div className="prose dark:prose-invert max-w-none mb-10">
              <h3 className="text-xl font-bold mb-4">Описание навыка</h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {offerUser.description || 'Пользователь пока не добавил подробное описание своего навыка. Но вы всегда можете отправить запрос и обсудить детали в чате!'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Заинтересовал навык?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Отправьте запрос на обмен опытом. Это бесплатно.</p>
              </div>
              <button
                onClick={handleExchange}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Предложить обмен
              </button>
            </div>
          </div>
        </section>

        {!users ? (
          <Loader />
        ) : (
          <section className="pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-8 dark:text-white">Похожие предложения</h2>
            <CardSlider users={users} />
          </section>
        )}
      </div>

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </div>
  );
};
