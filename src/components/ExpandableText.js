import React, {useState, useEffect} from 'react';
import {
  Text,
  View
} from 'react-native';

export default function ExpandableText({
  maxChar,
  buttonColor,
  buttonLabel,
  buttonCloseLabel,
  containerStyle,
  value,
}) {
  const [text, setText] = useState('');
  const [noCharacters, setnoCharacters] = useState(50);
  const [label, setLabel] = useState('Show more');
  const [closeLabel, setcloseLabel] = useState('Show Less');
  const [labelColor, setLabelColor] = useState('#4aa1ff');
  const [isShown, setisShown] = useState(false);
  useEffect(() => {
    setText(value);
    setnoCharacters(maxChar);
    if (buttonLabel != null) setLabel(buttonLabel);
    if (buttonCloseLabel != null) setcloseLabel(buttonCloseLabel);
    if (buttonColor != null) setLabelColor(buttonColor);
  }, [value, maxChar, buttonColor]);

  const trim = (text) => {
    if (text.length > noCharacters) {
      let res = text.slice(0, noCharacters);
      res = res + '...';
      return res;
    } else {
      return text;
    }
  };

  const toggleShown = () => {
    setisShown(!isShown);
  };

  return (
    <View style={containerStyle}>
      {!isShown ? (
        <Text>
          {trim(text)}
          {text.length > noCharacters ? (
            <Text style={{color: labelColor}} onPress={toggleShown}>
              {label}
            </Text>
          ) : null}
        </Text>
      ) : (
        <Text>
          {text}
          <Text style={{color: labelColor}} onPress={toggleShown}>
            {closeLabel}
          </Text>
        </Text>
      )}
    </View>
  );
}
