import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../shared/ui/icon/Icon";

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="text-primary italic">Exchange</span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
              Премиальная экосистема обмена навыками для современных цифровых мастеров. Качественное обучение встречает осознанное сообщество.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-6">Платформа</h3>
            <ul className="space-y-4">
              <li><Link to="/skills" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Каталог</Link></li>
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Как это работает</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Топ участников</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Блог</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-6">Поддержка</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Центр помощи</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Политика конфиденциальности</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Условия использования</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-6">Сообщество</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Правила сообщества</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Партнерства</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">Рассылка</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">События</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2024 Exchange. Все права защищены.</p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-gray-900 dark:hover:text-white">Конфиденциальность</Link>
            <Link to="#" className="hover:text-gray-900 dark:hover:text-white">Условия сервиса</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
