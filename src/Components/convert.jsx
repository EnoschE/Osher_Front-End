import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Convert = ({ text, language }) => {
  const [convertedText, setConvertedText] = useState('');

  useEffect(() => {
    const response = axios
      .post(
        'https://translation.googleapis.com/language/translate/v2',
        {},
        {
          params: {
            q: text,
            target: language,
            key: 'AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM'
          }
        }
      )
      .then((response) => {
        setConvertedText(response.data.data.translations[0].translatedText);
      })
      .catch((err) => {
        console.log('rest api error', err);
      });
  }, [text, language]);

  return <div>{convertedText}</div>;
};

export default Convert;