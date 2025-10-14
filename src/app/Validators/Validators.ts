import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /\d/.test(control.value) ? { hasNumber: true } : null;
}

export function passwordsMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}