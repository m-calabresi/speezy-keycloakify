import {
    faBitbucket,
    faFacebook,
    faGithub,
    faGitlab,
    faGoogle,
    faInstagram,
    faMicrosoft,
    faPaypal,
    faSquareLinkedin,
    faStackOverflow,
    faXTwitter,
    type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faCloud } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ICONS: { [key: string]: IconDefinition } = {
    "fa-google": faGoogle,
    "fa-windows": faMicrosoft,
    "fa-facebook": faFacebook,
    "fa-instagram": faInstagram,
    "fa-twitter": faXTwitter,
    "fa-linkedin": faSquareLinkedin,
    "fa-stack-overflow": faStackOverflow,
    "fa-github": faGithub,
    "fa-gitlab": faGitlab,
    "fa-bitbucket": faBitbucket,
    "fa-paypal": faPaypal,
    "fa-cloud": faCloud,
};

export function faIcon(iconClasses: string | undefined) {
    const faClass = iconClasses?.split(" ")?.[1] || "";
    const icon: IconDefinition = ICONS?.[faClass] || faArrowUpRightFromSquare;

    return <FontAwesomeIcon icon={icon} />;
}
