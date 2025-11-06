/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('should render default error message', () => {
    render(<ErrorMessage />);
    
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    render(<ErrorMessage message="カスタムエラー" />);
    
    expect(screen.getByText('カスタムエラー')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('再試行');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage />);
    
    expect(screen.queryByText('再試行')).not.toBeInTheDocument();
  });
});
