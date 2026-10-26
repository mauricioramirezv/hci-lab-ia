import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import '../../src/app/i18n';
import {IdentityProvider,IdentityPage} from '../../src/features/identity/presentation';
import {identityClient} from '../../src/features/identity/infrastructure/client';
import {identityLocales} from '../../src/features/identity/locales';
import {identityMailLocales} from '../../src/features/identity/mail-locales';
import {HttpError} from '../../src/shared/http';

const copy=identityLocales['es-CO'];
afterEach(()=>{cleanup();vi.restoreAllMocks();history.replaceState(null,'',location.pathname);});
function visitor(){
  vi.spyOn(identityClient,'me').mockRejectedValue(new HttpError('UNAUTHENTICATED',401));
  render(<IdentityProvider><IdentityPage/></IdentityProvider>);
}
async function openRegister(){
  await waitFor(()=>expect(screen.getByRole('button',{name:copy.register})).toBeEnabled());
  fireEvent.click(screen.getByRole('button',{name:copy.register}));
  const form=screen.getByRole('form',{name:copy.register});
  fireEvent.change(within(form).getByLabelText(copy.name),{target:{value:' Nombre sintético '}});
  fireEvent.change(within(form).getByLabelText(copy.lastName),{target:{value:' Apellido sintético '}});
  fireEvent.change(within(form).getByLabelText(copy.email),{target:{value:'learner@example.invalid'}});
  fireEvent.change(within(form).getByLabelText(copy.password,{exact:true}),{target:{value:'synthetic-password-2026'}});
  return form;
}

