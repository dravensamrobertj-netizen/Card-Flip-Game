
import { useState, useEffect } from 'react'

import './App.css'
import { GameHeader } from './components/GameHeader'
import { Card } from './components/card'
import { WinMessage } from './components/WinMessage'

const cardValues = [
   "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];

function App() {

   const[cards,setCards] = useState([]);
      const [flippedCards, setFlippedCards] = useState([]);
      const [matchedCards, setMatchedCards] = useState([]);
      const [score, setScore] = useState(0);
      const [moves, setMoves] = useState(0);
      const [isLocked, setIsLocked] = useState(false);  
    
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
      const initializeGame = () => {
        // Game initialization logic here(Shuffle cards)
       const shuffled = shuffleArray(cardValues);
    
       const finalCards = shuffled.map((value,index) => (
        {
          id : index,
          value,
          isFlipped : false,
          isMatched : false,
    
        }
      ));
    
      setCards(finalCards);
      setIsLocked(false);
      setMoves(0);
      setScore(0);
      setFlippedCards([]);
      setMatchedCards([]);
      
      };
      useEffect(() => {
        initializeGame();
      },[]);
    
      const handleCardClick = (card) => {
        //dont allow clicking on already flipped or matched cards
        if(card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2){
           return;
        }
    
        //update card  flipped state
        const newCards = cards.map((c) => {
          if (c.id === card.id) {
            return { ...c, isFlipped: true };
          } else {
            return c;
          }
        });
        setCards(newCards);
    
        const newFlippedCards = [...flippedCards, card.id];
        setFlippedCards(newFlippedCards);
    
        //check for match if two cards are flipped
        if (newFlippedCards.length === 2) {
          setIsLocked(true); // Lock the game while checking for a match
          const [firstCardId, secondCardId] = newFlippedCards;
          const firstCard = cards.find((c) => c.id === firstCardId);
          const secondCard = cards.find((c) => c.id === secondCardId);
    
          if(firstCard.value === secondCard.value){
            setTimeout(() => {
            //prev refers to the current state of matchedCards before the update
            setMatchedCards((prev) => [...prev, firstCardId, secondCardId]);
                setScore((prev) => prev + 1);
    
          
        setCards((prev) =>
          prev.map((c) => {
          if (c.id === firstCardId || c.id === secondCardId) {
            return { ...c, isMatched: true };
          } else {
            return c;
          }
        }) 
      );
        setFlippedCards([]);
        setIsLocked(false); // Unlock the game after checking for a match
      },500);
          } else {
            //flip back card1 ,card2 
            setTimeout(() => {
          
          setCards((prev) =>
            prev.map((c) => {
              if (c.id === firstCardId || c.id === secondCardId) {    
                return { ...c, isFlipped: false };
              } else {
                return c;
              }
            })
          );
    
          setFlippedCards([]);
          setIsLocked(false);
         }, 1000);
        }
        setMoves((prev) => prev + 1);
    
      }
      };
      const isGameComplete = matchedCards.length === cardValues.length;
  return <div className="app">
    <GameHeader score={score} moves={moves} onReset={initializeGame}/>
    {isGameComplete && <WinMessage moves={moves}/>}

    <div className='cards-grid'>
      {cards.map((card) => (
        <Card card = {card} onClick={handleCardClick}/>
      ))}
    </div>
  </div>
}
export default App
