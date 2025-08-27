import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { JSX } from "keycloakify/tools/JSX";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { cloneElement, useState } from "react";

import { faIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItemCustom, FormMessageCustom } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { KcContext } from "@/login/KcContext";
import type { I18n } from "@/login/i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes,
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div className="mt-6 space-y-6">
                    <Separator />
                    <div
                        id="kc-registration-container"
                        className="text-center">
                        <div
                            id="kc-registration"
                            className="space-y-2">
                            <span className="text-accent/70 text-sm">{msg("noAccount")} </span>
                            <Button
                                variant="link"
                                size="sm"
                                asChild
                                className="hover:text-background text-accent transition-colors duration-200">
                                <a
                                    tabIndex={8}
                                    href={url.registrationUrl}>
                                    {msg("doRegister")}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div
                            id="kc-social-providers"
                            className={cn(kcClsx("kcFormSocialAccountSectionClass"), "mt-6 space-y-6")}>
                            <div className="text-accent/70 text-center text-sm">{msg("identity-provider-login-label")}</div>
                            <div
                                className={cn(
                                    "grid gap-2",
                                    social.providers.length === 1 && "grid-cols-1",
                                    social.providers.length === 2 && "grid-cols-2",
                                    social.providers.length === 3 && "grid-cols-3",
                                    social.providers.length > 3 && "grid-cols-1",
                                )}>
                                {social.providers.map((...[p]) => (
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full rounded-2xl border border-gray-600 bg-transparent text-base font-medium text-gray-300 transition-all duration-200 hover:border-purple-500 hover:bg-purple-500/10 hover:text-white"
                                        asChild
                                        key={p.alias}>
                                        <a
                                            key={p.alias}
                                            id={`social-${p.alias}`}
                                            href={p.loginUrl}>
                                            {/* {p.iconClasses && <i className={cn(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true" />} */}
                                            {faIcon(p.iconClasses)}
                                            {kcSanitize(p.displayName)}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            }>
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                            className="space-y-4">
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <FormItemCustom>
                                        <Label
                                            htmlFor="username"
                                            className="text-accent text-sm font-medium">
                                            {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                tabIndex={2}
                                                id="username"
                                                name="username"
                                                className={kcClsx("kcInputClass")}
                                                defaultValue={login.username ?? ""}
                                                placeholder={`Enter your ${(!realm.loginWithEmailAllowed ? msgStr("username") : !realm.registrationEmailAsUsername ? msgStr("usernameOrEmail") : msgStr("email")).toLowerCase()}`}
                                                type="text"
                                                autoFocus
                                                autoComplete="username"
                                                aria-invalid={messagesPerField.existsError("username", "password")}
                                            />
                                            <MailIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        </div>
                                        {messagesPerField.existsError("username", "password") && (
                                            <FormMessageCustom
                                                id="input-error"
                                                className="text-destructive text-sm"
                                                aria-live="polite">
                                                {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                            </FormMessageCustom>
                                        )}
                                    </FormItemCustom>
                                </div>
                            )}

                            <FormItemCustom className={kcClsx("kcFormGroupClass")}>
                                <Label
                                    htmlFor="password"
                                    className={cn("text-accent text-sm font-medium", kcClsx("kcLabelClass"))}>
                                    {msg("password")}
                                </Label>
                                <PasswordWrapper
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                    passwordInputId="password">
                                    <Input
                                        tabIndex={3}
                                        id="password"
                                        className={kcClsx("kcInputClass")}
                                        placeholder="Enter your password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                </PasswordWrapper>
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <FormMessageCustom
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite">
                                        {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                    </FormMessageCustom>
                                )}
                            </FormItemCustom>

                            <div
                                className={cn(
                                    kcClsx("kcFormGroupClass", "kcFormSettingClass"),
                                    "flex items-center gap-4",
                                    realm.rememberMe && !usernameHidden && realm.resetPasswordAllowed ? "justify-between" : realm.resetPasswordAllowed ? "justify-end" : "justify-start",
                                )}>
                                {realm.rememberMe && !usernameHidden && (
                                    <div id="kc-form-options">
                                        <div className="group flex items-center gap-3 hover:cursor-pointer">
                                            <Checkbox
                                                tabIndex={5}
                                                id="rememberMe"
                                                name="rememberMe"
                                                defaultChecked={!!login.rememberMe}
                                                className="transition-colors duration-200 hover:cursor-pointer"
                                            />
                                            <Label
                                                htmlFor="rememberMe"
                                                className="group-hover:text-background text-accent transition-all duration-200 hover:cursor-pointer">
                                                {msg("rememberMe")}
                                            </Label>
                                        </div>
                                    </div>
                                )}
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <Button
                                                variant={"link"}
                                                size={"sm"}
                                                className="hover:text-background text-accent transition-colors duration-200"
                                                asChild>
                                                <a
                                                    tabIndex={6}
                                                    href={url.loginResetCredentialsUrl}>
                                                    {msg("doForgotPassword")}
                                                </a>
                                            </Button>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div
                                id="kc-form-buttons"
                                className={kcClsx("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    value={auth.selectedCredential}
                                />
                                <Button
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className={cn(
                                        kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                        "group h-14 w-full rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-600 to-purple-700 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl disabled:border-gray-600/20 disabled:from-gray-600 disabled:to-gray-700",
                                    )}
                                    name="login"
                                    id="kc-login"
                                    type="submit">
                                    {msgStr("doLogIn")}
                                    <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className="relative">
            <LockIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            {cloneElement(children, {
                type: isPasswordRevealed ? "text" : "password",
                className: cn(children.props.className, "pr-10"), // space for the button
            })}
            <button
                type="button"
                onClick={toggleIsPasswordRevealed}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none">
                {isPasswordRevealed ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
            </button>
        </div>
    );
}
