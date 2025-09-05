const { parsePointsFromText } = require('../backend/wattpad-api');

describe('parsePointsFromText', () => {
  test('should find a single points value', () => {
    const text = 'User has 42 points';
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(42);
  });

  test('should find the highest points value', () => {
    const text = 'User has 42 points and 75 points';
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(75);
  });
  
  test('should handle different points formats', () => {
    const texts = [
      'User has 42 Points',
      'User has 42 points',
      'User has 42 Point',
      'User has 42 point',
      'User has 42pt',
      'User has 42pts',
      'User has 42 pt',
      'User has 42 pts'
    ];
    
    texts.forEach(text => {
      const result = parsePointsFromText(text);
      expect(result.pointsFound).toBe(true);
      expect(result.maxPoints).toBe(42);
    });
  });
  
  test('should handle "Final" and "Total" formats', () => {
    const texts = [
      'Final: 50',
      'final: 60',
      'Total: 70',
      'total: 80',
      'Final points: 90',
      'final points: 100',
      'Total points: 110',
      'total points: 120'
    ];
    
    texts.forEach((text, index) => {
      const result = parsePointsFromText(text);
      expect(result.pointsFound).toBe(true);
      expect(result.maxPoints).toBe(50 + index * 10);
    });
  });
  
  test('should handle complex reading list with calculations and final total', () => {
    const text = `I have read chapters 1-23 of "Mirror, Mirror" by @CemeteryFaerie (23 chapters); 
And chapters 1-32 of "Once in A Blue Moon" by @CemeteryFaerie (32 chapters).

Rainbows category; 3 points. 

55 chapters × 3 = 165

I have read chapters 12.1-12.9 of "A Failure of A High Elf" by @erifnidne (9 chapters).

Mods category; 4 points. 

9 chapters × 4 = 36

Total points for August: 1634`;
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(1634); // Should pick 1634 as the highest value
  });
  
  test('should handle string with newline at end', () => {
    const text = "Total points for August: 1634\n";
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(1634);
  });
});