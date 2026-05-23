import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm } from './AuthForm';

describe('AuthForm', () => {
  it('enables submit only after valid email and password', async () => {
    const onContinue = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <AuthForm onContinue={onContinue} />
      </MemoryRouter>
    );

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    const emailInput = screen.getByPlaceholderText('vash@email.com');
    const passwordInput = container.querySelector('#password') as HTMLInputElement;

    expect(submitButton).toBeDisabled();

    await user.type(emailInput, 'wrong-email');
    await user.type(passwordInput, '1234');
    expect(submitButton).toBeDisabled();

    await user.clear(emailInput);
    await user.type(emailInput, 'user@test.ru');

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('calls onContinue with entered credentials', async () => {
    const onContinue = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <AuthForm onContinue={onContinue} />
      </MemoryRouter>
    );

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    const emailInput = screen.getByPlaceholderText('vash@email.com');
    const passwordInput = container.querySelector('#password') as HTMLInputElement;

    await user.type(emailInput, 'user@test.ru');
    await user.type(passwordInput, '1234');
    await waitFor(() => expect(submitButton).toBeEnabled());

    await user.click(submitButton);

    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledWith('user@test.ru', '1234');
  });

  it('hides registration link for admin email', async () => {
    const onContinue = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <AuthForm onContinue={onContinue} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('vash@email.com');
    expect(container.querySelector('a[href="/registration/step1"]')).toBeInTheDocument();

    await user.type(emailInput, 'admin@mail.ru');

    await waitFor(() => {
      expect(container.querySelector('a[href="/registration/step1"]')).not.toBeInTheDocument();
    });
  });
});
