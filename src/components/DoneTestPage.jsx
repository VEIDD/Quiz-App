import styles from "./css/DoneQuizPage.module.css";
import style from "./css/Header.module.css";
import { NavLink } from "react-router-dom";
export const TestCreatePage = () => {
  const code = localStorage.getItem("code-for-info");
  const url = `/quiz-app/test?code=${code}`;
  const copyUrlHandler = (e) => {
    e.target.textContent = "Скопійовано";
    setTimeout(() => {
      e.target.textContent = "Копіювати посилання 📋";
    }, 1000);
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
  };
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility((prev) => !prev);
  };
  return (
    <div>
       <header className={style.header}>
        <div className={style.container}>
          <div className={style.left}>
            <img
              src="https://quiz-server-kkjt.onrender.com/icons/logo.png"
              alt="Logo"
              width="130px"
            />
            <NavLink to="/" className={style.title}>Quiz App</NavLink>
          </div>
          <div
            onClick={changeVisibility}
            className={`${style.burger_menu} ${visibility ? style.active : ""}`}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`${style.nav} ${visibility ? style.active_nav : ""}`}>
            <div className={style.nav_links}>
              <NavLink to="/all-tests">Всі тести</NavLink>
              <NavLink to="/your-tests">Мої тести</NavLink>
              <NavLink to="/">Почати за кодом</NavLink>
              <NavLink to="/admin">
                {sessionStorage.getItem("isAuthenticated")
                  ? "Адмін панель"
                  : "Увійти"}
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.center}>
        <div className={styles.info}>
          <div className={styles.title2}>
            <h1>Ваш тест успішно створено</h1>
            <p>Ваш тест доступний за кодом {code}</p>
            <p>
              Або за посиланням
              {
                <a href={url} className={styles.url} target="_blank">
                  {" " + `${window.location.origin}${url}`}
                </a>
              }
            </p>
          </div>
          <button className={styles.btn_copy} onClick={copyUrlHandler}>
            Копіювати посилання 📋
          </button>
          <NavLink to="/" className={styles.backHome}>
            Повернутись на головний екран
          </NavLink>
        </div>
      </div>
    </div>
  );
};
