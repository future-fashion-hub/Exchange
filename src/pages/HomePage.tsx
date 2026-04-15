import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Мастерство <span className="text-primary">по обмену</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Ведущая платформа для обмена экспертным мнением и творческими компетенциями. 
            Учите тому, что вы знаете, и обучайтесь тому, о чем мечтаете.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth/register" className="bg-primary hover:bg-secondary text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Присоединиться к Atelier
            </Link>
            <Link to="/skills" className="bg-white dark:bg-gray-800 text-primary border border-primary dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-4 px-8 rounded-full shadow transition-all duration-300">
              Каталог навыков
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 w-[800px] h-[800px] opacity-30 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full blur-[100px] mix-blend-multiply"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Почему выбирают Exchange?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Экспертные наставники', desc: 'Учитесь у лучших профессионалов рынка абсолютно бесплатно через взаимный обмен.' },
              { title: 'Гибкость и удобство', desc: 'Управляйте своими заявками и чатами прямо в личном кабинете.' },
              { title: 'Бесконечный рост', desc: 'Расширяйте горизонты с системой рейтингов и персональными рекомендациями.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-primary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
