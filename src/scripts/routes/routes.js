import HomePage from "../pages/home/home-page";
import AddPage from "../pages/add/add-page";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";
import NotFound from "../pages/not-found/not-found";

const routes = {
  "/login": {
    page: new LoginPage(),
    requiresAuth: false,
  },
  "/register": {
    page: new RegisterPage(),
    requiresAuth: false,
  },

  "/": {
    page: new HomePage(),
    requiresAuth: true,
  },
  "/add": {
    page: new AddPage(),
    requiresAuth: true,
  },
  "/save-story": {
    page: new BookmarkPage(),
    requiresAuth: true,
  },

  "/404": {
    page: new NotFound(),
    requiresAuth: false,
  },
  "*": {
    page: new NotFound(),
    requiresAuth: false,
  },
};

export default routes;
