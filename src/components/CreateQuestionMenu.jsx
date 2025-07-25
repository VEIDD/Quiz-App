import style from "./css/CreateQuiz.module.css";
import checkbox from "./css/CheckBox.module.css";
import radio from "./css/Radio.module.css";
import { useEffect, useState } from "react";

function Variant({ index, value, fDel, onChange, isCorrect, changeCorrect }) {
  return (
    <li>
      <input
        type="text"
        placeholder={`Варіант ${index + 1}`}
        id={index}
        className={style.variant}
        onChange={(e) => onChange(index, e.target.value)}
        value={value}
      />

      <span className={checkbox.checkboxWrapper}>
        <input
          style={{ top: 10, marginLeft:20 }}
          type="checkbox"
          checked={isCorrect}
          id={index}
          onChange={(e) => changeCorrect(index, e)}
        />
      </span>

      {index >= 2 && (
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          alt={"delete"}
          className={style.del_variant}
          onClick={() => fDel(index)}
        />
      )}
    </li>
  );
}

function ModalError({ textError }) {
  return (
    <div className={style.modal2}>
      <p>{textError}</p>
    </div>
  );
}
export const Modal = ({
  onClose,
  onChangeQuestions,
  numberQuestion,
  editQuestion,
  plusNumberQuestion,
}) => {
  let [variants, updateVariants] = useState([
    { value: "", isCorrect: false },
    { value: "", isCorrect: false },
  ]);

  let [heigth, setHeigth] = useState(600);
  const [mode, setMode] = useState("solo");

  useEffect(() => {
    if (editQuestion) {
      setMode(editQuestion.mode);
      setValueTextArea(editQuestion.title);
      updateVariants(editQuestion.variants.map((v) => ({ ...v })));
      setIsEditQuestion(true);
    }
  }, [editQuestion]);

  const addVariant = () => {
    updateVariants((prev) => [...prev, { value: "", isCorrect: false }]);
    setHeigth((prev) => prev + 40);
  };

  const updateVariant = (index, newValue) => {
    updateVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, value: newValue } : v))
    );
  };
  const del_variant = (indexToDelete) => {
    updateVariants((prev) => prev.filter((_, i) => i !== indexToDelete));
    setHeigth((prev) => prev - 40);
  };

  const changeCorrect = (index, e) => {
    if (mode === "solo") {
      updateVariants((prev) => {
        const newVariants = [...prev];
        const isCorrect = newVariants[index].isCorrect;

        if (isCorrect) {
          newVariants[index].isCorrect = false;
        } else {
          newVariants.forEach((v) => (v.isCorrect = false));
          newVariants[index].isCorrect = true;
          console.log(newVariants);
        }

        return newVariants;
      });
    } else if (mode === "multiply") {
      updateVariants((prev) => {
        const newVariants = [...prev];
        console.log(newVariants);
        newVariants[index].isCorrect = !newVariants[index].isCorrect;

        return newVariants;
      });
    }
  };
  const [isEditQuestion, setIsEditQuestion] = useState(false);

  const [value_textarea, setValueTextArea] = useState("");
  const [isShowModalError, setIsShowModalError] = useState(false);
  const [textError, setTextError] = useState("");

  const onChangeTextArea = (e) => {
    setValueTextArea(e.target.value);
  };

  const catchErrors = (arr) => {
    if (value_textarea.trim() === "") {
      setTextError("Заповніть поле запитання");
      showError();
      return false;
    }

    const hasEmpty = variants.some((v) => v.value.trim() === "");
    if (hasEmpty) {
      setTextError("Заповніть усі варіанти відповіді");
      showError();
      return false;
    }

    const hasCorrect = variants.some((v) => v.isCorrect);

    if (!hasCorrect) {
      setTextError("Виберіть 1 правильну відповідь");
      showError();
      return false;
    }
    console.log(editQuestion.mode);
    if (mode === "solo") {
      const hasManyCorrect = variants.filter((v) => v.isCorrect);

      if (hasManyCorrect.length > 1) {
        setTextError("Виберіть 1 правильну відповідь");
        showError();
        return false;
      }
    }

    const hasDuplicates = (arr) => {
      const values = arr.map((v) => v.value.trim().toLowerCase());
      return new Set(values).size !== values.length;
    };

    if (hasDuplicates(arr)) {
      setTextError("Відповіді мають бути різні");
      showError();
      return false;
    }

    return true;
  };

  const isQuestionChanged = () => {
    if (!editQuestion) return true;

    const originalTitle = editQuestion.title.trim();
    const currentTitle = value_textarea.trim();
    if (originalTitle !== currentTitle) return true;

    if (editQuestion.variants.length !== variants.length) return true;

    for (let i = 0; i < variants.length; i++) {
      const originalVariant = editQuestion.variants[i];
      const currentVariant = variants[i];

      if (
        originalVariant.value.trim() !== currentVariant.value.trim() ||
        originalVariant.isCorrect !== currentVariant.isCorrect
      ) {
        return true;
      }
    }

    if (editQuestion.mode !== mode) return true;

    return false;
  };

  const showError = () => {
    setIsShowModalError(true);
    setTimeout(() => setIsShowModalError(false), 1000);
  };

  const createQuestion = () => {
    if (!catchErrors(variants)) return;

    plusNumberQuestion();

    const question = {
      numberQuestion,
      title: value_textarea,
      mode: mode,
      variants: variants,
    };
    onChangeQuestions(question, false);
    onClose();
  };
  const updateQuestion = () => {
    if (!catchErrors(variants)) return;

    if (!isQuestionChanged()) {
      setTextError("Жодних змін не внесено");
      showError();
      return;
    }

    const question = {
      numberQuestion,
      title: value_textarea,
      mode: mode,
      variants: variants,
    };

    onChangeQuestions(question, true);
    onClose();
  };
  return (
    <div className={style.modal} style={{ height: `${heigth}` }}>
      {isShowModalError && <ModalError textError={textError} />}

      <h1>Додати запитання</h1>
      <p>Запитання (обов'язкове поле) </p>
      <textarea
        className={style.textarea}
        placeholder="Ваше запитання"
        onChange={onChangeTextArea}
        value={value_textarea}
      ></textarea>
      <p>Вкажіть варіанти відповідей</p>
      <div className={radio.radioWrapper}>
        <input
          type="radio"
          name="ra"
          id="1"
          onChange={() => setMode("multiply")}
          checked={mode === "multiply"}
        />
        <label htmlFor="multiply">Декілька правильних відповідей</label>
        <br />
        <input
          type="radio"
          name="ra"
          id="2"
          checked={mode === "solo"}
          onChange={() => setMode("solo")}
        />
        <label htmlFor="solo">Одна правильна відповідь</label>
      </div>
      <ul className={style.questions}>
        {variants.map((variant, index) => {
          return (
            <Variant
              key={index}
              index={index}
              fDel={del_variant}
              value={variant.value}
              isCorrect={variant.isCorrect}
              onChange={updateVariant}
              changeCorrect={changeCorrect}
              setMode={setMode}
            />
          );
        })}
      </ul>

      <button onClick={addVariant} className={style.add_question_btn}>
        Додати варіант відповіді
      </button>
      <div className={style.btns}>
        <button onClick={onClose}>Назад</button>
        {isEditQuestion ? (
          <button onClick={updateQuestion}>Оновити запитання</button>
        ) : (
          <button onClick={createQuestion}>Створити запитання</button>
        )}
      </div>
    </div>
  );
};
