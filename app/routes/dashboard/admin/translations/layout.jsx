import { Outlet } from "react-router";



export const meta = () => [
    { title: "Translations - Cantina" },
];

export default function TranslationsLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}