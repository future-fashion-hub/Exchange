import { useNavigate } from "react-router-dom";
import { Icon } from '../../../shared/ui/icon/Icon';
import { SkillTag } from "../../skills/skillTag/SkillTag";
import { TUser } from "../../../api/types";
import { prepareSkillsToRender } from "../../../shared/lib/prepareSkillsToRender";
import { RootState, useDispatch, useSelector } from '@store';
import { setOfferUser } from '../../../services/users/users-slice';
import { birthdayToFormatedAge, getImageUrl } from "../../../shared/lib/helpers";
import { setUser } from "../../../services/user/user-slice";
import { toggleLikeAction } from "../../../services/users/actions";
import clsx from "clsx";

type UserCardProps = {
  user: TUser;
  needAbout?: boolean;
};

export const UserCard = ({
  user,
  needAbout = false
}: UserCardProps) => {
  const subCategories = useSelector((s: RootState) => s.categories.subcategories);
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
  };

  return (
    <article className={clsx(
      "flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group",
      needAbout && "shadow-none border-none hover:shadow-none hover:transform-none"
    )}>
      
      {/* Decorative top colored border */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-indigo-500 absolute top-0 left-0"></div>

      <div className="p-6 flex-grow flex flex-col pt-8">
        {/* Header: Avatar, Name, Age, Like */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => dispatch(setUser(user))}>
            <div className="relative">
              <img 
                src={avatar} 
                alt="Аватар профиля" 
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.from}, {age}</p>
            </div>
          </div>
          
          {!needAbout && (
            <button 
              onClick={() => dispatch(toggleLikeAction(user.id))}
              className={`p-2 rounded-full transition-colors ${user.likedByMe ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill={user.likedByMe ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          )}
        </div>

        {needAbout && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            {user.about}
          </p>
        )}

        {/* Skills Section */}
        <div className="mt-2 space-y-4 flex-grow">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Может научить</p>
            <div className="flex flex-wrap gap-2">
               <span className="inline-block px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-bold rounded-full border border-green-100 dark:border-green-800">
                 {user.sub_text || "Дизайн интерфейсов"}
               </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Хочет научиться</p>
            <div className="flex flex-wrap gap-2">
              {skillsCanRender.map((item, index) => (
                <span key={index} className="inline-block px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">
                  {item as string}
                </span>
              ))}
              {isRest && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-bold rounded-full">
                  +{rest}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {!needAbout && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          <button 
            onClick={onDetailsClick}
            className="w-full py-2.5 bg-white dark:bg-gray-800 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
          >
            Подробнее
          </button>
        </div>
      )}
    </article>
  );
};
