const { parsePointsFromText } = require('./wattpad-scraper');

describe('parsePointsFromText', () => {
  test('should find a single points value', () => {
    const result = parsePointsFromText('User has 42 points');
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(42);
  });

  test('should find the highest points value', () => {
    const result = parsePointsFromText('User has 42 points and 75 points');
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(75);
  });

  test('should match different formats of "points"', () => {
    expect(parsePointsFromText('User has 42 Points').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42 points').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42 Point').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42 point').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42pt').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42pts').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 42 pt').maxPoints).toBe(42);  // With space before pt
    expect(parsePointsFromText('User has 42 pts').maxPoints).toBe(42); // With space before pts
  });

  test('should return pointsFound=false for no matches', () => {
    const result = parsePointsFromText('User has no points mentioned');
    expect(result.pointsFound).toBe(false);
    expect(result.maxPoints).toBe(0);
  });

  test('should handle empty or null input', () => {
    expect(parsePointsFromText('')).toEqual(expect.objectContaining({ 
      maxPoints: 0, 
      pointsFound: false 
    }));
    expect(parsePointsFromText(null)).toEqual(expect.objectContaining({ 
      maxPoints: 0, 
      pointsFound: false 
    }));
  });

  test('should handle text with numbers not followed by "points"', () => {
    const result = parsePointsFromText('User has 42 cookies and 10 points');
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(10);
  });

  // Add real examples from your scraping
  test('should handle real-world examples', () => {
    expect(parsePointsFromText('lisa_london_ has 350 points for reading').maxPoints).toBe(350);
    expect(parsePointsFromText('User earned 75pt in August').maxPoints).toBe(75);
    expect(parsePointsFromText('User earned 63pts in September').maxPoints).toBe(63);
    expect(parsePointsFromText('User earned 85 pt in October').maxPoints).toBe(85);   // Space before pt
    expect(parsePointsFromText('User earned 95 pts in November').maxPoints).toBe(95); // Space before pts
  });

  // Specific test for the pts format
  test('should recognize "pts" format specifically', () => {
    const result = parsePointsFromText('This user has accumulated 120pts so far');
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(120);
  });
  
  // Test specifically for spaces between number and pt/pts
  test('should handle spaces between number and pt/pts', () => {
    const result1 = parsePointsFromText('User earned 150 pt this month');
    expect(result1.pointsFound).toBe(true);
    expect(result1.maxPoints).toBe(150);
    
    const result2 = parsePointsFromText('User earned 200 pts this month');
    expect(result2.pointsFound).toBe(true);
    expect(result2.maxPoints).toBe(200);
  });

  // Add new tests for the final/total formats:

  test('should recognize "Final" and "Total" formats', () => {
    expect(parsePointsFromText('Final: 50').maxPoints).toBe(50);
    expect(parsePointsFromText('final: 60').maxPoints).toBe(60);
    expect(parsePointsFromText('Total: 70').maxPoints).toBe(70);
    expect(parsePointsFromText('total: 80').maxPoints).toBe(80);
    expect(parsePointsFromText('Final points: 90').maxPoints).toBe(90);
    expect(parsePointsFromText('final points: 100').maxPoints).toBe(100);
    expect(parsePointsFromText('Total points: 110').maxPoints).toBe(110);
    expect(parsePointsFromText('total points: 120').maxPoints).toBe(120);
  });

  test('should handle mixed formats and find highest value', () => {
    const result = parsePointsFromText('User has 42 points. Final: 75. Total points: 60');
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(75);
  });

  test('should handle whitespace variations in final/total formats', () => {
    expect(parsePointsFromText('Final:50').maxPoints).toBe(50);
    expect(parsePointsFromText('Final:  50').maxPoints).toBe(50);
    expect(parsePointsFromText('Final  :  50').maxPoints).toBe(50);
    expect(parsePointsFromText('Final  points  :  50').maxPoints).toBe(50);
    expect(parsePointsFromText('Total:60').maxPoints).toBe(60);
  });

  // Add test for uppercase text

  test('should handle uppercase text', () => {
    expect(parsePointsFromText('User has 42 POINTS').maxPoints).toBe(42);
    expect(parsePointsFromText('User has 50 PT').maxPoints).toBe(50);
    expect(parsePointsFromText('User has 60 PTS').maxPoints).toBe(60);
    expect(parsePointsFromText('FINAL: 70').maxPoints).toBe(70);
    expect(parsePointsFromText('TOTAL POINTS: 80').maxPoints).toBe(80);
    expect(parsePointsFromText('FINAL = 90').maxPoints).toBe(90);
  });

  test('should handle mixed case text', () => {
    expect(parsePointsFromText('User has 42 PoInTs').maxPoints).toBe(42);
    expect(parsePointsFromText('FiNaL: 50').maxPoints).toBe(50);
    expect(parsePointsFromText('ToTaL pOiNtS: 60').maxPoints).toBe(60);
  });

  // Add tests for "Total points for [month]: X" format

  test('should handle "Total points for [month]: X" format', () => {
    expect(parsePointsFromText('Total points for August: 1634').maxPoints).toBe(1634);
    expect(parsePointsFromText('total points for September: 1700').maxPoints).toBe(1700);
    expect(parsePointsFromText('TOTAL POINTS FOR OCTOBER: 1800').maxPoints).toBe(1800);
    expect(parsePointsFromText('Total  points  for  November  :  1900').maxPoints).toBe(1900); // Extra spaces
    expect(parsePointsFromText('Final points for Winter: 2000').maxPoints).toBe(2000);
    expect(parsePointsFromText('total points for Summer Challenge = 2100').maxPoints).toBe(2100); // Using = instead of :
  });

  test('should handle arbitrary text between "for" and ":"', () => {
    expect(parsePointsFromText('Total points for the entire challenge: 2500').maxPoints).toBe(2500);
    expect(parsePointsFromText('Total points for reading War and Peace: 3000').maxPoints).toBe(3000);
    expect(parsePointsFromText('Final points for Lisa\'s reading marathon: 3500').maxPoints).toBe(3500);
    expect(parsePointsFromText('total points for this very long named event that we had: 4000').maxPoints).toBe(4000);
  });

  // Add tests for formats with math expressions

  test('should handle formats with math expressions', () => {
    expect(parsePointsFromText('total : 192+12+132+80 : 416').maxPoints).toBe(416);
    expect(parsePointsFromText('final : 200+150+50 : 400').maxPoints).toBe(400);
    expect(parsePointsFromText('Total Points : 100+200+300 = 600').maxPoints).toBe(600);
    expect(parsePointsFromText('TOTAL : 50+50+50+50 : 200').maxPoints).toBe(200);
  });

  test('should handle complex formats with math expressions', () => {
    expect(parsePointsFromText('Total points for August: 192+12+132+80 : 416').maxPoints).toBe(416);
    expect(parsePointsFromText('final points for September : 200 + 150 + 50 = 400').maxPoints).toBe(400);
    expect(parsePointsFromText('TOTAL POINTS FOR CHALLENGE : 100 + 200 + 300 : 600').maxPoints).toBe(600);
  });

  // Add more specific tests for math expressions with only numbers and plus signs

  test('should handle math expressions with only numbers and plus signs', () => {
    expect(parsePointsFromText('total : 192+12+132+80 : 416').maxPoints).toBe(416);
    expect(parsePointsFromText('final : 200 + 150 + 50 : 400').maxPoints).toBe(400); // With spaces
    expect(parsePointsFromText('Total Points : 100+200+300 = 600').maxPoints).toBe(600);
  });

  test('should handle math expressions with other operators or text', () => {
    expect(parsePointsFromText('total : 192*12/132-80 : 416').maxPoints).toBe(416);
    expect(parsePointsFromText('final : 200 minus 150 : 400').maxPoints).toBe(400);
  });

  // Add tests for multi-line formats

  test('should handle multi-line formats', () => {
    expect(parsePointsFromText('Total for August = 131 + 71\n\n= 202').maxPoints).toBe(202);
    expect(parsePointsFromText('Final points = 150 + 50\n= 200').maxPoints).toBe(200);
    expect(parsePointsFromText('Total\n=\n300').maxPoints).toBe(300);
    expect(parsePointsFromText('Total for Summer\n= 100 + 200 + 300\n= 600').maxPoints).toBe(600);
  });

  test('should handle standalone equals format', () => {
    expect(parsePointsFromText('= 100').maxPoints).toBe(100);
    expect(parsePointsFromText('  =  200  ').maxPoints).toBe(200);
    expect(parsePointsFromText('=300').maxPoints).toBe(300);
  });

  test('should handle complex real-world examples', () => {
    const complexExample = `
    Points for August Rainbow Book Club:
    Book 1: 131 points
    Book 2: 71 points
    
    Total = 131 + 71
    
    = 202
    `;
    expect(parsePointsFromText(complexExample).maxPoints).toBe(202);
    
    const anotherExample = `
    Final for September:
    100 + 150 + 50
    
    = 300
    `;
    expect(parsePointsFromText(anotherExample).maxPoints).toBe(300);
  });

  test('should handle points in book chapter reference', () => {
    const text = "Read chapter 8-13 of Can't get you out of my head by @itsmeimthevampire (mods; 4 points) \n\nTotal points: 24";
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(24); // Should pick 24 as the highest value
  });

  test('should handle string with newline at end', () => {
    const text = "Total points for August: 1634\n";
    
    const result = parsePointsFromText(text);
    
    expect(result.pointsFound).toBe(true);
    expect(result.maxPoints).toBe(1634);
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
});
