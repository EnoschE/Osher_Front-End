import { useTranslation } from "react-i18next";
import CustomButton from "../../Common/CustomButton";
import { TranslateOutlined } from "@mui/icons-material";
import { languageKey, languages } from "../../../i18n";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const isEnglishSelected = i18n.language === languages.ENGLISH;

  const handleLanguageToggle = () => {
    const language = isEnglishSelected ? languages.FRENCH : languages.ENGLISH;

    i18n.changeLanguage(language);
    localStorage.setItem(languageKey, language);
  };

  return (
    <CustomButton variant='text' onClick={handleLanguageToggle}>
      <TranslateOutlined />
      {isEnglishSelected ? "French" : "English"}
    </CustomButton>
  );
};

export default LanguageSelector;
