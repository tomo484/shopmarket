/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('should render loading spinner and text', () => {
    render(<Loading />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
