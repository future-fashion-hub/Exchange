// src/app/App.tsx

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";

import {
  DropdownDemo,
  DropdownGroupedDemo,
  Footer,
  GridList,
  Header,
  SkillForm,
} from "@widgets";

import { ServerErrorPage } from "../pages/server-error-page/ServerErrorPage";
import { NotFoundPage } from "../pages/not-found-page/NotFoundPage";

//То, что есть
import { HomePage } from "../pages/HomePage";

import { ProfilePage } from "../pages/profile/ProfilePage";

// Страницы регистрации
import { RegistrationStep1 } from "../pages/registration/RegistrationStep1";

import { RegistrationStep3Merged } from "../pages/registration/RegistrationStep3Merged";
import { RegistrationStepMerged } from "../pages/registration/RegistrationStepMerged";

import { ChatPage } from "../pages/chat/ChatPage";
import { AdminDashboard } from "../pages/admin/AdminDashboard";

//Данные/типы/стор (для каталога)
import { RootState, useDispatch } from "@store";
import { useSelector } from "@store";
import { AuthForm, FilterSection } from "@features";

import { getPlacesThunk } from "../services/places/actions";
import { getCategoriesThunk } from "../services/categories/actions";
import { getUserLikesThunk } from "../services/user/actions";

import { OfferPage } from "../pages/Offer/OfferPage";

import { getPopularUsersThunk } from "../services/popularUsers/actions";

import { ScrollToTop } from "../features/scrollToTop/ScrollToTop";

import { getCreatedAtUsersThunk } from "../services/createdAtUsers/actions";
import { getRandomUsersThunk } from "../services/randomUsers/actions";

import { About } from "../pages/about/About";
// import { getFilteredUsersThunk } from "../services/filteredUsers/actions";
// no need to import GENDERS or TGender
import { getOffersThunk } from "../services/offers/actions";
import { getOffers } from "../services/offers/offers-slice";
import { getUsersThunk } from "../services/users/actions";

import { HeaderWithModal } from '../widgets/header/HeaderWithModal';
import { registerApi } from "../api/Api";

