// src\pages\server-error-page\ServerErrorPage.tsx

import error500 from '@images/error-500.svg';
import { ErrorPage } from '@widgets';

export const ServerErrorPage = () => {
  return(
    <ErrorPage
      title='На сервере произошла ошибка'
      text='Попробуйте позже или вернитесь на главную страницу'
      image={error500}
      alt='Ошибка сервера 500'
    />
  )
}