describe('account forms and actionable feedback',()=>{
  it('validates registration fields while typing and announces strength and matching state',async()=>{
    visitor();const form=await openRegister();
    const submit=within(form).getByRole('button',{name:copy.register});
    const email=within(form).getByLabelText(copy.email);
    expect(submit).toBeDisabled();
    fireEvent.change(email,{target:{value:'learner@'}});
    expect(await within(form).findByText(copy.emailInvalid)).toHaveClass('identity-validation-invalid');
    expect(email).toHaveAttribute('aria-invalid','true');
    fireEvent.change(email,{target:{value:'learner@example.invalid'}});
    expect(await within(form).findByText(copy.emailValid)).toHaveClass('identity-validation-valid');
    const password=within(form).getByLabelText(copy.password,{exact:true});
    fireEvent.change(password,{target:{value:'short'}});
    expect(await within(form).findByText(copy.passwordLengthInvalid)).toHaveClass('identity-validation-invalid');
    expect(await within(form).findByText(copy.passwordStrength.weak)).toHaveClass('identity-validation-weak');
    fireEvent.change(password,{target:{value:'synthetic-password-2026'}});
    expect(await within(form).findByText(copy.passwordLengthValid)).toHaveClass('identity-validation-valid');
    expect(await within(form).findByText(copy.passwordStrength.strong)).toHaveClass('identity-validation-strong');
    const confirmation=within(form).getByLabelText(copy.confirmPassword);
    fireEvent.change(confirmation,{target:{value:'other-password-2026'}});
    expect(await within(form).findByText(copy.passwordMismatch)).toHaveClass('identity-validation-invalid');
    expect(confirmation).toHaveAttribute('aria-invalid','true');
    fireEvent.change(confirmation,{target:{value:'synthetic-password-2026'}});
    expect(await within(form).findByText(copy.passwordMatch)).toHaveClass('identity-validation-valid');
    expect(submit).toBeEnabled();
  });
  it('shows and hides passwords independently in sign-in, registration, and recovery forms',async()=>{
    visitor();
    const login=await screen.findByRole('form',{name:copy.login});
    const loginPassword=within(login).getByLabelText(copy.password,{exact:true});
    fireEvent.click(within(login).getByRole('button',{name:copy.showPassword}));
    expect(loginPassword).toHaveAttribute('type','text');
    fireEvent.click(within(login).getByRole('button',{name:copy.hidePassword}));
    expect(loginPassword).toHaveAttribute('type','password');
    fireEvent.click(screen.getByRole('button',{name:copy.register}));
    const register=screen.getByRole('form',{name:copy.register});
    const registerPassword=within(register).getByLabelText(copy.password,{exact:true});
    const registerConfirmation=within(register).getByLabelText(copy.confirmPassword);
    const showButtons=within(register).getAllByRole('button',{name:copy.showPassword});
    expect(showButtons).toHaveLength(2);
    fireEvent.click(showButtons[0]);fireEvent.click(showButtons[1]);
    expect(registerPassword).toHaveAttribute('type','text');
    expect(registerConfirmation).toHaveAttribute('type','text');
    expect(copy.lastNamePrompt).toBe('Escribe tu apellido.');
    history.replaceState(null,'',location.pathname+'#/cuenta?reset=synthetic-token');
    fireEvent(window,new Event('hashchange'));
    const recovery=await screen.findByRole('form',{name:copy.completeReset});
    const newPassword=within(recovery).getByLabelText(copy.newPassword);
    const resetConfirmation=within(recovery).getByLabelText(copy.confirmPassword);
    const resetShowButtons=within(recovery).getAllByRole('button',{name:copy.showPassword});
    expect(resetShowButtons).toHaveLength(2);
    fireEvent.click(resetShowButtons[0]);fireEvent.click(resetShowButtons[1]);
    expect(newPassword).toHaveAttribute('type','text');
    expect(resetConfirmation).toHaveAttribute('type','text');
  });
  it('opens only login by default, preserves the requested order and keeps all sections keyboard accessible',async()=>{
    const mailbox=vi.spyOn(identityClient,'developmentMailbox');
    visitor();
    await waitFor(()=>expect(screen.getByRole('form',{name:copy.login})).toBeVisible());
    const headings=screen.getAllByRole('heading',{level:2});
    expect(headings.map(item=>item.textContent)).toEqual([copy.login,copy.forgot,copy.register]);
    expect(screen.queryByRole('form',{name:copy.register})).not.toBeInTheDocument();
    expect(screen.queryByRole('form',{name:copy.forgot})).not.toBeInTheDocument();
    expect(screen.getByRole('heading',{level:1})).toHaveTextContent(/^Cuenta$/);
    expect(screen.queryByText(copy.developmentMailTitle)).not.toBeInTheDocument();
    expect(mailbox).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:copy.forgot}));
    expect(screen.getByRole('form',{name:copy.forgot})).toBeVisible();
    expect(screen.queryByRole('form',{name:copy.login})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:copy.forgot}));
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
  it('blocks mismatched passwords before sending anything, then persists name and surname independently',async()=>{
    const register=vi.spyOn(identityClient,'register').mockResolvedValue({message:'accepted'});
    const mailbox=vi.spyOn(identityClient,'developmentMailbox').mockResolvedValue({messages:[
      {to:'other@example.invalid',subject:'Verify',link:'http://localhost:5173/hci-lab-ia/#/cuenta?verify=foreign-token'},
      {to:'learner@example.invalid',subject:'Verify',link:'http://localhost:5173/hci-lab-ia/#/cuenta?verify=one-use-token'},
      {to:'learner@example.invalid',subject:'Reset',link:'http://localhost:5173/hci-lab-ia/#/cuenta?reset=wrong-purpose'}
    ]});
    visitor();const form=await openRegister();
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'different-password-2026'}});
    fireEvent.submit(form);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.passwordMismatch);
    expect(register).not.toHaveBeenCalled();expect(mailbox).not.toHaveBeenCalled();
    expect(within(form).getByLabelText(copy.confirmPassword)).toHaveAttribute('aria-invalid','true');
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'synthetic-password-2026'}});
    fireEvent.submit(form);
    await waitFor(()=>expect(register).toHaveBeenCalledWith({email:'learner@example.invalid',password:'synthetic-password-2026',displayName:'Nombre sintético',lastName:'Apellido sintético'}));
    expect(await screen.findByRole('status')).toHaveTextContent(copy.registrationReceived);
    expect(await screen.findByRole('link',{name:copy.verifyHere})).toHaveAttribute('href','#/cuenta?verify=one-use-token');
    expect(screen.getByText(copy.localSetupHelp)).toBeInTheDocument();
    expect(within(form).getByLabelText(copy.password,{exact:true})).toHaveValue('');
    expect(within(form).getByLabelText(copy.confirmPassword)).toHaveValue('');
  });
  it('does not announce success after a failed request and clears the previous action error when switching sections',async()=>{
    vi.spyOn(identityClient,'register').mockRejectedValue(new HttpError('DEPENDENCY_UNAVAILABLE',503));
    visitor();const form=await openRegister();
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'synthetic-password-2026'}});
    fireEvent.submit(form);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.network);
    expect(screen.queryByText(copy.registrationReceived)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:copy.forgot}));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('keeps login and recovery inputs independent and gives a generic recovery acknowledgement',async()=>{
    const reset=vi.spyOn(identityClient,'requestReset').mockResolvedValue({message:'accepted'});
    vi.spyOn(identityClient,'developmentMailbox').mockResolvedValue({messages:[]});
    visitor();
    await waitFor(()=>expect(screen.getByRole('form',{name:copy.login})).toBeVisible());
    fireEvent.change(within(screen.getByRole('form',{name:copy.login})).getByLabelText(copy.email),{target:{value:'login@example.invalid'}});
    fireEvent.click(screen.getByRole('button',{name:copy.forgot}));
    fireEvent.change(within(screen.getByRole('form',{name:copy.forgot})).getByLabelText(copy.email),{target:{value:'recover@example.invalid'}});
    fireEvent.submit(screen.getByRole('form',{name:copy.forgot}));
    await waitFor(()=>expect(reset).toHaveBeenCalledWith('recover@example.invalid'));
    expect(await screen.findByRole('status')).toHaveTextContent(copy.resetSent);
    expect(screen.getByText(copy.localLinkUnavailable)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:copy.login}));
    expect(within(screen.getByRole('form',{name:copy.login})).getByLabelText(copy.email)).toHaveValue('login@example.invalid');
  });
  it('opens recovery links in the recovery section, validates confirmation and returns to sign in after success',async()=>{
    history.replaceState(null,'',location.pathname+'#/cuenta?reset=synthetic-one-use');
    const complete=vi.spyOn(identityClient,'finishReset').mockResolvedValue({completed:true});
    visitor();
    await waitFor(()=>expect(screen.getByRole('form',{name:copy.completeReset})).toBeVisible());
    expect(location.hash).toBe('#/cuenta');
    const form=screen.getByRole('form',{name:copy.completeReset});
    fireEvent.change(within(form).getByLabelText(copy.newPassword),{target:{value:'new-synthetic-password-2026'}});
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'different-password-2026'}});
    fireEvent.submit(form);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.passwordMismatch);
    expect(complete).not.toHaveBeenCalled();
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'new-synthetic-password-2026'}});
    fireEvent.submit(form);
    await waitFor(()=>expect(complete).toHaveBeenCalledWith('synthetic-one-use','new-synthetic-password-2026'));
    expect(await screen.findByRole('form',{name:copy.login})).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(copy.passwordChanged);
  });
  it('consumes a verification link once and shows the next step without retaining the token in the URL',async()=>{
    history.replaceState(null,'',location.pathname+'#/cuenta?verify=synthetic-one-use');
    const verify=vi.spyOn(identityClient,'verify').mockResolvedValue({verified:true});
    visitor();
    expect(await screen.findByText(copy.verifySent)).toBeInTheDocument();
    expect(verify).toHaveBeenCalledExactlyOnceWith('synthetic-one-use');
    expect(location.hash).toBe('#/cuenta');
    expect(screen.getByRole('form',{name:copy.login})).toBeVisible();
  });
  it('opens the local SMTP inbox instead of showing an in-memory verification link and supports a safe resend',async()=>{
    const mailCopy=identityMailLocales['es-CO'];
    vi.spyOn(identityClient,'authOptions').mockResolvedValue({delivery:'smtp_local',developmentInboxUrl:'http://127.0.0.1:8025'});
    vi.spyOn(identityClient,'register').mockResolvedValue({message:'accepted'});
    const resend=vi.spyOn(identityClient,'resendVerification').mockResolvedValue({message:'accepted'});
    const mailbox=vi.spyOn(identityClient,'developmentMailbox');
    visitor();const form=await openRegister();
    fireEvent.change(within(form).getByLabelText(copy.confirmPassword),{target:{value:'synthetic-password-2026'}});
    fireEvent.submit(form);
    expect(await screen.findByRole('link',{name:mailCopy.openMailpit})).toHaveAttribute('href','http://127.0.0.1:8025');
    expect(screen.getByText(mailCopy.localSmtpHelp)).toBeInTheDocument();
    expect(mailbox).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:mailCopy.resendVerification}));
    await waitFor(()=>expect(resend).toHaveBeenCalledWith('learner@example.invalid'));
    expect(await screen.findByText(mailCopy.resendSent)).toBeInTheDocument();
  });
  it('processes a verification link opened after the account page is already mounted',async()=>{
    const verify=vi.spyOn(identityClient,'verify').mockResolvedValue({verified:true});
    visitor();
    await waitFor(()=>expect(screen.getByRole('form',{name:copy.login})).toBeVisible());
    fireEvent.click(screen.getByRole('button',{name:copy.register}));
    history.replaceState(null,'',location.pathname+'#/cuenta?verify=opened-after-mount');
    fireEvent(window,new Event('hashchange'));
    expect(await screen.findByText(copy.verifySent)).toBeInTheDocument();
    expect(verify).toHaveBeenCalledExactlyOnceWith('opened-after-mount');
    expect(location.hash).toBe('#/cuenta');
    expect(screen.getByRole('form',{name:copy.login})).toBeVisible();
  });

});
