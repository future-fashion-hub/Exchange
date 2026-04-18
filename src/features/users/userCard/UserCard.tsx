import { useNavigate } from "react-router-dom";
import { TUser } from "../../../api/types";
import { prepareSkillsToRender } from "../../../shared/lib/prepareSkillsToRender";
import { RootState, useDispatch, useSelector } from '@store';
import { setOfferUser } from '../../../services/users/users-slice';
import { getImageUrl, toAbsoluteServerUrl } from "../../../shared/lib/helpers";

type UserCardProps = {
  user: TUser;
  needAbout?: boolean;
};

export const UserCard = ({
  user,
}: UserCardProps) => {
  const subCategories = useSelector((s: RootState) => s.categories.subcategories);
  const { skillsCanRender } = prepareSkillsToRender(
    user.need_subcat,
    subCategories
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatar = getImageUrl(user.photo);
  const coverImage = user.images?.[0] ? toAbsoluteServerUrl(user.images[0]) : avatar;
  
  // Use user's primary offer as title, fallback to something else
  const title = user.sub_text || (skillsCanRender[0] as string) || "Обучение и обмен опытом";
  
  // Category for the badge
  const badge = user.sub_text ? user.sub_text.split(' ')[0] : "РАЗРАБОТКА";

  const onDetailsClick = () => {
    dispatch(setOfferUser(user));
    navigate(`/skills/${user.id}`);
  };

  return (
    <article className="flex flex-col w-full h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      
      {/* Cover Image */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img 
           src={coverImage}
           alt="Cover"
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           onError={(e) => {
             (e.target as HTMLImageElement).src = avatar;
           }}
        />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm uppercase tracking-wider">
           <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
           {badge}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col pt-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
           <div className="relative">
             <img 
               src={avatar} 
               alt={user.name} 
               className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-600"
             />
           </div>
           <div>
             <h3 className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</h3>
             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
               <svg className="w-3.5 h-3.5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
               <span className="font-semibold text-gray-700 dark:text-gray-300">4.9</span>
               <span className="ml-1 opacity-75">(12 обменов)</span>
             </div>
           </div>
        </div>

        {/* Content */}
        <h4 className="font-extrabold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer" onClick={onDetailsClick}>
          {title}
        </h4>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
          {user.about || "Свяжитесь со мной для подробностей. Буду рад обсудить возможности сотрудничества и обмена навыками в удобное для нас время."}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <button 
            onClick={onDetailsClick}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 py-3 px-4 rounded-full font-semibold text-sm transition-colors text-center"
          >
            Подробнее
          </button>
          <button 
            className="flex-1 bg-blue-50 text-primary hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 py-3 px-4 rounded-full font-bold text-sm tracking-wide transition-colors text-center uppercase"
          >
            Обменять
          </button>
        </div>
      </div>
    </article>
  );
};
