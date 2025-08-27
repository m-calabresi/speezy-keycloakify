import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { clsx } from "keycloakify/tools/clsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { AlertTriangleIcon, CircleAlertIcon, CircleCheckIcon, GlobeIcon, InfoIcon, MailIcon, RefreshCcw, ShieldIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import type { I18n } from "@/login/i18n";
import type { KcContext } from "@/login/KcContext";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Logo from "@/login/assets/logo.svg";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children,
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass"),
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass"),
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    const cardRef = useRef<HTMLDivElement>(null);

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="font-poppins flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6 md:p-10">
            <div className={clsx("w-full max-w-sm", kcClsx("kcLoginClass"))}>
                <div
                    id="kc-header"
                    className={cn("flex justify-center pb-6", kcClsx("kcHeaderClass"))}>
                    <div className="flex items-center gap-3">
                        <div
                            id="kc-header-wrapper"
                            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg">
                            <img
                                src={Logo}
                                alt="speezy logo"
                                className="h-8 w-8"
                            />
                        </div>
                        <h1 className={cn("font-bricolage-grotesque from-primary to-chart-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent", kcClsx("kcHeaderWrapperClass"))}>
                            speezy
                        </h1>
                        {/* {msg("loginTitleHtml", realm.displayNameHtml)} */}
                    </div>
                </div>
                <div
                    className="flex flex-col gap-6"
                    ref={cardRef}>
                    <div>
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                variant={message.type}
                                className="my-6">
                                {message.type === "success" && <CircleCheckIcon />}
                                {message.type === "warning" && <AlertTriangleIcon />}
                                {message.type === "error" && <CircleAlertIcon />}
                                {message.type === "info" && <InfoIcon />}
                                {/* <AlertTitle>Heads up!</AlertTitle> */}
                                <AlertDescription>{kcSanitize(message.summary)}</AlertDescription>
                            </Alert>
                        )}
                        {enabledLanguages.length > 1 && (
                            <Select
                                onValueChange={(selectedTag) => {
                                    const selectedLang = enabledLanguages.find((lang) => lang.languageTag === selectedTag);
                                    if (selectedLang?.href) {
                                        window.location.href = selectedLang.href;
                                    }
                                }}
                                defaultValue={currentLanguage.languageTag}>
                                <SelectTrigger className="text-accent hover:text-popover absolute end-4 top-4 ms-auto h-auto w-auto rounded-md border-none bg-transparent px-2 py-1 shadow-none focus:ring-0">
                                    <SelectValue placeholder="Select a language">
                                        <GlobeIcon />
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {enabledLanguages.map(({ languageTag, label, href }) => (
                                        <SelectItem
                                            key={languageTag}
                                            value={languageTag}
                                            data-href={href}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <div
                                    id="kc-page-title"
                                    className="flex items-center justify-center text-3xl leading-tight font-bold text-white">
                                    {headerNode}
                                </div>
                            ) : (
                                <div id="kc-username">
                                    <Label
                                        htmlFor="username"
                                        className="text-accent text-sm font-medium">
                                        {!realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                                    </Label>
                                    <div className="flex w-full flex-grow items-center">
                                        <div className="relative w-full hover:cursor-not-allowed">
                                            <Input
                                                disabled
                                                contentEditable={false}
                                                tabIndex={2}
                                                id="username"
                                                name="username"
                                                className={kcClsx("kcInputClass")}
                                                defaultValue={auth.attemptedUsername ?? ""}
                                                type="text"
                                                autoFocus
                                                autoComplete="username"
                                            />
                                            <MailIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        </div>
                                        <Button
                                            variant="link"
                                            asChild>
                                            <a
                                                id="reset-login"
                                                href={url.loginRestartFlowUrl}
                                                aria-label={msgStr("restartLoginTooltip")}>
                                                <Tooltip>
                                                    <TooltipTrigger className="text-accent hover:text-background hover:cursor-pointer">
                                                        <RefreshCcw />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                        {/* <div>{msg("loginTitleHtml", realm.displayNameHtml)}</div> */}
                    </div>
                    <div className="space-y-4">
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form
                                id="kc-select-try-another-way-form"
                                action={url.loginAction}
                                method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input
                                        type="hidden"
                                        name="tryAnotherWay"
                                        value="on"
                                    />
                                    <Button
                                        variant={"link"}
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}>
                                        {msg("doTryAnotherWay")}
                                    </Button>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && <div>{infoNode}</div>}
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 pt-4 text-sm text-gray-500">
                    <ShieldIcon className="h-4 w-4" />
                    <span>Secured by Keycloak</span>
                </div>
            </div>
        </div>
    );
}
