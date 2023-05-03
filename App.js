import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import {colors, CLEAR, ENTER, colorsToEmoji} from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...(arr.map(rows => [...rows]))]
 }

 const getDayOfTheYear = () => {
   const now = new Date();
   const start = new Date(now.getFullYear(), 0, 0);
   const diff = now - start;
   const oneDay = 1000 * 60 * 60 * 24;
   const day = Math.floor(diff / oneDay);
   return day;
 }

 const dayOfTheYear = getDayOfTheYear();
 print(dayOfTheYear)

 const words = [
   "hello",
   "world",
   "alina",
   "adieu",
   "watch",
   "silky",
   "asher",
   "kitty",
   "farms",
   "sicky",
   "punch",
   "slush",
   "quran",
   "proud",
   "witch",
   "slimey",
   "touch",
   "polar",
   "hello",
   "world",
   "alina",
   "adieu",
   "watch",
   "silky",
   "asher",
   "kitty",
   "farms",
   "sicky",
   "punch",
   "slush",
   "quran",
   "proud",
   "witch",
   "slimey",
   "touch",
   "polar",
 ]

export default function App() {

  const word = words[Math.floor(dayOfTheYear / 12)];
  const letters = word.split(''); // array of characters

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(
    new Array(letters.length).fill("")
  ));

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow])


  const checkGameState = () => {
    if (checkIfWon()){
      Alert.alert("Winner Chicken Dinner");
      setGameState('won');
    } else if (checkIfLost()) {
      Alert.alert('You suck');
      setGameState('lost');
    }
  }

  const shareScore = () => {
    const textShare = rows.map((row, i) => row.map((cell, j) => getCellBGColor(i, j)));
    console.log(textShare);
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  }

  const checkIfLost = () => {
    return currentRow === rows.length;
  } 

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }
    
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = currentCol - 1;

      if (prevCol >= 0){
        updatedRows[currentRow][prevCol] = "";
        setRows(updatedRows);
        setCurrentCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (currentCol === rows[0].length){
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
      }
      return;
    }

    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key;
      setRows(updatedRows);
      setCurrentCol(currentCol + 1);
    }
    
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col]
    if (row >= currentRow) {
      return colors.black;
    }

    if (letter === letters[col]) {
      return colors.primary;
    }

    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const isCellActive = (row, col) => {
    return row === currentRow && col === currentCol;
  }

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => row.filter((cell, j) => getCellBGColor(i, j) ===color));
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map} >
        {rows.map((row, i) => (
           <View key = {`row-${i}`}
            style={styles.row}>
            {row.map((letter, j) => 
            <View key={`cell-${i}-${j}`} style=
              {[styles.cell, 
              { borderColor: isCellActive(i, j) ? 
                colors.grey : colors.darkgrey, 
                backgroundColor: getCellBGColor(i, j),
              }
            ]}>
             <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
           </View>
          )}
         </View>
        ))}
       
      </ScrollView>
      <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yellowCaps} greyCaps={greyCaps}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',

  },

  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },

  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 3,
    maxWidth: 70,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  }
});
