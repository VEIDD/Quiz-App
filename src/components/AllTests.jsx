import { useEffect, useState } from "react";
import styles from "./css/AllQuizes.module.css";
import style from "./css/Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export const AllTests = () => {
  let url = "https://quiz-server-kkjt.onrender.com/all";
  const urlA = `test?code=`;
  let [isShowLoader, setIsShowLoader] = useState(false);
  let [quizes, setQuizes] = useState([]);
  let [quizesRender, setQuizesRender] = useState([]);
  let [value, setValue] = useState("");
  let [placeholder, setPlace] = useState("Пошук");
  let [searchNotDefined, setSearchNotDefined] = useState(false);
  const changeInput = (e) => {
    setValue(e.target.value);
  };
  const searchHandler = () => {
    if (value === "") {
    } else {
      setValue("");
    }

    let search_result = quizesRender.filter((quiz) =>
      quiz.title.replace(/\s/g, "").toLowerCase().includes(value.toLowerCase())
    );
    if (search_result.toString() === [].toString()) {
      setSearchNotDefined(true);
    } else {
      setSearchNotDefined(false);
    }
    setQuizes(search_result);
  };
  useEffect(() => {
    setIsShowLoader(true);

    const fetchTests = async (url) => {
      let response = await fetch(url);
      let data = await response.json();
      setIsShowLoader(false);
      setQuizes(data);
      setQuizesRender(data);
    };
    fetchTests(url);
  }, []);
  const navigate = useNavigate();
  const goTest = (e) => {
    navigate(`${urlA}${e.target.id}`);
  };
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility((prev) => !prev);
  };
  return (
    <div className={`${visibility ? style.active_body : ""}`}>
      <header className={style.header}>
        <div className={style.container}>
          <div className={style.left}>
            <img
              src="https://quiz-server-kkjt.onrender.com/icons/logo.png"
              alt="Logo"
              width="130px"
            />
            <NavLink
              to="/"
              className={style.title}
              onClick={() => {
                localStorage.removeItem("form_status");
              }}
            >
              Quiz App
            </NavLink>
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
              <NavLink
                to="/"
                onClick={() => {
                  localStorage.setItem("form_status", "startCode");
                }}>
                Почати за кодом
              </NavLink>
              <NavLink to="/admin">
                {sessionStorage.getItem("isAuthenticated")
                  ? "Адмін панель"
                  : "Увійти"}
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.div_search}>
        <input
          type="text"
          placeholder={placeholder}
          className={styles.search}
          value={value}
          onChange={changeInput}
        />
        <button onClick={searchHandler}>Шукати</button>
      </div>
      {isShowLoader && (
        <div className={styles.center_loader}>
          <div className={styles.loader}></div>
        </div>
      )}
      {searchNotDefined && (
        <h1 className={styles.searchNot}>
          За вашим запитом нічого не знайдено
        </h1>
      )}
      <div className={styles.tests_center}>
        <div className={styles.tests}>
          {quizes.map((quiz) => {
            return (
              <div key={quiz.code} className={styles.test}>
                <h2>Назва:{quiz.title}</h2>
                <h2>Автор:{quiz.author}</h2>
                <h3>Кількість запитань:{quiz.questions.length}</h3>
                <h3>Код:{quiz.code}</h3>
                <a
                  className={styles.toTest}
                  onClick={goTest}
                  id={quiz.code}
                  href={`${window.location.origin}/quiz-app/${urlA}${quiz.code}`}
                >
                  Пройти тест
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
