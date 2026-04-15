// src\pages\not-found-page\NotFoundPage.tsx

import error404 from '@images/error-404.svg';
import { ErrorPage } from '@widgets';

export const NotFoundPage = () => {
  return(
    <ErrorPage
      title='Страница не найдена'
      text='К сожалению, эта страница недоступна.
            Вернитесь на главную страницу или попробуйте позже'
      image={error404}
      alt='Ошибка 404'
    />
  )
}