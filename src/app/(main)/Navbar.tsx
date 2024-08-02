import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-lg">
      <div className="gap-5 mx-auto flex max-w-7xl flex-wrap items-center justify-center px-5 py-3">
        <Link href={"/"} className="text-2xl font-bold text-primary">
          SocialApp
        </Link>

        {/* Search Field  */}
        <SearchField />

        {/* user info  */}
        <UserButton className="sm:ms-auto"/>
      </div>
      
    </header>
  );
}
