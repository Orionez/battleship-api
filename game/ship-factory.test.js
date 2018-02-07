'use strict';

const shipFactory = require('./ship-factory');

describe('shipFactory', () => {

  const battleship = 'Battleship';
  const cruiser = 'Cruiser';
  const destroyer = 'Destroyer';
  const submarine = 'Submarine';

  test('Battleship should have health of 4', () => {
    const result = shipFactory.createBattleship();
    expect(result.type).toBe(battleship);
    expect(result.health).toBe(4);
  });

  test('Cruiser should have health of 3', () => {
    const result = shipFactory.createCruiser();
    expect(result.type).toBe(cruiser);
    expect(result.health).toBe(3);
  });

  test('Destroyer should have health of 2', () => {
    const result = shipFactory.createDestroyer();
    expect(result.type).toBe(destroyer);
    expect(result.health).toBe(2);
  });

  test('Submarine should have health of 1', () => {
    const result = shipFactory.createSubmarine();
    expect(result.type).toBe(submarine);
    expect(result.health).toBe(1);
  });

  test('Create fleet should have correct number of ships', () => {
    const result = shipFactory.createNewFleet();
    expect(result.filter(s => s.type === battleship).length).toBe(1);
    expect(result.filter(s => s.type === cruiser).length).toBe(2);
    expect(result.filter(s => s.type === destroyer).length).toBe(3);
    expect(result.filter(s => s.type === submarine).length).toBe(4);
  });
});



