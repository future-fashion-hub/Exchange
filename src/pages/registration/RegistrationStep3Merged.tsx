import React, { useState } from 'react';
import { Icon } from '../../shared/ui/icon/Icon';

export interface RegistrationStep3MergedProps {
  onBack?: () => void;
  onComplete?: () => void;
  onClose?: () => void;
}

export const RegistrationStep3Merged: React.FC<RegistrationStep3MergedProps> = ({ 
  onBack, 
  onComplete,
  onClose
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<'remote' | 'city'>('remote');
  const [city, setCity] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    } else {
      window.location.href = '/';
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/registration/step2';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl cursor-pointer" onClick={() => window.location.href='/'}>
          <Icon name="logo" size={32} />
          <span className="text-gray-900">SkillSwap</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-500 font-medium">Шаг 3 из 3</div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <Icon name="cross" size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-10 px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Завершите свой профиль</h1>
        <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
          Добавьте финальные штрихи к вашему цифровому ателье, чтобы начать общение с кураторами со всего мира.
        </p>

        <div className="space-y-6 max-w-2xl mx-auto">
          
          {/* Card 1: Фото профиля */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 w-full justify-start">
              <span className="w-10 h-10 rounded-lg bg-indigo-50 flex justify-center items-center text-indigo-500">
                <Icon name="userCircle" size={24} />
              </span>
              Фото профиля
            </h2>
            
            <div className="flex flex-col items-center justify-center mb-4">
              <label htmlFor="avatar-upload" className="cursor-pointer relative flex flex-col items-center justify-center w-36 h-36 rounded-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 transition-colors group overflow-visible">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
                
                {/* Edit Icon Overlay */}
                <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 w-9 h-9 rounded-full bg-blue-600 border-[3px] border-white flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/jpeg, image/png" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
            </div>
            <p className="text-center text-gray-400/80 text-[11px] font-bold tracking-wider uppercase">РЕКОМЕНДУЕТСЯ: 400X400PX JPG/PNG</p>
          </div>

          {/* Card 2: Ваше местоположение */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gray-100 flex justify-center items-center text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              Ваше местоположение
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                type="button" 
                onClick={() => setLocationType("remote")}
                className={`py-3.5 px-4 rounded-xl border flex justify-center items-center gap-2 font-semibold transition-colors ${
                  locationType === "remote" 
                  ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Удаленно
              </button>
              <button 
                type="button" 
                onClick={() => setLocationType("city")}
                className={`py-3.5 px-4 rounded-xl border flex justify-center items-center gap-2 font-semibold transition-colors ${
                  locationType === "city" 
                  ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
                В городе
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Введите ваш город (напр. Париж, Лондон)"
                className="w-full pl-11 pr-4 py-3.5 bg-indigo-50/30 border border-transparent rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-gray-400 text-gray-700 font-medium" 
              />
            </div>
          </div>

          {/* Card 3: Закрытый профиль */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex justify-center items-center text-pink-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">Закрытый профиль</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Виден только участникам по вашему запросу</p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPrivate ? "bg-indigo-300" : "bg-gray-200"}`}
                role="switch"
                aria-checked={isPrivate}
              >
                <span 
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPrivate ? "translate-x-5" : "translate-x-0"}`} 
                />
              </button>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto flex justify-between items-center mt-12 mb-8">
          <button 
            type="button" 
            onClick={handleBack}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Назад
          </button>
          <button 
            type="button" 
            onClick={handleContinue}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-full shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Завершить регистрацию
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};
