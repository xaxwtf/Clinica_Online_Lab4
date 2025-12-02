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

export const captchaValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const a = Number(formGroup.get('operandoA')?.value);
  const b = Number(formGroup.get('operandoB')?.value);
  const op = formGroup.get('operador')?.value;
  const resultado = Number(formGroup.get('resultadoChapta')?.value);

  if (a == null || b == null || !op || resultado == null) return null; // no validar aún

  let correcto = false;
  switch(op) {
    case '+': correcto = (a + b === resultado); break;
    case '-': correcto = (a - b === resultado); break;
    case '*': correcto = (a * b === resultado); break;
    case '/': correcto = (b !== 0 && a / b === resultado); break;
  }

  return correcto ? null : { captchaIncorrecto: true };
};