import styles from "./App.module.css";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  // const API_USER_ID = Number(import.meta.env.VITE_AUTH_USER_ID);

  // Подгружаем данные при старте
  React.useEffect(() => {
    dispatch(getOffersThunk()); //подгружаем все офферы
    // dispatch(getUserThunk(API_USER_ID));

    dispatch(getUsersThunk(1));
    dispatch(getPopularUsersThunk(1));
    dispatch(getCreatedAtUsersThunk(1));
    dispatch(getRandomUsersThunk(1));
    // dispatch(getFilteredUsersThunk({
    //   page:1,
    //   gender:GENDERS.MALE,
    // }));

    dispatch(getPlacesThunk());
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const currentUser = useSelector((s: RootState) => s.user.user);
  const offers = useSelector(getOffers);

  // лайки грузятся при смене пользователя
  React.useEffect(() => {
    if (currentUser) {
      dispatch(getUserLikesThunk(currentUser.id));
    }
  }, [dispatch, currentUser, offers]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Страницы регистрации (без общего Layout, так как у них свой дизайн) */}
        <Route
          path="registration/step1"
          element={
            <RegistrationStep1
              onContinue={async (fullName, email, password) => {
                try {
                  await registerApi({ fullName, email, password });
                  window.location.href = "/registration/step2";
                } catch (error) {
                  console.error("Registration step 1 error:", error);
                  alert("Не удалось зарегистрироваться. Проверьте данные и повторите попытку.");
                }
              }}
            />
          }
        />
        <Route
          path="registration/step2"
          element={
            <RegistrationStepMerged />
          }
        />
        <Route
          path="registration/step3"
          element={
            <RegistrationStep3Merged
              onBack={() => (window.location.href = "/registration/step2")}
              onComplete={() => {
                console.log("Step 3 data completed!");
                window.location.href = "/";
              }}
            />
          }
        />

        <Route element={<Layout />}>
          {/*То, что есть*/}
          <Route index element={<HomePage />} />
          <Route path="skills" element={<CatalogContent />} />
          <Route path="auth/login" element={<LoginContent />} />
          <Route path="auth/register" element={<RegisterContent />} />
          <Route path="skill/new" element={<SkillFormContent />} />
          <Route path="skills/:id" element={<OfferPage />} />
          <Route path="demo/dropdowns" element={<DropdownsDemoContent />} />
          <Route path="about" element={<About />} />

          {/*заглушки*/}
          <Route path="favorites" element={<FavoritesPageStub />} />
          <Route path="requests" element={<RequestsPageStub />} />

          {/* ПРОФИЛЬ */}
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="chat" element={<ChatPage />} />
            {/* Все подразделы профиля ведут на 404 */}
            <Route path="notifications" element={<NotFoundPage />} />
            <Route path="requests" element={<NotFoundPage />} />
            <Route path="exchanges" element={<NotFoundPage />} />
            <Route path="favorites" element={<NotFoundPage />} />
            <Route path="skills" element={<NotFoundPage />} />
          </Route>

          <Route path="admin" element={<AdminDashboard />} />

          {/* Системные */}
          <Route path="500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

//Общий Layout (для всех КРОМЕ главной), чтобы не дублировать везде хедер и футер
const Layout: React.FC = () => {
  const location = useLocation();
  const isRegistrationFlow = location.pathname.startsWith("/auth/register");

  return (
    <div className="layout">
      {!isRegistrationFlow && <HeaderWithModal />}
      <main className={styles.main}>
        <Outlet />
      </main>
      {!isRegistrationFlow && <Footer />}
    </div>
  );
};

//Каталог (FilterSection + GridList)
const CatalogContent: React.FC = () => {
  const users = useSelector((s: RootState) => s.users.users);

  const [selectedPlaces, setSelectedPlaces] = React.useState<string[]>([]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 flex-shrink-0 sticky top-24">
          <FilterSection
            onPlacesChange={setSelectedPlaces}
            selectedPlaces={selectedPlaces}
          />
        </aside>

        
        {/* Main Grid Content */}
        <main className="w-full md:w-3/4 flex-grow">
          <GridList
            users={users}
            // subCategories={subCategories}
            loading={false}
            hasMore={false}
            onLoadMore={() => {}}
          />
        </main>
      </div>
    </section>
  );
};

//Логин — AuthForm
const LoginContent: React.FC = () => (
  <section className="page page-auth">
    <AuthForm
      onContinue={(email, password) => {
        console.log("Email:", email, "Password:", password);
      }}
    />
  </section>
);

// Регистрация
const RegisterContent: React.FC = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({ fullName: "", email: "", password: "" });

  const handleStep1Continue = async (fullName: string, email: string, password: string) => {
    try {
      await registerApi({ fullName, email, password });
      setStep1Data({ fullName, email, password });
      setStep(2);
    } catch (error) {
      console.error("Registration step 1 error:", error);
      alert("Не удалось зарегистрироваться. Проверьте данные и повторите попытку.");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <section className="page page-auth w-full">
      {step === 1 && (
        <RegistrationStep1 onContinue={handleStep1Continue} />
      )}
      {step === 2 && (
        <RegistrationStepMerged
          onBack={handleBack}
          onComplete={() => {
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <RegistrationStep3Merged
          onBack={handleBack}
          onComplete={() => {
            console.log("Registration complete!!");
            window.location.href = "/";
          }}
        />
      )}
    </section>
  );
};

//Форма навыка
const SkillFormContent: React.FC = () => (
  <section className="page page-skillform">
    <SkillForm
      onBack={() => console.log("Back")}
      onContinue={() => console.log("Continue")}
    />
  </section>
);

//Демо: дропдауны
const DropdownsDemoContent: React.FC = () => (
  <section className="page page-dropdowns">
    <h2>Вариант Dropdown 1</h2>
    <DropdownDemo />
    <h2>Вариант Dropdown 2</h2>
    <DropdownGroupedDemo />
  </section>
);

// /skills/:id — детальная страница навыка (пока заглушка)
// const SkillPageStub: React.FC = () => {
//   const { id } = useParams();
//   return (
//     <section className="page page-skill">
//       <h1>Навык #{id}</h1>
//       <p>Здесь будет детальная страница навыка.</p>
//     </section>
//   );
// };

// /favorites
const FavoritesPageStub: React.FC = () => (
  <section className="page page-favorites">
    <h1>Избранное</h1>
    <p>Страница в разработке.</p>
  </section>
);

// /requests
const RequestsPageStub: React.FC = () => (
  <section className="page page-requests">
    <h1>Заявки</h1>
    <p>Страница в разработке.</p>
  </section>
);

export default App;
