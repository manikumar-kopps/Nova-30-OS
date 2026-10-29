import React, { useState, useEffect } from 'react';

type Card = { suit: string, value: string, faceUp: boolean, color: 'red' | 'black' };

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = () => {
  let deck: Card[] = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push({ suit, value, faceUp: false, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function Solitaire() {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [selected, setSelected] = useState<{ pile: string, index: number } | null>(null);

  const newGame = () => {
    const deck = createDeck();
    let newTableau: Card[][] = [[], [], [], [], [], [], []];
    let count = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck[count++];
        if (j === i) card.faceUp = true;
        newTableau[i].push(card);
      }
    }
    setTableau(newTableau);
    setStock(deck.slice(count));
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelected(null);
  };

  useEffect(() => { newGame(); }, []);

  const drawCard = () => {
    if (stock.length === 0) {
      setStock(waste.reverse().map(c => ({ ...c, faceUp: false })));
      setWaste([]);
    } else {
      const card = stock[stock.length - 1];
      card.faceUp = true;
      setWaste([...waste, card]);
      setStock(stock.slice(0, -1));
    }
    setSelected(null);
  };

  const handlePileClick = (pileId: string, itemIndex: number) => {
    if (!selected) {
      setSelected({ pile: pileId, index: itemIndex });
      return;
    }

    // Try to move
    const { pile: srcPile, index: srcIndex } = selected;
    let cardsToMove: Card[] = [];

    // Extract cards
    let newWaste = [...waste], newTableau = [...tableau.map(t => [...t])], newFoundations = [...foundations.map(f => [...f])];

    if (srcPile === 'waste') cardsToMove = [newWaste[newWaste.length - 1]];
    else if (srcPile.startsWith('tab-')) {
      const tIdx = parseInt(srcPile.split('-')[1]);
      cardsToMove = newTableau[tIdx].slice(srcIndex);
    } else if (srcPile.startsWith('found-')) {
      const fIdx = parseInt(srcPile.split('-')[1]);
      cardsToMove = [newFoundations[fIdx][newFoundations[fIdx].length - 1]];
    }

    if (!cardsToMove.length || !cardsToMove[0]) {
      setSelected(null);
      return;
    }

    let moved = false;

    // Move to foundation
    if (pileId.startsWith('found-') && cardsToMove.length === 1) {
      const fIdx = parseInt(pileId.split('-')[1]);
      const targetPile = newFoundations[fIdx];
      const card = cardsToMove[0];
      
      const isValid = targetPile.length === 0 ? card.value === 'A' : 
                      (targetPile[targetPile.length - 1].suit === card.suit && VALUES.indexOf(card.value) === targetPile.length);
      
      if (isValid) {
        newFoundations[fIdx].push(card);
        moved = true;
      }
    }
    // Move to tableau
    else if (pileId.startsWith('tab-')) {
      const tIdx = parseInt(pileId.split('-')[1]);
      const targetPile = newTableau[tIdx];
      const card = cardsToMove[0];

      const isValid = targetPile.length === 0 ? card.value === 'K' :
                      (targetPile[targetPile.length - 1].color !== card.color && 
                       VALUES.indexOf(card.value) === VALUES.indexOf(targetPile[targetPile.length - 1].value) - 1);
      
      if (isValid) {
        newTableau[tIdx].push(...cardsToMove);
        moved = true;
      }
    }

    if (moved) {
      if (srcPile === 'waste') newWaste.pop();
      else if (srcPile.startsWith('tab-')) {
        const tIdx = parseInt(srcPile.split('-')[1]);
        newTableau[tIdx] = newTableau[tIdx].slice(0, srcIndex);
        if (newTableau[tIdx].length > 0) newTableau[tIdx][newTableau[tIdx].length - 1].faceUp = true;
      }
      else if (srcPile.startsWith('found-')) {
        const fIdx = parseInt(srcPile.split('-')[1]);
        newFoundations[fIdx].pop();
      }
      setWaste(newWaste);
      setTableau(newTableau);
      setFoundations(newFoundations);
    }
    setSelected(null);
  };

  const renderCard = (c: Card, isSelected: boolean) => (
    <div style={{
      width: '60px', height: '80px', border: '1px solid black', borderRadius: '4px',
      backgroundColor: c.faceUp ? 'white' : '#000080', color: c.color === 'red' ? 'red' : 'black',
      display: 'flex', flexDirection: 'column', padding: '2px', boxSizing: 'border-box',
      boxShadow: isSelected ? '0 0 0 3px yellow' : '1px 1px 2px rgba(0,0,0,0.5)', cursor: 'pointer'
    }}>
      {c.faceUp ? <><div style={{ fontSize: '14px', fontWeight: 'bold' }}>{c.value}</div><div style={{ fontSize: '24px', textAlign: 'center', marginTop: '10px' }}>{c.suit}</div></> : null}
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'ms sans serif, sans-serif', backgroundColor: '#008000', minHeight: '100%', overflow: 'auto' }}>
      <button onClick={newGame} style={{ marginBottom: '20px', padding: '5px', border: '2px outset #dfdfdf', backgroundColor: '#c0c0c0', cursor: 'pointer' }}>New Game</button>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div onClick={drawCard} style={{ width: '60px', height: '80px', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '4px', cursor: 'pointer', backgroundColor: stock.length ? '#000080' : 'transparent' }}></div>
          <div onClick={() => handlePileClick('waste', waste.length - 1)}>
            {waste.length > 0 && renderCard(waste[waste.length - 1], selected?.pile === 'waste')}
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          {foundations.map((f, i) => (
            <div key={i} onClick={() => handlePileClick(`found-${i}`, f.length - 1)} style={{ width: '60px', height: '80px', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              {f.length > 0 && renderCard(f[f.length - 1], selected?.pile === `found-${i}`)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {tableau.map((col, cIdx) => (
          <div key={cIdx} style={{ width: '60px', minHeight: '80px', position: 'relative' }}>
            {col.length === 0 ? (
              <div onClick={() => handlePileClick(`tab-${cIdx}`, 0)} style={{ width: '60px', height: '80px', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '4px' }} />
            ) : (
              col.map((card, rIdx) => (
                <div key={rIdx} onClick={() => card.faceUp && handlePileClick(`tab-${cIdx}`, rIdx)} style={{ position: rIdx === 0 ? 'relative' : 'absolute', top: rIdx === 0 ? 0 : rIdx * 20, zIndex: rIdx }}>
                  {renderCard(card, selected?.pile === `tab-${cIdx}` && selected.index <= rIdx)}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
