/// <reference types="jest" />
import { formatPrice, formatDate, cn } from '../utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('should format price in Japanese Yen', () => {
      expect(formatPrice(1000)).toBe('￥1,000');
      expect(formatPrice(500)).toBe('￥500');
      expect(formatPrice(0)).toBe('￥0');
    });
  });

  describe('formatDate', () => {
    it('should format date in Japanese locale', () => {
      const dateString = '2025-01-01T00:00:00Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/2025/);
    });
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn()).toBe('');
    });
  });
});
