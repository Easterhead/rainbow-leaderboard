/**
 * Tests for leaderboard-client.ts functions
 */

// Import the function to test from the source file
import { calculateCountdownValues } from '../public/leaderboard-client';
import { CountdownValues } from '../types';

// Test the countdown calculation function
describe('calculateCountdownValues', () => {
  test('should calculate normal time correctly (multiple minutes)', () => {
    // Test with 5 minutes and 30 seconds
    const fiveMinThirtySec = 5 * 60 * 1000 + 30 * 1000; // 5:30 in milliseconds
    const result = calculateCountdownValues(fiveMinThirtySec);
    expect(result).toEqual({ minutes: 5, seconds: 30, isUrgent: false });
  });
  
  test('should detect urgent time (under 30 seconds)', () => {
    // Test with 25 seconds (urgent)
    const twentyFiveSec = 25 * 1000; // 0:25 in milliseconds
    const result = calculateCountdownValues(twentyFiveSec);
    expect(result).toEqual({ minutes: 0, seconds: 25, isUrgent: true });
    
    // Test at exactly 30 seconds (urgent)
    const thirtySec = 30 * 1000; // 0:30 in milliseconds
    const resultAt30 = calculateCountdownValues(thirtySec);
    expect(resultAt30).toEqual({ minutes: 0, seconds: 30, isUrgent: true });
    
    // Test just over threshold (31 seconds - not urgent)
    const thirtyOneSec = 31 * 1000; // 0:31 in milliseconds
    const resultAt31 = calculateCountdownValues(thirtyOneSec);
    expect(resultAt31).toEqual({ minutes: 0, seconds: 31, isUrgent: false });
  });
  
  test('should handle edge cases', () => {
    // Test with negative time (should handle gracefully)
    const negativeTime = -5000; // -5 seconds
    const resultNegative = calculateCountdownValues(negativeTime);
    expect(resultNegative).toEqual({ minutes: 0, seconds: 0, isUrgent: false });
    
    // Test with zero time
    const zeroTime = 0;
    const resultZero = calculateCountdownValues(zeroTime);
    expect(resultZero).toEqual({ minutes: 0, seconds: 0, isUrgent: false });
    
    // Test with very large time
    const largeTime = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
    const resultLarge = calculateCountdownValues(largeTime);
    expect(resultLarge).toEqual({ 
      minutes: 10 * 24 * 60, // 10 days in minutes
      seconds: 0, 
      isUrgent: false 
    });
  });
});
