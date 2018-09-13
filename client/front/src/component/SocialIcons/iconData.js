import GithubIcon from './resources/GitHub-Mark-32px.png';
import FacebookIcon from './resources/facebook_circle_black.png';

export type IconData = {
    imgSrc: string,
    href: string,
    alt: string
};

export default [
    { imgSrc: GithubIcon, href: "https://github.com/shharn", alt: "Github" },
    { imgSrc: FacebookIcon, href: "https://www.facebook.com/profile.php?id=100023598949770", alt: "Facebook"}
];