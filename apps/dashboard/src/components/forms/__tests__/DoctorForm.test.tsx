import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctorForm } from '../DoctorForm';

describe('DoctorForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all required form fields', () => {
      render(<DoctorForm {...defaultProps} />);

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Specialization')).toBeInTheDocument();
    });

    it('should render optional form fields', () => {
      render(<DoctorForm {...defaultProps} />);

      expect(screen.getByText('License Number')).toBeInTheDocument();
      expect(screen.getByText('Consultation Fee ($)')).toBeInTheDocument();
      expect(screen.getByText('Appointment Duration (min)')).toBeInTheDocument();
      expect(screen.getByText('Clinic Name')).toBeInTheDocument();
      expect(screen.getByText('Clinic Address')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
    });

    it('should render "Add Doctor" button for new doctor form', () => {
      render(<DoctorForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Add Doctor' })).toBeInTheDocument();
    });

    it('should render "Update Doctor" button in edit mode', () => {
      render(<DoctorForm {...defaultProps} isEdit />);
      expect(screen.getByRole('button', { name: 'Update Doctor' })).toBeInTheDocument();
    });

    it('should render "Saving..." when isLoading is true', () => {
      render(<DoctorForm {...defaultProps} isLoading />);
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
    });

    it('should disable submit button when loading', () => {
      render(<DoctorForm {...defaultProps} isLoading />);
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('should render Cancel button', () => {
      render(<DoctorForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('default values', () => {
    it('should populate fields with default values', () => {
      render(
        <DoctorForm
          {...defaultProps}
          defaultValues={{
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@hospital.com',
            phone: '+1 555 1234',
          }}
        />,
      );

      expect(screen.getByPlaceholderText('John')).toHaveValue('Jane');
      expect(screen.getByPlaceholderText('Doe')).toHaveValue('Smith');
      expect(screen.getByPlaceholderText('john@hospital.com')).toHaveValue('jane@hospital.com');
      expect(screen.getByPlaceholderText('+1 234 567 890')).toHaveValue('+1 555 1234');
    });

    it('should disable first name, last name, email, and phone in edit mode', () => {
      render(
        <DoctorForm
          {...defaultProps}
          isEdit
          defaultValues={{
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@hospital.com',
            phone: '+1 555 1234',
          }}
        />,
      );

      expect(screen.getByPlaceholderText('John')).toBeDisabled();
      expect(screen.getByPlaceholderText('Doe')).toBeDisabled();
      expect(screen.getByPlaceholderText('john@hospital.com')).toBeDisabled();
      expect(screen.getByPlaceholderText('+1 234 567 890')).toBeDisabled();
    });
  });

  describe('validation', () => {
    it('should show validation errors when submitting empty required fields', async () => {
      render(<DoctorForm {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: 'Add Doctor' }));

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Valid email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone is required')).toBeInTheDocument();
      expect(screen.getByText('Specialization is required')).toBeInTheDocument();
    });

    it('should show email validation error for invalid email', async () => {
      render(<DoctorForm {...defaultProps} />);

      await userEvent.type(screen.getByPlaceholderText('John'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('Doe'), 'User');
      await userEvent.type(screen.getByPlaceholderText('john@hospital.com'), 'not-an-email');
      await userEvent.type(screen.getByPlaceholderText('+1 234 567 890'), '1234567890');
      // Select a specialization
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        'Cardiology',
      );

      await userEvent.click(screen.getByRole('button', { name: 'Add Doctor' }));

      await waitFor(() => {
        expect(screen.getByText('Valid email is required')).toBeInTheDocument();
      });
    });

    it('should not call onSubmit when validation fails', async () => {
      render(<DoctorForm {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: 'Add Doctor' }));

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with form data when all required fields are valid', async () => {
      render(<DoctorForm {...defaultProps} />);

      await userEvent.type(screen.getByPlaceholderText('John'), 'Alice');
      await userEvent.type(screen.getByPlaceholderText('Doe'), 'Johnson');
      await userEvent.type(screen.getByPlaceholderText('john@hospital.com'), 'alice@hospital.com');
      await userEvent.type(screen.getByPlaceholderText('+1 234 567 890'), '+1 555 9999');
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        'Neurology',
      );

      await userEvent.click(screen.getByRole('button', { name: 'Add Doctor' }));

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
      });

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@hospital.com',
          phone: '+1 555 9999',
          specialization: 'Neurology',
        }),
      );
    });
  });

  describe('cancel', () => {
    it('should call onCancel when Cancel button is clicked', async () => {
      render(<DoctorForm {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not trigger form submission when Cancel is clicked', async () => {
      render(<DoctorForm {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
  });
});
