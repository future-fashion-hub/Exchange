import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const RegistrationStep1: React.FC<{ onContinue: (email: string, pass: string) => void, onClose?: () => void }> = ({ onContinue, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === passwordRepeat && email && name) {
      // In real scenario, we'll store name and email in Redux or Context
      onContinue(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Создать аккаунт
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Добро пожаловать в Exchange. Давайте начнем ваш путь к экспертному обмену.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700">
          <div className="mb-6 flex justify-between gap-2">
            <div className="h-1 w-1/3 bg-primary rounded"></div>
            <div className="h-1 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-1 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Полное имя</label>
              <div className="mt-1">
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" className="appearance-none block w-full px-3 py-3 border border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-gray-900 dark:text-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Электронная почта</label>
              <div className="mt-1">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="appearance-none block w-full px-3 py-3 border border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-gray-900 dark:text-white transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пароль</label>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="********" className="appearance-none block w-full px-3 py-3 border border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-gray-900 dark:text-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Повторите</label>
                <div className="mt-1">
                  <input type="password" required value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)} placeholder="********" className="appearance-none block w-full px-3 py-3 border border-transparent rounded-xl bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-gray-900 dark:text-white transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm">
                <Link to="/auth/login" className="font-semibold text-primary hover:text-secondary">
                  Уже есть аккаунт?
                </Link>
              </div>

              <button type="submit" className="flex justify-center py-3 px-6 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                Далее к шагу 2 &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
