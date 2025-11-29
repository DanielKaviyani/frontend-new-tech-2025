import Link from "next/link";

export default function AppHeader() {
    return (
        <header>
            <nav className="container h-20 flex items-center">
                <ul className="flex items-center gap-8">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/use-form-state">use form state</Link>
                </li>
                </ul>
            </nav>
        </header>
    )
}