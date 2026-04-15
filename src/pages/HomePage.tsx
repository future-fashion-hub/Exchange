import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 overflow-hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="lg:w-1/2 flex flex-col items-start text-left z-10 space-y-6">
            <span className="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Цифровое ателье
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Обменивайтесь<br />
              навыками в <br />
              <span className="text-primary italic">Exchange</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Присоединяйтесь к сообществу экспертов. Никаких комиссий
              и подписок — только чистый обмен талантами в нашей
              образовательной экосистеме.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/registration/step1" className="bg-primary hover:bg-secondary text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Начать
              </Link>
              <Link to="/about" className="bg-blue-100 dark:bg-gray-800 text-primary dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-700 font-semibold py-4 px-8 rounded-full transition-transform hover:-translate-y-1">
                Узнать больше
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-10 w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
            {/* The main hero image placeholder representing people talking */}
            <div className="w-full h-[500px] md:h-[600px] bg-gray-300 rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Exchange team" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating Overlay Card */}
              <div className="absolute bottom-8 left-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl flex items-center space-x-4 max-w-xs animate-bounce" style={{animationDuration: '3s'}}>
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                   <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Елена обменяла Python</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">на UI-дизайн 2 ч. назад</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-gray-100/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Как это работает</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Простой четырехэтапный процесс, созданный для вашего профессионального роста через сотрудничество.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'Поиск', desc: 'Откройте для себя мир знаний: от фотографии до квантовой физики в нашем каталоге.' },
              { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Предложение', desc: 'Опишите свой опыт и расскажите, чему вы хотите научиться взамен.' },
              { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', title: 'Общение', desc: 'Связывайтесь с партнерами для обсуждения целей, графиков и деталей обмена.' },
              { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', title: 'Обмен', desc: 'Завершите обмен навыками и расширяйте свой кругозор через практическое обучение.' }
            ].map((step, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 bg-blue-50 dark:bg-gray-700 text-primary rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step.icon}></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Популярные навыки</h2>
              <p className="text-gray-600 dark:text-gray-400">Самые востребованные обмены на данный момент.</p>
            </div>
            <Link to="/skills" className="text-primary font-medium hover:text-secondary hidden sm:flex items-center group">
              Смотреть все 
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { cat: 'Дизайн', title: 'Мастерство UI-дизайна', name: 'Маркус Чен', role: 'Тимлид в Studio-X', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80', avatar: 'https://i.pravatar.cc/100?img=11' },
              { cat: 'Языки', title: 'Уроки испанского', name: 'София Родригес', role: 'Носитель языка', img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80', avatar: 'https://i.pravatar.cc/100?img=9' },
              { cat: 'Разработка', title: 'Программирование Python', name: 'Дэвид Смит', role: 'Senior разработчик', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80', avatar: 'https://i.pravatar.cc/100?img=12' },
              { cat: 'Искусство', title: 'Курс фотографии', name: 'Лила Торн', role: 'Travel-фотограф', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', avatar: 'https://i.pravatar.cc/100?img=5' },
            ].map((skill, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={skill.img} alt={skill.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {skill.cat}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex-grow">{skill.title}</h3>
                  <div className="flex items-center space-x-3 mt-auto">
                    <img src={skill.avatar} alt={skill.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{skill.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{skill.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link to="/skills" className="text-primary font-medium hover:text-secondary flex items-center">
              Смотреть все 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Deep Blue CTA Block */}
      <section className="bg-gray-900 dark:bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Готовы расширить свои навыки?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Присоединяйтесь к более чем 50 000 творцов, разработчиков и преподавателей, 
            которые строят новый мир обмена знаниями. Ваш первый обмен — всего в одном клике.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <Link to="/registration/step1" className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition-colors">
              Создать бесплатный аккаунт
            </Link>
            <Link to="/support" className="w-full sm:w-auto bg-transparent border border-gray-600 hover:border-gray-400 text-white font-bold py-4 px-8 rounded-full transition-colors">
              Служба поддержки
            </Link>
          </div>
          <p className="text-sm text-gray-400">Банковская карта не требуется. Только обмен знаниями.</p>
        </div>
      </section>
    </div>
  );
};
