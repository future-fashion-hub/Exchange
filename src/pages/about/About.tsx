import { FC } from "react";

export const About: FC = () => {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-32 text-center relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-50 blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-indigo-400 opacity-40 blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-4 block">О сервисе</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Больше, чем просто <span className="italic font-serif">Exchange</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Мы верим, что знаниями нужно делиться. Наша образовательная экосистема объединяет таланты со всего мира для бесплатного и безлимитного обмена опытом.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        
        {/* Card: Mission */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 mb-16 flex flex-col md:flex-row gap-12 items-center border border-gray-100 dark:border-gray-700">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Валюта будущего —<br />это ваши знания</h2>
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
              <p>
                <strong>Exchange</strong> — это инновационная платформа, которая меняет фокус в обучении. Мы предлагаем забыть о дорогих курсах, бесконечных подписках и скрытых комиссиях платформы.
              </p>
              <p>
                В нашем сообществе единственным средством оплаты являются <strong>ваши навыки</strong>. Мы верим, что каждый человек обладает уникальным опытом, который представляет огромную ценность для других.
              </p>
              <p>
                Хотите выучить французский? Предложите взамен помощь с настройкой рекламы. Мечтаете освоить программирование? Поделитесь своими знаниями в области дизайна.
              </p>
              <p className="font-semibold text-primary pt-2">
                Создавайте связи, учитесь новому и делитесь своим талантом — абсолютно бесплатно. Деньги здесь не имеют значения.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden relative shadow-inner">
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Team collaborating" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white pr-6">
                <p className="font-bold text-2xl mb-1">Прямой обмен опытом</p>
                <p className="text-sm opacity-90">Люди учат людей без посредников и оплаты</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
