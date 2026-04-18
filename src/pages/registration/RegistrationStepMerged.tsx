import React, { useState } from "react";
import { Icon } from "../../shared/ui/icon/Icon";
import { updateMeApi, uploadAvatarApi } from "../../api/Api";

export interface RegistrationStepMergedProps {
  onBack?: () => void;
  onComplete?: () => void;
  onClose?: () => void;
}

export const RegistrationStepMerged: React.FC<RegistrationStepMergedProps> = ({
  onBack,
  onComplete,
  onClose,
}) => {
  const [offerTags, setOfferTags] = useState<string[]>(["UI/UX Design", "Figma", "Web Design"]);
  const [seekTags, setSeekTags] = useState<string[]>(["Frontend", "React", "TypeScript"]);
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else window.location.href = "/registration/step1";
  };

  const handleContinue = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const uploaded = await uploadAvatarApi(avatarFile);
        avatarUrl = uploaded.avatarUrl;
      }

      await updateMeApi({
        bio,
        offerTags,
        seekTags,
        ...(avatarUrl ? { avatarUrl } : {}),
      });

      if (onComplete) onComplete();
      else window.location.href = "/registration/step3";
    } catch (error) {
      console.error("Registration step 2 save error:", error);
      alert("Не удалось сохранить данные шага 2. Повторите попытку.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-10 px-4">
        <div className="mb-6 flex justify-between gap-2 max-w-md mx-auto">
          <div className="h-1 w-1/3 bg-primary rounded"></div>
          <div className="h-1 w-1/3 bg-primary rounded"></div>
          <div className="h-1 w-1/3 bg-gray-200 rounded"></div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Создайте свой профиль навыков</h1>

        <div className="space-y-6">
          {/* Card 1: Your Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Выберите ваши навыки</h2>
            <p className="text-gray-500 text-sm mb-4">Укажите, что вы умеете и чем готовы поделиться с другими</p>
            
            <div className="border rounded-lg p-3 flex flex-wrap gap-2 min-h-[50px] items-center mb-3">
              {offerTags.map((tag) => (
                <span key={tag} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {tag}
                  <button onClick={() => setOfferTags(offerTags.filter(t => t !== tag))} className="hover:text-indigo-900">
                    <Icon name="cross" size={14} />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="Добавить навык..." 
                className="outline-none flex-1 min-w-[120px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setOfferTags([...offerTags, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400">Популярные:</span>
              <button className="text-indigo-600 hover:underline" onClick={() => setOfferTags([...offerTags, 'JavaScript'])}>JavaScript</button>,
              <button className="text-indigo-600 hover:underline" onClick={() => setOfferTags([...offerTags, 'Python'])}>Python</button>,
              <button className="text-indigo-600 hover:underline" onClick={() => setOfferTags([...offerTags, 'Marketing'])}>Marketing</button>
            </div>
          </div>

          {/* Card 2: Want to Learn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Чему вы хотите научиться</h2>
            <p className="text-gray-500 text-sm mb-4">Укажите навыки, которые вы ищете для освоения</p>
            
            <div className="border rounded-lg p-3 flex flex-wrap gap-2 min-h-[50px] items-center mb-3">
              {seekTags.map((tag) => (
                <span key={tag} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {tag}
                  <button onClick={() => setSeekTags(seekTags.filter(t => t !== tag))} className="hover:text-emerald-900">
                    <Icon name="cross" size={14} />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="Найти навык..." 
                className="outline-none flex-1 min-w-[120px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setSeekTags([...seekTags, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* Card 3 & 4: Bio and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Краткая биография</h2>
              <p className="text-gray-500 text-sm mb-4">Расскажите немного о себе и своем опыте</p>
              <textarea 
                className="flex-1 w-full border rounded-lg p-3 text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Привет! Я UI/UX дизайнер с 3-летним опытом. Люблю создавать красивые интерфейсы и хочу подтянуть свои знания во фронтенде..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Right: Photo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2 w-full text-left">Превью карточки навыков</h2>
              <p className="text-gray-500 text-sm mb-6 w-full text-left">Это фото для карточки навыков, не для основного профиля.</p>
              
              <div className="relative group w-32 h-32 mb-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-indigo-50" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                     <Icon name="galleryedit" size={32} />
                  </div>
                )}
                
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-sm font-medium">Изменить</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="text-xs text-gray-400">Рекомендуемый размер 256x256 px<br/>Форматы: JPG, PNG, GIF</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            &larr; Назад
          </button>
          <button 
            onClick={handleContinue}
            disabled={isSaving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            {isSaving ? "Сохраняем..." : "Продолжить к шагу 3 →"}
          </button>
        </div>
      </main>
    </div>
  );
};