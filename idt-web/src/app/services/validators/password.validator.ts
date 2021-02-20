import { FormGroup } from '@angular/forms';

export function passwordMatchValidator(registratiomForm: FormGroup) {
    const pass = registratiomForm.controls.password.value;
    const confirmPass = registratiomForm.controls.passwordRepeat.value;

    return pass === confirmPass ? null : { passwordMismatch: true };
}
